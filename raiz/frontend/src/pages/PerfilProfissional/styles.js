import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { darken } from 'polished';

// Cores principais
export const AZUL = '#3a86ff';
export const LARANJA = '#FF6B35';
export const VERDE = '#35eb21';
export const VERDE_ESCURO = '#229a00';
export const CINZA_CLARO = '#f8f9fa';

// Animações
const titleEntrance = keyframes`
  from { 
    opacity: 0;
    transform: translateY(-15px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const imageEntrance = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9) rotate(5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
`;

const popupEntrance = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Componentes base
export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  font-family: 'Golos Text', font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;    
  margin-bottom: 10px; 
  position: relative;
  gap: 10px;           
`;

export const AnimatedTitle = styled.h1`
  font-family: "Golos Text", sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 auto 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  animation: ${titleEntrance} 0.6s cubic-bezier(0.2, 0.8, 0.4, 1.2) forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

export const TitleWord = styled.span`
  color: ${props => props.azul ? AZUL : LARANJA};
  display: inline-block;
`;

export const ProfilePicture = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #f0f2f5;
  margin: 4rem auto 2rem;
  overflow: hidden;
  position: relative;
  border: 3px solid ${AZUL};
  box-shadow: 0 4px 12px rgba(58, 134, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${imageEntrance} 0.7s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
  animation-delay: 0.4s;
  opacity: 0;

  @media (max-width: 480px) {
    width: 150px;
    height: 150px;
    margin: 2rem auto 1.5rem;
  }
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  animation: ${fadeIn} 0.5s ease 0.8s forwards;
  opacity: 0;
  display: block;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 10;
  transition: transform 0.2s ease;

  span.material-icons { 
    color: #000 !important; 
    font-size: 32px;
    font-weight: 900;
    text-shadow: 0 2px 2px rgba(0,0,0,0.1);
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

export const UploadLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${AZUL};
  color: white;
  padding: 0.8rem;
  border-radius: 90%;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: scale(1);
  
  input {
    display: none;
  }

  &:hover {
    background: ${LARANJA};
    transform: scale(1.1);
  }

  .material-icons {
    font-size: 30px;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    
    .material-icons {
      font-size: 24px;
    }
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const InputGroup = styled.div`
  flex: 1;
  position: relative;
  margin-bottom: 1.5rem;

  & + & {
    margin-top: 1rem;
  }

  input {
    margin-bottom: 0.3rem;
  }
`;

export const SpacingLine = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 1.5rem 0;
  width: 100%;
`;

export const DoubleInputContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  width: 100%;
  gap: 1rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: black;
  font-weight: 600;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.error ? '#ff006e' : props.bordercolor || AZUL};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  font-family: 'Golos Text', sans-serif;

  &[placeholder*="+"] {
    letter-spacing: 0.5px;
  }

  &:focus {
    border-color: ${LARANJA};
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.3);
    outline: none;
  }

  &::placeholder {
    color: #6c757d;
    opacity: 0.6;
  }

  &[type="date"] {
    appearance: none;
  }
`;

export const Select = styled.select`
  ${Input}
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233a86ff'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
`;

export const Button = styled.button`
  font-family: "Golos Text", sans-serif;
  width: 100%;
  padding: 15px;
  background: ${props => props.cor || AZUL};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: filter 0.2s ease;
  margin-top: ${props => props.mt ? `${props.mt}rem` : '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const EditButton = styled.button`
  position: absolute;
  right: 0px;
  top: 3rem; 
  width: 60px;
  height: 60px;
  border-radius: 70%;
  background: ${({ isEditing }) => isEditing ? '#ff4444' : AZUL};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  margin: 0;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1);
  }

  > span {
    color: inherit; 
    filter: brightness(100%);
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1rem;
    top: 2.5rem;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
  animation: ${popupEntrance} 0.3s ease;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const ErrorMessage = styled.span`
  color: #FF6B35;
  font-size: 0.75rem;
  position: absolute;
  bottom: -20px;
  left: 5px;
  white-space: nowrap;
`;

export const CompactInputGroup = styled.div`
  flex: 1;
  position: relative;

  &:first-child input {
    border-radius: 8px 0 0 8px;
    border-right: none;
  }

  &:last-child input {
    border-radius: 0 8px 8px 0;
  }
`;

export const CompactInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.error ? '#ff006e' : AZUL};
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  height: 48px;
  box-sizing: border-box;
  font-family: 'Golos Text', sans-serif;

  &:focus {
    border-color: ${LARANJA};
    z-index: 2;
    outline: none;
  }

  &::placeholder {
    color: #6c757d;
    opacity: 0.6;
  }
`;

export const UnitWrapper = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: '${props => props.unit}';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 600;
    pointer-events: none;
    background: white;
    padding-left: 5px;
    color: #6c757d;
  }
`;

export const ViewModeField = styled.div`
  padding: 0.8rem;
  border-radius: 8px;
  background: ${CINZA_CLARO};
  color: #333;
  font-size: 0.9rem;
  min-height: 20px;
  display: flex;
  align-items: center;
  border: 2px solid ${AZUL};
  transition: border-color 0.3s ease;
  z-index: 2;
  
  & + & {
    margin-top: 0.5rem; 
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${AZUL}33;
  }
`;

export const PasswordButton = styled(Link)`
  font-family: "Golos Text", sans-serif;
  background: ${LARANJA};
  color: white !important;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  align-self: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;

  &:hover {
    background: ${darken(0.1, AZUL)};
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }
`;

export const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 10px 35px;
  
  img {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease;
  }

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 2px solid #ccc;
  }
  
  &::before {
    margin-right: 10px;
  }
  
  &::after {
    margin-left: 10px;
  }
  
  span {
    font-size: 30px;
    color: #ccc;
  }
`;

// Novos componentes específicos para profissionais
export const ProfessionalBadge = styled.div`
  background: ${props => props.type === 'nutricionista' ? VERDE_ESCURO : LARANJA};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
`;

export const BioText = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 1rem;
  background: ${CINZA_CLARO};
  border-radius: 8px;
  border-left: 4px solid ${AZUL};
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.8rem;
  }
`;

export const ProfessionalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  border-top: 4px solid ${props => props.color || AZUL};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

export const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${AZUL};
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

export const ProfessionalHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease;

  h2 {
    color: ${AZUL};
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
  }

  p {
    color: #6c757d;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    
    h2 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

export const DateInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin: 8px 0;
  border: 1px solid ${props => props.bordercolor || '#ccc'};
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${props => props.bordercolor || '#3a86ff'};
    outline: none;
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
  
  /* Estilização do calendário nativo */
  &::-webkit-calendar-picker-indicator {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%233a86ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>');
    cursor: pointer;
    padding-left: 10px;
  }
  
  /* Ajustes para Firefox */
  @-moz-document url-prefix() {
    padding-right: 30px;
  }
`;

export const DateDisplay = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #666;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: inline-block;
`;