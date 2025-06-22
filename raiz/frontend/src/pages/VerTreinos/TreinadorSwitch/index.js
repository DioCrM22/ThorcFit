import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import * as S from './styles';

export default function TreinadorSwitch({ treinadores, onSelectTreinador, currentTreinador }) {
  const [showList, setShowList] = useState(false);

  const handleSelectTreinador = (treinador) => {
    onSelectTreinador(treinador);
    setShowList(false);
  };

  return (
    <>
      <S.FloatingButton 
        onClick={() => setShowList(!showList)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ top: '120px' }}
      >
        <FiRefreshCw size={20} color="white" />
      </S.FloatingButton>

      <AnimatePresence>
        {showList && (
          <S.TreinadoresList
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <S.Header>
              <h3>SELECIONE SEU TREINADOR</h3>
              <S.CloseButton onClick={() => setShowList(false)}>
                <span>✖</span>
              </S.CloseButton>
            </S.Header>
            
            {treinadores.map(treinador => (
              <S.TreinadorCard
                key={treinador.id}
                onClick={() => handleSelectTreinador(treinador)}
                selected={currentTreinador?.id === treinador.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <S.TreinadorImage src={treinador.foto} alt={treinador.nome} />
                <S.TreinadorInfo>
                  <S.TreinadorName>{treinador.nome}</S.TreinadorName>
                  <S.TreinadorDetail>
                    <span>{treinador.email}</span>
                    <span>{treinador.telefone}</span>
                  </S.TreinadorDetail>
                </S.TreinadorInfo>
                {currentTreinador?.id === treinador.id && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🔄
                  </div>
                )}
              </S.TreinadorCard>
            ))}
          </S.TreinadoresList>
        )}
      </AnimatePresence>
    </>
  );
}