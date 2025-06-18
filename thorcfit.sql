-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 18/06/2025 às 04:44
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `thorcfit`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_atualizar_metricas` (IN `p_id_usuario` INT, IN `p_peso` DECIMAL(5,2), IN `p_altura` DECIMAL(5,2))   BEGIN DECLARE v_imc DECIMAL(5,2); SET v_imc = p_peso / POW(p_altura/100, 2); INSERT INTO metricas_usuario (id_usuario, data_registro, peso, altura, imc) VALUES (p_id_usuario, CURDATE(), p_peso, p_altura, v_imc); UPDATE usuario SET peso = p_peso, altura = p_altura WHERE id_usuario = p_id_usuario; END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_criar_plano_integrado` (IN `p_id_usuario` INT, IN `p_id_nutricionista` INT, IN `p_id_personal` INT, IN `p_objetivo` TEXT)   BEGIN DECLARE v_id_plano_nutricional INT; DECLARE v_id_plano_treino INT; INSERT INTO plano_nutricional (id_usuario, id_profissional, data_criacao, objetivo) VALUES (p_id_usuario, p_id_nutricionista, CURDATE(), p_objetivo); SET v_id_plano_nutricional = LAST_INSERT_ID(); INSERT INTO plano_treino (id_usuario, id_profissional, nome, data_criacao, objetivo) VALUES (p_id_usuario, p_id_personal, CONCAT('Plano ', p_objetivo), CURDATE(), p_objetivo); SET v_id_plano_treino = LAST_INSERT_ID(); INSERT INTO vinculo_profissional (id_usuario, id_profissional, tipo_vinculo, data_inicio) VALUES (p_id_usuario, p_id_nutricionista, 'nutricionista', CURDATE()), (p_id_usuario, p_id_personal, 'personal_trainer', CURDATE()); SELECT v_id_plano_nutricional AS id_plano_nutricional, v_id_plano_treino AS id_plano_treino; END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `alimento`
--

CREATE TABLE `alimento` (
  `id_alimento` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `calorias` decimal(8,2) NOT NULL COMMENT 'Calorias por 100g',
  `proteinas` decimal(8,2) DEFAULT NULL COMMENT 'Proteínas em gramas por 100g',
  `carboidratos` decimal(8,2) DEFAULT NULL COMMENT 'Carboidratos em gramas por 100g',
  `gorduras` decimal(8,2) DEFAULT NULL COMMENT 'Gorduras em gramas por 100g',
  `fibras` decimal(8,2) DEFAULT NULL COMMENT 'Fibras em gramas por 100g',
  `unidade_medida` varchar(50) DEFAULT 'g',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `alimento`
--

INSERT INTO `alimento` (`id_alimento`, `nome`, `calorias`, `proteinas`, `carboidratos`, `gorduras`, `fibras`, `unidade_medida`, `created_at`, `updated_at`) VALUES
(1, 'Arroz Branco Cozido', 130.00, 2.70, 28.20, 0.30, NULL, 'g', '2025-06-16 20:04:06', '2025-06-16 20:04:44'),
(2, 'Peito de Frango Grelhado', 165.00, 31.00, 0.00, 3.60, NULL, 'g', '2025-06-16 20:04:06', '2025-06-16 20:04:44'),
(3, 'Brócolis Cozido', 55.00, 3.70, 11.20, 0.60, NULL, 'g', '2025-06-16 20:04:06', '2025-06-16 20:04:44'),
(4, 'Ovo Cozido', 155.00, 13.00, 1.10, 11.00, NULL, 'g', '2025-06-16 20:04:06', '2025-06-16 20:04:44');

-- --------------------------------------------------------

--
-- Estrutura para tabela `alimento_refeicao`
--

CREATE TABLE `alimento_refeicao` (
  `id_refeicao` int(11) NOT NULL,
  `id_alimento` int(11) NOT NULL,
  `quantidade` decimal(8,2) NOT NULL,
  `porcao` varchar(50) NOT NULL DEFAULT 'g'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `diario_alimentar`
--

CREATE TABLE `diario_alimentar` (
  `id_registro` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `data` date NOT NULL,
  `total_calorias` decimal(8,2) DEFAULT 0.00,
  `total_proteinas` decimal(8,2) DEFAULT 0.00,
  `total_carboidratos` decimal(8,2) DEFAULT 0.00,
  `total_gorduras` decimal(8,2) DEFAULT 0.00,
  `agua_ml` int(11) DEFAULT 0,
  `observacoes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `exercicio`
--

CREATE TABLE `exercicio` (
  `id_exercicio` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `grupo_muscular` varchar(50) NOT NULL,
  `equipamento_necesario` varchar(100) DEFAULT NULL,
  `nivel_dificuldade` enum('iniciante','intermediario','avancado') DEFAULT 'intermediario',
  `instrucoes` text DEFAULT NULL,
  `gif_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `exercicio`
--

INSERT INTO `exercicio` (`id_exercicio`, `nome`, `descricao`, `grupo_muscular`, `equipamento_necesario`, `nivel_dificuldade`, `instrucoes`, `gif_url`, `created_at`, `updated_at`) VALUES
(1, 'Supino Reto com Barra', 'Exercício para peito, ombros e tríceps.', 'Peito', 'Barra, Anilhas, Banco', 'intermediario', NULL, NULL, '2025-06-16 20:17:21', '2025-06-16 20:17:21'),
(2, 'Agachamento Livre', 'Exercício composto para pernas e glúteos.', 'Pernas', 'Nenhum (opcional: barra e anilhas)', 'intermediario', NULL, NULL, '2025-06-16 20:17:21', '2025-06-16 20:17:21'),
(3, 'Remada Curvada', 'Exercício para costas e bíceps.', 'Costas', 'Barra, Anilhas', 'intermediario', NULL, NULL, '2025-06-16 20:17:21', '2025-06-16 20:17:21');

-- --------------------------------------------------------

--
-- Estrutura para tabela `exercicios_do_treino`
--

CREATE TABLE `exercicios_do_treino` (
  `id_treino` int(11) NOT NULL,
  `id_exercicio` int(11) NOT NULL,
  `series` int(11) NOT NULL,
  `repeticoes` int(11) NOT NULL,
  `carga` decimal(8,2) DEFAULT NULL COMMENT 'Carga em kg',
  `tempo_descanso` int(11) DEFAULT NULL COMMENT 'Tempo de descanso em segundos',
  `observacoes` text DEFAULT NULL,
  `ordem` int(11) DEFAULT NULL COMMENT 'Ordem do exercício no treino'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_treino`
--

CREATE TABLE `historico_treino` (
  `id_historico` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_plano_treino` int(11) NOT NULL,
  `data_treino` date NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fim` time DEFAULT NULL,
  `duracao_minutos` int(11) DEFAULT NULL,
  `calorias_queimadas` int(11) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `concluido` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `metas_usuario`
--

CREATE TABLE `metas_usuario` (
  `id_meta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_meta` enum('peso','percentual_gordura','circunferencia_abdominal','massa_muscular') NOT NULL,
  `valor_atual` decimal(8,2) DEFAULT NULL,
  `valor_meta` decimal(8,2) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_prazo` date DEFAULT NULL,
  `status` enum('ativa','concluida','pausada','cancelada') NOT NULL DEFAULT 'ativa',
  `descricao` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `metricas_usuario`
--

CREATE TABLE `metricas_usuario` (
  `id_metrica` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `data_registro` date NOT NULL,
  `altura` decimal(5,2) DEFAULT NULL COMMENT 'Altura em cm',
  `peso` decimal(5,2) DEFAULT NULL COMMENT 'Peso em kg',
  `imc` decimal(5,2) DEFAULT NULL COMMENT 'IMC calculado automaticamente',
  `percentual_gordura` decimal(5,2) DEFAULT NULL COMMENT 'Percentual de gordura corporal',
  `circunferencia_abdominal` decimal(5,2) DEFAULT NULL COMMENT 'Circunferência abdominal em cm',
  `massa_muscular` decimal(5,2) DEFAULT NULL COMMENT 'Massa muscular em kg',
  `observacoes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `nutricionista`
--

CREATE TABLE `nutricionista` (
  `id_nutricionista` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `crn` varchar(50) DEFAULT NULL,
  `especialidade` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preco_consulta` decimal(8,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `nutricionista`
--

INSERT INTO `nutricionista` (`id_nutricionista`, `id_usuario`, `crn`, `especialidade`, `bio`, `preco_consulta`, `created_at`, `updated_at`) VALUES
(1, 3, 'CRN-12345', 'Nutrição Esportiva', 'Nutricionista especializado em nutrição esportiva e emagrecimento.', 150.00, '2025-06-16 20:03:01', '2025-06-16 20:03:01'),
(2, 5, 'CRN-67890', 'Nutrição Clínica', 'Nutricionista clínico com foco em saúde intestinal.', 120.00, '2025-06-16 20:03:01', '2025-06-16 20:03:01');

-- --------------------------------------------------------

--
-- Estrutura para tabela `personal_trainer`
--

CREATE TABLE `personal_trainer` (
  `id_personal` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `cref` varchar(50) DEFAULT NULL,
  `especialidade` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preco_sessao` decimal(8,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `personal_trainer`
--

INSERT INTO `personal_trainer` (`id_personal`, `id_usuario`, `cref`, `especialidade`, `bio`, `preco_sessao`, `created_at`, `updated_at`) VALUES
(1, 4, 'CREF-54321', 'Treinamento Funcional', 'Personal trainer com experiência em treinamento funcional e hipertrofia.', 80.00, '2025-06-16 20:03:08', '2025-06-16 20:03:08'),
(2, 6, 'CREF-98765', 'Condicionamento Físico', 'Personal trainer focada em condicionamento físico e bem-estar.', 70.00, '2025-06-16 20:03:08', '2025-06-16 20:03:08');

-- --------------------------------------------------------

--
-- Estrutura para tabela `plano_nutricional`
--

CREATE TABLE `plano_nutricional` (
  `id_plano_nutricional` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `calorias_diarias` int(11) DEFAULT NULL,
  `proteinas_diarias` decimal(8,2) DEFAULT NULL,
  `carboidratos_diarias` decimal(8,2) DEFAULT NULL,
  `gorduras_diarias` decimal(8,2) DEFAULT NULL,
  `status` enum('ativo','inativo','concluido') NOT NULL DEFAULT 'ativo',
  `id_nutricionista` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `plano_treino`
--

CREATE TABLE `plano_treino` (
  `id_plano_treino` int(11) NOT NULL,
  `tipo_criador` enum('usuario','personal') NOT NULL,
  `id_criador_usuario` int(11) DEFAULT NULL,
  `id_criador_personal` int(11) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `data_criacao` date NOT NULL,
  `descricao` text DEFAULT NULL,
  `status` enum('ativo','inativo','concluido') NOT NULL DEFAULT 'ativo',
  `nivel_dificuldade` enum('iniciante','intermediario','avancado') DEFAULT NULL,
  `duracao_estimada` int(11) DEFAULT NULL COMMENT 'Duração em minutos',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `refeicao`
--

CREATE TABLE `refeicao` (
  `id_refeicao` int(11) NOT NULL,
  `id_registro` int(11) NOT NULL,
  `tipo_refeicao` enum('Café da Manhã','Lanche da Manhã','Almoço','Lanche da Tarde','Jantar','Ceia') NOT NULL,
  `horario` time NOT NULL,
  `notas` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `data_nascimento` date NOT NULL,
  `genero` enum('masculino','feminino','outro') DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL,
  `id_objetivo` enum('manutenção','ganho','perca') DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `metodo_login` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `email`, `senha_hash`, `data_nascimento`, `genero`, `telefone`, `data_cadastro`, `id_objetivo`, `google_id`, `avatar`, `metodo_login`) VALUES
(1, 'João Silva', 'joao@teste.com', '$2b$10$example_hash_1', '1990-05-15', 'masculino', '(11) 99999-1111', '2025-06-14 19:51:53', 'ganho', NULL, NULL, 'email'),
(2, 'Maria Santos', 'maria@teste.com', '$2b$10$example_hash_2', '1985-08-22', 'feminino', '(11) 99999-2222', '2025-06-14 19:51:53', 'perca', NULL, NULL, 'email'),
(3, 'Dr. Carlos Nutricionista', 'carlos.nutri@teste.com', '$2b$10$example_hash_3', '1980-03-10', 'masculino', '(11) 99999-3333', '2025-06-14 19:51:53', 'manutenção', NULL, NULL, 'email'),
(4, 'Ana Personal Trainer', 'ana.personal@teste.com', '$2b$10$example_hash_4', '1988-12-05', 'feminino', '(11) 99999-4444', '2025-06-14 19:51:53', 'manutenção', NULL, NULL, 'email'),
(5, 'Dr. Pedro Nutricionista', 'pedro.nutri@teste.com', '$2b$10$example_hash_5', '1975-07-18', 'masculino', '(11) 99999-5555', '2025-06-14 19:51:53', 'manutenção', NULL, NULL, 'email'),
(6, 'Mariana Personal Trainer', 'mariana.personal@teste.com', '$2b$10$example_hash_6', '1992-01-20', 'feminino', '(11) 99999-6666', '2025-06-14 19:51:53', 'ganho', NULL, NULL, 'email');

-- --------------------------------------------------------

--
-- Estrutura para tabela `vinculo_nutricional`
--

CREATE TABLE `vinculo_nutricional` (
  `id_vinculo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_nutricionista` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `status` enum('pendente','ativo','inativo','cancelado') NOT NULL DEFAULT 'pendente',
  `observacoes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vinculo_nutricional`
--

INSERT INTO `vinculo_nutricional` (`id_vinculo`, `id_usuario`, `id_nutricionista`, `data_inicio`, `data_fim`, `status`, `observacoes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-14', NULL, 'ativo', NULL, '2025-06-16 20:17:43', '2025-06-16 20:17:43'),
(2, 2, 2, '2025-06-14', NULL, '', NULL, '2025-06-16 20:17:43', '2025-06-16 20:17:43');

-- --------------------------------------------------------

--
-- Estrutura para tabela `vinculo_treino`
--

CREATE TABLE `vinculo_treino` (
  `id_vinculo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_personal` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `status` enum('pendente','ativo','inativo','cancelado') NOT NULL DEFAULT 'pendente',
  `observacoes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vinculo_treino`
--

INSERT INTO `vinculo_treino` (`id_vinculo`, `id_usuario`, `id_personal`, `data_inicio`, `data_fim`, `status`, `observacoes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-14', NULL, 'ativo', NULL, '2025-06-16 20:17:59', '2025-06-16 20:17:59'),
(2, 2, 2, '2025-06-14', NULL, '', NULL, '2025-06-16 20:17:59', '2025-06-16 20:17:59');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `alimento`
--
ALTER TABLE `alimento`
  ADD PRIMARY KEY (`id_alimento`);
ALTER TABLE `alimento` ADD FULLTEXT KEY `nome` (`nome`);

--
-- Índices de tabela `alimento_refeicao`
--
ALTER TABLE `alimento_refeicao`
  ADD KEY `id_refeicao` (`id_refeicao`),
  ADD KEY `id_alimento` (`id_alimento`);

--
-- Índices de tabela `diario_alimentar`
--
ALTER TABLE `diario_alimentar`
  ADD PRIMARY KEY (`id_registro`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`,`data`),
  ADD UNIQUE KEY `diario_alimentar_id_usuario_data` (`id_usuario`,`data`),
  ADD KEY `idx_diario_usuario_data` (`id_usuario`,`data`);

--
-- Índices de tabela `exercicio`
--
ALTER TABLE `exercicio`
  ADD PRIMARY KEY (`id_exercicio`);
ALTER TABLE `exercicio` ADD FULLTEXT KEY `nome` (`nome`,`descricao`);

--
-- Índices de tabela `exercicios_do_treino`
--
ALTER TABLE `exercicios_do_treino`
  ADD PRIMARY KEY (`id_treino`,`id_exercicio`),
  ADD KEY `id_exercicio` (`id_exercicio`);

--
-- Índices de tabela `historico_treino`
--
ALTER TABLE `historico_treino`
  ADD PRIMARY KEY (`id_historico`);

--
-- Índices de tabela `metas_usuario`
--
ALTER TABLE `metas_usuario`
  ADD PRIMARY KEY (`id_meta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `metricas_usuario`
--
ALTER TABLE `metricas_usuario`
  ADD PRIMARY KEY (`id_metrica`),
  ADD KEY `idx_usuario_data` (`id_usuario`,`data_registro`),
  ADD KEY `metricas_usuario_id_usuario_data_registro` (`id_usuario`,`data_registro`);

--
-- Índices de tabela `nutricionista`
--
ALTER TABLE `nutricionista`
  ADD PRIMARY KEY (`id_nutricionista`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `personal_trainer`
--
ALTER TABLE `personal_trainer`
  ADD PRIMARY KEY (`id_personal`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `plano_nutricional`
--
ALTER TABLE `plano_nutricional`
  ADD PRIMARY KEY (`id_plano_nutricional`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_plnut_id_nutricionista` (`id_nutricionista`);

--
-- Índices de tabela `plano_treino`
--
ALTER TABLE `plano_treino`
  ADD PRIMARY KEY (`id_plano_treino`),
  ADD KEY `id_criador_usuario` (`id_criador_usuario`),
  ADD KEY `id_criador_personal` (`id_criador_personal`);

--
-- Índices de tabela `refeicao`
--
ALTER TABLE `refeicao`
  ADD PRIMARY KEY (`id_refeicao`),
  ADD KEY `id_registro` (`id_registro`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`);

--
-- Índices de tabela `vinculo_nutricional`
--
ALTER TABLE `vinculo_nutricional`
  ADD PRIMARY KEY (`id_vinculo`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_nutricionista` (`id_nutricionista`);

--
-- Índices de tabela `vinculo_treino`
--
ALTER TABLE `vinculo_treino`
  ADD PRIMARY KEY (`id_vinculo`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_personal` (`id_personal`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alimento`
--
ALTER TABLE `alimento`
  MODIFY `id_alimento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `diario_alimentar`
--
ALTER TABLE `diario_alimentar`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `exercicio`
--
ALTER TABLE `exercicio`
  MODIFY `id_exercicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `historico_treino`
--
ALTER TABLE `historico_treino`
  MODIFY `id_historico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `metas_usuario`
--
ALTER TABLE `metas_usuario`
  MODIFY `id_meta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `metricas_usuario`
--
ALTER TABLE `metricas_usuario`
  MODIFY `id_metrica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `nutricionista`
--
ALTER TABLE `nutricionista`
  MODIFY `id_nutricionista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `personal_trainer`
--
ALTER TABLE `personal_trainer`
  MODIFY `id_personal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `plano_nutricional`
--
ALTER TABLE `plano_nutricional`
  MODIFY `id_plano_nutricional` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `plano_treino`
--
ALTER TABLE `plano_treino`
  MODIFY `id_plano_treino` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `refeicao`
--
ALTER TABLE `refeicao`
  MODIFY `id_refeicao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `vinculo_nutricional`
--
ALTER TABLE `vinculo_nutricional`
  MODIFY `id_vinculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `vinculo_treino`
--
ALTER TABLE `vinculo_treino`
  MODIFY `id_vinculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `alimento_refeicao`
--
ALTER TABLE `alimento_refeicao`
  ADD CONSTRAINT `alimento_refeicao_ibfk_1` FOREIGN KEY (`id_refeicao`) REFERENCES `refeicao` (`id_refeicao`),
  ADD CONSTRAINT `alimento_refeicao_ibfk_2` FOREIGN KEY (`id_alimento`) REFERENCES `alimento` (`id_alimento`);

--
-- Restrições para tabelas `diario_alimentar`
--
ALTER TABLE `diario_alimentar`
  ADD CONSTRAINT `diario_alimentar_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `exercicios_do_treino`
--
ALTER TABLE `exercicios_do_treino`
  ADD CONSTRAINT `exercicios_do_treino_ibfk_1` FOREIGN KEY (`id_treino`) REFERENCES `plano_treino` (`id_plano_treino`),
  ADD CONSTRAINT `exercicios_do_treino_ibfk_2` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicio` (`id_exercicio`);

--
-- Restrições para tabelas `metas_usuario`
--
ALTER TABLE `metas_usuario`
  ADD CONSTRAINT `metas_usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `metricas_usuario`
--
ALTER TABLE `metricas_usuario`
  ADD CONSTRAINT `metricas_usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `nutricionista`
--
ALTER TABLE `nutricionista`
  ADD CONSTRAINT `nutricionista_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `personal_trainer`
--
ALTER TABLE `personal_trainer`
  ADD CONSTRAINT `personal_trainer_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `plano_nutricional`
--
ALTER TABLE `plano_nutricional`
  ADD CONSTRAINT `plano_nutricional_ibfk_13` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `plano_nutricional_ibfk_14` FOREIGN KEY (`id_nutricionista`) REFERENCES `nutricionista` (`id_nutricionista`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `plano_treino`
--
ALTER TABLE `plano_treino`
  ADD CONSTRAINT `plano_treino_ibfk_13` FOREIGN KEY (`id_criador_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `plano_treino_ibfk_14` FOREIGN KEY (`id_criador_personal`) REFERENCES `personal_trainer` (`id_personal`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `refeicao`
--
ALTER TABLE `refeicao`
  ADD CONSTRAINT `refeicao_ibfk_1` FOREIGN KEY (`id_registro`) REFERENCES `diario_alimentar` (`id_registro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `vinculo_nutricional`
--
ALTER TABLE `vinculo_nutricional`
  ADD CONSTRAINT `vinculo_nutricional_ibfk_11` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vinculo_nutricional_ibfk_12` FOREIGN KEY (`id_nutricionista`) REFERENCES `nutricionista` (`id_nutricionista`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `vinculo_treino`
--
ALTER TABLE `vinculo_treino`
  ADD CONSTRAINT `vinculo_treino_ibfk_10` FOREIGN KEY (`id_personal`) REFERENCES `personal_trainer` (`id_personal`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vinculo_treino_ibfk_9` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
