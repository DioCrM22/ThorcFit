module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const VinculoTreino = sequelize.define('VinculoTreino', {
    id_vinculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_personal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'ativo', 'cancelado'),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    }
  }, {
    tableName: 'vinculo_treino',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return VinculoTreino;
};
