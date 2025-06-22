const express = require('express');
const TreinoController = require('../controllers/TreinoController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Obter planos de treino
router.get('/planos',
  TreinoController.getPlanos
);

// Criar novo plano de treino
router.post('/plano',
  TreinoController.validatePlano,
  TreinoController.createPlano
);

// Visualizar plano de treino específico
router.get('/plano/:id',
  TreinoController.getPlano
);

// Editar plano de treino
router.put('/plano/:id',
  TreinoController.updatePlano
);

// Duplicar plano de treino
router.post('/plano/:id/duplicar',
  TreinoController.duplicatePlano
);

// Excluir plano de treino
router.delete('/plano/:id',
  TreinoController.deletePlano
);

// Iniciar treino
router.post('/iniciar/:id',
  TreinoController.iniciarTreino
);

// Finalizar treino
router.post('/finalizar',
  TreinoController.finalizarTreino
);

module.exports = router;

