const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { DateTime } = require('luxon');
const { 
  PlanoTreino, 
  Exercicio, 
  ExerciciosDoTreino, 
  HistoricoTreino, 
  PersonalTrainer, 
  VinculoTreino,
  Usuario
} = require('../models');

class TreinoController {
  static validatePlano = [
    body('nome')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome do plano deve ter entre 2 e 100 caracteres'),
    body('observacoes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Observações devem ter no máximo 500 caracteres'),
    body('duracao_estimada')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duração estimada deve ser um número inteiro positivo'),
    body('exercicios')
      .isArray({ min: 1 })
      .withMessage('Pelo menos um exercício deve ser adicionado'),
    body('exercicios.*.exercicio_id')
      .isInt({ min: 1 })
      .withMessage('ID do exercício inválido'),
    body('exercicios.*.series')
      .isInt({ min: 1, max: 20 })
      .withMessage('Número de séries deve estar entre 1 e 20'),
    body('exercicios.*.repeticoes')
      .isInt({ min: 1, max: 100 })
      .withMessage('Número de repetições deve estar entre 1 e 100')
  ];

  static mapExerciciosTreino(exercicios) {
    return exercicios.map(exercicio => ({
      series: exercicio.ExerciciosDoTreino.series,
      repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
      carga: exercicio.ExerciciosDoTreino.carga,
      tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
      observacoes: exercicio.ExerciciosDoTreino.observacoes,
      ordem: exercicio.ExerciciosDoTreino.ordem,
      exercicio: {
        id_exercicio: exercicio.id_exercicio,
        nome: exercicio.nome,
        descricao: exercicio.descricao,
        grupo_muscular: exercicio.grupo_muscular,
        equipamento_necesario: exercicio.equipamento_necesario,
        instrucoes: exercicio.instrucoes,
        gif_url: exercicio.gif_url
      }
    })).sort((a, b) => a.ordem - b.ordem);
  }

  static async getPlanos(req, res) {
    try {
      const { status } = req.query;
      const vinculos = await VinculoTreino.findAll({
        where: { id_usuario: req.userId, status: 'ativo' },
        attributes: ['id_personal']
      });
      const idPersonais = vinculos.map(v => v.id_personal);

      let whereClause = {
        [Op.or]: [
          { id_criador_usuario: req.userId },
          { id_criador_personal: { [Op.in]: idPersonais } }
        ]
      };

      if (status) whereClause.status = status;

      const planosTreino = await PlanoTreino.findAll({
        where: whereClause,
        include: [
          {
            model: Exercicio,
            as: 'exercicios',
            through: { attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem'] }
          },
          {
            model: PersonalTrainer,
            as: 'criadorPersonal',
            include: [{ model: Usuario, as: 'usuario', attributes: ['nome'] }]
          }
        ],
        order: [['data_criacao', 'DESC']]
      });

      const estatisticas = await TreinoController.calcularEstatisticas(req.userId, idPersonais);

      const exerciciosDisponiveis = await Exercicio.findAll({
        attributes: ['id_exercicio', 'nome', 'grupo_muscular'],
        order: [['grupo_muscular', 'ASC'], ['nome', 'ASC']]
      });

      res.json({
        planos_treino: planosTreino.map(plano => ({
          ...plano.toJSON(),
          exercicios_treino: TreinoController.mapExerciciosTreino(plano.exercicios)
        })),
        ...estatisticas,
        exercicios_disponiveis: exerciciosDisponiveis
      });
    } catch (error) {
      console.error('Erro ao buscar planos de treino:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }


  // Criar novo plano de treino
  static async createPlano(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { nome, observacoes, exercicios, duracao_estimada } = req.body;

      const novoPlano = await PlanoTreino.create({
        tipo_criador: 'usuario',
        id_criador_usuario: req.userId,
        nome,
        descricao: observacoes,
        data_criacao: new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
        status: 'ativo',
        duracao_estimada
      });

      let exerciciosAdicionados = 0;
      for (let i = 0; i < exercicios.length; i++) {
        const exercicioData = exercicios[i];

        const exercicio = await Exercicio.findByPk(exercicioData.exercicio_id);
        if (!exercicio) continue;

        await ExerciciosDoTreino.create({
          id_treino: novoPlano.id_plano_treino,
          id_exercicio: exercicioData.exercicio_id,
          series: exercicioData.series,
          repeticoes: exercicioData.repeticoes,
          carga: exercicioData.carga || null,
          tempo_descanso: exercicioData.tempo_descanso || null,
          observacoes: exercicioData.observacoes || null,
          ordem: i + 1
        });

        exerciciosAdicionados++;
      }

      if (exerciciosAdicionados === 0) {
        await novoPlano.destroy();
        return res.status(400).json({
          error: 'Nenhum exercício válido foi adicionado ao plano'
        });
      }

      const planoCriado = await PlanoTreino.findByPk(novoPlano.id_plano_treino, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      res.status(201).json({
        success: true,
        message: `Plano "${nome}" criado com sucesso! ${exerciciosAdicionados} exercícios adicionados.`,
        plano: planoCriado
      });

    } catch (error) {
      console.error('Erro ao criar plano de treino:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Visualizar plano específico
  static async getPlano(req, res) {
    try {
      const { id } = req.params;

      const plano = await PlanoTreino.findByPk(id, {
        include: [
          {
            model: Exercicio,
            as: 'exercicios',
            through: {
              attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
            }
          },
          {
            model: PersonalTrainer,
            as: 'criadorPersonal',
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['nome']
            }]
          }
        ]
      });

      if (!plano) {
        return res.status(404).json({ error: 'Plano de treino não encontrado' });
      }

      const temAcesso = await TreinoController.verificarAcessoPlano(plano, req.userId);
      if (!temAcesso) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      res.json({
        plano: {
          ...plano.toJSON(),
          exercicios_treino: plano.exercicios.map(exercicio => ({
            series: exercicio.ExerciciosDoTreino.series,
            repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
            carga: exercicio.ExerciciosDoTreino.carga,
            tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
            observacoes: exercicio.ExerciciosDoTreino.observacoes,
            ordem: exercicio.ExerciciosDoTreino.ordem,
            exercicio: {
              id_exercicio: exercicio.id_exercicio,
              nome: exercicio.nome,
              descricao: exercicio.descricao,
              grupo_muscular: exercicio.grupo_muscular,
              equipamento_necesario: exercicio.equipamento_necesario,
              instrucoes: exercicio.instrucoes,
              gif_url: exercicio.gif_url
            }
          })).sort((a,b) => a.ordem - b.ordem)
        }
      });

    } catch (error) {
      console.error('Erro ao buscar plano de treino:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar plano de treino
  static async updatePlano(req, res) {
    try {
      const { id } = req.params;
      const { nome, observacoes, exercicios, duracao_estimada } = req.body;

      const plano = await PlanoTreino.findByPk(id);
      if (!plano) {
        return res.status(404).json({ error: 'Plano de treino não encontrado' });
      }

      if (plano.id_criador_usuario !== req.userId) {
        return res.status(403).json({ error: 'Você não pode editar este plano' });
      }

      await plano.update({
        nome: nome || plano.nome,
        descricao: observacoes !== undefined ? observacoes : plano.descricao,
        duracao_estimada: duracao_estimada || plano.duracao_estimada
      });

      if (exercicios && Array.isArray(exercicios)) {
        await ExerciciosDoTreino.destroy({ where: { id_treino: plano.id_plano_treino } });

        for (let i = 0; i < exercicios.length; i++) {
          const exercicioData = exercicios[i];

          await ExerciciosDoTreino.create({
            id_treino: plano.id_plano_treino,
            id_exercicio: exercicioData.exercicio_id,
            series: exercicioData.series,
            repeticoes: exercicioData.repeticoes,
            carga: exercicioData.carga || null,
            tempo_descanso: exercicioData.tempo_descanso || null,
            observacoes: exercicioData.observacoes || null,
            ordem: i + 1
          });
        }
      }

      const planoAtualizado = await PlanoTreino.findByPk(id, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      res.json({
        success: true,
        message: 'Plano atualizado com sucesso',
        plano: planoAtualizado
      });

    } catch (error) {
      console.error('Erro ao atualizar plano de treino:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Duplicar plano
  static async duplicatePlano(req, res) {
    try {
      const { id } = req.params;

      const planoOriginal = await PlanoTreino.findByPk(id, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      if (!planoOriginal) {
        return res.status(404).json({ error: 'Plano de treino não encontrado' });
      }

      const temAcesso = await TreinoController.verificarAcessoPlano(planoOriginal, req.userId);
      if (!temAcesso) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const novoPlano = await PlanoTreino.create({
        tipo_criador: 'usuario',
        id_criador_usuario: req.userId,
        nome: `${planoOriginal.nome} (Cópia)`,
        descricao: planoOriginal.descricao,
        data_criacao: new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
        status: 'ativo',
        duracao_estimada: planoOriginal.duracao_estimada
      });

      for (const exercicio of planoOriginal.exercicios) {
        await ExerciciosDoTreino.create({
          id_treino: novoPlano.id_plano_treino,
          id_exercicio: exercicio.id_exercicio,
          series: exercicio.ExerciciosDoTreino.series,
          repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
          carga: exercicio.ExerciciosDoTreino.carga,
          tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
          observacoes: exercicio.ExerciciosDoTreino.observacoes,
          ordem: exercicio.ExerciciosDoTreino.ordem
        });
      }

      res.status(201).json({
        success: true,
        message: 'Plano duplicado com sucesso',
        novo_plano: novoPlano
      });

    } catch (error) {
      console.error('Erro ao duplicar plano de treino:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

// Excluir plano
  static async deletePlano(req, res) {
    const { id } = req.params;

    try {
      // Primeiro apaga os exercícios vinculados a esse plano
      await ExerciciosDoTreino.destroy({
        where: { id_treino: id }
      });

      // Depois apaga o plano
      const deleted = await PlanoTreino.destroy({
        where: { id_plano_treino: id }
      });

      if (deleted === 0) {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }

      return res.status(200).json({ message: 'Plano deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar plano de treino:', error);
      return res.status(500).json({ message: 'Erro ao deletar plano de treino' });
    }
  }


  // Iniciar treino
  static async iniciarTreino(req, res) {
    try {
      const { id } = req.params;

      const plano = await PlanoTreino.findByPk(id, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      if (!plano) {
        return res.status(404).json({ error: 'Plano de treino não encontrado' });
      }

      const temAcesso = await TreinoController.verificarAcessoPlano(plano, req.userId);
      if (!temAcesso) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const historicoTreino = await HistoricoTreino.create({
        id_usuario: req.userId,
        id_plano_treino: plano.id_plano_treino,
        data_treino: new Date().toISOString().split('T')[0],
        hora_inicio: new Date().toTimeString().split(' ')[0],
        concluido: false
      });

      res.json({
        plano: {
          ...plano.toJSON(),
          exercicios_treino: plano.exercicios.map(exercicio => ({
            series: exercicio.ExerciciosDoTreino.series,
            repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
            carga: exercicio.ExerciciosDoTreino.carga,
            tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
            observacoes: exercicio.ExerciciosDoTreino.observacoes,
            ordem: exercicio.ExerciciosDoTreino.ordem,
            exercicio: {
              id_exercicio: exercicio.id_exercicio,
              nome: exercicio.nome,
              descricao: exercicio.descricao,
              grupo_muscular: exercicio.grupo_muscular,
              equipamento_necesario: exercicio.equipamento_necesario,
              instrucoes: exercicio.instrucoes,
              gif_url: exercicio.gif_url
            }
          })).sort((a,b) => a.ordem - b.ordem)
        },
        historico_id: historicoTreino.id_historico
      });

    } catch (error) {
      console.error('Erro ao iniciar treino:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Finalizar treino
static async finalizarTreino(req, res) {
  try {
    const { historico_id, observacoes } = req.body;

    const historico = await HistoricoTreino.findOne({
      where: {
        id_historico: historico_id,
        id_usuario: req.userId
      }
    });

    if (!historico) {
      return res.status(404).json({ error: 'Histórico de treino não encontrado' });
    }

    const horaFim = new Date().toTimeString().split(' ')[0];
    const horaInicio = historico.hora_inicio;

    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFim.split(':').map(Number);
    let duracao = (horaF * 60 + minF) - (horaI * 60 + minI);
    if (duracao < 0) duracao += 24 * 60;

    await historico.update({
      concluido: true,
      hora_fim: horaFim,
      duracao_minutos: duracao,
      observacoes
    });

    // Atualizar array de "realizados" no plano
    const plano = await PlanoTreino.findByPk(historico.id_plano_treino);
    const hoje = new Date().toISOString().split('T')[0];

    let realizados = plano.realizados || [];
    if (!realizados.includes(hoje)) {
      realizados.push(hoje);
      await plano.update({ realizados });
    }

    res.json({
      success: true,
      message: 'Treino finalizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao finalizar treino:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

  // Verificar acesso ao plano
  static async verificarAcessoPlano(plano, userId) {
    if (plano.id_criador_usuario === userId) return true;

    if (plano.id_criador_personal) {
      const vinculo = await VinculoTreino.findOne({
        where: {
          id_usuario: userId,
          id_personal: plano.id_criador_personal,
          status: 'ativo'
        }
      });
      return !!vinculo;
    }
    return false;
  }

  // Calcular estatísticas do usuário
  static async calcularEstatisticas(userId) {
    const totalPlanos = await PlanoTreino.count({
      where: {
        [Op.or]: [
          { id_criador_usuario: userId },
          {
            id_criador_personal: {
              [Op.in]: await VinculoTreino.findAll({
                where: { id_usuario: userId, status: 'ativo' },
                attributes: ['id_personal']
              }).then(vinculos => vinculos.map(v => v.id_personal))
            }
          }
        ]
      }
    });

    const planosAtivos = await PlanoTreino.count({
      where: {
        status: 'ativo',
        [Op.or]: [
          { id_criador_usuario: userId },
          {
            id_criador_personal: {
              [Op.in]: await VinculoTreino.findAll({
                where: { id_usuario: userId, status: 'ativo' },
                attributes: ['id_personal']
              }).then(vinculos => vinculos.map(v => v.id_personal))
            }
          }
        ]
      }
    });

    return {
      total_planos: totalPlanos,
      planos_ativos: planosAtivos
    };
  }
}

module.exports = TreinoController;
