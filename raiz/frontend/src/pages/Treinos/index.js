import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiClock, FiCheck, FiInfo } from 'react-icons/fi';
import Confetti from 'react-confetti';
import * as S from './styles';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';

const mockTreinos = [
  {
    id: 1,
    nome: 'Agachamento com Halteres',
    realizado: false,
    tempo: 30,
    repeticoes: 12,
    series: 3,
    descanso: 45,
    descricao: 'Mantenha as costas retas e desça até os joelhos formarem 90 graus',
    grupo_muscular: 'Pernas',
    equipamento: 'Halteres',
    carga_kg: 15,
    gif: '/assets/gif/Agachamento com halteres.gif',
    paused: false
  },
  { 
    id: 2,
    nome: 'Avanço (Afundo) com Halteres',
    realizado: false,
    tempo: 30,
    repeticoes: 12,
    series: 3,
    descanso: 45,
    descricao: 'Dê um passo à frente e desça até o joelho traseiro quase tocar o chão',
    grupo_muscular: 'Pernas',
    equipamento: 'Halteres',
    carga_kg: 10,
    gif: '/assets/gif/Avanço (Afundo) com halteres.gif',
    paused: false
  },
  {
    id: 3,
    nome: 'Elevação de Quadril',
    realizado: false,
    tempo: 60,
    repeticoes: 1,
    series: 1,
    descanso: 30,
    descricao: 'Deitado de costas, eleve o quadril mantendo as costas retas',
    grupo_muscular: 'Glúteos',
    equipamento: 'Colchonete',
    carga_kg: null,
    gif: '/assets/gif/Elevação de Quadril com Pernas Flexionadas.gif',
    paused: false
  },
  {
    id: 4,
    nome: 'Esteira',
    realizado: false,
    tempo: 60,
    repeticoes: 1,
    series: 1,
    descanso: 30,
    descricao: 'Corrida moderada na esteira',
    grupo_muscular: 'Cardio',
    equipamento: 'Esteira',
    carga_kg: null,
    gif: '/assets/gif/Esteira.gif',
    paused: false
  },
  {
    id: 5,
    nome: 'Flexão de Braço',
    realizado: false,
    tempo: 30,
    repeticoes: 12,
    series: 3,
    descanso: 45,
    descricao: 'Mantenha o corpo alinhado e desça até que o peito fique próximo ao chão, empurrando de volta até a posição inicial.',
    grupo_muscular: 'Peitoral, Tríceps e Ombros',
    equipamento: 'Colchonete',
    carga_kg: null,
    gif: '/assets/gif/Flexão de Braço.gif',
    paused: false
  },
  {
  id: 6,
  nome: 'Marcha Estacionária',
  realizado: false,
  tempo: 45,
  repeticoes: null,
  series: 3,
  descanso: 30,
  descricao: 'Em pé, eleve os joelhos alternadamente como se estivesse marchando no mesmo lugar, mantendo o core ativado e os braços acompanhando o movimento naturalmente.',
  grupo_muscular: 'Quadríceps, Glúteos e Core',
  equipamento: 'Nenhum',
  carga_kg: null,
  gif: '/assets/gif/Marcha Estacionaria.gif',
  paused: false
},
  {
    id: 7,
    nome: 'Polichinelo',
    realizado: false,
    tempo: 60,
    repeticoes: 1,
    series: 1,
    descanso: 30,
    descricao: 'Exercício aeróbico que consiste em abrir e fechar braços e pernas ao mesmo tempo, ideal para aquecimento.',
    grupo_muscular: 'Cardio',
    equipamento: 'Nenhum',
    carga_kg: null,
    gif: '/assets/gif/Polichinelo.gif',
    paused: false
  },
  {
    id: 8,
    nome: 'Stiff com Halteres',
    realizado: false,
    tempo: 30,
    repeticoes: 10,
    series: 3,
    descanso: 60,
    descricao: 'Com os halteres nas mãos, mantenha os joelhos levemente flexionados e desça o tronco até sentir alongamento nos posteriores da coxa, retornando à posição inicial.',
    grupo_muscular: 'Posterior de Coxa e Glúteos',
    equipamento: 'Halteres',
    carga_kg: 20,
    gif: '/assets/gif/Stiff com halteres.gif',
    paused: false
  },
  {
  id: 9,
  nome: 'Subida no banco',
  realizado: false,
  tempo: 30,
  repeticoes: 12,
  series: 3,
  descanso: 45,
  descricao: 'Posicione-se em frente a um banco ou step. Suba com uma perna de cada vez, mantendo o tronco ereto e o core ativado. Desça com controle e repita alternando as pernas.',
  grupo_muscular: 'Quadríceps, Glúteos e Panturrilha',
  equipamento: 'Banco ou step',
  carga_kg: null,
  gif: '/assets/gif/Subida no banco (Step-up).gif',
  paused: false
},
];

export default function Treinos() {
  const [treinos, setTreinos] = useState(mockTreinos);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStage, setCurrentStage] = useState('exercise');
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSerie, setCurrentSerie] = useState(1);
  const [showDetails, setShowDetails] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const navigate = useNavigate();

  const toggleDetails = (id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleItemSelection = (id) => {
    const newSelectedItems = selectedItems.includes(id) 
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id];
    
    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.length === treinos.length);
  };

  const handleBulkComplete = () => {
    setTreinos(treinos.map(t => 
      selectedItems.includes(t.id) ? {...t, realizado: true, paused: false} : t
    ));
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const handleBulkReset = () => {
    setTreinos(treinos.map(t => 
      selectedItems.includes(t.id) ? {...t, realizado: false, paused: false} : t
    ));
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(treinos.map(treino => treino.id));
    }
    setSelectAll(!selectAll);
  };

  const handleFinishWorkout = useCallback(() => {
    if (currentSerie < selectedTreino?.series) {
      setCurrentSerie(currentSerie + 1);
      setCurrentRep(1);
      setShowRest(true);
      setCurrentStage('rest');
      setTimeLeft(selectedTreino?.descanso || 0);
      setTimerActive(true);
    } else {
      setShowRest(false);
      setShowCompletion(true);
      setShowConfetti(true);
      setTimerActive(false);
      setCurrentStage('completed');
      
      setTreinos(treinos.map(t => 
        t.id === selectedTreino.id ? {...t, realizado: true, paused: false} : t
      ));

      setTimeout(() => {
        setShowConfetti(false);
        setCurrentSerie(1);
        setCurrentRep(1);
      }, 3000);
    }
  }, [selectedTreino, treinos, currentSerie]);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      
      if (currentStage === 'exercise') {
        if (currentRep < selectedTreino?.repeticoes) {
          setCurrentRep(currentRep + 1);
          setTimeLeft(selectedTreino?.tempo || 0);
          setTimerActive(true);
        } else {
          setShowRest(true);
          setCurrentStage('rest');
          setTimeLeft(selectedTreino?.descanso || 0);
          setTimerActive(true);
        }
      } else if (currentStage === 'rest') {
        handleFinishWorkout();
      }
    }
    return () => clearTimeout(timer);
  }, [timerActive, timeLeft, currentStage, selectedTreino, currentRep, handleFinishWorkout]);

  useEffect(() => {
    if (showCompletion) {
      const timer = setTimeout(() => {
        setShowCompletion(false);
        setSelectedTreino(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCompletion]);

  const handleStartWorkout = (treino) => {
    setSelectedTreino(treino);
    setCurrentStage('exercise');
    setTimeLeft(treino.paused ? treino.tempo - treino.currentTime : treino.tempo);
    setTimerActive(true);
    setCurrentRep(1);
    setCurrentSerie(1);
    
    if (treino.paused) {
      setTreinos(treinos.map(t => 
        t.id === treino.id ? {...t, paused: false} : t
      ));
    }
  };

  const handlePauseWorkout = () => {
    setTimerActive(false);
    setTreinos(treinos.map(t => 
      t.id === selectedTreino.id ? {...t, paused: true, currentTime: selectedTreino.tempo - timeLeft} : t
    ));
    setSelectedTreino(null);
  };

  return (
    <S.Page>
      <NavBar 
        title="THORC FIT"
        showBack={true}
        showMenu={false}
        onBack={() => navigate('/ver-treinos')}
      />

      {showBulkActions && (
        <S.BulkActionsContainer initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}>
          <S.ExecuteButton onClick={handleBulkComplete}>✅ Finalizar Selecionados</S.ExecuteButton>
          <S.ContinueButton onClick={handleBulkReset}>🔄 Reiniciar Selecionados</S.ContinueButton>
          <S.DeleteButton onClick={() => {
            setSelectedItems([]);
            setShowBulkActions(false);
          }}>❌ Cancelar</S.DeleteButton>
        </S.BulkActionsContainer>
      )}

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} gravity={0.5} />
      )}

      <S.Content>
        {(selectedItems.length > 0 || selectAll) && (
          <S.SelectionBarTop>
            <S.SelectAllCheckbox 
              selected={selectAll} 
              onClick={handleSelectAll}
            >
              <span>{selectAll && '✓'}</span>
              Todos
            </S.SelectAllCheckbox>
            
            <S.ManageSelectionButton 
              onClick={() => setShowBulkActions(true)}
              disabled={selectedItems.length === 0}
            >
              Gerenciar Selecionados
            </S.ManageSelectionButton>
          </S.SelectionBarTop>
        )}
        <S.TreinosList>
          {treinos.map((item) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ 
                opacity: 1, 
                y: 0,
                border: selectedItems.includes(item.id) ? `2px solid ${S.AZUL}` : 'none'
              }} 
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <S.TreinoCard>
                <S.GifContainer>
                  <S.SelectionCheckbox 
                    selected={selectedItems.includes(item.id)}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    {selectedItems.includes(item.id) && '✓'}
                  </S.SelectionCheckbox>
                  <img src={item.gif} alt={item.nome} />
                  <S.TimeBadge><FiClock size={14} /> {item.tempo}s</S.TimeBadge>
                  <S.RepInfo>{item.repeticoes} rep x {item.series} séries</S.RepInfo>
                </S.GifContainer>
                <S.TreinoInfo>
                  <S.TreinoHeader>
                    <h3>{item.nome}</h3>
                    <S.InfoButton onClick={() => toggleDetails(item.id)}><FiInfo size={18} /></S.InfoButton>
                  </S.TreinoHeader>
                  <AnimatePresence>
                    {showDetails[item.id] && (
                      <S.ExerciseDetails initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                        <p>{item.descricao}</p>
                        <S.DetailsGrid>
                          <div><strong>Grupo Muscular:</strong><span>{item.grupo_muscular}</span></div>
                          <div><strong>Equipamento:</strong><span>{item.equipamento}</span></div>
                          {item.carga_kg && (<div><strong>Carga:</strong><span>{item.carga_kg} kg</span></div>)}
                          <div><strong>Descanso:</strong><span>{item.descanso}s</span></div>
                        </S.DetailsGrid>
                      </S.ExerciseDetails>
                    )}
                  </AnimatePresence>
                  <S.ButtonGroup>
                    {item.realizado ? (
                      <S.FinishedButton><FiCheck /> Finalizado</S.FinishedButton>
                    ) : item.paused ? (
                      <S.ContinueButton onClick={() => handleStartWorkout(item)}><FiPlay /> Continuar</S.ContinueButton>
                    ) : (
                      <S.ExecuteButton onClick={() => handleStartWorkout(item)}><FiPlay /> Iniciar</S.ExecuteButton>
                    )}
                  </S.ButtonGroup>
                </S.TreinoInfo>
              </S.TreinoCard>
            </motion.div>
          ))}
        </S.TreinosList>

        <AnimatePresence>
          {selectedTreino && (
            <S.FullScreenOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <S.FullScreenContent>
                {showRest ? (
                  <S.RestContainer>
                    <S.RestTitle>DESCANSO - Série {currentSerie}/{selectedTreino.series}</S.RestTitle>
                    <S.RestTimer>{timeLeft}s</S.RestTimer>
                    <S.RestText>Aguarde {selectedTreino.descanso} segundos</S.RestText>
                  </S.RestContainer>
                ) : (
                  <>
                    <S.FullScreenGifContainer>
                      <img src={selectedTreino.gif} alt={selectedTreino.nome} />
                      <S.Timer>{timeLeft}s</S.Timer>
                      <S.RepInfo>
                        Rep {currentRep}/{selectedTreino.repeticoes} - Série {currentSerie}/{selectedTreino.series}
                      </S.RepInfo>
                    </S.FullScreenGifContainer>

                    <S.GifInfoContainer>
                      <S.Timer>{timeLeft}s</S.Timer>
                    </S.GifInfoContainer>

                    <S.ExerciseDescription>
                      <h3>{selectedTreino.nome}</h3>
                      <p>{selectedTreino.descricao}</p>
                      <S.DetailsGrid>
                        <div><strong>Grupo Muscular:</strong><span>{selectedTreino.grupo_muscular}</span></div>
                        <div><strong>Equipamento:</strong><span>{selectedTreino.equipamento}</span></div>
                        {selectedTreino.carga_kg && (<div><strong>Carga:</strong><span>{selectedTreino.carga_kg} kg</span></div>)}
                      </S.DetailsGrid>
                    </S.ExerciseDescription>
                    <S.ControlGroup>
                      <S.StopButton onClick={handlePauseWorkout}><FiPause /> Parar</S.StopButton>
                    </S.ControlGroup>
                  </>
                )}
              </S.FullScreenContent>
            </S.FullScreenOverlay>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCompletion && (
            <S.CompletionOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <S.CompletionContent>
                <S.LogoContainer>
                  <S.LogoGlow />
                  <S.CompletionLogo src="/assets/images/logo.png" alt="Logo" />
                </S.LogoContainer>
                <S.CompletionText>Treino Finalizado!</S.CompletionText>
              </S.CompletionContent>
            </S.CompletionOverlay>
          )}
        </AnimatePresence>
      </S.Content>
    </S.Page>
  );
}