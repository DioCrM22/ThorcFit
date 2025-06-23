const express = require('express');
const multer = require('multer');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer();

// Aplica autenticação para todas as rotas daqui pra frente
router.use(authMiddleware);

// Rota para obter perfil do usuário autenticado
router.get('/profile', UserController.getProfile);

// Atualizar perfil do usuário autenticado
router.put('/usuario-perfil',
  upload.any(),
  UserController.validateUpdateProfile,
  UserController.updateProfile
);

// Obter perfil público de um usuário pelo ID
router.get('/usuario/:id/perfil',
  UserController.getPublicProfile
);

// Buscar profissionais (nutricionistas e personal trainers)
router.get('/profissionais',
  UserController.searchProfessionals
);

// Obter estatísticas do usuário autenticado
router.get('/usuario/estatisticas',
  UserController.getUserStats
);

// Desativar conta do usuário autenticado
router.delete('/usuario/desativar',
  UserController.deactivateAccount
);

module.exports = router;
