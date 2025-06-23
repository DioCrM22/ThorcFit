const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Usuario = sequelize.define("Usuario", {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    genero: {
      type: DataTypes.ENUM("masculino", "feminino", "outro"),
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    data_cadastro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_objetivo: {
      type: DataTypes.ENUM("manutenção", "ganho", "perca"),
      allowNull: true,
    },
    altura: {
  type: DataTypes.DECIMAL(5,2),
  allowNull: true,
  comment: 'Altura em cm',
},
peso: {
  type: DataTypes.DECIMAL(5,2),
  allowNull: true,
  comment: 'Peso em kg',
},

    foto_perfil: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },

  }, {
    tableName: "usuario",
    timestamps: false,
  });

  return Usuario;
};