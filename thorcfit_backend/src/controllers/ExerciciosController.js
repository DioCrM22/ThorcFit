const { Op } = require('sequelize');
const { Exercicio } = require('../models');

class ExerciciosController {
  // Listar exercícios com filtros
  static async getExercicios(req, res) {
    try {
      const { 
        busca, 
        grupo_muscular, 
        limite = 50, 
        pagina = 1 
      } = req.query;

      const offset = (pagina - 1) * limite;
      const whereClause = {};

      // Aplicar filtros
      if (busca) {
        whereClause.nome = { [Op.like]: `%${busca}%` };
      }

      if (grupo_muscular) {
        whereClause.grupo_muscular = grupo_muscular;
      }


      const { count, rows: exercicios } = await Exercicio.findAndCountAll({
        where: whereClause,
        limit: parseInt(limite),
        offset,
        order: [['grupo_muscular', 'ASC'], ['nome', 'ASC']]
      });

      // Obter grupos musculares únicos para filtros
      const gruposMusculares = await Exercicio.findAll({
        attributes: ['grupo_muscular'],
        group: ['grupo_muscular'],
        order: [['grupo_muscular', 'ASC']]
      });

      res.json({
        exercicios,
        total: count,
        pagina: parseInt(pagina),
        total_paginas: Math.ceil(count / limite),
        grupos_musculares: gruposMusculares.map(g => g.grupo_muscular),
        filtros_aplicados: {
          busca,
          grupo_muscular,
        }
      });

    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter exercício específico
  static async getExercicio(req, res) {
    try {
      const { id } = req.params;

      const exercicio = await Exercicio.findByPk(id);

      if (!exercicio) {
        return res.status(404).json({
          error: 'Exercício não encontrado'
        });
      }

      res.json({ exercicio });

    } catch (error) {
      console.error('Erro ao buscar exercício:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar exercícios por nome (para autocomplete)
  static async searchExercicios(req, res) {
    try {
      const { q, limite = 10 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.json([]);
      }

      const exercicios = await Exercicio.findAll({
        where: {
          nome: { [Op.like]: `%${q.trim()}%` }
        },
        attributes: ['id_exercicio', 'nome', 'grupo_muscular'],
        limit: parseInt(limite),
        order: [['nome', 'ASC']]
      });

      res.json(exercicios);

    } catch (error) {
      console.error('Erro na busca de exercícios:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter exercícios por grupo muscular
  static async getExerciciosPorGrupo(req, res) {
    try {
      const { grupo } = req.params;

      const exercicios = await Exercicio.findAll({
        where: { grupo_muscular: grupo },
        order: [['nome', 'ASC']]
      });

      res.json({
        grupo_muscular: grupo,
        exercicios
      });

    } catch (error) {
      console.error('Erro ao buscar exercícios por grupo:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter estatísticas de exercícios
  static async getEstatisticas(req, res) {
    try {
      const [
        totalExercicios,
        gruposMusculares,
        exerciciosPorNivel
      ] = await Promise.all([
        Exercicio.count(),
        Exercicio.findAll({
          attributes: ['grupo_muscular'],
          group: ['grupo_muscular'],
          order: [['grupo_muscular', 'ASC']]
        }),
      ]);

      res.json({
        total_exercicios: totalExercicios,
        total_grupos_musculares: gruposMusculares.length,
        grupos_musculares: gruposMusculares.map(g => g.grupo_muscular),
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas de exercícios:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Criar novo exercício (para administradores ou personal trainers)
  static async createExercicio(req, res) {
    try {
      const {
        nome,
        descricao,
        grupo_muscular,
        equipamento_necesario,
        instrucoes,
        gif_url
      } = req.body;

      // Validações básicas
      if (!nome || !grupo_muscular) {
        return res.status(400).json({
          error: 'Nome e grupo muscular são obrigatórios'
        });
      }

      // Verificar se já existe exercício com o mesmo nome
      const exercicioExistente = await Exercicio.findOne({
        where: { nome: { [Op.like]: nome.trim() } }
      });

      if (exercicioExistente) {
        return res.status(409).json({
          error: 'Já existe um exercício com este nome'
        });
      }

      const novoExercicio = await Exercicio.create({
        nome: nome.trim(),
        descricao,
        grupo_muscular,
        equipamento_necesario,
        instrucoes,
        gif_url
      });

      res.status(201).json({
        success: true,
        message: 'Exercício criado com sucesso',
        exercicio: novoExercicio
      });

    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar exercício
  static async updateExercicio(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        descricao,
        grupo_muscular,
        equipamento_necesario,
        instrucoes,
        gif_url
      } = req.body;

      const exercicio = await Exercicio.findByPk(id);

      if (!exercicio) {
        return res.status(404).json({
          error: 'Exercício não encontrado'
        });
      }

      // Verificar se o novo nome já existe (se foi alterado)
      if (nome && nome.trim() !== exercicio.nome) {
        const exercicioExistente = await Exercicio.findOne({
          where: { 
            nome: { [Op.like]: nome.trim() },
            id_exercicio: { [Op.ne]: id }
          }
        });

        if (exercicioExistente) {
          return res.status(409).json({
            error: 'Já existe um exercício com este nome'
          });
        }
      }

      await exercicio.update({
        nome: nome ? nome.trim() : exercicio.nome,
        descricao: descricao !== undefined ? descricao : exercicio.descricao,
        grupo_muscular: grupo_muscular || exercicio.grupo_muscular,
        equipamento_necesario: equipamento_necesario !== undefined ? equipamento_necesario : exercicio.equipamento_necesario,
        instrucoes: instrucoes !== undefined ? instrucoes : exercicio.instrucoes,
        gif_url: gif_url !== undefined ? gif_url : exercicio.gif_url
      });

      res.json({
        success: true,
        message: 'Exercício atualizado com sucesso',
        exercicio
      });

    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Excluir exercício
  static async deleteExercicio(req, res) {
    try {
      const { id } = req.params;

      const exercicio = await Exercicio.findByPk(id);

      if (!exercicio) {
        return res.status(404).json({
          error: 'Exercício não encontrado'
        });
      }

      // Verificar se o exercício está sendo usado em algum plano
      const { ExerciciosDoTreino } = require('../models');
      const usoEmPlanos = await ExerciciosDoTreino.count({
        where: { id_exercicio: id }
      });

      if (usoEmPlanos > 0) {
        return res.status(409).json({
          error: 'Este exercício está sendo usado em planos de treino e não pode ser excluído'
        });
      }

      await exercicio.destroy();

      res.json({
        success: true,
        message: 'Exercício excluído com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir exercício:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = ExerciciosController;