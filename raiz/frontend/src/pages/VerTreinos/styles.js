// src/pages/VerTreino/styles.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const AZUL = '#0066cc';
export const LARANJA = '#FF6B35';
export const VERDE = '#35eb21';
export const VERMELHO = '#FF3333';
export const CINZA = '#666';
export const CINZA_CLARO = '#f5f5f5';
export const CINZA_ESCURO = '#333';

export const Page = styled.div`
  padding-top: 70px;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: "Golos Text", sans-serif;
  position: relative;
`;

export const CenteredLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;

  img {
    width: 150px;
    height: auto;
  }
`;

export const ViewModeTitle = styled.h2`
  font-size: 1.5rem;
  color: ${LARANJA};
  margin: 10px 0 20px;
  text-transform: uppercase;
  text-align: center;
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

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
`;

export const TabButton = styled(motion.button)`
  flex: 1;
  padding: 12px 0;
  background: ${props => props.active ? AZUL : 'transparent'};
  color: ${props => props.active ? 'white' : CINZA};
  border: none;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  font-size: 1rem;
  border-radius: 8px 8px 0 0;

  &:hover {
    background: ${props => props.active ? '#005bb7' : '#f0f0f0'};
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const TreinosGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const TreinoCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
`;

export const TreinoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const TreinoDate = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${CINZA_ESCURO};
`;

export const TreinoType = styled.span`
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${props => props.tipo === 'pessoal' ? '#e0f0ff' : '#fff4e0'};
  color: ${props => props.tipo === 'pessoal' ? AZUL : LARANJA};
`;

export const TreinoName = styled.h3`
  font-size: 1.2rem;
  color: ${CINZA_ESCURO};
  margin-bottom: 10px;
`;

export const TreinoDetail = styled.p`
  font-size: 0.9rem;
  color: ${CINZA};
  margin: 4px 0;
`;

export const TreinoAction = styled(motion.button)`
  margin-top: auto;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 8px;
  background: ${props => props.status === 'pendente' ? VERDE : props.status === 'em-andamento' ? LARANJA : AZUL};
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.status === 'pendente' ? '#2bc418' : props.status === 'em-andamento' ? '#e65c00' : '#005bb7'};
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: ${CINZA};
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  grid-column: 1 / -1;
`;

export const ProfileHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

export const ProfileImageContainer = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid ${AZUL};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const ProfileName = styled.h2`
  font-size: 1.2rem;
  color: ${CINZA_ESCURO};
`;

export const ProfileDetail = styled.p`
  font-size: 0.9rem;
  color: ${CINZA};
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ProfileType = styled.span`
  display: inline-block;
  margin-top: 6px;
  padding: 4px 8px;
  background: ${AZUL};
  color: white;
  font-size: 0.75rem;
  border-radius: 4px;
`;

export const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${VERMELHO};
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #cc0000;
  }
`;

export const EditPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const EditPopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;