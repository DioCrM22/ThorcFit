import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FloatingButton = styled(motion.button).attrs(props => ({
  style: {
    '--bg-color': props.$active 
      ? props.$type === 'workout' ? '#35eb21' : '#0066cc' 
      : 'white',
    '--text-color': props.$active 
      ? 'white' 
      : props.$type === 'workout' ? '#35eb21' : '#0066cc',
    '--border-color': props.$active 
      ? 'transparent' 
      : props.$type === 'workout' ? '#35eb21' : '#0066cc',
    '--hover-scale': props.$active ? 1.05 : 1.1
  }
}))`
  position: fixed;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  transition: all 0.2s ease;
  font-size: 22px;

  &:hover {
    transform: scale(var(--hover-scale));
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  &::before {
    content: '${props => props.$type === 'workout' ? '🔄' : '👤'}';
    display: block;
    transition: all 0.2s ease;
    filter: ${props => props.$active ? 'none' : 'grayscale(30%)'};
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    right: 15px;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    right: 10px;
    font-size: 18px;
  }
`;