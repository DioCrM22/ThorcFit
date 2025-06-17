/*
const bcrypt = require("bcryptjs");
const { sequelize } = require("../src/config/database"); // Importa sequelize diretamente
const models = require("../src/models"); // Importa o objeto models completo

// Desestruturar os modelos do objeto models
const { Usuario, Nutricionista, PersonalTrainer, Alimento, Exercicio, PlanoTreino, DiarioAlimentar, Refeicao, AlimentoRefeicao, HistoricoTreino, MetricasUsuario, MetasUsuario, VinculoNutricao, VinculoTreino, Amizade, PlanoNutricional, ExerciciosDoTreino } = models;

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Sincronizar modelos (criar tabelas se não existirem)
    await sequelize.sync({ force: true }); // force: true recria as tabelas a cada seed
    console.log("✅ Modelos sincronizados");

    // DEBUG: Adicionar logs para inspecionar os modelos
    console.log("DEBUG: Objeto models:", models);
    console.log("DEBUG: Modelo Usuario:", Usuario);

    // 1. Criar Usuários
    console.log("👥 Criando usuários...");
    const usuarios = await Usuario.bulkCreate([
      {
        nome: "João Silva",
        email: "joao@teste.com",
        senha: await bcrypt.hash("123456", 10),
        data_nascimento: "1990-05-15",
        genero: "Masculino",
        tipo_usuario: "comum",
      },
      {
        nome: "Maria Oliveira",
        email: "maria@teste.com",
        senha: await bcrypt.hash("123456", 10),
        data_nascimento: "1992-11-20",
        genero: "Feminino",
        tipo_usuario: "comum",
      },
      {
        nome: "Carlos Nutri",
        email: "carlos.nutri@teste.com",
        senha: await bcrypt.hash("123456", 10),
        data_nascimento: "1985-03-10",
        genero: "Masculino",
        tipo_usuario: "nutricionista",
      },
      {
        nome: "Ana Personal",
        email: "ana.personal@teste.com",
        senha: await bcrypt.hash("123456", 10),
        data_nascimento: "1988-07-25",
        genero: "Feminino",
        tipo_usuario: "personal_trainer",
      },
      {
        nome: "Pedro Admin",
        email: "pedro.admin@teste.com",
        senha: await bcrypt.hash("admin123", 10),
        data_nascimento: "1980-01-01",
        genero: "Masculino",
        tipo_usuario: "admin",
      },
    ]);
    console.log("✅ Usuários criados.");

    // 2. Criar Perfis de Nutricionista e Personal Trainer
    console.log("👩‍⚕️🏋️ Criando perfis profissionais...");
    const nutricionista = await Nutricionista.create({
      id_usuario: usuarios[2].id_usuario,
      crn: "CRN12345",
      especialidade: "Nutrição Esportiva",
    });
    const personalTrainer = await PersonalTrainer.create({
      id_usuario: usuarios[3].id_usuario,
      cref: "CREF67890",
      especialidade: "Treinamento Funcional",
    });
    console.log("✅ Perfis profissionais criados.");

    // 3. Criar Alimentos
    console.log("🍎 Criando alimentos...");
    const alimentos = await Alimento.bulkCreate([
      { nome: "Arroz Branco", calorias: 130, carboidratos: 28, proteinas: 2.7, gorduras: 0.3, unidade_medida: "g" },
      { nome: "Peito de Frango", calorias: 165, carboidratos: 0, proteinas: 31, gorduras: 3.6, unidade_medida: "g" },
      { nome: "Brócolis", calorias: 55, carboidratos: 11, proteinas: 3.7, gorduras: 0.6, unidade_medida: "g" },
      { nome: "Ovo Cozido", calorias: 78, carboidratos: 0.6, proteinas: 6.3, gorduras: 5.3, unidade_medida: "unidade" },
      { nome: "Batata Doce", calorias: 86, carboidratos: 20, proteinas: 1.6, gorduras: 0.1, unidade_medida: "g" },
      { nome: "Salmão", calorias: 208, carboidratos: 0, proteinas: 20, gorduras: 13, unidade_medida: "g" },
      { nome: "Aveia", calorias: 389, carboidratos: 66, proteinas: 17, gorduras: 7, unidade_medida: "g" },
      { nome: "Leite Integral", calorias: 61, carboidratos: 4.7, proteinas: 3.2, gorduras: 3.3, unidade_medida: "ml" },
      { nome: "Maçã", calorias: 52, carboidratos: 14, proteinas: 0.3, gorduras: 0.2, unidade_medida: "unidade" },
      { nome: "Banana", calorias: 89, carboidratos: 23, proteinas: 1.1, gorduras: 0.3, unidade_medida: "unidade" },
      { nome: "Pão Integral", calorias: 265, carboidratos: 49, proteinas: 13, gorduras: 3.6, unidade_medida: "g" },
      { nome: "Queijo Cottage", calorias: 98, carboidratos: 3.4, proteinas: 11, gorduras: 4.3, unidade_medida: "g" },
      { nome: "Iogurte Natural", calorias: 59, carboidratos: 3.6, proteinas: 10, gorduras: 0.4, unidade_medida: "g" },
      { nome: "Amêndoas", calorias: 579, carboidratos: 22, proteinas: 21, gorduras: 49, unidade_medida: "g" },
      { nome: "Azeite de Oliva", calorias: 884, carboidratos: 0, proteinas: 0, gorduras: 100, unidade_medida: "ml" },
      { nome: "Feijão Preto", calorias: 132, carboidratos: 24, proteinas: 8.9, gorduras: 0.5, unidade_medida: "g" },
      { nome: "Carne Moída (magra)", calorias: 250, carboidratos: 0, proteinas: 26, gorduras: 15, unidade_medida: "g" },
      { nome: "Lentilha", calorias: 116, carboidratos: 20, proteinas: 9, gorduras: 0.4, unidade_medida: "g" },
      { nome: "Espinafre", calorias: 23, carboidratos: 3.6, proteinas: 2.9, gorduras: 0.4, unidade_medida: "g" },
      { nome: "Arroz Integral", calorias: 111, carboidratos: 23, proteinas: 2.6, gorduras: 0.9, unidade_medida: "g" },
      { nome: "Pescada", calorias: 82, carboidratos: 0, proteinas: 17, gorduras: 1.2, unidade_medida: "g" },
      { nome: "Cenoura", calorias: 41, carboidratos: 9.6, proteinas: 0.9, gorduras: 0.2, unidade_medida: "g" },
      { nome: "Tomate", calorias: 18, carboidratos: 3.9, proteinas: 0.9, gorduras: 0.2, unidade_medida: "g" },
      { nome: "Cebola", calorias: 40, carboidratos: 9.3, proteinas: 1.1, gorduras: 0.1, unidade_medida: "g" },
      { nome: "Alface", calorias: 15, carboidratos: 2.9, proteinas: 1.4, gorduras: 0.2, unidade_medida: "g" },
      { nome: "Pimentão", calorias: 20, carboidratos: 4.6, proteinas: 0.9, gorduras: 0.2, unidade_medida: "g" },
      { nome: "Abacate", calorias: 160, carboidratos: 8.5, proteinas: 2, gorduras: 14.7, unidade_medida: "g" },
    ]);
    console.log("✅ Alimentos criados.");

    // 4. Criar Exercícios
    console.log("💪 Criando exercícios...");
    const exercicios = await Exercicio.bulkCreate([
      { nome: "Supino Reto", grupo_muscular: "Peito", descricao: "Exercício para peitoral com barra." },
      { nome: "Agachamento Livre", grupo_muscular: "Pernas", descricao: "Exercício fundamental para pernas e glúteos." },
      { nome: "Remada Curvada", grupo_muscular: "Costas", descricao: "Exercício para costas com barra." },
      { nome: "Desenvolvimento de Ombro", grupo_muscular: "Ombros", descricao: "Exercício para ombros com halteres." },
      { nome: "Rosca Direta", grupo_muscular: "Bíceps", descricao: "Exercício para bíceps com barra." },
      { nome: "Tríceps Testa", grupo_muscular: "Tríceps", descricao: "Exercício para tríceps com barra." },
      { nome: "Leg Press", grupo_muscular: "Pernas", descricao: "Exercício para pernas em máquina." },
      { nome: "Puxada Frontal", grupo_muscular: "Costas", descricao: "Exercício para costas em máquina." },
      { nome: "Elevação Lateral", grupo_muscular: "Ombros", descricao: "Exercício para ombros com halteres." },
      { nome: "Cadeira Extensora", grupo_muscular: "Pernas", descricao: "Exercício para quadríceps." },
      { nome: "Cadeira Flexora", grupo_muscular: "Pernas", descricao: "Exercício para isquiotibiais." },
      { nome: "Panturrilha em Pé", grupo_muscular: "Panturrilha", descricao: "Exercício para panturrilha." },
      { nome: "Abdominal Crunch", grupo_muscular: "Abdômen", descricao: "Exercício para abdômen." },
      { nome: "Prancha", grupo_muscular: "Abdômen", descricao: "Exercício isométrico para core." },
      { nome: "Caminhada", grupo_muscular: "Cardio", descricao: "Exercício aeróbico de baixo impacto." },
      { nome: "Corrida", grupo_muscular: "Cardio", descricao: "Exercício aeróbico de alto impacto." },
      { nome: "Natação", grupo_muscular: "Corpo Todo", descricao: "Exercício aeróbico completo." },
      { nome: "Ciclismo", grupo_muscular: "Pernas", descricao: "Exercício aeróbico para pernas." },
      { nome: "Remo", grupo_muscular: "Costas", descricao: "Exercício de cardio e força." },
      { nome: "Flexão de Braço", grupo_muscular: "Peito", descricao: "Exercício com peso corporal para peito e tríceps." },
      { nome: "Barra Fixa", grupo_muscular: "Costas", descricao: "Exercício com peso corporal para costas e bíceps." },
      { nome: "Afundo", grupo_muscular: "Pernas", descricao: "Exercício unilateral para pernas." },
      { nome: "Stiff", grupo_muscular: "Pernas", descricao: "Exercício para isquiotibiais e glúteos." },
      { nome: "Encolhimento de Ombros", grupo_muscular: "Ombros", descricao: "Exercício para trapézio." },
      { nome: "Voador", grupo_muscular: "Peito", descricao: "Exercício para peitoral em máquina." },
      { nome: "Crucifixo Invertido", grupo_muscular: "Costas", descricao: "Exercício para deltoides posteriores." },
        ]);
        console.log("✅ Exercícios criados.");

        // 5. Criar Planos de Treino
        console.log("🏋️‍♀️ Criando planos de treino...");
        const planoTreino1 = await PlanoTreino.create({
          id_usuario: usuarios[0].id_usuario,
          nome: "Treino Iniciante Full Body",
          descricao: "Plano de treino para iniciantes, corpo todo.",
          data_criacao: new Date(),
          ativo: true,
        });
        const planoTreino2 = await PlanoTreino.create({
          id_usuario: usuarios[1].id_usuario,
          nome: "Treino Avançado ABC",
          descricao: "Plano de treino dividido em A, B e C.",
          data_criacao: new Date(),
          ativo: true,
        });
        const planoTreino3 = await PlanoTreino.create({
          id_usuario: usuarios[0].id_usuario,
          nome: "Treino de Força - Superior",
          descricao: "Foco em membros superiores.",
          data_criacao: new Date(),
          ativo: true,
        });
        const planoTreino4 = await PlanoTreino.create({
          id_usuario: usuarios[1].id_usuario,
          nome: "Treino de Resistência - Inferior",
          descricao: "Foco em membros inferiores e resistência.",
          data_criacao: new Date(),
          ativo: true,
        });
        console.log("✅ Planos de treino criados.");

        // 6. Adicionar Exercícios aos Planos de Treino
        console.log("📝 Adicionando exercícios aos planos...");
        await ExerciciosDoTreino.bulkCreate([
          { id_treino: planoTreino1.id_treino, id_exercicio: exercicios[0].id_exercicio, series: 3, repeticoes: 10, carga: "50kg" }, // Supino
          { id_treino: planoTreino1.id_treino, id_exercicio: exercicios[1].id_exercicio, series: 3, repeticoes: 12, carga: "Peso Corporal" }, // Agachamento
          { id_treino: planoTreino2.id_treino, id_exercicio: exercicios[2].id_exercicio, series: 4, repeticoes: 8, carga: "60kg" }, // Remada
          { id_treino: planoTreino2.id_treino, id_exercicio: exercicios[3].id_exercicio, series: 4, repeticoes: 10, carga: "20kg" }, // Desenvolvimento
          { id_treino: planoTreino3.id_treino, id_exercicio: exercicios[0].id_exercicio, series: 4, repeticoes: 8, carga: "60kg" }, // Supino
          { id_treino: planoTreino3.id_treino, id_exercicio: exercicios[4].id_exercicio, series: 3, repeticoes: 10, carga: "30kg" }, // Rosca Direta
          { id_treino: planoTreino4.id_treino, id_exercicio: exercicios[1].id_exercicio, series: 4, repeticoes: 15, carga: "40kg" }, // Agachamento
          { id_treino: planoTreino4.id_treino, id_exercicio: exercicios[6].id_exercicio, series: 3, repeticoes: 12, carga: "100kg" }, // Leg Press
        ]);
        console.log("✅ Exercícios adicionados aos planos.");

        // 7. Criar Diários Alimentares e Refeições
        console.log("🥗 Criando diários alimentares e refeições...");
        const diario1 = await DiarioAlimentar.create({
          id_usuario: usuarios[0].id_usuario,
          data: new Date(),
          total_calorias: 0,
          total_carboidratos: 0,
          total_proteinas: 0,
          total_gorduras: 0,
        });

        const refeicao1 = await Refeicao.create({
          id_registro: diario1.id_registro,
          tipo_refeicao: "Café da Manhã",
          horario: "08:00",
        });
        await AlimentoRefeicao.bulkCreate([
          { id_refeicao: refeicao1.id_refeicao, id_alimento: alimentos[6].id_alimento, quantidade: 50 }, // Aveia
          { id_refeicao: refeicao1.id_refeicao, id_alimento: alimentos[7].id_alimento, quantidade: 200 }, // Leite
          { id_refeicao: refeicao1.id_refeicao, id_alimento: alimentos[9].id_alimento, quantidade: 1 }, // Banana
        ]);

        const refeicao2 = await Refeicao.create({
          id_registro: diario1.id_registro,
          tipo_refeicao: "Almoço",
          horario: "13:00",
        });
        await AlimentoRefeicao.bulkCreate([
          { id_refeicao: refeicao2.id_refeicao, id_alimento: alimentos[0].id_alimento, quantidade: 150 }, // Arroz
          { id_refeicao: refeicao2.id_refeicao, id_alimento: alimentos[1].id_alimento, quantidade: 120 }, // Frango
          { id_refeicao: refeicao2.id_refeicao, id_alimento: alimentos[2].id_alimento, quantidade: 100 }, // Brócolis
        ]);
        console.log("✅ Diários alimentares e refeições criados.");

        // 8. Criar Métricas de Usuário
        console.log("📈 Criando métricas de usuário...");
        await MetricasUsuario.bulkCreate([
          { id_usuario: usuarios[0].id_usuario, data_registro: "2024-01-01", peso: 75.0, altura: 175, imc: 24.49, percentual_gordura: 18.0 },
          { id_usuario: usuarios[0].id_usuario, data_registro: "2024-02-01", peso: 74.5, altura: 175, imc: 24.33, percentual_gordura: 17.5 },
          { id_usuario: usuarios[0].id_usuario, data_registro: "2024-03-01", peso: 74.0, altura: 175, imc: 24.17, percentual_gordura: 17.0 },
          { id_usuario: usuarios[1].id_usuario, data_registro: "2024-01-01", peso: 60.0, altura: 160, imc: 23.44, percentual_gordura: 25.0 },
          { id_usuario: usuarios[1].id_usuario, data_registro: "2024-02-01", peso: 59.5, altura: 160, imc: 23.24, percentual_gordura: 24.5 },
        ]);
        console.log("✅ Métricas de usuário criadas.");

        // 9. Criar Metas de Usuário
        console.log("🎯 Criando metas de usuário...");
        await MetasUsuario.bulkCreate([
          { id_usuario: usuarios[0].id_usuario, tipo_meta: "peso", valor_meta: 70.0, data_inicio: "2024-01-01", data_fim: "2024-06-30", status: "em_progresso" },
          { id_usuario: usuarios[1].id_usuario, tipo_meta: "percentual_gordura", valor_meta: 20.0, data_inicio: "2024-01-01", data_fim: "2024-09-30", status: "em_progresso" },
        ]);
        console.log("✅ Metas de usuário criadas.");

        // 10. Criar Vínculos Profissionais
        console.log("🤝 Criando vínculos profissionais...");
        await VinculoNutricao.create({
          id_usuario: usuarios[0].id_usuario,
          id_nutricionista: nutricionista.id_nutricionista,
          data_vinculo: new Date(),
          ativo: true,
        });
        await VinculoTreino.create({
          id_usuario: usuarios[1].id_usuario,
          id_personal: personalTrainer.id_personal,
          data_vinculo: new Date(),
          ativo: true,
        });
        console.log("✅ Vínculos profissionais criados.");

        // 11. Criar Amizades
        console.log("👫 Criando amizades...");
        await Amizade.create({
          id_usuario_solicitante: usuarios[0].id_usuario,
          id_usuario_destinatario: usuarios[1].id_usuario,
          status: "aceita",
          data_solicitacao: new Date(),
        });
        console.log("✅ Amizades criadas.");

        console.log("🎉 Seed do banco de dados concluído com sucesso!");
      } catch (error) {
        console.error("💥 Erro no seed:", error);
      }
      process.exit(0);
    }

    seedDatabase();


    //caso não de certo utilize os "dados testes do sql.txt" não fica insistindo no erro.
    */