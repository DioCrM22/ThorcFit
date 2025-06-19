// index.js
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
  Button,
} from "./styles";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConf, setSenhaConf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [crn, setCrn] = useState("");
  const [cref, setCref] = useState("");

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
    if (!validateNameCharacters(rawValue)) return;
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

  const validarIdade = (data) => {
    const hoje = new Date();
    const nascimento = new Date(data);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    return idade > 14 || (idade === 14 && m >= 0);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setShowInfo(true);
  };

  const handleNextStep = () => {
    if (!selectedRole) {
      notify("⚠️ Selecione o tipo de conta.", "error");
      return;
    }
    setStep(2);
  };

  const handleSignup = async () => {
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

    if (!validarIdade(dataNascimento)) {
      notify("⚠️ Você precisa ter pelo menos 14 anos.", "error");
      return;
    }

    if (selectedRole === "nutricionista" && !crn.trim()) {
      notify("📄 Insira o CRN do nutricionista.", "error");
      return;
    }

    if (selectedRole === "personal" && !cref.trim()) {
      notify("📄 Insira o CREF do treinador.", "error");
      return;
    }

    try {
      const extra = selectedRole === "nutricionista" ? crn : selectedRole === "personal" ? cref : "";
      const errorMessage = await signup(nome, email, senha, selectedRole, dataNascimento, extra);
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

  const renderTooltipContent = () => {
    switch (selectedRole) {
      case "usuario":
        return "👤 Usuário: Recebe treinos e planos nutricionais.";
      case "nutricionista":
        return "🍎 Nutricionista: Envia planos nutricionais (conta administrativa).";
      case "personal":
        return "💪 Personal: Envia treinos (conta administrativa).";
      default:
        return "";
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
            <RoleSelectionTitle>
              <span className="blue">Selecione seu</span>{" "}
              <span className="orange">TIPO DE CONTA</span>
            </RoleSelectionTitle>

            <RoleOptionsGrid>
              <RoleOption onClick={() => handleSelectRole("usuario")} $selected={selectedRole === "usuario"}>
                <RoleIcon>👤</RoleIcon>
                <RoleName>Usuário</RoleName>
              </RoleOption>

              <RoleOption onClick={() => handleSelectRole("nutricionista")} $selected={selectedRole === "nutricionista"}>
                <RoleIcon>🍎</RoleIcon>
                <RoleName>Nutricionista</RoleName>
              </RoleOption>

              <RoleOption onClick={() => handleSelectRole("personal")} $selected={selectedRole === "personal"}>
                <RoleIcon>💪</RoleIcon>
                <RoleName>Personal</RoleName>
              </RoleOption>
            </RoleOptionsGrid>

            {showInfo && selectedRole && (
              <InfoTooltip>
                <p>{renderTooltipContent()}</p>
                <button onClick={() => setShowInfo(false)}>❌ Fechar</button>
              </InfoTooltip>
            )}

            <Button variant="orange" onClick={handleNextStep}>
              Próxima Etapa ➡️
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Preencha <AnimatedSpan>seus dados</AnimatedSpan></Title>

            <InputGroup>
              <Input type="text" placeholder="Nome Completo" emoji="👤" value={nome} onChange={handleNomeChange} />
            </InputGroup>

            <InputGroup>
              <Input type="email" placeholder="E-mail" emoji="✉" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
            </InputGroup>

            <InputGroup>
              <Input type="email" placeholder="Confirme o E-mail" emoji="📧" value={emailConf} onChange={(e) => setEmailConf(e.target.value.toLowerCase())} />
            </InputGroup>

            <InputGroup>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#f9f9f9',
                  padding: '5px',
                  color: '#333',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    📅
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '15px',
                    textAlign: 'center',
                  }}>
                    Data de Nascimento
                  </div>
                  <div style={{ width: '100%', padding: '5px', backgroundtext: 'bold', color: '#333' }}>
                    <Input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      emoji={null}
                    />
                  </div>
            </InputGroup>

            {selectedRole === "nutricionista" && (
              <InputGroup>
                <Input type="text" placeholder="CRN do Nutricionista" emoji="📝" value={crn} onChange={(e) => setCrn(e.target.value)} />
              </InputGroup>
            )}

            {selectedRole === "personal" && (
              <InputGroup>
                <Input type="text" placeholder="CREF do Personal" emoji="📄" value={cref} onChange={(e) => setCref(e.target.value)} />
              </InputGroup>
            )}

            <InputGroup>
              <Input type="password" placeholder="Crie sua Senha" emoji="🔓" value={senha} onChange={handleSenhaChange} />
            </InputGroup>

            <PasswordRules>
              <ValidationItem $valid={passwordValidations.length}>✓ Ter mais de 8 caracteres</ValidationItem>
              <ValidationItem $valid={passwordValidations.uppercase}>✓ Letra maiúscula</ValidationItem>
              <ValidationItem $valid={passwordValidations.lowercase}>✓ Letra minúscula</ValidationItem>
              <ValidationItem $valid={passwordValidations.number}>✓ Número</ValidationItem>
              <ValidationItem $valid={passwordValidations.specialChar}>✓ Caractere especial</ValidationItem>
            </PasswordRules>

            <InputGroup>
              <Input type="password" placeholder="Confirme a Senha" emoji="🔒" value={senhaConf} onChange={(e) => setSenhaConf(e.target.value)} />
            </InputGroup>

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
