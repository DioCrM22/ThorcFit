import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FloatingButton = styled(motion.button)`
  position: fixed;
  top: 150px;  // Aumentei de 100px para 150px
  right: 15px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #FF6B35;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
  transition: all 0.2s ease;

  &:hover {
    background: #E55C2B;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    top: 90px;
    right: 15px;
  }
`;

export const TreinadoresList = styled(motion.div)`
  position: fixed;
  top: 150px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  z-index: 100;
  width: 320px;
  max-height: 70vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 90%;
    right: 5%;
    top: 100px;
    max-height: 60vh;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  h3 {
    margin: 0;
    color: #0066cc;
    font-size: 0.9rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
`;

export const TreinadorCard = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background: ${props => props.selected ? '#FFF5F0' : 'white'};
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${props => props.selected ? '#FF6B35' : '#eee'};
  position: relative;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

export const TreinadorImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid #FF6B35;
`;

export const TreinadorInfo = styled.div`
  flex: 1;
`;

export const TreinadorName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  margin-bottom: 5px;
`;

export const TreinadorDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  span {
    font-size: 0.8rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

export const SelectedBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FF6B35;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;