const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Exercicio = sequelize.define("Exercicio", {
    id_exercicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    grupo_muscular: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    equipamento_necesario: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    instrucoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gif_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: "exercicio",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  const PlanoTreino = sequelize.define("PlanoTreino", {
    id_plano_treino: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_criador: {
      type: DataTypes.ENUM("usuario", "personal"),
      allowNull: false,
    },
    id_criador_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_criador_personal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data_criacao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("ativo", "inativo", "concluido"),
      allowNull: false,
      defaultValue: "ativo",
    },
    duracao_estimada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Duração em minutos",
    },
  }, {
    tableName: "plano_treino",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  const ExerciciosDoTreino = sequelize.define("ExerciciosDoTreino", {
    id_treino: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_exercicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    series: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repeticoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    carga: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: "Carga em kg",
    },
    tempo_descanso: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Tempo de descanso em segundos",
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Ordem do exercício no treino",
    },
  }, {
    tableName: "exercicios_do_treino",
    timestamps: false,
  });

  const HistoricoTreino = sequelize.define("HistoricoTreino", {
    id_historico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_plano_treino: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data_treino: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    hora_fim: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    duracao_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    calorias_queimadas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    concluido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: "historico_treino",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return {
    Exercicio,
    PlanoTreino,
    ExerciciosDoTreino,
    HistoricoTreino
  };
};
