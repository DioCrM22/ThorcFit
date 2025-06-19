const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { PlanoTreino, Exercicio, ExerciciosDoTreino, HistoricoTreino, PersonalTrainer, VinculoTreino } = require('../models');

class TreinoController {
  // Validações para novo plano de treino
  static validatePlano = [
    body('nome')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome do plano deve ter entre 2 e 100 caracteres'),
    body('exercicios')
      .isArray({ min: 1 })
      .withMessage('Pelo menos um exercício deve ser adicionado'),
    body('exercicios.*.exercicio_id')
      .isInt({ min: 1 })
      .withMessage('ID do exercício inválido'),
    body('exercicios.*.series')
      .isInt({ min: 1, max: 20 })
      .withMessage('Número de séries deve estar entre 1 e 20'),
    body('exercicios.*.repeticoes')
      .isInt({ min: 1, max: 100 })
      .withMessage('Número de repetições deve estar entre 1 e 100')
  ];

  // Obter planos de treino
  static async getPlanos(req, res) {
    try {
      const { status } = req.query;

      // Query base - planos criados pelo usuário ou por personal vinculado
      let whereClause = {
        [Op.or]: [
          { id_criador_usuario: req.userId },
          {
            id_criador_personal: {
              [Op.in]: await VinculoTreino.findAll({
                where: { 
                  id_usuario: req.userId, 
                  status: 'ativo' 
                },
                attributes: ['id_personal']
              }).then(vinculos => vinculos.map(v => v.id_personal))
            }
          }
        ]
      };

      // Aplicar filtro de status se fornecido
      if (status) {
        if (status === 'ativo') {
          whereClause.status = 'ativo';
        } else if (status === 'inativo') {
          whereClause.status = 'inativo';
        }
      }

      const planosTreino = await PlanoTreino.findAll({
        where: whereClause,
        include: [
          {
            model: Exercicio,
            as: 'exercicios',
            through: {
              attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
            }
          },
          {
            model: PersonalTrainer,
            as: 'criadorPersonal',
            include: [{
              model: require('./Usuario'),
              as: 'usuario',
              attributes: ['nome']
            }]
          }
        ],
        order: [['data_criacao', 'DESC']]
      });

      // Calcular estatísticas
      const estatisticas = await this.calcularEstatisticas(req.userId);

      // Buscar exercícios disponíveis
      const exerciciosDisponiveis = await Exercicio.findAll({
        attributes: ['id_exercicio', 'nome', 'grupo_muscular'],
        order: [['grupo_muscular', 'ASC'], ['nome', 'ASC']]
      });

      res.json({
        planos_treino: planosTreino.map(plano => ({
          ...plano.toJSON(),
          exercicios_treino: plano.exercicios.map(exercicio => ({
            series: exercicio.ExerciciosDoTreino.series,
            repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
            carga: exercicio.ExerciciosDoTreino.carga,
            tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
            observacoes: exercicio.ExerciciosDoTreino.observacoes,
            ordem: exercicio.ExerciciosDoTreino.ordem,
            exercicio: {
              id_exercicio: exercicio.id_exercicio,
              nome: exercicio.nome,
              grupo_muscular: exercicio.grupo_muscular,
            }
          }))
        })),
        ...estatisticas,
        exercicios_disponiveis: exerciciosDisponiveis
      });

    } catch (error) {
      console.error('Erro ao buscar planos de treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Criar novo plano de treino
  static async createPlano(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { nome, observacoes, exercicios, duracao_estimada } = req.body;

      // Criar plano
      const novoPlano = await PlanoTreino.create({
        tipo_criador: 'usuario',
        id_criador_usuario: req.userId,
        nome,
        descricao: observacoes,
        data_criacao: new Date(),
        status: 'ativo',
        duracao_estimada
      });

      // Adicionar exercícios ao plano
      let exerciciosAdicionados = 0;
      for (let i = 0; i < exercicios.length; i++) {
        const exercicioData = exercicios[i];
        
        // Verificar se o exercício existe
        const exercicio = await Exercicio.findByPk(exercicioData.exercicio_id);
        if (!exercicio) {
          continue;
        }

        await ExerciciosDoTreino.create({
          id_treino: novoPlano.id_plano_treino,
          id_exercicio: exercicioData.exercicio_id,
          series: exercicioData.series,
          repeticoes: exercicioData.repeticoes,
          carga: exercicioData.carga || null,
          tempo_descanso: exercicioData.tempo_descanso || null,
          observacoes: exercicioData.observacoes || null,
          ordem: i + 1
        });

        exerciciosAdicionados++;
      }

      if (exerciciosAdicionados === 0) {
        await novoPlano.destroy();
        return res.status(400).json({
          error: 'Nenhum exercício válido foi adicionado ao plano'
        });
      }

      // Buscar plano criado com exercícios
      const planoCriado = await PlanoTreino.findByPk(novoPlano.id_plano_treino, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      res.status(201).json({
        success: true,
        message: `Plano "${nome}" criado com sucesso! ${exerciciosAdicionados} exercícios adicionados.`,
        plano: planoCriado
      });

    } catch (error) {
      console.error('Erro ao criar plano de treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Visualizar plano de treino específico
  static async getPlano(req, res) {
    try {
      const { id } = req.params;

      const plano = await PlanoTreino.findByPk(id, {
        include: [
          {
            model: Exercicio,
            as: 'exercicios',
            through: {
              attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
            }
          },
          {
            model: PersonalTrainer,
            as: 'criadorPersonal',
            include: [{
              model: require('./Usuario'),
              as: 'usuario',
              attributes: ['nome']
            }]
          }
        ]
      });

      if (!plano) {
        return res.status(404).json({
          error: 'Plano de treino não encontrado'
        });
      }

      // Verificar se o usuário tem acesso ao plano
      const temAcesso = await this.verificarAcessoPlano(plano, req.userId);
      if (!temAcesso) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      res.json({
        plano: {
          ...plano.toJSON(),
          exercicios_treino: plano.exercicios.map(exercicio => ({
            series: exercicio.ExerciciosDoTreino.series,
            repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
            carga: exercicio.ExerciciosDoTreino.carga,
            tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
            observacoes: exercicio.ExerciciosDoTreino.observacoes,
            ordem: exercicio.ExerciciosDoTreino.ordem,
            exercicio: {
              id_exercicio: exercicio.id_exercicio,
              nome: exercicio.nome,
              descricao: exercicio.descricao,
              grupo_muscular: exercicio.grupo_muscular,
              equipamento_necesario: exercicio.equipamento_necesario,
              instrucoes: exercicio.instrucoes,
              gif_url: exercicio.gif_url
            }
          })).sort((a, b) => a.ordem - b.ordem)
        }
      });

    } catch (error) {
      console.error('Erro ao buscar plano de treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Editar plano de treino
  static async updatePlano(req, res) {
    try {
      const { id } = req.params;
      const { nome, observacoes, exercicios, duracao_estimada } = req.body;

      const plano = await PlanoTreino.findByPk(id);

      if (!plano) {
        return res.status(404).json({
          error: 'Plano de treino não encontrado'
        });
      }

      // Verificar se o usuário pode editar o plano
      if (plano.id_criador_usuario !== req.userId) {
        return res.status(403).json({
          error: 'Você não pode editar este plano'
        });
      }

      // Atualizar dados básicos do plano
      await plano.update({
        nome: nome || plano.nome,
        descricao: observacoes !== undefined ? observacoes : plano.descricao,
        duracao_estimada: duracao_estimada || plano.duracao_estimada
      });

      // Se exercícios foram fornecidos, atualizar a lista
      if (exercicios && Array.isArray(exercicios)) {
        // Remover exercícios existentes
        await ExerciciosDoTreino.destroy({
          where: { id_treino: plano.id_plano_treino }
        });

        // Adicionar novos exercícios
        for (let i = 0; i < exercicios.length; i++) {
          const exercicioData = exercicios[i];
          
          await ExerciciosDoTreino.create({
            id_treino: plano.id_plano_treino,
            id_exercicio: exercicioData.exercicio_id,
            series: exercicioData.series,
            repeticoes: exercicioData.repeticoes,
            carga: exercicioData.carga || null,
            tempo_descanso: exercicioData.tempo_descanso || null,
            observacoes: exercicioData.observacoes || null,
            ordem: i + 1
          });
        }
      }

      // Buscar plano atualizado
      const planoAtualizado = await PlanoTreino.findByPk(id, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      res.json({
        success: true,
        message: 'Plano atualizado com sucesso',
        plano: planoAtualizado
      });

    } catch (error) {
      console.error('Erro ao atualizar plano de treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Duplicar plano de treino
  static async duplicatePlano(req, res) {
    try {
      const { id } = req.params;

      const planoOriginal = await PlanoTreino.findByPk(id, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      if (!planoOriginal) {
        return res.status(404).json({
          error: 'Plano de treino não encontrado'
        });
      }

      // Verificar acesso
      const temAcesso = await this.verificarAcessoPlano(planoOriginal, req.userId);
      if (!temAcesso) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      // Criar novo plano
      const novoPlano = await PlanoTreino.create({
        tipo_criador: 'usuario',
        id_criador_usuario: req.userId,
        nome: `${planoOriginal.nome} (Cópia)`,
        descricao: planoOriginal.descricao,
        data_criacao: new Date(),
        status: 'ativo',
        duracao_estimada: planoOriginal.duracao_estimada
      });

      // Copiar exercícios
      for (const exercicio of planoOriginal.exercicios) {
        await ExerciciosDoTreino.create({
          id_treino: novoPlano.id_plano_treino,
          id_exercicio: exercicio.id_exercicio,
          series: exercicio.ExerciciosDoTreino.series,
          repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
          carga: exercicio.ExerciciosDoTreino.carga,
          tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
          observacoes: exercicio.ExerciciosDoTreino.observacoes,
          ordem: exercicio.ExerciciosDoTreino.ordem
        });
      }

      res.status(201).json({
        success: true,
        message: 'Plano duplicado com sucesso',
        novo_plano: novoPlano
      });

    } catch (error) {
      console.error('Erro ao duplicar plano de treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Excluir plano de treino
  static async deletePlano(req, res) {
    try {
      const { id } = req.params;

      const plano = await PlanoTreino.findByPk(id);

      if (!plano) {
        return res.status(404).json({
          error: 'Plano de treino não encontrado'
        });
      }

      // Verificar se o usuário pode excluir o plano
      if (plano.id_criador_usuario !== req.userId) {
        return res.status(403).json({
          error: 'Você não pode excluir este plano'
        });
      }

      await plano.destroy();

      res.json({
        success: true,
        message: 'Plano excluído com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir plano de treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Iniciar treino
  static async iniciarTreino(req, res) {
    try {
      const { id } = req.params;

      const plano = await PlanoTreino.findByPk(id, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          through: {
            attributes: ['series', 'repeticoes', 'carga', 'tempo_descanso', 'observacoes', 'ordem']
          }
        }]
      });

      if (!plano) {
        return res.status(404).json({
          error: 'Plano de treino não encontrado'
        });
      }

      // Verificar acesso
      const temAcesso = await this.verificarAcessoPlano(plano, req.userId);
      if (!temAcesso) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      // Criar registro no histórico
      const historicoTreino = await HistoricoTreino.create({
        id_usuario: req.userId,
        id_plano_treino: plano.id_plano_treino,
        data_treino: new Date().toISOString().split('T')[0],
        hora_inicio: new Date().toTimeString().split(' ')[0],
        concluido: false
      });

      res.json({
        plano: {
          ...plano.toJSON(),
          exercicios_treino: plano.exercicios.map(exercicio => ({
            series: exercicio.ExerciciosDoTreino.series,
            repeticoes: exercicio.ExerciciosDoTreino.repeticoes,
            carga: exercicio.ExerciciosDoTreino.carga,
            tempo_descanso: exercicio.ExerciciosDoTreino.tempo_descanso,
            observacoes: exercicio.ExerciciosDoTreino.observacoes,
            ordem: exercicio.ExerciciosDoTreino.ordem,
            exercicio: {
              id_exercicio: exercicio.id_exercicio,
              nome: exercicio.nome,
              descricao: exercicio.descricao,
              grupo_muscular: exercicio.grupo_muscular,
              equipamento_necesario: exercicio.equipamento_necesario,
              instrucoes: exercicio.instrucoes,
              gif_url: exercicio.gif_url
            }
          })).sort((a, b) => a.ordem - b.ordem)
        },
        historico_id: historicoTreino.id_historico
      });

    } catch (error) {
      console.error('Erro ao iniciar treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Finalizar treino
  static async finalizarTreino(req, res) {
    try {
      const { historico_id, calorias_queimadas, observacoes } = req.body;

      const historico = await HistoricoTreino.findOne({
        where: {
          id_historico: historico_id,
          id_usuario: req.userId
        }
      });

      if (!historico) {
        return res.status(404).json({
          error: 'Histórico de treino não encontrado'
        });
      }

      const horaFim = new Date().toTimeString().split(' ')[0];
      const horaInicio = historico.hora_inicio;
      
      // Calcular duração em minutos
      const [horaI, minI] = horaInicio.split(':').map(Number);
      const [horaF, minF] = horaFim.split(':').map(Number);
      const duracaoMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);

      await historico.update({
        hora_fim: horaFim,
        duracao_minutos: duracaoMinutos,
        calorias_queimadas,
        observacoes,
        concluido: true
      });

      res.json({
        success: true,
        message: 'Treino finalizado com sucesso',
        duracao_minutos: duracaoMinutos
      });

    } catch (error) {
      console.error('Erro ao finalizar treino:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Métodos auxiliares
  static async verificarAcessoPlano(plano, userId) {
    if (plano.id_criador_usuario === userId) {
      return true;
    }

    if (plano.tipo_criador === 'personal') {
      const vinculo = await VinculoTreino.findOne({
        where: {
          id_usuario: userId,
          id_personal: plano.id_criador_personal,
          status: 'ativo'
        }
      });
      return vinculo !== null;
    }

    return false;
  }

  static async calcularEstatisticas(userId) {
    const hoje = new Date();
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
    
    const [
      treinosSemana,
      totalTreinos,
      totalCalorias,
      tempoTotal
    ] = await Promise.all([
      HistoricoTreino.count({
        where: {
          id_usuario: userId,
          data_treino: { [Op.gte]: inicioSemana.toISOString().split('T')[0] },
          concluido: true
        }
      }),
      HistoricoTreino.count({
        where: { id_usuario: userId, concluido: true }
      }),
      HistoricoTreino.sum('calorias_queimadas', {
        where: { id_usuario: userId, concluido: true }
      }),
      HistoricoTreino.sum('duracao_minutos', {
        where: { id_usuario: userId, concluido: true }
      })
    ]);

    // Exercício favorito
    const exercicioFavorito = await ExerciciosDoTreino.findOne({
      include: [
        {
          model: Exercicio,
          as: 'exercicio',
          attributes: ['nome']
        },
        {
          model: PlanoTreino,
          as: 'planoTreino',
          include: [{
            model: HistoricoTreino,
            as: 'historicos',
            where: { id_usuario: userId, concluido: true },
            attributes: []
          }]
        }
      ],
      group: ['id_exercicio'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('planoTreino.historicos.id_historico')), 'DESC']],
      limit: 1
    });

    return {
      treinos_semana: treinosSemana,
      total_treinos_realizados: totalTreinos,
      calorias_queimadas: totalCalorias || 0,
      tempo_total_treino: Math.round((tempoTotal || 0) / 60 * 10) / 10, // em horas
      exercicio_favorito: exercicioFavorito?.exercicio?.nome || 'N/A'
    };
  }
}

module.exports = TreinoController;

