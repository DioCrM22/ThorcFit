import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Cores
export const AZUL = '#0066cc';
export const LARANJA = '#FF6B35';
export const VERDE = '#35eb21';
export const AMARELO = '#FFD700';
export const CINZA_CLARO = '#f0f0f0';
export const CINZA_ESCURO = '#666';

// Animações
const glow = keyframes`
  0% { box-shadow: 0 0 10px ${AMARELO}; }
  50% { box-shadow: 0 0 20px ${AMARELO}; }
  100% { box-shadow: 0 0 10px ${AMARELO}; }
`;

//const pulse = keyframes`
  //0% { transform: scale(1); }
  //50% { transform: scale(1.05); }
  //100% { transform: scale(1); }
//`;

// Estrutura principal
export const Page = styled.div`
  padding-top: 60px;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: "Golos Text", sans-serif;
`;

export const Content = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

// Lista de treinos
export const TreinosList = styled.div`
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const TreinoCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
`;

export const GifContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  overflow: hidden;
  
  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    height: 220px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

export const TimeBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${AZUL};
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

export const RepInfo = styled.span`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: ${AZUL};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
`;

export const TreinoInfo = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const TreinoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
    flex: 1;
  }
`;

export const ExerciseDetails = styled(motion.div)`
  overflow: hidden;
  margin-bottom: 15px;

  p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 12px;
  }
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;

  div {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 0.8rem;
      color: ${CINZA_ESCURO};
      margin-bottom: 2px;
    }

    span {
      font-size: 0.9rem;
      color: ${CINZA_ESCURO};
      font-weight: 500;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Botões
export const ButtonGroup = styled.div`
  margin-top: auto;
  display: flex;
  gap: 10px;
`;

const BaseButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-family: "Golos Text", sans-serif;
  justify-content: center;
  flex: 1;
  font-size: 0.95rem;
`;

export const ExecuteButton = styled(BaseButton)`
  background: ${VERDE};
  color: white;
  font-weight: 600;

  &:hover {
    background: #2bc418;
  }
`;

export const ContinueButton = styled(BaseButton)`
  background: ${LARANJA};
  color: white;
  font-weight: 600;

  &:hover {
    background: #e05a28;
  }
`;

export const DeleteButton = styled(BaseButton)`
  background: ${CINZA_CLARO};
  color: ${CINZA_ESCURO};

  &:hover {
    background: #e0e0e0;
  }
`;

export const FinishedButton = styled(BaseButton)`
  background: ${AZUL};
  color: white;
  cursor: default;
`;

export const InfoButton = styled.button`
  background: none;
  border: none;
  color: ${AZUL};
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  border-radius: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 102, 204, 0.1);
  }
`;

export const StopButton = styled(BaseButton)`
  background: ${LARANJA};
  color: white;
  font-size: 1rem;
  padding: 14px 24px;

  &:hover {
    background: #e05a28;
  }
`;

export const FloatingActionButton = styled(BaseButton)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 100;
  animation: ${props => props.pulse ? 'pulse 2s infinite' : 'none'};

  &:hover {
    transform: scale(1.1);
  }
`;

export const SelectionCheckbox = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.selected ? AZUL : 'rgba(255,255,255,0.7)'};
  border: 2px solid ${props => props.selected ? 'white' : AZUL};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    transform: scale(1.1);
  }
`;

export const BulkActionsContainer = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: white;
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  gap: 15px;
  z-index: 99;
`;

// Tela de exercício em tela cheia
export const FullScreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const FullScreenContent = styled.div`
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

export const FullScreenGifContainer = styled.div`
  width: 100%;
  height: 300px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }

  @media (max-width: 480px) {
    height: 220px;
  }
`;

export const GifInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    padding: 10px 15px;
  }
`;

export const ExerciseDescription = styled.div`
  padding: 20px;
  text-align: left;

  h3 {
    margin-bottom: 12px;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    
    h3 {
      font-size: 1.3rem;
    }

    p {
      font-size: 0.95rem;
    }
  }
`;

export const Timer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  color: white;
  background: ${AZUL};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
`;

export const ControlGroup = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
`;

// Tela de descanso
export const RestContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
  background: ${AMARELO};
  height: 100%;
  animation: ${glow} 2s infinite;

  @media (max-width: 480px) {
    padding: 30px;
  }
`;

export const RestTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const RestTimer = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

export const RestText = styled.p`
  font-size: 1.3rem;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

// Tela de conclusão
export const CompletionOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CompletionContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const LogoContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoGlow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%);
`;

export const CompletionLogo = styled.img`
  width: 100%;
  height: auto;
  z-index: 1;
  position: relative;
`;

export const CompletionText = styled.h2`
  color: white;
  font-size: 2rem;
  text-align: center;
  margin-top: 20px;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;