import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCheck, FiTrash2, FiPlus } from 'react-icons/fi';
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

  useEffect(() => {
    fetchTreinadores();
  }, [fetchTreinadores]);

  useEffect(() => {
    const fetchTodosTreinos = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_URL}/treino/planos`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let planos = data.planos_treino || data;

        if (viewMode === 'treinador' && treinadorSelecionado?.id) {
          planos = planos.filter(
            treino => treino.id_treinador === treinadorSelecionado.id
          );
        }

        // ✅ Busca treinos salvos localmente (realizados)
        const local = JSON.parse(localStorage.getItem('historicoTreinos') || '[]');

        const localComStatus = local.map(t => ({
          ...t,
          status: 'concluido'
        }));

        const todos = [...planos, ...localComStatus];

        console.log('Treinos carregados (API + LocalStorage):', todos);

        setTreinos(todos);
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
      }
    };

    fetchTodosTreinos();
  }, [viewMode, treinadorSelecionado]);

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'pessoal' ? 'treinador' : 'pessoal'));
  };

  const treinosFiltrados = useMemo(() => {
    return treinos.filter((treino) => {
      if (activeTab === 'pendentes') {
        return (
          (treino.status === 'ativo' || treino.status === 'em-andamento') &&
          !treino.id_historico // Exclui treinos salvos localmente
        );
      }
      if (activeTab === 'realizados') {
        return treino.status === 'finalizado' || treino.status === 'concluido';
      }
      return false;
    });
  }, [treinos, activeTab]);

  const handleAcaoTreino = (id) => {
    navigate(`/treino/${id}`);
  };

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
            Treinos disponiveis
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
                    key={treino.id_plano_treino || treino.id_historico || treino.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleAcaoTreino(treino.id_plano_treino || treino.id_historico || treino.id)}
                    style={{ cursor: 'pointer' }}
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

                    {treino.hora_fim && (
                      <S.TreinoDetail>
                        🗓️ Feito em: {new Date(treino.hora_fim).toLocaleDateString('pt-BR')}
                      </S.TreinoDetail>
                    )}

                    <S.TreinoDetail>💪 {treino.exercicios_treino?.length || 0} exercício(s)</S.TreinoDetail>

                    <S.ActionButtonsContainer>
                      {activeTab === 'realizados' && (
                        <S.TreinoAction
                          status={treino.status}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcaoTreino(treino.id_plano_treino || treino.id_historico || treino.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {(treino.status === 'finalizado' || treino.status === 'concluido') && <><FiCheck size={14} /> Visualizar</>}
                          {(treino.status === 'ativo' || treino.status === 'em-andamento') && <><FiClock size={14} /> Continuar</>}
                        </S.TreinoAction>
                      )}

                      <S.RemoveButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTreinoParaExcluir(treino.id_plano_treino || treino.id_historico || treino.id);
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
          fetchTreinos={() => {}} 
          viewMode={viewMode}
          treinadorSelecionado={treinadorSelecionado}
        />
      )}
    </S.Page>
  );
}
