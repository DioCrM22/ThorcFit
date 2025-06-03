import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiActivity, FiUser, FiClock, FiEdit, FiTrash2 } from 'react-icons/fi';
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
  HistoryContainer,
  HistoryItem,
  DeleteButton
} from './styles';

const TrainerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState({});
  const [popupTreino, setPopupTreino] = useState({ userId: null, workoutId: null });
  const [athletes, setAthletes] = useState([
    {
      id_usuario: 1,
      nome: 'João Santos',
      email: 'joao@exemplo.com',
      foto_perfil: '/assets/images/default-avatar.png',
      status_treino: 'ativo',
      data_nascimento: '1990-01-15',
      genero: 'masculino',
      numero: '(11) 98765-4321',
      historico_treinos: [
        { id_treino: 101, nome: 'Treino A', data_criacao: '2024-05-10', status: 'finalizado' },
        { id_treino: 102, nome: 'Treino B', data_criacao: '2024-05-15', status: 'finalizado' },
        { id_treino: 103, nome: 'Treino C', data_criacao: '2024-05-18', status: 'ativo' }
      ]
    },
    {
      id_usuario: 2,
      nome: 'Maria Oliveira',
      email: 'maria@exemplo.com',
      foto_perfil: '/assets/images/default-avatar.png',
      status_treino: 'inativo',
      data_nascimento: '1992-05-22',
      genero: 'feminino',
      numero: '(11) 91234-5678',
      historico_treinos: [
        { id_treino: 201, nome: 'Treino X', data_criacao: '2024-04-20', status: 'finalizado' },
        { id_treino: 202, nome: 'Treino Y', data_criacao: '2024-05-10', status: 'finalizado' }
      ]
    }
  ]);

  const filteredAthletes = athletes.filter(athlete => 
    athlete.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const toggleHistory = (userId) => {
    setShowHistory(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCreateWorkout = (userId) => {
    setPopupTreino({ userId, workoutId: null });
  };

  const handleEditWorkout = (userId, workoutId) => {
    setPopupTreino({ userId, workoutId });
  };

  const handleDeleteAthlete = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setAthletes(prev => prev.filter(athlete => athlete.id_usuario !== userId));
    }
  };

  const getGenderEmoji = (gender) => {
    return gender === 'masculino' ? '👨' : '👩';
  };

  return (
    <PageContainer>
      <TrainerSidebar userData={{ nome: "Treinador", avatar: "/assets/images/default-avatar.png" }} />
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

        <SearchContainer>
          <FiSearch size={20} />
          <SearchInput
            placeholder="Buscar atleta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <ProfessionalList>
          <AnimatePresence>
            {filteredAthletes.length === 0 ? (
              <EmptyMessage>
                <FiUser size={40} />
                <p>Nenhum atleta encontrado</p>
              </EmptyMessage>
            ) : (
              filteredAthletes.map((athlete, index) => (
                <motion.div
                  key={athlete.id_usuario}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProfessionalCard>
                    <UserImage src={athlete.foto_perfil} alt={athlete.nome} />
                    
                    <UserInfo>
                      <h4>{athlete.nome}</h4>
                      <p>📧 {athlete.email}</p>
                      <p>{getGenderEmoji(athlete.genero)} {athlete.numero}</p>
                      <div className="status">
                        <span className={`badge ${athlete.status_treino}`}>
                          {athlete.status_treino === 'ativo' ? '✅ Ativo' : '⏸️ Inativo'}
                        </span>
                      </div>
                    </UserInfo>

                    <ActionGroup>
                      <PlanButton
                        onClick={() => handleCreateWorkout(athlete.id_usuario)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiActivity /> {athlete.status_treino === 'ativo' ? 'Editar' : 'Novo'} Treino
                      </PlanButton>
                      
                      {athlete.historico_treinos && athlete.historico_treinos.length > 0 && (
                        <HistoryButton
                          onClick={() => toggleHistory(athlete.id_usuario)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiClock /> Histórico
                        </HistoryButton>
                      )}
                    </ActionGroup>

                    <DeleteButton 
                      onClick={() => handleDeleteAthlete(athlete.id_usuario)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 />
                    </DeleteButton>

                    {showHistory[athlete.id_usuario] && (
                      <HistoryContainer>
                        <h5>Histórico de Treinos</h5>
                        {athlete.historico_treinos.map((treino) => (
                          <HistoryItem key={treino.id_treino} status={treino.status}>
                            <div>
                              <strong>{treino.nome}</strong>
                              <span>Criado em: {formatDate(treino.data_criacao)}</span>
                              <span>Status: {treino.status === 'ativo' ? '✅ Ativo' : '✔️ Finalizado'}</span>
                            </div>
                            {treino.status === 'ativo' && (
                              <button onClick={() => handleEditWorkout(athlete.id_usuario, treino.id_treino)}>
                                <FiEdit /> Editar
                              </button>
                            )}
                          </HistoryItem>
                        ))}
                      </HistoryContainer>
                    )}
                  </ProfessionalCard>
                </motion.div>
              ))
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