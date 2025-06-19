const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// ✅ Rota que o frontend espera: GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado na sessão' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao carregar o perfil:', error);
    res.status(500).json({ error: 'Erro interno ao buscar perfil' });
  }
});

// Atualizar perfil do usuário
router.put('/usuario-perfil',
  UserController.validateUpdateProfile,
  UserController.updateProfile
);

// Obter perfil público de outro usuário
router.get('/usuario/:id/perfil',
  UserController.getPublicProfile
);

// Buscar profissionais (nutricionistas e personal trainers)
router.get('/profissionais',
  UserController.searchProfessionals
);

// Obter estatísticas do usuário
router.get('/usuario/estatisticas',
  UserController.getUserStats
);

// Desativar conta
router.delete('/usuario/desativar',
  UserController.deactivateAccount
);

module.exports = router;
