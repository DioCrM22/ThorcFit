// src/pages/VerTreinos/index.js

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiClock, FiCheck, FiTrash2 } from 'react-icons/fi';
import NavBar from '../../components/NavBar';
import MeusTreinosButton from './MeusTreinosButton';
import TreinadorSwitch from './TreinadorSwitch';
import CriarTreino from './CriarTreino';

import * as S from './styles';

export default function VerTreino() {
  const navigate = useNavigate();

  const [treinos, setTreinos] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [viewMode, setViewMode] = useState('pessoal');
  const [treinadorSelecionado, setTreinadorSelecionado] = useState(null);
  const [isCriarTreinoOpen, setIsCriarTreinoOpen] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);
  const [treinoParaExcluir, setTreinoParaExcluir] = useState(null);


  const API_URL = 'http://localhost:3001/api';

  // Função para obter token do localStorage, validando existência e formato
  const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token || token === 'null' || token.trim() === '') {
      console.error('Token inválido ou não encontrado no localStorage:', token);
      return null;
    }
    return token;
  };

const fetchTreinadores = useCallback(async () => {
  try {
    const token = getToken();
    if (!token) return;

    const { data } = await axios.get(`${API_URL}/user/profissionais`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Resposta profissionais:', data);

    const profissionais = Array.isArray(data) ? data : [];

    const apenasTreinadores = profissionais.filter(user => user.tipo === 'treinador');
    setTreinadores(apenasTreinadores);
  } catch (error) {
    console.error('Erro ao buscar treinadores:', error);
  }
}, [API_URL]);


// Efeito para carregar treinadores só uma vez
useEffect(() => {
  fetchTreinadores();
}, [fetchTreinadores]);

// Busca treinos (planos), filtra se estiver na visão de treinador
const fetchTreinos = useCallback(async () => {
  try {
    const token = getToken();
    if (!token) return;

    const { data } = await axios.get(`${API_URL}/treino/planos`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let planos = data.planos_treino || data;

    if (viewMode === 'treinador' && treinadorSelecionado?.id) {
      planos = planos.filter(
        treino => treino.id_treinador === treinadorSelecionado.id
      );
    }

    setTreinos(planos);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
  }
}, [viewMode, treinadorSelecionado, API_URL]);

// Efeito para carregar treinos ao montar componente ou mudar dependências
useEffect(() => {
  fetchTreinos();
}, [fetchTreinos]);

// Alterna modo de visualização
const toggleViewMode = () => {
  setViewMode(prev => (prev === 'pessoal' ? 'treinador' : 'pessoal'));
};

// Formata data no padrão dd/mm/aaaa
const formatarData = (dataString) => {
  const data = new Date(dataString);
  return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${data.getFullYear()}`;
};

// Filtra treinos baseado no status (pendentes ou realizados)
const treinosFiltrados = useMemo(() => {
  return treinos.filter((treino) => {
    const statusMatch =
      (activeTab === 'pendentes' && (treino.status === 'ativo' || treino.status === 'em-andamento')) ||
      (activeTab === 'realizados' && treino.status === 'finalizado');
    return statusMatch;
  });
}, [treinos, activeTab]);

// Navega para detalhes do treino
const handleAcaoTreino = (id) => {
  navigate(`/treino/${id}`);
};

// Deleta treino após confirmação
const handleDeleteTreino = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    await axios.delete(`${API_URL}/treino/plano/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTreinos(prevTreinos => prevTreinos.filter(treino => treino.id_plano_treino !== id));
    setPopupAberto(false);
    console.log('Treino excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir treino:', error);
  }
};

  return (
    <S.Page>
      <NavBar
        title="THORC FIT"
        showBack
        onBack={() => navigate('/home')}
      />

      <S.CenteredLogo>
        <img src="/assets/images/LogoForte.png" alt="Logo ThorcFit" />
        <S.ViewModeTitle>
          {viewMode === 'pessoal' ? 'MEUS TREINOS 👤' : 
           `TREINOS DO ${treinadorSelecionado?.nome?.toUpperCase() || 'TREINADOR'}`}
        </S.ViewModeTitle>
      </S.CenteredLogo>

      <MeusTreinosButton 
        onClick={toggleViewMode}
        active={viewMode === 'pessoal'}
      />

      {viewMode === 'treinador' && (
        <TreinadorSwitch 
          treinadores={treinadores}
          onSelectTreinador={setTreinadorSelecionado}
          currentTreinador={treinadorSelecionado}
        />
      )}

      <S.FloatingButton
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsCriarTreinoOpen(true)}
      >
        <FiPlus size={28} />
      </S.FloatingButton>

      <S.Content>
        <S.TabsContainer>
          <S.TabButton 
            $active={activeTab === 'pendentes'}
            onClick={() => setActiveTab('pendentes')}
          >
            Pendentes
          </S.TabButton>

          <S.TabButton
            $active={activeTab === 'realizados'}
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
                    key={treino.id_plano_treino}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <S.TreinoHeader>
                      <S.TreinoType tipo={treino.tipo || 'pessoal'}>
                        {treino.tipo?.toUpperCase() || 'PESSOAL'}
                      </S.TreinoType>
                    </S.TreinoHeader>

                    <S.TreinoName>{treino.nome}</S.TreinoName>

                    {treino.descricao && (
                      <S.TreinoDetail>📝 {treino.descricao}</S.TreinoDetail>
                    )}

                    <S.TreinoDetail>💪 {treino.exercicios_treino?.length || 0} exercício(s)</S.TreinoDetail>

                    <S.ActionButtonsContainer>
                      <S.TreinoAction
                        status={treino.status}
                        onClick={() => handleAcaoTreino(treino.id_plano_treino)}
                        whileHover={{ scale: 1.05 }}
                      >
                        {treino.status === 'ativo' && <><FiPlus size={14} /> Iniciar</>}
                        {treino.status === 'em-andamento' && <><FiClock size={14} /> Continuar</>}
                        {treino.status === 'finalizado' && <><FiCheck size={14} /> Visualizar</>}
                      </S.TreinoAction>

                      <S.RemoveButton 
                      onClick={() => {
                        setTreinoParaExcluir(treino.id_plano_treino);
                        setPopupAberto(true);
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <FiTrash2 size={14} /> Excluir
                    </S.RemoveButton>
                    </S.ActionButtonsContainer>
                  </S.TreinoCard>
              ))
            )}
          </S.TreinosGrid>
        </AnimatePresence>
      </S.Content>

      {popupAberto && (
          <S.PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <S.PopupContainer
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <S.PopupTitle>Confirmar Exclusão</S.PopupTitle>
              <S.PopupMessage>Tem certeza que deseja excluir este treino?</S.PopupMessage>
              <S.PopupButtons>
                <S.PopupCancelButton onClick={() => setPopupAberto(false)}>
                  Voltar
                </S.PopupCancelButton>
                <S.PopupConfirmButton 
                  onClick={() => {
                    handleDeleteTreino(treinoParaExcluir);
                    setPopupAberto(false);
                  }}
                >
                  Excluir
                </S.PopupConfirmButton>
              </S.PopupButtons>
            </S.PopupContainer>
          </S.PopupOverlay>
        )}

      {isCriarTreinoOpen && (
        <CriarTreino
          onClose={() => setIsCriarTreinoOpen(false)}
          fetchTreinos={fetchTreinos}
          viewMode={viewMode}
          treinadorSelecionado={treinadorSelecionado}
        />
      )}
    </S.Page>
  );
}