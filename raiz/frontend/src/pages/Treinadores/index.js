// src/pages/Treinadores/index.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiActivity, FiUser, FiClock, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import TrainerSidebar from './Sidebar';
import EditarTreino from '../../components/EditarTreino';
import NavBar from '../../components/NavBar';
import {
  PageContainer,
  MainContent,
  Header,
  CenteredLogo,
  SectionTitle,
  SearchContainer,
  SearchInput,
  ProfessionalList,
  ProfessionalCard,
  UserImage,
  UserInfo,
  ActionGroup,
  PlanButton,
  EmptyMessage,
  HistoryButton,
  DeleteButton
} from './styles';

const TrainerPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupTreino, setPopupTreino] = useState({ userId: null, workoutId: null });
  const [vinculosAtivos, setVinculosAtivos] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ativos'); // 'ativos' ou 'pendentes'

  useEffect(() => {
    if (user) {
      loadVinculos();
    }
  }, [user]);

  const loadVinculos = async () => {
    try {
      setLoading(true);
      
      // Carregar vínculos ativos
      const ativosResponse = await fetch('http://localhost:3001/api/vinculos/treino?status=ativo', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (ativosResponse.ok) {
        const ativosData = await ativosResponse.json();
        setVinculosAtivos(ativosData);
      }

      // Carregar solicitações pendentes
      const pendentesResponse = await fetch('http://localhost:3001/api/vinculos/treino?status=pendente', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (pendentesResponse.ok) {
        const pendentesData = await pendentesResponse.json();
        setSolicitacoesPendentes(pendentesData);
      }
    } catch (error) {
      console.error('Erro ao carregar vínculos:', error);
      toast.error('Erro ao carregar vínculos');
    } finally {
      setLoading(false);
    }
  };

  const handleAceitarSolicitacao = async (vinculoId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/vinculos/treino/${vinculoId}/aceitar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Solicitação aceita com sucesso!');
        loadVinculos(); // Recarregar dados
      } else {
        toast.error('Erro ao aceitar solicitação');
      }
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
      toast.error('Erro ao aceitar solicitação');
    }
  };

  const handleRejeitarSolicitacao = async (vinculoId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/vinculos/treino/${vinculoId}/rejeitar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Solicitação rejeitada');
        loadVinculos(); // Recarregar dados
      } else {
        toast.error('Erro ao rejeitar solicitação');
      }
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  const handleCancelarVinculo = async (vinculoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este vínculo?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/vinculos/treino/${vinculoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Vínculo cancelado com sucesso');
          loadVinculos(); // Recarregar dados
        } else {
          toast.error('Erro ao cancelar vínculo');
        }
      } catch (error) {
        console.error('Erro ao cancelar vínculo:', error);
        toast.error('Erro ao cancelar vínculo');
      }
    }
  };

  const filteredVinculosAtivos = vinculosAtivos.filter(vinculo =>
    vinculo.usuario?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vinculo.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSolicitacoesPendentes = solicitacoesPendentes.filter(vinculo =>
    vinculo.usuario?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vinculo.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };



  const handleCreateWorkout = (userId) => {
    setPopupTreino({ userId, workoutId: null });
  };



  const handleVerTreinos = (userId) => {
    // Navegar para os treinos do usuário
    window.open(`/treinos?usuario=${userId}`, '_blank');
  };

  const getGenderEmoji = (gender) => {
    return gender === 'masculino' ? '👨' : '👩';
  };

  if (loading) {
    return (
      <PageContainer>
        <MainContent>
          <Header>
            <NavBar 
              title="THORC FIT"
              showBack={false}
              showMenu={true}
              onMenu={() => setSidebarOpen(true)}
            />
          </Header>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Carregando vínculos...
          </div>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TrainerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <MainContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Header>
          <NavBar 
            title="THORC FIT"
            showBack={false}
            showMenu={true}
            onMenu={() => setSidebarOpen(true)}
          />
        </Header>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CenteredLogo>
            <motion.img 
              src="/assets/images/logo.png"
              alt="Logo Thorc Fit"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
            <SectionTitle>
              ESPAÇO PARA <span className="highlight">TREINADORES</span>
            </SectionTitle>
          </CenteredLogo>
        </motion.div>

        {/* Tabs para alternar entre vínculos ativos e pendentes */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '1rem',
          borderBottom: '1px solid #eee'
        }}>
          <button
            onClick={() => setActiveTab('ativos')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: activeTab === 'ativos' ? '#3a86ff' : 'transparent',
              color: activeTab === 'ativos' ? 'white' : '#666',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer'
            }}
          >
            Vínculos Ativos ({vinculosAtivos.length})
          </button>
          <button
            onClick={() => setActiveTab('pendentes')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: activeTab === 'pendentes' ? '#ff6b35' : 'transparent',
              color: activeTab === 'pendentes' ? 'white' : '#666',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer'
            }}
          >
            Solicitações Pendentes ({solicitacoesPendentes.length})
          </button>
        </div>

        <SearchContainer>
          <FiSearch size={20} />
          <SearchInput
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <ProfessionalList>
          <AnimatePresence>
            {activeTab === 'ativos' ? (
              filteredVinculosAtivos.length > 0 ? (
                filteredVinculosAtivos.map((vinculo, index) => (
                  <motion.div
                    key={vinculo.id_vinculo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProfessionalCard>
                      <UserImage src={vinculo.usuario?.avatar || '/assets/images/default-avatar.png'} alt={vinculo.usuario?.nome} />
                      
                      <UserInfo>
                        <h4>{vinculo.usuario?.nome || 'Nome não disponível'}</h4>
                        <p>📧 {vinculo.usuario?.email || 'Email não disponível'}</p>
                        <p>{getGenderEmoji(vinculo.usuario?.genero)} {vinculo.usuario?.telefone || 'Telefone não disponível'}</p>
                        <small style={{ color: '#666' }}>
                          Vínculo desde: {formatDate(vinculo.data_inicio)}
                        </small>
                      </UserInfo>

                      <ActionGroup>
                        <PlanButton
                          onClick={() => handleCreateWorkout(vinculo.usuario?.id_usuario)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiActivity /> Novo Treino
                        </PlanButton>
                        
                        <HistoryButton
                          onClick={() => handleVerTreinos(vinculo.usuario?.id_usuario)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiEye /> Ver Treinos
                        </HistoryButton>
                      </ActionGroup>

                      <DeleteButton 
                        onClick={() => handleCancelarVinculo(vinculo.id_vinculo)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiTrash2 />
                      </DeleteButton>
                    </ProfessionalCard>
                  </motion.div>
                ))
              ) : (
                <EmptyMessage>
                  <FiUser size={40} />
                  <p>{searchTerm ? 'Nenhum vínculo encontrado com esse termo' : 'Você ainda não possui vínculos ativos'}</p>
                </EmptyMessage>
              )
            ) : (
              filteredSolicitacoesPendentes.length > 0 ? (
                filteredSolicitacoesPendentes.map((vinculo, index) => (
                  <motion.div
                    key={vinculo.id_vinculo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProfessionalCard style={{ borderLeft: '4px solid #ff6b35' }}>
                      <UserImage src={vinculo.usuario?.avatar || '/assets/images/default-avatar.png'} alt={vinculo.usuario?.nome} />
                      
                      <UserInfo>
                        <h4>{vinculo.usuario?.nome || 'Nome não disponível'}</h4>
                        <p>📧 {vinculo.usuario?.email || 'Email não disponível'}</p>
                        <p>{getGenderEmoji(vinculo.usuario?.genero)} {vinculo.usuario?.telefone || 'Telefone não disponível'}</p>
                        <small style={{ color: '#ff6b35', fontWeight: 'bold' }}>
                          Solicitação pendente
                        </small>
                      </UserInfo>

                      <ActionGroup>
                        <PlanButton 
                          onClick={() => handleAceitarSolicitacao(vinculo.id_vinculo)}
                          style={{ backgroundColor: '#229a00' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✓ Aceitar
                        </PlanButton>
                        <HistoryButton 
                          onClick={() => handleRejeitarSolicitacao(vinculo.id_vinculo)}
                          style={{ backgroundColor: '#dc3545' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✗ Rejeitar
                        </HistoryButton>
                      </ActionGroup>
                    </ProfessionalCard>
                  </motion.div>
                ))
              ) : (
                <EmptyMessage>
                  <FiUser size={40} />
                  <p>{searchTerm ? 'Nenhuma solicitação encontrada com esse termo' : 'Não há solicitações pendentes'}</p>
                </EmptyMessage>
              )
            )}

            {popupTreino.userId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  zIndex: 1000,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px',
                }}
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  style={{
                    width: '100%',
                    maxWidth: '850px',
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    overflowY: 'auto',
                    maxHeight: '95vh',
                  }}
                >
                  <EditarTreino
                    userId={popupTreino.userId}
                    workoutId={popupTreino.workoutId}
                    onClose={() => setPopupTreino({ userId: null, workoutId: null })}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ProfessionalList>
      </MainContent>
    </PageContainer>
  );
};

export default TrainerPage;