 import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { darken } from 'polished';
import { AZUL, LARANJA } from '../PerfilUsuario/styles';

// Animações usadas
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bubble = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { transform: translateY(5px) scale(1.05); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 0.8; }
`;

const dropFall = keyframes`
  0% { transform: rotate(-45deg) translateY(0) translateX(-50%); opacity: 0; }
  20% { opacity: 0.8; }
  100% { transform: rotate(-45deg) translateY(20px) translateX(-50%); opacity: 0; }
`;

// --- Estilos principais ---

export const Page = styled.div`
  padding-top: 70px;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Golos Text', sans-serif;
  padding-bottom: 80px;

  @media (max-width: 480px) {
    padding-top: 60px;
  }
`;

export const Content = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const CenteredLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 150px;
    @media (max-width: 480px) {
      width: 150px;
    }
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #007bff;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const FloatingButtons = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;

  @media (max-width: 480px) {
    top: 70px;
    right: 16px;
  }
`;

export const SolicitacoesButton = styled(motion.button)`
  background: #ff7f00;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const AmigosButton = styled(SolicitacoesButton)`
  background: #0066cc;

  &:hover {
    background-color: #1976d2;
  }
`;

export const DayTreinos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TreinoCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  h4 {
    margin: 0;
    font-size: 1.05rem;
    color: #222;
  }

  p {
    margin: 4px 0;
    font-size: 0.95rem;
    color: #555;
  }
`;

export const TreinoTipo = styled.span`
  font-size: 0.85rem;
  background: #e0f0ff;
  color: #0066cc;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
`;

export const TreinoNome = styled.h3`
  font-size: 1.15rem;
  color: #333;
  margin: 6px 0;
`;

export const TreinoObjetivo = styled.p`
  font-size: 0.9rem;
  color: #555;
  font-style: italic;
`;

export const TreinoDetail = styled.p`
  font-size: 0.9rem;
  color: #888;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  font-size: 0.95rem;
`;

export const VerTreinoButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const TreinoFullscreen = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #fff;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const TreinoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1.2rem;
    text-weight: 900;
    text-transform: uppercase;
    margin: 0;
    color: #ff7f00;
  }
`;

export const TreinoInfoTop = styled.div`
  background: #f1f1f1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 6px;

  p {
    margin: 0;
  }
`;

export const ExerciciosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ButtonSair = styled.button`
  background: #ccc;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
`;

export const ButtonFinalizar = styled.button`
  background: #28a745;
  color: white;
  font-size: 1rem;
  border: none;
  padding: 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TreinoTopo = styled.div`
  background: #f0f4f8;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.95rem;
  color: #333;

  p {
    margin: 2px 0;
    word-wrap: break-word;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const ButtonFinalizarSozinho = styled.button`
  background: #28a745;
  color: white;
  font-size: 1.05rem;
  border: none;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  text-align: center;
  transition: background 0.3s;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ExercicioInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const ExercicioTopo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #007bff;
  padding-bottom: 4px;
  margin-bottom: 8px;

  h4 {
    font-size: 1.2rem;
    color: #007bff;
    margin: 0;
    font-weight: 700;
  }

  span {
    font-size: 1rem;
    color: #555;
    font-style: italic;
  }
`;

// Nutrition Bars (Resumo Nutricional)
export const NutritionBars = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const NutritionSectionTitle = styled.h3`
  color: ${AZUL};
  font-size: 1.2rem;
  margin-bottom: 12px;
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProgressLabel = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

export const ProgressBar = styled.div`
  height: 12px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || AZUL};
  width: ${props => props.percent || 0}%;
  transition: width 0.4s ease-in-out;
`;

export const NutritionistInfo = styled.div`
  margin: 16px 0;
  padding: 12px;
  background-color: #f0f4f8;
  border-radius: 8px;
  p {
    margin: 4px 0;
  }
`;

// Hidratação
export const WaterTracker = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${AZUL}, ${darken(0.1, AZUL)});
  }
`;

export const WaterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const WaterTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: ${AZUL};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Golos Text", sans-serif;
  
  background: linear-gradient(45deg, ${AZUL}, ${darken(0.1, AZUL)});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const WaterAmount = styled.div`
  font-weight: 700;
  color: ${LARANJA};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);

  span {
    font-size: 1.2rem;
  }
`;

export const WaterControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background: #f5f9ff;
  padding: 1rem;
  border-radius: 12px;
`;

export const WaterButton = styled.button`
  background: white;
  color: #007bff;
  border: 2px solid #007bff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2);

  &:hover {
    background: #007bff;
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EditButton = styled.button`
  background: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(0, 123, 255, 0.1);
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 3px 6px;
  }
`;

export const EditPopup = styled.div`
  background: #fffdfc;
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #444;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);

  p {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  label {
    display: block;
    font-weight: bold;
    margin-top: 0.5rem;
    margin-bottom: 0.3rem;
  }

  input {
    width: 100%;
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  div {
    display: flex;
    gap: 1rem;

    button {
      flex: 1;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    button:first-child {
      background: ${AZUL};
      color: white;

      &:hover {
        background: ${darken(0.1, AZUL)};
      }
    }

    button:last-child {
      background: #eee;

      &:hover {
        background: #ddd;
      }
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 0.9rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

// Container da garrafa
export const WaterGlassContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 1rem;
  margin: 1.rem 0;
`;

// Componentes da garrafa individual
export const WaterGlass = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 200px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const GlassTop = styled.div`
  width: 110px;
  height: 15px;
  background: linear-gradient(to right, #f0f0f0,rgb(161, 160, 160));
  border-radius: 5px 5px 0 0;
  position: relative;
  z-index: 1;
  
  /* Detalhe do gargalo */
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 10px;
    background: inherit;
    border-radius: 5px 5px 0 0;
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 20px;
    
    &::after {
      width: 30px;
      height: 8px;
    }
  }
`;

export const GlassBody = styled.div`
  width: 110px;
  height: 190px;
  background: rgba(230, 242, 255, 0.5);
  border: 5px solid #e0e0e0;
  border-radius: 20px 20px 60px 60px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.1);
  
  /* Efeito 3D no vidro */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px 15px 55px 55px;
    box-shadow: inset 5px 5px 10px rgba(255,255,255,0.5),
                inset -5px -5px 10px rgba(0,0,0,0.1);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    width: 90px;
    height: 160px;
    border-radius: 15px 15px 10px 10px;
    
    &::before {
      border-radius: 10px 10px 5px 5px;
    }
  }
`;

export const GlassBottom = styled.div`
  width: 110px;
  height: 5px;
  background: linear-gradient(to right, #e0e0e0, #f0f0f0);
  border-radius: 0 0 30px 30px;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    width: 70px;
    height: 5px;
    border-radius: 0 0 40px 40px;
  }
`;

// Componentes da água
export const WaterFill = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.percentage}%;
  background: linear-gradient(to top, ${AZUL}, #3a86ff);
  transition: height 0.7s cubic-bezier(0.65, 0, 0.35, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  animation: ${bubble} 2s infinite ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.3) 100%
    );
     animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(-50%); }
    50% { transform: translateY(-5px) translateX(-50%); }
  }
`;

export const WaterDrop = styled.div`
  position: absolute;
  top: ${props => props.top || '-10px'};
  left: ${props => props.left || '50%'};
  width: 12px;
  height: 12px;
  background: ${AZUL};
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg) translateX(-50%);
  opacity: 0.8;
  animation: ${dropFall} 2s infinite ease-in;
  animation-delay: ${props => props.delay || '0s'};

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 6px;
    height: 6px;
    background: rgba(255,255,255,0.5);
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
`;

// Componentes de informação
export const WaterLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.1rem;

  &::before {
    content: '${props => props.children.includes('Meta') ? '🎯' : '🥤'}';
  }
`;

export const BottleCapacity = styled.div`
  position: absolute;
  top: ${props => props.inside ? '50%' : '-25px'};
  left: 50%;
  transform: translateX(-50%) ${props => props.inside ? 'translateY(-50%)' : 'none'};
  background: ${props => props.inside ? `rgba(255,255,255,${props.percentage === 100 ? '0.9' : '0.7'})` : 'white'};
  padding: 0.3rem 0.5rem;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${props => props.percentage === 100 ? AZUL : (props.percentage > 50 ? 'white' : AZUL)};
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 2;
  white-space: nowrap;

  &::before {
    content: '💧';
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
  }
`;

export const WaterContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WaterAmountControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  gap: 0.2rem;

  span {
    font-weight: bold;
    color: ${AZUL};
  }

  small {
    font-size: 0.7rem;
    opacity: 0.8;
  }
`;
