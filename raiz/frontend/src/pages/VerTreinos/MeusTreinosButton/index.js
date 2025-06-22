import React from 'react';
import { FloatingButton } from './styles';
import { motion } from 'framer-motion';

export default function MeusTreinosButton({ 
  onClick, 
  active, 
  mode = 'treinos',
  position = { top: '60px', right: '15px' }
}) {
  // Define emoji e cores com base no modo
  const buttonConfig = {
    treinos: {
      emoji: '🔄',
      activeColor: '#35eb21',
      inactiveColor: '#0066cc'
    },
    treinadores: {
      emoji: '👤',
      activeColor: '#0066cc',
      inactiveColor: '#35eb21'
    }
  };

  const { emoji, activeColor, inactiveColor } = buttonConfig[mode];

  return (
    <FloatingButton
      as={motion.button}
      $active={active}
      $color={active ? activeColor : inactiveColor}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        top: position.top,
        right: position.right,
        '--active-color': activeColor,
        '--inactive-color': inactiveColor
      }}
    >
      <span style={{ 
        fontSize: '22px',
        filter: active ? 'none' : 'grayscale(30%)'
      }}>
        {emoji}
      </span>
    </FloatingButton>
  );
}