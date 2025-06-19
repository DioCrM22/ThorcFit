const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Usuario, Nutricionista, PersonalTrainer } = require('../models');

class AuthController {
  // Validações para registro
  static validateSignup = [
    body('nome').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('tipo_usuario').optional().isIn(['usuario', 'nutricionista', 'personal']).withMessage('Tipo de usuário inválido')
  ];

  static validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
  ];

  static async signup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { nome, email, senha, data_nascimento, genero, telefone, tipo_usuario = 'usuario', registro_profissional, bio, especialidades } = req.body;

      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(409).json({ error: 'Email já está em uso' });
      }

      const senha_hash = await bcrypt.hash(senha, 12);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone
      });

      if (tipo_usuario === 'nutricionista') {
        await Nutricionista.create({
          id_usuario: novoUsuario.id_usuario,
          registro_nutricionista: registro_profissional,
          bio,
          especialidades
        });
      } else if (tipo_usuario === 'personal') {
        await PersonalTrainer.create({
          id_usuario: novoUsuario.id_usuario,
          registro_personal: registro_profissional,
          bio,
          especialidades
        });
      }

      const token = jwt.sign(
        { id: novoUsuario.id_usuario, email: novoUsuario.email, tipo: tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const usuarioResposta = novoUsuario.toJSON();
      delete usuarioResposta.senha_hash;

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: { ...usuarioResposta, tipo_usuario }
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({
        where: { email },
        include: [
          { model: Nutricionista, as: 'nutricionista' },
          { model: PersonalTrainer, as: 'personalTrainer' }
        ]
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      let tipo_usuario = 'usuario';
      if (usuario.nutricionista) tipo_usuario = 'nutricionista';
      else if (usuario.personalTrainer) tipo_usuario = 'personal';

      const token = jwt.sign(
        { id: usuario.id_usuario, email: usuario.email, tipo: tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const usuarioResposta = usuario.toJSON();
      delete usuarioResposta.senha_hash;

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: { ...usuarioResposta, tipo_usuario }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getProfile(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.userId, {
        attributes: { exclude: ['senha_hash'] },
        include: [
          { model: Nutricionista, as: 'nutricionista' },
          { model: PersonalTrainer, as: 'personalTrainer' }
        ]
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      let tipo_usuario = 'usuario';
      if (usuario.nutricionista) tipo_usuario = 'nutricionista';
      else if (usuario.personalTrainer) tipo_usuario = 'personal';

      res.json({
        success: true,
        usuario: { ...usuario.toJSON(), tipo_usuario }
      });

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static validateForgotPassword = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido')
  ];

  static async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Email inválido', details: errors.array() });
      }

      const { email } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        // Não revela se o email existe ou não
        return res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha' });
      }

      // Aqui futuramente você pode disparar um e-mail de recuperação

      res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha' });

    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static validateResetPassword = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
  ];

  static async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { email, newPassword } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senha_hash = await bcrypt.hash(newPassword, 12);

      await usuario.update({ senha_hash });

      res.json({ message: 'Senha redefinida com sucesso' });

    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async verifyToken(req, res) {
    try {
      res.json({ valid: true, user: req.user });
    } catch (error) {
      res.status(401).json({ valid: false, error: 'Token inválido' });
    }
  }
}

module.exports = AuthController;
