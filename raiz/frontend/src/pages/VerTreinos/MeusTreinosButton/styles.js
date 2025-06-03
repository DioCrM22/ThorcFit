import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FloatingButton = styled(motion.button)`
  position: fixed;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : '#0066cc'};
  color: ${props => props.active ? '#0066cc' : 'white'};
  border: 2px solid ${props => props.active ? 'transparent' : '#0066cc'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  transition: all 0.2s ease;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    right: 15px;
  }
`;

export const Tooltip = styled.span`
  position: absolute;
  top: 60px;
  background: #0066cc;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
`;