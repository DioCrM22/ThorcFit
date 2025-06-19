import styled, { keyframes } from "styled-components";

/* ============ ANIMAÇÕES ============ */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const colorChange = keyframes`
  0% { color: rgb(42, 94, 236); transform: scale(1); }
  80% { color: rgb(42, 94, 236); transform: scale(1.2); }
  100% { color: #ff7f00; transform: scale(1); text-transform: uppercase; }
`;

/* ============ LAYOUT PRINCIPAL ============ */
export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #004080, #0066cc);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const FormBox = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 430px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 430px) {
    padding: 20px;
    max-width: 95%;
  }
`;

/* ============ CABEÇALHO ============ */
export const LogoIcon = styled.div`
  text-align: center;
  margin-bottom: 10px;
  
  img {
    max-width: 200px;
  }
`;

export const Title = styled.h2`
  font-family: "Golos Text", sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: rgb(42, 94, 236);
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
  letter-spacing: 1.5px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }

  @media (max-width: 500px) {
    font-size: 1.3rem;
  }
`;

export const AnimatedSpan = styled.span`
  display: inline-block;
  animation: ${colorChange} 1.5s ease-in-out 2s 1 forwards;
  
  @media (max-width: 500px) {
    animation: ${colorChange} 1s ease-in-out 2s 1 forwards;
  }
`;

/* ============ FORMULÁRIO ============ */
export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s;

  &:focus-within {
    transform: scale(1.05);
  }
`;

export const PasswordRules = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: black;
`;

export const ValidationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 20px;
  font-weight: bold;
  color: ${(props) => (props.$valid ? "#2ecc71" : "#e74c3c")};
`;

/* ============ RODAPÉ ============ */
export const FooterText = styled.p`
  text-align: center;
  margin-top: 10px;
  font-size: 20px;
  color: black;
  font-weight: bold;
  
  a {
    color: rgb(42, 94, 236);
    font-weight: bold;
    text-decoration: none;
  }
`;

/* ============ SELEÇÃO DE TIPO DE CONTA ============ */
export const RoleSelectionContainer = styled.div`
  margin: 20px 0;
  border-radius: 15px;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
`;

export const RoleSelectionTitle = styled.h3`
  font-family: "Golos Text", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;

  span.blue {
    color: #2a5eec;
    text-transform: none;
  }

  span.orange {
    color: #ff7f00;
    display: inline-block;
    animation: ${colorChange} 1.5s ease-in-out 2s 1 forwards;
    text-transform: uppercase;
  }

  @media (max-width: 500px) {
    font-size: 1.3rem;
  }
`;

export const RoleOptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
`;

export const RoleOption = styled.div`
  border: 2px solid ${props => props.$selected ? '#2a5eec' : '#e0e0e0'};
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.$selected ? '#f0f7ff' : 'white'};
  text-align: center;
  
  &:hover {
    border-color: #2a5eec;
    transform: translateY(-3px);
  }
`;

export const RoleIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

export const RoleName = styled.h4`
  font-size: 0.9rem;
  color: #333;
  margin: 0;
`;

export const RoleDescription = styled.p`
  display: none;
  color: #666;
  font-size: 0.8rem;
  margin-top: 5px;
`;

export const Button = styled.button`
  background-color: ${(props) => {
    if (props.variant === "green") return "#2ecc71";
    if (props.variant === "orange") return "#ff7f00";
    return "#2a5eec";
  }};
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: ${(props) => {
      if (props.variant === "green") return "#27ae60";
      if (props.variant === "orange") return "#cc6500";
      return "#1c4dc5";
    }};
  }
`;

/* ============ INFO DO TIPO DE CONTA ============ */

export const InfoTooltip = styled.div`
  background: #f0f7ff;
  border: 2px solid #2a5eec;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  color: #333;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: fadeIn 0.3s ease;

  div {
    margin-bottom: 10px;
  }

  button {
    color: #2a5eec;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;

  }
`;