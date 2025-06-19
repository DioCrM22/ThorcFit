const { body, validationResult } = require('express-validator');
const { Usuario, Nutricionista, PersonalTrainer } = require('../models');
const { Op } = require('sequelize');

class UserController {
  static validateUpdateProfile = [
    body('nome').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('telefone').optional().trim().isLength({ max: 20 }).withMessage('Telefone deve ter no máximo 20 caracteres'),
    body('genero').optional().isIn(['masculino', 'feminino', 'outro']).withMessage('Gênero inválido'),
    body('data_nascimento').optional().isISO8601().withMessage('Data de nascimento inválida')
  ];

  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { nome, telefone, genero, data_nascimento, foto_perfil, bio, especialidades, registro_profissional, preco_consulta, preco_sessao } = req.body;

      const usuario = await Usuario.findByPk(req.userId, {
        include: [
          { model: Nutricionista, as: 'nutricionista' },
          { model: PersonalTrainer, as: 'personalTrainer' }
        ]
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const dadosAtualizacao = {};
      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (telefone !== undefined) dadosAtualizacao.telefone = telefone;
      if (genero !== undefined) dadosAtualizacao.genero = genero;
      if (data_nascimento !== undefined) dadosAtualizacao.data_nascimento = data_nascimento;
      if (foto_perfil !== undefined) dadosAtualizacao.foto_perfil = foto_perfil;

      await usuario.update(dadosAtualizacao);

      if (usuario.nutricionista && (bio !== undefined || especialidades !== undefined || registro_profissional !== undefined || preco_consulta !== undefined)) {
        const dadosNutricionista = {};
        if (bio !== undefined) dadosNutricionista.bio = bio;
        if (especialidades !== undefined) dadosNutricionista.especialidades = especialidades;
        if (registro_profissional !== undefined) dadosNutricionista.registro_nutricionista = registro_profissional;
        if (preco_consulta !== undefined) dadosNutricionista.preco_consulta = preco_consulta;

        await usuario.nutricionista.update(dadosNutricionista);
      }

      if (usuario.personalTrainer && (bio !== undefined || especialidades !== undefined || registro_profissional !== undefined || preco_sessao !== undefined)) {
        const dadosPersonal = {};
        if (bio !== undefined) dadosPersonal.bio = bio;
        if (especialidades !== undefined) dadosPersonal.especialidades = especialidades;
        if (registro_profissional !== undefined) dadosPersonal.registro_personal = registro_profissional;
        if (preco_sessao !== undefined) dadosPersonal.preco_sessao = preco_sessao;

        await usuario.personalTrainer.update(dadosPersonal);
      }

      const usuarioAtualizado = await Usuario.findByPk(req.userId, {
        attributes: { exclude: ['senha_hash'] },
        include: [
          { model: Nutricionista, as: 'nutricionista' },
          { model: PersonalTrainer, as: 'personalTrainer' }
        ]
      });

      res.json({
        message: 'Perfil atualizado com sucesso',
        usuarioAtualizado: usuarioAtualizado.toJSON()
      });

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getPublicProfile(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        attributes: ['id_usuario', 'nome', 'foto_perfil'],
        include: [
          {
            model: Nutricionista,
            as: 'nutricionista',
            attributes: ['bio', 'especialidades', 'preco_consulta']
          },
          {
            model: PersonalTrainer,
            as: 'personalTrainer',
            attributes: ['bio', 'especialidades', 'preco_sessao']
          }
        ]
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ usuario: usuario.toJSON() });

    } catch (error) {
      console.error('Erro ao buscar perfil público:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async searchProfessionals(req, res) {
    try {
      const { tipo, busca, limite = 20, pagina = 1 } = req.query;

      const offset = (pagina - 1) * limite;

      const whereClause = {};

      if (busca) {
        whereClause.nome = { [Op.like]: `%${busca}%` };
      }

      const include = [];

      if (tipo === 'nutricionista' || !tipo) {
        include.push({
          model: Nutricionista,
          as: 'nutricionista',
          required: tipo === 'nutricionista'
        });
      }

      if (tipo === 'personal' || !tipo) {
        include.push({
          model: PersonalTrainer,
          as: 'personalTrainer',
          required: tipo === 'personal'
        });
      }

      const { count, rows: profissionais } = await Usuario.findAndCountAll({
        where: whereClause,
        include,
        attributes: ['id_usuario', 'nome', 'foto_perfil'],
        limit: parseInt(limite),
        offset,
        order: [['nome', 'ASC']]
      });

      const profissionaisFiltrados = profissionais.filter(usuario => usuario.nutricionista || usuario.personalTrainer);

      res.json({
        profissionais: profissionaisFiltrados,
        total: count,
        pagina: parseInt(pagina),
        totalPaginas: Math.ceil(count / limite)
      });

    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async deactivateAccount(req, res) {
    try {
      return res.status(501).json({
        error: 'Funcionalidade de desativar conta não implementada. Remova ou ajuste esse endpoint se não for usar.'
      });
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getUserStats(req, res) {
    try {
      const { DiarioAlimentar, PlanoTreino, MetricasUsuario } = require('../models');

      const [totalDiarios, totalPlanos, totalMetricas, ultimaMetrica] = await Promise.all([
        DiarioAlimentar.count({ where: { id_usuario: req.userId } }),
        PlanoTreino.count({ where: { id_criador_usuario: req.userId } }),
        MetricasUsuario.count({ where: { id_usuario: req.userId } }),
        MetricasUsuario.findOne({
          where: { id_usuario: req.userId },
          order: [['data_registro', 'DESC']]
        })
      ]);

      res.json({
        estatisticas: {
          total_diarios_alimentares: totalDiarios,
          total_planos_treino: totalPlanos,
          total_metricas: totalMetricas,
          ultima_metrica: ultimaMetrica
        }
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = UserController;
