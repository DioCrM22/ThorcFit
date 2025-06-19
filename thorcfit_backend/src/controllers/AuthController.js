const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Usuario, Nutricionista, PersonalTrainer } = require('../models');

class AuthController {
  // Validações para registro
  static validateSignup = [
    body('nome')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('tipo_usuario')
      .optional()
      .isIn(['usuario', 'nutricionista', 'personal'])
      .withMessage('Tipo de usuário inválido')
  ];

  // Validações para login
  static validateLogin = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('senha')
      .notEmpty()
      .withMessage('Senha é obrigatória')
  ];

  // Registro de usuário
  static async signup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { 
        nome, 
        email, 
        senha, 
        data_nascimento, 
        genero, 
        telefone, 
        tipo_usuario = 'usuario',
        registro_profissional,
        bio,
        especialidades
      } = req.body;

      // Verificar se o email já existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(409).json({
          error: 'Email já está em uso'
        });
      }

      // Criptografar senha
      const saltRounds = 12;
      const senha_hash = await bcrypt.hash(senha, saltRounds);

      // Criar usuário
      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone,
      });

      // Criar perfil profissional se necessário
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

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: novoUsuario.id_usuario,
          email: novoUsuario.email,
          tipo: tipo_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Remover senha do objeto de resposta
      const usuarioResposta = novoUsuario.toJSON();

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          ...usuarioResposta,
          tipo_usuario
        }
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Login de usuário
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { email, senha } = req.body;

      // Buscar usuário por email
      const usuario = await Usuario.findOne({ 
      where: { email },
      include: [
        { model: Nutricionista, as: 'nutricionista' },
        { model: PersonalTrainer, as: 'personalTrainer' }
      ]
    });


      if (!usuario) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Determinar tipo de usuário
      let tipo_usuario = 'usuario';
      if (usuario.nutricionista) {
        tipo_usuario = 'nutricionista';
      } else if (usuario.personalTrainer) {
        tipo_usuario = 'personal';
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id_usuario,
          email: usuario.email,
          tipo: tipo_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Preparar resposta
      const usuarioResposta = usuario.toJSON();
      delete usuarioResposta.senha_hash;

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          ...usuarioResposta,
          tipo_usuario
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter perfil do usuário logado
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
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Determinar tipo de usuário
      let tipo_usuario = 'usuario';
      if (usuario.nutricionista) {
        tipo_usuario = 'nutricionista';
      } else if (usuario.personalTrainer) {
        tipo_usuario = 'personal';
      }

      res.json({
        success: true,
        usuario: {
          ...usuario.toJSON(),
          tipo_usuario
        }
      });

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Validações para recuperação de senha
  static validateForgotPassword = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido')
  ];

  // Solicitar recuperação de senha
  static async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Email inválido'
        });
      }

      const { email } = req.body;

      const usuario = await Usuario.findOne({ where: { email, ativo: true } });
      
      if (!usuario) {
        // Por segurança, não revelar se o email existe ou não
        return res.json({
          message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha'
        });
      }

      // TODO: Implementar envio de email com token de recuperação
      // Por enquanto, retornar sucesso
      res.json({
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha'
      });

    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Validações para redefinição de senha
  static validateResetPassword = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Nova senha deve ter pelo menos 6 caracteres')
  ];

  // Redefinir senha
  static async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { email, newPassword } = req.body;

      const usuario = await Usuario.findOne({ where: { email, ativo: true } });
      
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Criptografar nova senha
      const saltRounds = 12;
      const senha_hash = await bcrypt.hash(newPassword, saltRounds);

      // Atualizar senha
      await usuario.update({ senha_hash });

      res.json({
        message: 'Senha redefinida com sucesso'
      });

    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Verificar token (para validação de sessão)
  static async verifyToken(req, res) {
    try {
      // Se chegou até aqui, o token é válido (middleware de auth já verificou)
      res.json({
        valid: true,
        user: req.user
      });
    } catch (error) {
      res.status(401).json({
        valid: false,
        error: 'Token inválido'
      });
    }
  }
}

module.exports = AuthController;