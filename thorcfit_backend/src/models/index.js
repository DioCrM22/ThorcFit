const { sequelize } = require("../config/database");

// Importar as definições dos modelos
const defineUsuario = require("./Usuario");
const defineProfissionais = require("./Profissionais");
const defineNutricao = require("./Nutricao");
const defineTreino = require("./Treino");
const defineVinculoNutricional = require("./VinculoNutricional");  // novo
const defineVinculoTreino = require("./VinculoTreino");            // novo

// Definir os modelos
const Usuario = defineUsuario(sequelize);
const { Nutricionista, PersonalTrainer } = defineProfissionais(sequelize);
const { Alimento, PlanoNutricional, DiarioAlimentar, Refeicao, AlimentoRefeicao } = defineNutricao(sequelize);
const { Exercicio, PlanoTreino, ExerciciosDoTreino, HistoricoTreino } = defineTreino(sequelize);
const VinculoNutricional = defineVinculoNutricional(sequelize);  // novo
const VinculoTreino = defineVinculoTreino(sequelize);            // novo

// Associações de Usuario
Usuario.hasOne(Nutricionista, { foreignKey: 'id_usuario', as: 'nutricionista' });
Nutricionista.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasOne(PersonalTrainer, { foreignKey: 'id_usuario', as: 'personalTrainer' });
PersonalTrainer.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(DiarioAlimentar, { foreignKey: 'id_usuario', as: 'diariosAlimentares' });
DiarioAlimentar.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(PlanoNutricional, { foreignKey: 'id_usuario', as: 'planosNutricionais' });
PlanoNutricional.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(PlanoTreino, { foreignKey: 'id_criador_usuario', as: 'planosTreinoCriados' });
PlanoTreino.belongsTo(Usuario, { foreignKey: 'id_criador_usuario', as: 'criadorUsuario' });


// Associações com vinculos
Usuario.hasMany(VinculoNutricional, { foreignKey: 'id_usuario', as: 'vinculosNutricionais' });
VinculoNutricional.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(VinculoTreino, { foreignKey: 'id_usuario', as: 'vinculosTreino' });
VinculoTreino.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Associações de Nutricionista
Nutricionista.hasMany(PlanoNutricional, { foreignKey: 'id_nutricionista', as: 'planosNutricionaisCriados' });
PlanoNutricional.belongsTo(Nutricionista, { foreignKey: 'id_nutricionista', as: 'nutricionista' });

Nutricionista.hasMany(VinculoNutricional, { foreignKey: 'id_nutricionista', as: 'vinculosNutricionaisRecebidos' });
VinculoNutricional.belongsTo(Nutricionista, { foreignKey: 'id_nutricionista', as: 'nutricionista' });

// Associações de PersonalTrainer
PersonalTrainer.hasMany(PlanoTreino, { foreignKey: 'id_criador_personal', as: 'planosTreinoCriados' });
PlanoTreino.belongsTo(PersonalTrainer, { foreignKey: 'id_criador_personal', as: 'criadorPersonal' });

PersonalTrainer.hasMany(VinculoTreino, { foreignKey: 'id_personal', as: 'vinculosTreinoRecebidos' });
VinculoTreino.belongsTo(PersonalTrainer, { foreignKey: 'id_personal', as: 'personalTrainer' });

// Associações de DiarioAlimentar
DiarioAlimentar.hasMany(Refeicao, { foreignKey: 'id_registro', as: 'refeicoes' });
Refeicao.belongsTo(DiarioAlimentar, { foreignKey: 'id_registro', as: 'diarioAlimentar' });

// Associações de Refeicao
Refeicao.hasMany(AlimentoRefeicao, { foreignKey: 'id_refeicao', as: 'alimentosRefeicao' });
AlimentoRefeicao.belongsTo(Refeicao, { foreignKey: 'id_refeicao', as: 'refeicao' });

// Associações de Alimento
Alimento.hasMany(AlimentoRefeicao, { foreignKey: 'id_alimento', as: 'refeicoesComAlimento' });
AlimentoRefeicao.belongsTo(Alimento, { foreignKey: 'id_alimento', as: 'alimento' });

// Associações de PlanoTreino e ExerciciosDoTreino (muitos para muitos via tabela intermediária)
PlanoTreino.belongsToMany(Exercicio, {
  through: ExerciciosDoTreino,
  foreignKey: 'id_treino',
  otherKey: 'id_exercicio',
  as: 'exercicios',
});

Exercicio.belongsToMany(PlanoTreino, {
  through: ExerciciosDoTreino,
  foreignKey: 'id_exercicio',
  otherKey: 'id_treino',
  as: 'planosTreino',
});

// Opcional manter os relacionamentos diretos (1-N) entre PlanoTreino e ExerciciosDoTreino
PlanoTreino.hasMany(ExerciciosDoTreino, { foreignKey: 'id_treino', as: 'exerciciosDoTreino' });
ExerciciosDoTreino.belongsTo(PlanoTreino, { foreignKey: 'id_treino', as: 'planoTreino' });

Exercicio.hasMany(ExerciciosDoTreino, { foreignKey: 'id_exercicio', as: 'treinosComExercicio' });
ExerciciosDoTreino.belongsTo(Exercicio, { foreignKey: 'id_exercicio', as: 'exercicio' });

// Exportar modelos e sequelize
module.exports = {
  sequelize,
  Usuario,
  Nutricionista,
  PersonalTrainer,
  Alimento,
  PlanoNutricional,
  DiarioAlimentar,
  Refeicao,
  AlimentoRefeicao,
  Exercicio,
  PlanoTreino,
  ExerciciosDoTreino,
  HistoricoTreino,
  VinculoNutricional,
  VinculoTreino,
};
