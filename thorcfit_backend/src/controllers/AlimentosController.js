const { Op } = require('sequelize');
const { Alimento } = require('../models');

class AlimentosController {
  // Buscar alimentos (para autocomplete)
  static async buscarAlimentos(req, res) {
    try {
      const { q, limite = 20 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.json([]);
      }

      const alimentos = await Alimento.findAll({
        where: {
          nome: { [Op.like]: `%${q.trim()}%` }
        },
        attributes: [
          'id_alimento',
          'nome',
          'calorias',
          'proteinas',
          'carboidratos',
          'gorduras',
          'porcao_padrao'
        ],
        limit: parseInt(limite),
        order: [['nome', 'ASC']]
      });

      res.json(alimentos);

    } catch (error) {
      console.error('Erro na busca de alimentos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Listar alimentos com filtros
static async getAlimentos(req, res) {
    try {
      const { 
        busca, 
        ordenar_por = 'nome',
        ordem = 'ASC',
        limite = 50, 
        pagina = 1 
      } = req.query;

      const offset = (pagina - 1) * limite;
      const whereClause = {};

      if (busca) {
        whereClause.nome = { [Op.like]: `%${busca}%` };
      }

      const camposValidos = [
        'nome', 'calorias', 'proteinas', 
        'carboidratos', 'gorduras', 'fibras',
        'unidade_medida', 'created_at'
      ];
      
      const campoOrdenacao = camposValidos.includes(ordenar_por) ? ordenar_por : 'nome';
      const direcaoOrdem = ordem.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const { count, rows: alimentos } = await Alimento.findAndCountAll({
        where: whereClause,
        attributes: [
          'id_alimento',
          'nome',
          'unidade_medida',
          'calorias',
          'proteinas',
          'carboidratos',
          'gorduras',
          'fibras',
          'created_at',
          'updated_at'
        ],
        limit: parseInt(limite),
        offset,
        order: [[campoOrdenacao, direcaoOrdem]]
      });

      res.json({
        alimentos,
        total: count,
        pagina: parseInt(pagina),
        total_paginas: Math.ceil(count / limite),
        filtros_aplicados: {
          busca,
          ordenar_por: campoOrdenacao,
          ordem: direcaoOrdem
        }
      });

    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
}

  // Obter alimento específico
  static async getAlimento(req, res) {
    try {
      const { id } = req.params;

      const alimento = await Alimento.findByPk(id);

      if (!alimento) {
        return res.status(404).json({
          error: 'Alimento não encontrado'
        });
      }

      res.json({ alimento });

    } catch (error) {
      console.error('Erro ao buscar alimento:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Criar novo alimento
  static async createAlimento(req, res) {
    try {
      const {
        nome,
        calorias,
        proteinas,
        carboidratos,
        gorduras,
        fibras,
        porcao_padrao
      } = req.body;

      // Validações básicas
      if (!nome || calorias === undefined) {
        return res.status(400).json({
          error: 'Nome e calorias são obrigatórios'
        });
      }

      if (calorias < 0 || proteinas < 0 || carboidratos < 0 || gorduras < 0) {
        return res.status(400).json({
          error: 'Valores nutricionais não podem ser negativos'
        });
      }

      // Verificar se já existe alimento com o mesmo nome
      const alimentoExistente = await Alimento.findOne({
        where: { nome: { [Op.like]: nome.trim() } }
      });

      if (alimentoExistente) {
        return res.status(409).json({
          error: 'Já existe um alimento com este nome'
        });
      }

      const novoAlimento = await Alimento.create({
        nome: nome.trim(),
        calorias: parseFloat(calorias),
        proteinas: proteinas ? parseFloat(proteinas) : 0,
        carboidratos: carboidratos ? parseFloat(carboidratos) : 0,
        gorduras: gorduras ? parseFloat(gorduras) : 0,
        fibras: fibras ? parseFloat(fibras) : 0,
        porcao_padrao: porcao_padrao || '100g'
      });

      res.status(201).json({
        success: true,
        message: 'Alimento criado com sucesso',
        alimento: novoAlimento
      });

    } catch (error) {
      console.error('Erro ao criar alimento:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar alimento
  static async updateAlimento(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        calorias,
        proteinas,
        carboidratos,
        gorduras,
        fibras,
        porcao_padrao
      } = req.body;

      const alimento = await Alimento.findByPk(id);

      if (!alimento) {
        return res.status(404).json({
          error: 'Alimento não encontrado'
        });
      }

      // Verificar se o novo nome já existe (se foi alterado)
      if (nome && nome.trim() !== alimento.nome) {
        const alimentoExistente = await Alimento.findOne({
          where: { 
            nome: { [Op.like]: nome.trim() },
            id_alimento: { [Op.ne]: id }
          }
        });

        if (alimentoExistente) {
          return res.status(409).json({
            error: 'Já existe um alimento com este nome'
          });
        }
      }

      // Validar valores se fornecidos
      if (calorias !== undefined && calorias < 0) {
        return res.status(400).json({
          error: 'Calorias não podem ser negativas'
        });
      }

      if (proteinas !== undefined && proteinas < 0) {
        return res.status(400).json({
          error: 'Proteínas não podem ser negativas'
        });
      }

      if (carboidratos !== undefined && carboidratos < 0) {
        return res.status(400).json({
          error: 'Carboidratos não podem ser negativos'
        });
      }

      if (gorduras !== undefined && gorduras < 0) {
        return res.status(400).json({
          error: 'Gorduras não podem ser negativas'
        });
      }

      await alimento.update({
        nome: nome ? nome.trim() : alimento.nome,
        calorias: calorias !== undefined ? parseFloat(calorias) : alimento.calorias,
        proteinas: proteinas !== undefined ? parseFloat(proteinas) : alimento.proteinas,
        carboidratos: carboidratos !== undefined ? parseFloat(carboidratos) : alimento.carboidratos,
        gorduras: gorduras !== undefined ? parseFloat(gorduras) : alimento.gorduras,
        fibras: fibras !== undefined ? parseFloat(fibras) : alimento.fibras,
        porcao_padrao: porcao_padrao || alimento.porcao_padrao
      });

      res.json({
        success: true,
        message: 'Alimento atualizado com sucesso',
        alimento
      });

    } catch (error) {
      console.error('Erro ao atualizar alimento:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Excluir alimento
  static async deleteAlimento(req, res) {
    try {
      const { id } = req.params;

      const alimento = await Alimento.findByPk(id);

      if (!alimento) {
        return res.status(404).json({
          error: 'Alimento não encontrado'
        });
      }

      // Verificar se o alimento está sendo usado em alguma refeição
      const { AlimentoRefeicao } = require('../models');
      const usoEmRefeicoes = await AlimentoRefeicao.count({
        where: { id_alimento: id }
      });

      if (usoEmRefeicoes > 0) {
        return res.status(409).json({
          error: 'Este alimento está sendo usado em refeições e não pode ser excluído'
        });
      }

      await alimento.destroy();

      res.json({
        success: true,
        message: 'Alimento excluído com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir alimento:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter estatísticas de alimentos
  static async getEstatisticas(req, res) {
    try {
      const [
        totalAlimentos,
        mediaCalorias,
        alimentoMaisCalorico,
        alimentoMenosCalorico
      ] = await Promise.all([
        Alimento.count(),
        Alimento.findOne({
          attributes: [
            [require('sequelize').fn('AVG', require('sequelize').col('calorias')), 'media_calorias']
          ]
        }),
        Alimento.findOne({
          order: [['calorias', 'DESC']],
          attributes: ['nome', 'calorias']
        }),
        Alimento.findOne({
          order: [['calorias', 'ASC']],
          attributes: ['nome', 'calorias']
        })
      ]);

      res.json({
        total_alimentos: totalAlimentos,
        media_calorias: mediaCalorias ? Math.round(parseFloat(mediaCalorias.dataValues.media_calorias)) : 0,
        alimento_mais_calorico: alimentoMaisCalorico,
        alimento_menos_calorico: alimentoMenosCalorico
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas de alimentos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Calcular valores nutricionais para uma quantidade específica
  static async calcularNutrientes(req, res) {
    try {
      const { id } = req.params;
      const { quantidade, porcao = 'g' } = req.query;

      if (!quantidade || quantidade <= 0) {
        return res.status(400).json({
          error: 'Quantidade deve ser maior que 0'
        });
      }

      const alimento = await Alimento.findByPk(id);

      if (!alimento) {
        return res.status(404).json({
          error: 'Alimento não encontrado'
        });
      }

      // Calcular valores proporcionais (base 100g)
      const fatorCalculo = parseFloat(quantidade) / 100;

      const valoresCalculados = {
        quantidade: parseFloat(quantidade),
        porcao,
        calorias: Math.round(alimento.calorias * fatorCalculo * 100) / 100,
        proteinas: Math.round((alimento.proteinas || 0) * fatorCalculo * 100) / 100,
        carboidratos: Math.round((alimento.carboidratos || 0) * fatorCalculo * 100) / 100,
        gorduras: Math.round((alimento.gorduras || 0) * fatorCalculo * 100) / 100,
        fibras: Math.round((alimento.fibras || 0) * fatorCalculo * 100) / 100
      };

      res.json({
        alimento: {
          id_alimento: alimento.id_alimento,
          nome: alimento.nome
        },
        valores_calculados: valoresCalculados
      });

    } catch (error) {
      console.error('Erro ao calcular nutrientes:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Importar alimentos em lote (para administradores)
  static async importarAlimentos(req, res) {
    try {
      const { alimentos } = req.body;

      if (!Array.isArray(alimentos) || alimentos.length === 0) {
        return res.status(400).json({
          error: 'Lista de alimentos é obrigatória'
        });
      }

      const alimentosImportados = [];
      const erros = [];

      for (let i = 0; i < alimentos.length; i++) {
        const alimentoData = alimentos[i];
        
        try {
          // Verificar se já existe
          const existente = await Alimento.findOne({
            where: { nome: { [Op.like]: alimentoData.nome.trim() } }
          });

          if (existente) {
            erros.push(`Linha ${i + 1}: Alimento "${alimentoData.nome}" já existe`);
            continue;
          }

          // Validar dados obrigatórios
          if (!alimentoData.nome || alimentoData.calorias === undefined) {
            erros.push(`Linha ${i + 1}: Nome e calorias são obrigatórios`);
            continue;
          }

          const novoAlimento = await Alimento.create({
            nome: alimentoData.nome.trim(),
            calorias: parseFloat(alimentoData.calorias),
            proteinas: alimentoData.proteinas ? parseFloat(alimentoData.proteinas) : 0,
            carboidratos: alimentoData.carboidratos ? parseFloat(alimentoData.carboidratos) : 0,
            gorduras: alimentoData.gorduras ? parseFloat(alimentoData.gorduras) : 0,
            fibras: alimentoData.fibras ? parseFloat(alimentoData.fibras) : 0,
            porcao_padrao: alimentoData.porcao_padrao || '100g'
          });

          alimentosImportados.push(novoAlimento);

        } catch (error) {
          erros.push(`Linha ${i + 1}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: `${alimentosImportados.length} alimentos importados com sucesso`,
        alimentos_importados: alimentosImportados.length,
        total_erros: erros.length,
        erros: erros.slice(0, 10) // Limitar a 10 erros para não sobrecarregar a resposta
      });

    } catch (error) {
      console.error('Erro ao importar alimentos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AlimentosController;
