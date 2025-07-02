const express = require('express');
const AlimentosController = require('../controllers/AlimentosController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Buscar alimentos (autocomplete)
router.get('/buscar',
  AlimentosController.buscarAlimentos
);

// Listar alimentos com filtros
router.get('/listar',
  AlimentosController.getAlimentos
);

// Obter alimento específico
router.get('/:id',
  AlimentosController.getAlimento
);

// Calcular valores nutricionais para quantidade específica
router.get('/:id/calcular',
  AlimentosController.calcularNutrientes
);

// Obter estatísticas de alimentos
router.get('/admin/estatisticas',
  AlimentosController.getEstatisticas
);

// Criar novo alimento
router.post('/createalimento',
  AlimentosController.createAlimento
);

// Atualizar alimento
router.put('/:id',
  AlimentosController.updateAlimento
);

// Excluir alimento
router.delete('/:id',
  AlimentosController.deleteAlimento
);

// Importar alimentos em lote (para administradores)
router.post('/importar',
  AlimentosController.importarAlimentos
);

module.exports = router;