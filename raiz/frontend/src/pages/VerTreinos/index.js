// src/pages/VerTreino/index.js

import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiPlus, FiClock, FiUser, FiCheck, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import * as S from './styles';
import TreinadorSwitch from './TreinadorSwitch';
import MeusTreinosButton from './MeusTreinosButton';
import EditarTreino from '../../components/EditarTreino';

const mockTreinosPessoais = [
  {
    id: 1,
    nome: "Treino Hipertrofia",
    objetivo: "Ganho de massa muscular",
    observacoes: "Executar com atenção à postura",
    data: new Date().toISOString(),
    status: "pendente",
    tipo: "pessoal",
    exercicios: [
      "Supino reto",
      "Agachamento livre",
      "Remada curvada"
    ]
  }
];

const mockTreinadores = [
  {
    id: 1,
    nome: "Carlos Silva",
    email: "carlos@example.com",
    telefone: "(11) 99999-9999",
    foto: "../carlos.jpg",
    especialidade: "Musculação",
    treinos: [
      {
        id: 101,
        nome: "Treino Funcional",
        objetivo: "Resistência e agilidade",
        observacoes: "Manter ritmo alto",
        data: new Date().toISOString(),
        status: "pendente",
        tipo: "treinador",
        criador: "Carlos Silva",
        exercicios: [
          "Burpee",
          "Kettlebell Swing",
          "Pular Corda"
        ]
      }
    ]
  }
];

export default function VerTreino() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pendentes');
  const [viewMode, setViewMode] = useState('pessoal');
  const [treinadorAtual, setTreinadorAtual] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1)
      .toString().padStart(2, '0')}`;
  };

  const treinosFiltrados = useMemo(() => {
    const treinosBase = viewMode === 'pessoal'
      ? mockTreinosPessoais
      : treinadorAtual?.treinos || [];

    return treinosBase.filter((treino) => {
      const statusMatch =
        (activeTab === 'pendentes' && (treino.status === 'pendente' || treino.status === 'em-andamento')) ||
        (activeTab === 'realizados' && treino.status === 'finalizado');

      return statusMatch;
    });
  }, [viewMode, activeTab, treinadorAtual]);

  const handleAcaoTreino = (id) => {
    navigate(`/treino/${id}`);
  };

  return (
    <S.Page>
      <NavBar
        title="THORC FIT"
        showBack
        onBack={() => navigate('/home')}
      />

      <S.CenteredLogo>
        <img src="/assets/images/LogoForte.png" alt="Logo" />
        <S.ViewModeTitle>
          {viewMode === 'pessoal' ? 'MEUS TREINOS 👤' : treinadorAtual?.nome}
        </S.ViewModeTitle>
      </S.CenteredLogo>

      <MeusTreinosButton
        onClick={() => {
          if (viewMode === 'pessoal') {
            setShowEditPopup(true);
          } else {
            setViewMode('pessoal');
            setTreinadorAtual(null);
          }
        }}
        active={viewMode === 'pessoal'}
        whileHover={{ scale: 1.1 }}
      />

      <TreinadorSwitch
        treinadores={mockTreinadores}
        onSelectTreinador={(t) => {
          setTreinadorAtual(t);
          setViewMode('treinador');
        }}
        currentTreinador={treinadorAtual}
      />

      <S.Content>
        {viewMode === 'treinador' && treinadorAtual && (
          <S.ProfileHeader>
            <S.ProfileImageContainer>
              <S.ProfileImage src={treinadorAtual.foto} />
            </S.ProfileImageContainer>
            <S.ProfileInfo>
              <S.ProfileName>{treinadorAtual.nome}</S.ProfileName>
              <S.ProfileDetail><FiMail size={14} /> {treinadorAtual.email}</S.ProfileDetail>
              <S.ProfileDetail><FiPhone size={14} /> {treinadorAtual.telefone}</S.ProfileDetail>
              <S.ProfileType>TREINADOR</S.ProfileType>
            </S.ProfileInfo>
            <S.RemoveButton onClick={() => {
              setTreinadorAtual(null);
              setViewMode('pessoal');
            }}>
              <FiTrash2 />
            </S.RemoveButton>
          </S.ProfileHeader>
        )}

        <S.TabsContainer>
          <S.TabButton
            active={activeTab === 'pendentes'}
            onClick={() => setActiveTab('pendentes')}
          >
            Pendentes
          </S.TabButton>
          <S.TabButton
            active={activeTab === 'realizados'}
            onClick={() => setActiveTab('realizados')}
          >
            Realizados
          </S.TabButton>
        </S.TabsContainer>

        <AnimatePresence>
          <S.TreinosGrid>
            {treinosFiltrados.length === 0 ? (
              <S.EmptyMessage>Nenhum treino encontrado</S.EmptyMessage>
            ) : (
              treinosFiltrados.map((treino) => (
                <S.TreinoCard
                  key={treino.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <S.TreinoHeader>
                    <S.TreinoDate>{formatarData(treino.data)}</S.TreinoDate>
                    <S.TreinoType tipo={treino.tipo}>
                      {treino.tipo === 'pessoal' ? 'PESSOAL' : 'TREINADOR'}
                    </S.TreinoType>
                  </S.TreinoHeader>

                  <S.TreinoName>{treino.nome}</S.TreinoName>

                  {treino.objetivo && (
                    <S.TreinoDetail>🎯 {treino.objetivo}</S.TreinoDetail>
                  )}

                  {treino.observacoes && (
                    <S.TreinoDetail>📝 {treino.observacoes}</S.TreinoDetail>
                  )}

                  <S.TreinoDetail>💪 {treino.exercicios?.length} exercício(s)</S.TreinoDetail>

                  {treino.tipo === 'treinador' && (
                    <S.TreinoDetail><FiUser size={14} /> {treino.criador}</S.TreinoDetail>
                  )}

                  <S.TreinoAction
                    status={treino.status}
                    onClick={() => handleAcaoTreino(treino.id)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {treino.status === 'pendente' && <><FiPlus size={14} /> Iniciar</>}
                    {treino.status === 'em-andamento' && <><FiClock size={14} /> Continuar</>}
                    {treino.status === 'finalizado' && <><FiCheck size={14} /> Visualizar</>}
                  </S.TreinoAction>
                </S.TreinoCard>
              ))
            )}
          </S.TreinosGrid>
        </AnimatePresence>
      </S.Content>
      {showEditPopup && (
        <S.EditPopupOverlay>
          <S.EditPopupContent>
            <EditarTreino 
              userId="current-user-id" 
              onClose={() => setShowEditPopup(false)} 
              onSave={(newWorkout) => {
                const newPersonalWorkout = {
                  id: Date.now(),
                  nome: newWorkout.nome,
                  objetivo: newWorkout.objetivo,
                  observacoes: newWorkout.observacoes,
                  data: newWorkout.data_criacao,
                  status: "pendente",
                  tipo: "pessoal",
                  exercicios: newWorkout.exercicios.map(ex => ex.nome)
                };
                mockTreinosPessoais.unshift(newPersonalWorkout);
                setShowEditPopup(false);
              }}
            />
          </S.EditPopupContent>
        </S.EditPopupOverlay>
      )}
    </S.Page>
  );
}
