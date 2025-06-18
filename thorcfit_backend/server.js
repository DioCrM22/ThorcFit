const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// Importar rotas
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const alimentacaoRoutes = require('./src/routes/alimentacao');
const treinoRoutes = require('./src/routes/treino');
const metricasRoutes = require('./src/routes/metricas');
const exerciciosRoutes = require('./src/routes/exercicios');
const alimentosRoutes = require('./src/routes/alimentos');
const vinculosRoutes = require('./src/routes/vinculos');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar trust proxy para proxies reversos
app.set('trust proxy', true);

// Configurações de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});

app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/alimentacao', alimentacaoRoutes);
app.use('/api/treino', treinoRoutes);
app.use('/api/metricas', metricasRoutes);
app.use('/api/exercicios', exerciciosRoutes);
app.use('/api/alimentos', alimentosRoutes);
app.use('/api/vinculos', vinculosRoutes);

// Rota para informações da API
app.get('/api', (req, res) => {
  res.json({
    name: 'ThorcFit Backend API',
    version: '1.0.0',
    description: 'API para aplicação de fitness e nutrição',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      alimentacao: '/api/alimentacao',
      treino: '/api/treino',
      metricas: '/api/metricas',
      exercicios: '/api/exercicios',
      alimentos: '/api/alimentos',
      vinculos: '/api/vinculos'
    },
    documentation: 'Consulte o README.md para documentação completa'
  });
});

// Middleware de tratamento de rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Função para inicializar o servidor
async function startServer() {
  try {
    // Testar conexão com banco de dados
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida');

    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados com o banco de dados');
    }

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 API disponível em: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Documentação: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais de encerramento
process.on('SIGTERM', async () => {
  console.log('🛑 Recebido SIGTERM, encerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recebido SIGINT, encerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Inicializar servidor
if (require.main === module) {
  startServer();
}

module.exports = app;