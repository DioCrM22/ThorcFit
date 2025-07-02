const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { DiarioAlimentar, Refeicao, Alimento, AlimentoRefeicao } = require('../models');

class AlimentacaoController {
  // Validações para nova refeição
  static validateRefeicao = [
    body('tipo_refeicao')
      .isIn(['café_da_manhã', 'lanche_manhã', 'almoço', 'lanche_tarde', 'jantar'])
      .withMessage('Tipo de refeição inválido'),
    body('horario')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Horário inválido (formato HH:MM)'),
    body('alimentos')
      .isArray({ min: 1 })
      .withMessage('Pelo menos um alimento deve ser adicionado'),
    body('alimentos.*.nome')
      .trim()
      .notEmpty()
      .withMessage('Nome do alimento é obrigatório'),
    body('alimentos.*.quantidade')
      .isFloat({ min: 0.1 })
      .withMessage('Quantidade deve ser maior que 0')
  ];

  // Obter diário alimentar do dia
  static async getDiario(req, res) {
    try {
      const { data } = req.query;
      const dataConsulta = data || new Date().toISOString().split('T')[0];

      // Buscar ou criar diário do dia
      let [diario] = await DiarioAlimentar.findOrCreate({
        where: {
          id_usuario: req.userId,
          data: dataConsulta
        },
        defaults: {
          id_usuario: req.userId,
          data: dataConsulta,
          total_calorias: 0,
          total_proteinas: 0,
          total_carboidratos: 0,
          total_gorduras: 0,
          agua_ml: 0
        }
      });

      // Buscar refeições do dia com alimentos
      const refeicoes = await Refeicao.findAll({
        where: { id_registro: diario.id_registro },
        include: [{
          model: Alimento,
          as: 'alimentos',
          through: {
            attributes: ['quantidade', 'porcao']
          }
        }],
        order: [['horario', 'ASC']]
      });

      // Buscar alimentos disponíveis para autocomplete
      const alimentosDisponiveis = await Alimento.findAll({
        attributes: ['id_alimento', 'nome', 'calorias', 'porcao_padrao'],
        order: [['nome', 'ASC']],
        limit: 100
      });

      // Metas padrão (podem ser personalizadas no futuro)
      const metaCalorias = 2000;
      const metaAgua = 2000; // ml

      res.json({
        diario: {
          ...diario.toJSON(),
          refeicoes: refeicoes.map(refeicao => ({
            ...refeicao.toJSON(),
            alimentos: refeicao.alimentos.map(alimento => ({
              ...alimento.toJSON(),
              quantidade: alimento.AlimentoRefeicao.quantidade,
              porcao: alimento.AlimentoRefeicao.porcao,
              calorias_calculadas: (alimento.calorias * alimento.AlimentoRefeicao.quantidade) / 100,
              proteinas_calculadas: (alimento.proteinas * alimento.AlimentoRefeicao.quantidade) / 100,
              carboidratos_calculados: (alimento.carboidratos * alimento.AlimentoRefeicao.quantidade) / 100,
              gorduras_calculadas: (alimento.gorduras * alimento.AlimentoRefeicao.quantidade) / 100
            }))
          }))
        },
        meta_calorias: metaCalorias,
        meta_agua: metaAgua,
        alimentos_disponiveis: alimentosDisponiveis
      });

    } catch (error) {
      console.error('Erro ao buscar diário alimentar:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Adicionar nova refeição
  static async addRefeicao(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { tipo_refeicao, horario, notas, alimentos } = req.body;
      const data = new Date().toISOString().split('T')[0];

      // Buscar ou criar diário do dia
      let [diario] = await DiarioAlimentar.findOrCreate({
        where: {
          id_usuario: req.userId,
          data
        },
        defaults: {
          id_usuario: req.userId,
          data,
          total_calorias: 0,
          total_proteinas: 0,
          total_carboidratos: 0,
          total_gorduras: 0,
          agua_ml: 0
        }
      });

      // Criar refeição
      const novaRefeicao = await Refeicao.create({
        id_registro: diario.id_registro,
        tipo_refeicao,
        horario,
        notas
      });

      let totalCaloriasRefeicao = 0;
      let totalProteinasRefeicao = 0;
      let totalCarboidratosRefeicao = 0;
      let totalGordurasRefeicao = 0;

      // Processar alimentos da refeição
      for (const alimentoData of alimentos) {
        // Buscar ou criar alimento
        let alimento = await Alimento.findOne({
          where: { nome: { [Op.like]: alimentoData.nome.trim() } }
        });

        if (!alimento) {
          // Se o alimento não existe, criar um básico
          alimento = await Alimento.create({
            nome: alimentoData.nome.trim(),
            calorias: alimentoData.calorias || 0,
            proteinas: alimentoData.proteinas || 0,
            carboidratos: alimentoData.carboidratos || 0,
            gorduras: alimentoData.gorduras || 0,
            porcao_padrao: alimentoData.porcao || '100g'
          });
        }

        // Adicionar alimento à refeição
        await AlimentoRefeicao.create({
          id_refeicao: novaRefeicao.id_refeicao,
          id_alimento: alimento.id_alimento,
          quantidade: alimentoData.quantidade,
          porcao: alimentoData.porcao || 'g'
        });

        // Calcular valores nutricionais
        const fatorCalculo = alimentoData.quantidade / 100;
        totalCaloriasRefeicao += alimento.calorias * fatorCalculo;
        totalProteinasRefeicao += (alimento.proteinas || 0) * fatorCalculo;
        totalCarboidratosRefeicao += (alimento.carboidratos || 0) * fatorCalculo;
        totalGordurasRefeicao += (alimento.gorduras || 0) * fatorCalculo;
      }

      // Atualizar totais do diário
      await diario.update({
        total_calorias: parseFloat(diario.total_calorias) + totalCaloriasRefeicao,
        total_proteinas: parseFloat(diario.total_proteinas) + totalProteinasRefeicao,
        total_carboidratos: parseFloat(diario.total_carboidratos) + totalCarboidratosRefeicao,
        total_gorduras: parseFloat(diario.total_gorduras) + totalGordurasRefeicao
      });

      // Buscar refeição criada com alimentos
      const refeicaoCriada = await Refeicao.findByPk(novaRefeicao.id_refeicao, {
        include: [{
          model: Alimento,
          as: 'alimentos',
          through: {
            attributes: ['quantidade', 'porcao']
          }
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Refeição adicionada com sucesso',
        refeicao: refeicaoCriada
      });

    } catch (error) {
      console.error('Erro ao adicionar refeição:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Adicionar consumo de água
  static async addAgua(req, res) {
    try {
      const { quantidade, data } = req.body;
      const dataConsulta = data || new Date().toISOString().split('T')[0];

      if (!quantidade || quantidade <= 0) {
        return res.status(400).json({
          error: 'Quantidade de água deve ser maior que 0'
        });
      }

      // Buscar ou criar diário do dia
      let [diario] = await DiarioAlimentar.findOrCreate({
        where: {
          id_usuario: req.userId,
          data: dataConsulta
        },
        defaults: {
          id_usuario: req.userId,
          data: dataConsulta,
          total_calorias: 0,
          total_proteinas: 0,
          total_carboidratos: 0,
          total_gorduras: 0,
          agua_ml: 0
        }
      });

      // Atualizar consumo de água
      const novoTotalAgua = parseInt(diario.agua_ml) + parseInt(quantidade);
      await diario.update({ agua_ml: novoTotalAgua });

      res.json({
        success: true,
        message: 'Consumo de água registrado',
        total_agua: novoTotalAgua
      });

    } catch (error) {
      console.error('Erro ao adicionar água:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Salvar observações do diário
  static async saveObservacoes(req, res) {
    try {
      const { data, observacoes } = req.body;
      const dataConsulta = data || new Date().toISOString().split('T')[0];

      // Buscar ou criar diário do dia
      let [diario] = await DiarioAlimentar.findOrCreate({
        where: {
          id_usuario: req.userId,
          data: dataConsulta
        },
        defaults: {
          id_usuario: req.userId,
          data: dataConsulta,
          total_calorias: 0,
          total_proteinas: 0,
          total_carboidratos: 0,
          total_gorduras: 0,
          agua_ml: 0
        }
      });

      await diario.update({ observacoes });

      res.json({
        success: true,
        message: 'Observações salvas com sucesso'
      });

    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Excluir refeição
  static async deleteRefeicao(req, res) {
    try {
      const { id } = req.params;

      const refeicao = await Refeicao.findByPk(id, {
        include: [{
          model: DiarioAlimentar,
          as: 'diarioAlimentar',
          where: { id_usuario: req.userId }
        }, {
          model: Alimento,
          as: 'alimentos',
          through: {
            attributes: ['quantidade', 'porcao']
          }
        }]
      });

      if (!refeicao) {
        return res.status(404).json({
          error: 'Refeição não encontrada'
        });
      }

      // Calcular valores a serem subtraídos do diário
      let totalCaloriasRefeicao = 0;
      let totalProteinasRefeicao = 0;
      let totalCarboidratosRefeicao = 0;
      let totalGordurasRefeicao = 0;

      for (const alimento of refeicao.alimentos) {
        const fatorCalculo = alimento.AlimentoRefeicao.quantidade / 100;
        totalCaloriasRefeicao += alimento.calorias * fatorCalculo;
        totalProteinasRefeicao += (alimento.proteinas || 0) * fatorCalculo;
        totalCarboidratosRefeicao += (alimento.carboidratos || 0) * fatorCalculo;
        totalGordurasRefeicao += (alimento.gorduras || 0) * fatorCalculo;
      }

      // Atualizar totais do diário
      const diario = refeicao.diarioAlimentar;
      await diario.update({
        total_calorias: Math.max(0, parseFloat(diario.total_calorias) - totalCaloriasRefeicao),
        total_proteinas: Math.max(0, parseFloat(diario.total_proteinas) - totalProteinasRefeicao),
        total_carboidratos: Math.max(0, parseFloat(diario.total_carboidratos) - totalCarboidratosRefeicao),
        total_gorduras: Math.max(0, parseFloat(diario.total_gorduras) - totalGordurasRefeicao)
      });

      // Excluir refeição
      await refeicao.destroy();

      res.json({
        success: true,
        message: 'Refeição excluída com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir refeição:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter relatório nutricional
  static async getRelatorio(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;
      
      const dataInicio = data_inicio || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dataFim = data_fim || new Date().toISOString().split('T')[0];

      const diarios = await DiarioAlimentar.findAll({
        where: {
          id_usuario: req.userId,
          data: {
            [Op.between]: [dataInicio, dataFim]
          }
        },
        order: [['data', 'ASC']]
      });

      // Calcular médias
      const totalDias = diarios.length;
      const totais = diarios.reduce((acc, diario) => ({
        calorias: acc.calorias + parseFloat(diario.total_calorias || 0),
        proteinas: acc.proteinas + parseFloat(diario.total_proteinas || 0),
        carboidratos: acc.carboidratos + parseFloat(diario.total_carboidratos || 0),
        gorduras: acc.gorduras + parseFloat(diario.total_gorduras || 0),
        agua: acc.agua + parseInt(diario.agua_ml || 0)
      }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, agua: 0 });

      const medias = totalDias > 0 ? {
        calorias: Math.round(totais.calorias / totalDias),
        proteinas: Math.round(totais.proteinas / totalDias),
        carboidratos: Math.round(totais.carboidratos / totalDias),
        gorduras: Math.round(totais.gorduras / totalDias),
        agua: Math.round(totais.agua / totalDias)
      } : { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, agua: 0 };

      res.json({
        periodo: { data_inicio: dataInicio, data_fim: dataFim },
        total_dias: totalDias,
        medias_diarias: medias,
        totais_periodo: totais,
        diarios
      });

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AlimentacaoController;