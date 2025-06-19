import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../contexts/NotificationContext";
import Input from "../../components/Input";
import {
  Container,
  FormBox,
  LogoIcon,
  Title,
  FooterText,
  InputGroup,
  PasswordRules,
  ValidationItem,
  AnimatedSpan,
  RoleSelectionTitle,
  RoleOptionsGrid,
  RoleOption,
  RoleIcon,
  RoleName,
  InfoTooltip,
  Button
} from "./styles";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [step, setStep] = useState(1);
  const [showInfo, setShowInfo] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConf, setSenhaConf] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validateNameCharacters = (name) => /^[a-zA-ZÀ-ÿ\s-]*$/.test(name);

  const formatName = (name) => {
    return name
      .replace(/[^a-zA-ZÀ-ÿ\s-]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleNomeChange = (e) => {
    const rawValue = e.target.value;
    if (!validateNameCharacters(rawValue)) {
      return;
    }
    setNome(formatName(rawValue));
  };

  const handleSenhaChange = (e) => {
    const newPassword = e.target.value;
    setSenha(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
    return Object.values(validations).every((v) => v);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNextStep = () => {
    if (!nome.trim() || nome.split(" ").length < 2) {
      notify("👤 Informe seu nome completo.", "error");
      return;
    }
    if (!validateEmail(email)) {
      notify("📧 E-mail inválido.", "error");
      return;
    }
    if (email !== emailConf) {
      notify("📧 E-mails não coincidem.", "error");
      return;
    }
    if (!validatePassword(senha)) {
      notify("🔒 A senha não atende aos critérios.", "error");
      return;
    }
    if (senha !== senhaConf) {
      notify("🔒 As senhas não coincidem.", "error");
      return;
    }
    setStep(2);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setShowInfo(true);
  };

  const handleSignup = async () => {
    if (!selectedRole) {
      notify("⚠️ Selecione o tipo de conta.", "error");
      return;
    }

    try {
      const errorMessage = await signup(nome, email, senha, selectedRole);
      if (errorMessage) {
        notify(errorMessage, "error");
      } else {
        notify("🎉 Cadastro realizado com sucesso!", "success");
        navigate("/home");
      }
    } catch {
      notify("❌ Erro ao conectar com o servidor", "error");
    }
  };

  return (
    <Container>
      <FormBox>
        <LogoIcon>
          <img src="/assets/images/logo.png" alt="Logo" />
        </LogoIcon>

        {step === 1 && (
          <>
            <Title>Crie <AnimatedSpan>sua conta</AnimatedSpan></Title>

            <InputGroup>
              <Input
                type="text"
                placeholder="Nome Completo"
                emoji="👤"
                value={nome}
                onChange={handleNomeChange}
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="email"
                placeholder="E-mail"
                emoji="✉"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="email"
                placeholder="Confirme o E-mail"
                emoji="📧"
                value={emailConf}
                onChange={(e) => setEmailConf(e.target.value.toLowerCase())}
              />
            </InputGroup>

            <InputGroup>
              <label style={{ marginBottom: '4px', fontSize: '14px', color: '#555' }}>📅 Data de Nascimento:</label>
              <Input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                style={{ padding: '8px', fontSize: '14px' }}
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="password"
                placeholder="Crie sua Senha"
                emoji="🔓"
                value={senha}
                onChange={handleSenhaChange}
              />
            </InputGroup>

            <PasswordRules>
              <ValidationItem $valid={passwordValidations.length}>
                ✓ Ter mais de 8 caracteres
              </ValidationItem>
              <ValidationItem $valid={passwordValidations.uppercase}>
                ✓ Letra maiúscula
              </ValidationItem>
              <ValidationItem $valid={passwordValidations.lowercase}>
                ✓ Letra minúscula
              </ValidationItem>
              <ValidationItem $valid={passwordValidations.number}>
                ✓ Número
              </ValidationItem>
              <ValidationItem $valid={passwordValidations.specialChar}>
                ✓ Caractere especial
              </ValidationItem>
            </PasswordRules>

            <InputGroup>
              <Input
                type="password"
                placeholder="Confirme a Senha"
                emoji="🔒"
                value={senhaConf}
                onChange={(e) => setSenhaConf(e.target.value)}
              />
            </InputGroup>

            <Button variant="orange" onClick={handleNextStep}>
              Próxima Etapa ➡️
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <RoleSelectionTitle>
              <span className="blue">Selecione seu</span>{" "}
              <span className="orange">TIPO DE CONTA</span>
            </RoleSelectionTitle>

            <RoleOptionsGrid>
              <RoleOption
                onClick={() => handleSelectRole("usuario")}
                $selected={selectedRole === "usuario"}
              >
                <RoleIcon>👤</RoleIcon>
                <RoleName>Usuário</RoleName>
              </RoleOption>

              <RoleOption
                onClick={() => handleSelectRole("nutricionista")}
                $selected={selectedRole === "nutricionista"}
              >
                <RoleIcon>🍎</RoleIcon>
                <RoleName>Nutricionista</RoleName>
              </RoleOption>

              <RoleOption
                onClick={() => handleSelectRole("personal")}
                $selected={selectedRole === "personal"}
              >
                <RoleIcon>💪</RoleIcon>
                <RoleName>Personal</RoleName>
              </RoleOption>
            </RoleOptionsGrid>

            {showInfo && (
              <InfoTooltip>
                <div>
                  <p>👤 <strong>Usuário:</strong> Recebe treinos e planos nutricionais.</p>
                  <p>🍎 <strong>Nutricionista:</strong> Envia planos nutricionais (conta administrativa).</p>
                  <p>💪 <strong>Personal:</strong> Envia treinos (conta administrativa).</p>
                </div>
                <button onClick={() => setShowInfo(false)}>❌ Fechar</button>
              </InfoTooltip>
            )}

            <Button variant="green" onClick={handleSignup}>
              🚀 Finalizar Cadastro
            </Button>
            <Button variant="orange" onClick={() => setStep(1)}>
              ⬅️ Voltar
            </Button>
          </>
        )}

        <FooterText>
          Já tem conta? <Link to="/signin">Faça Login</Link>
        </FooterText>
      </FormBox>
    </Container>
  );
};

export default Signup;
