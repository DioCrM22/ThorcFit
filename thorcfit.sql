-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02/07/2025 às 02:21
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
  `instrucoes` text DEFAULT NULL,
  `gif_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `exercicio`
--

INSERT INTO `exercicio` (`id_exercicio`, `nome`, `descricao`, `grupo_muscular`, `equipamento_necesario`, `instrucoes`, `gif_url`, `created_at`, `updated_at`) VALUES
(1, 'Supino Reto com Barra', 'Exercício para peito, ombros e tríceps.', 'Peito', 'Barra, Anilhas, Banco', NULL, NULL, '2025-06-16 20:17:21', '2025-06-16 20:17:21'),
(2, 'Agachamento Livre', 'Exercício composto para pernas e glúteos.', 'Pernas', 'Nenhum (opcional: barra e anilhas)', NULL, NULL, '2025-06-16 20:17:21', '2025-06-16 20:17:21'),
(3, 'Remada Curvada', 'Exercício para costas e bíceps.', 'Costas', 'Barra, Anilhas', NULL, NULL, '2025-06-16 20:17:21', '2025-06-16 20:17:21');

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

--
-- Despejando dados para a tabela `exercicios_do_treino`
--

INSERT INTO `exercicios_do_treino` (`id_treino`, `id_exercicio`, `series`, `repeticoes`, `carga`, `tempo_descanso`, `observacoes`, `ordem`) VALUES
(6, 1, 3, 10, 50.00, 45, NULL, 1),
(8, 1, 3, 10, NULL, 45, NULL, 1),
(8, 3, 3, 10, NULL, 45, NULL, 2);

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
  `updated_at` datetime NOT NULL,
  `realizados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array de datas (ou objetos) em que o plano foi finalizado' CHECK (json_valid(`realizados`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `historico_treino`
--

INSERT INTO `historico_treino` (`id_historico`, `id_usuario`, `id_plano_treino`, `data_treino`, `hora_inicio`, `hora_fim`, `duracao_minutos`, `calorias_queimadas`, `observacoes`, `concluido`, `created_at`, `updated_at`, `realizados`) VALUES
(1, 7, 5, '2025-07-01', '20:18:40', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:18:40', '2025-07-01 20:18:40', NULL),
(2, 7, 5, '2025-07-01', '20:18:54', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:18:54', '2025-07-01 20:18:54', NULL),
(3, 7, 5, '2025-07-01', '20:19:03', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:19:03', '2025-07-01 20:19:03', NULL),
(4, 7, 7, '2025-07-01', '20:56:24', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:56:24', '2025-07-01 20:56:24', NULL),
(5, 7, 7, '2025-07-01', '20:57:18', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:57:18', '2025-07-01 20:57:18', NULL),
(6, 7, 7, '2025-07-01', '20:58:24', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:58:24', '2025-07-01 20:58:24', NULL),
(7, 7, 7, '2025-07-01', '20:58:34', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:58:34', '2025-07-01 20:58:34', NULL),
(8, 7, 7, '2025-07-01', '20:58:40', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:58:40', '2025-07-01 20:58:40', NULL),
(9, 7, 7, '2025-07-01', '20:59:44', NULL, NULL, NULL, NULL, 0, '2025-07-01 20:59:44', '2025-07-01 20:59:44', NULL),
(10, 7, 8, '2025-07-02', '21:20:14', NULL, NULL, NULL, NULL, 0, '2025-07-01 21:20:14', '2025-07-01 21:20:14', NULL);

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
(2, 6, 'CREF-98765', 'Condicionamento Físico', 'Personal trainer focada em condicionamento físico e bem-estar.', 70.00, '2025-06-16 20:03:08', '2025-06-16 20:03:08'),
(3, 53, 'CREF 54321-SP', NULL, 'Treinador focado em hipertrofia muscular', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

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
  `realizados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Datas em que o plano foi concluído' CHECK (json_valid(`realizados`)),
  `duracao_estimada` int(11) DEFAULT NULL COMMENT 'Duração em minutos',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `plano_treino`
--

INSERT INTO `plano_treino` (`id_plano_treino`, `tipo_criador`, `id_criador_usuario`, `id_criador_personal`, `nome`, `data_criacao`, `descricao`, `status`, `realizados`, `duracao_estimada`, `created_at`, `updated_at`) VALUES
(6, 'usuario', NULL, NULL, 'Treino Peito', '2025-06-23', 'fazer bem feito', 'ativo', '[]', 60, '2025-06-22 21:34:51', '2025-06-22 21:34:51'),
(8, 'usuario', 7, NULL, 'Peito', '2025-01-07', 'peito generico', 'ativo', '[]', 60, '2025-07-01 21:20:07', '2025-07-01 21:20:07');

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
  `foto_perfil` longtext DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL COMMENT 'Altura em cm',
  `peso` decimal(5,2) DEFAULT NULL COMMENT 'Peso em kg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `email`, `senha_hash`, `data_nascimento`, `genero`, `telefone`, `data_cadastro`, `id_objetivo`, `foto_perfil`, `altura`, `peso`) VALUES
(1, 'João Silva', 'joao@teste.com', '$2b$10$example_hash_1', '1990-05-15', 'masculino', '(11) 99999-1111', '2025-06-14 19:51:53', 'ganho', NULL, NULL, NULL),
(2, 'Maria Santos', 'maria@teste.com', '$2b$10$example_hash_2', '1985-08-22', 'feminino', '(11) 99999-2222', '2025-06-14 19:51:53', 'perca', NULL, NULL, NULL),
(3, 'Dr. Carlos Nutricionista', 'carlos.nutri@teste.com', '$2b$10$example_hash_3', '1980-03-10', 'masculino', '(11) 99999-3333', '2025-06-14 19:51:53', 'manutenção', NULL, NULL, NULL),
(4, 'Ana Personal Trainer', 'ana.personal@teste.com', '$2b$10$example_hash_4', '1988-12-05', 'feminino', '(11) 99999-4444', '2025-06-14 19:51:53', 'manutenção', NULL, NULL, NULL),
(5, 'Dr. Pedro Nutricionista', 'pedro.nutri@teste.com', '$2b$10$example_hash_5', '1975-07-18', 'masculino', '(11) 99999-5555', '2025-06-14 19:51:53', 'manutenção', NULL, NULL, NULL),
(6, 'Mariana Personal Trainer', 'mariana.personal@teste.com', '$2b$10$example_hash_6', '1992-01-20', 'feminino', '(11) 99999-6666', '2025-06-14 19:51:53', 'ganho', NULL, NULL, NULL),
(7, 'Diogo Zica', 'diogo@teste.com', '$2a$12$.1tl7N5SssWQfrNWIUw26ul2MjBTUSUv/wNof7zazapazqK8vDWOi', '2004-06-01', 'masculino', '+19 (98) 14455-77', '2025-06-19 18:45:51', 'ganho', 'data:image/jpeg;base64,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', 9.99, 60.00),
(8, 'Juca Juquinha', 'juca@teste.com', '$2a$12$SmbVrXEULrH.G0KQx4p0aeQIFiL3qDGcjI2Y1nAqxYk0g4dUHEafq', '0000-00-00', NULL, NULL, '2025-06-19 15:45:51', NULL, NULL, NULL, NULL),
(10, 'Hungo H', 'hungo@teste.com', '$2a$12$s.cb4JK/eKW.8hjy3tFtCegd0EaUi9.oJFg/PmpoLBAuNMgTn15hO', '2004-03-21', NULL, NULL, '2025-06-19 19:34:17', NULL, NULL, NULL, NULL),
(53, 'Pedro Silva', 'pedro@exemplo.com', '$2a$12$ExemploHashDaSenha', '1987-11-20', 'masculino', '11999998888', '2025-06-28 19:04:43', 'manutenção', NULL, 9.99, 75.50),
(62, 'Diogo Treinador', 'diogotreinador@teste.com', '$2a$12$mLqwk1n8PFHyRNosF8qMxezr5JPiBy8k6qRAEQ6STs/EhghGIR0HS', '1999-08-09', NULL, NULL, '2025-06-28 19:45:00', NULL, NULL, NULL, NULL),
(68, 'Usuário Teste', 'teste@example.com', '$2a$12$fBdzitpcx8ca8IRk8nR30.3QEiEqhZEh3A5I5BBGV7OvAi48z9Bwm', '2000-01-01', NULL, NULL, '2025-06-29 00:20:47', NULL, NULL, NULL, NULL),
(86, 'Ana Nutri', 'ana.nutri@example.com', '$2a$12$DmJZ40qDEiaUoFPmIALK2evCAsBth9/hi31SmMCP/xG.6Ef6xQAoS', '1988-12-15', NULL, NULL, '2025-06-29 11:48:59', NULL, NULL, NULL, NULL),
(94, 'Teste', 'teste@teste.com', 'hashfake', '2000-01-01', NULL, NULL, '2025-06-29 13:11:45', NULL, NULL, NULL, NULL),
(95, 'Ana Nutri', 'ananu@example.com', '$2a$12$1uyGCeyDVFMo.wMKDoBNZOTs/SXKa5TA4GY4xIVWT0NbqVimVP19G', '1988-12-15', NULL, NULL, '2025-06-29 13:17:06', NULL, NULL, NULL, NULL),
(96, 'Ana Nutri', 'ana@example.com', '$2a$12$yPVnqVlUzFxDytqHuvlGQO.yBh.m8ymqiuB/bh3auZmh6OZoMoNv2', '1988-12-15', NULL, NULL, '2025-06-29 13:18:33', NULL, NULL, NULL, NULL),
(97, 'Diogo Nutri', 'diogonutri@teste.com', '$2a$12$NFJAIa6XtcvpwAzj96Q6CuCx0xWLtpWXLMdoxHUiuXZlortV8ekgC', '1999-08-09', NULL, NULL, '2025-06-29 19:20:25', NULL, NULL, NULL, NULL),
(100, 'Ana Nutri', 'ana36@example.com', '$2a$12$JcDcwCq7f7ZMS.QjuFmtsuMBQE/G0rSOz4/aOg4WgTA5rKz7GLveK', '1988-12-15', NULL, NULL, '2025-06-29 19:30:17', NULL, NULL, NULL, NULL),
(101, 'Diogo Treinador', 'diogo12@teste.com', '$2a$12$kRsoPXUX2zl7tWzEscp.MOjBM/ekA/W5l48GK.aAF2rbeabZK3ANO', '1999-08-09', NULL, NULL, '2025-06-29 19:31:33', NULL, NULL, NULL, NULL),
(104, 'Ana Nutri', 'ana89@example.com', '$2a$12$2CmBkkI03hpgXAA.5A5c4O/4168MUwOmTODZ5XAIgCfYBNw2jVK1y', '1988-12-15', NULL, NULL, '2025-06-29 19:48:27', NULL, NULL, NULL, NULL),
(107, 'Ana Nutri', 'ana180@example.com', '$2a$12$KojbvTj0F3EQPScv/ZNdqeIuI.k7Q84JdE2gpphVkWFd5OzWkEx26', '1988-12-15', NULL, NULL, '2025-06-29 19:54:24', NULL, NULL, NULL, NULL),
(108, 'Ana Nutri', 'ana11@example.com', '$2a$12$szhwILd0nYD7NJtpukfk9OkI/h4SOmrjFTGn5b0aE4PLE.WHa6CjK', '1988-12-15', NULL, NULL, '2025-06-29 19:57:58', NULL, NULL, NULL, NULL),
(109, 'Ana Nutri', 'an1@example.com', '$2a$12$/kF9P.PwHY5Mx0.Qz2Zcs.Jo7f3Q4X48EILx8X2wYVHz3AOwv9WF2', '1988-12-15', NULL, NULL, '2025-06-29 19:59:28', NULL, NULL, NULL, NULL),
(110, 'Ana Nutri', 'ani1@example.com', '$2a$12$j9HAKCY8rnoxAJj5OlfImegR2FEMFMBeSR6rL.DD0rFUtICMIwX2S', '1988-12-15', NULL, NULL, '2025-06-29 20:00:06', NULL, NULL, NULL, NULL),
(111, 'Ana Nutri', 'anpp1@example.com', '$2a$12$D1UUHeMLVrizKlW.8T6Hue0RIG6rqW/c8.jOHIx.NNS01AsSElAqi', '1988-12-15', NULL, NULL, '2025-06-29 20:04:03', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `vinculo_nutricional`
--

CREATE TABLE `vinculo_nutricional` (
  `id_vinculo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_nutricionista` int(11) NOT NULL,
  `data_inicio` datetime NOT NULL,
  `status` enum('pendente','ativo','cancelado') NOT NULL,
  `observacoes` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vinculo_nutricional`
--

INSERT INTO `vinculo_nutricional` (`id_vinculo`, `id_usuario`, `id_nutricionista`, `data_inicio`, `status`, `observacoes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-14 00:00:00', 'ativo', NULL, '2025-06-16 20:17:43', '2025-06-16 20:17:43'),
(2, 2, 2, '2025-06-14 00:00:00', '', NULL, '2025-06-16 20:17:43', '2025-06-16 20:17:43');

-- --------------------------------------------------------

--
-- Estrutura para tabela `vinculo_treino`
--

CREATE TABLE `vinculo_treino` (
  `id_vinculo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_personal` int(11) NOT NULL,
  `data_inicio` datetime NOT NULL,
  `status` enum('pendente','ativo','cancelado') NOT NULL,
  `observacoes` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vinculo_treino`
--

INSERT INTO `vinculo_treino` (`id_vinculo`, `id_usuario`, `id_personal`, `data_inicio`, `status`, `observacoes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-14 00:00:00', 'ativo', NULL, '2025-06-16 20:17:59', '2025-06-16 20:17:59'),
(2, 2, 2, '2025-06-14 00:00:00', '', NULL, '2025-06-16 20:17:59', '2025-06-16 20:17:59');

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
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`);

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
  MODIFY `id_historico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `nutricionista`
--
ALTER TABLE `nutricionista`
  MODIFY `id_nutricionista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `personal_trainer`
--
ALTER TABLE `personal_trainer`
  MODIFY `id_personal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `plano_nutricional`
--
ALTER TABLE `plano_nutricional`
  MODIFY `id_plano_nutricional` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `plano_treino`
--
ALTER TABLE `plano_treino`
  MODIFY `id_plano_treino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `refeicao`
--
ALTER TABLE `refeicao`
  MODIFY `id_refeicao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

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
  ADD CONSTRAINT `plano_nutricional_ibfk_253` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `plano_nutricional_ibfk_254` FOREIGN KEY (`id_nutricionista`) REFERENCES `nutricionista` (`id_nutricionista`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `plano_treino`
--
ALTER TABLE `plano_treino`
  ADD CONSTRAINT `plano_treino_ibfk_249` FOREIGN KEY (`id_criador_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `plano_treino_ibfk_250` FOREIGN KEY (`id_criador_personal`) REFERENCES `personal_trainer` (`id_personal`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `refeicao`
--
ALTER TABLE `refeicao`
  ADD CONSTRAINT `refeicao_ibfk_1` FOREIGN KEY (`id_registro`) REFERENCES `diario_alimentar` (`id_registro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `vinculo_nutricional`
--
ALTER TABLE `vinculo_nutricional`
  ADD CONSTRAINT `vinculo_nutricional_ibfk_241` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vinculo_nutricional_ibfk_242` FOREIGN KEY (`id_nutricionista`) REFERENCES `nutricionista` (`id_nutricionista`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `vinculo_treino`
--
ALTER TABLE `vinculo_treino`
  ADD CONSTRAINT `vinculo_treino_ibfk_235` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vinculo_treino_ibfk_236` FOREIGN KEY (`id_personal`) REFERENCES `personal_trainer` (`id_personal`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
