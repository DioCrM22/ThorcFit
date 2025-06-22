// styles.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
  gap: 10px;

  img {
    width: 150px;
    @media (max-width: 480px) {
      width: 100px;
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

