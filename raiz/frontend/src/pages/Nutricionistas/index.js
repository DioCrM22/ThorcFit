// Nutricionistas/index.js
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiActivity, FiTrash2 } from 'react-icons/fi';
import NutriSidebar from './Sidebar';
import EditarRefeicao from './EditarRefeicao';
import NavBar from '../../components/NavBar';
import * as S from './styles';

const NutricionistasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [popupRefeicao, setPopupRefeicao] = useState({ userId: null, refeicaoId: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const atletas = [
    {
      id_usuario: 1,
      nome: 'João Santos',
      email: 'joao@exemplo.com',
      foto_perfil: 'https://i.pravatar.cc/70?img=12',
      genero: 'masculino',
      numero: '(11) 98765-4321',
      status_treino: 'ativo',
      historico_refeicoes: [
        { id_refeicao: 201, nome: 'Café da Manhã', data: '2024-05-10', status: 'ativo' },
        { id_refeicao: 202, nome: 'Almoço', data: '2024-05-11', status: 'finalizado' }
      ]
    }
  ];

  const handleNovaRefeicao = (userId) => {
    setPopupRefeicao({ userId, refeicaoId: null });
  };

  const handleFecharPopup = () => {
    setPopupRefeicao({ userId: null, refeicaoId: null });
  };

  return (
    <S.PageContainer>
      <NutriSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <S.MainContent>
        <S.Header>
          <NavBar 
            title="THORC FIT"
            showBack={false}
            showMenu={true}
            onMenu={() => setSidebarOpen(true)}
          />
        </S.Header>

        <S.CenteredLogo>
          <motion.img src="/assets/images/logo.png" alt="Logo Thorc Fit" />
          <S.SectionTitle>ESPAÇO PARA <span className="highlight">NUTRICIONISTAS</span></S.SectionTitle>
        </S.CenteredLogo>

        <S.SearchContainer>
          <FiSearch />
          <S.SearchInput
            placeholder="Buscar atleta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchContainer>

        <S.ProfessionalList>
          {atletas.map((atleta) => (
            <S.ProfessionalCard key={atleta.id_usuario}>
              <S.UserImage src={atleta.foto_perfil} />
              <S.UserInfo>
                <h4>{atleta.nome}</h4>
                <p>{atleta.email}</p>
                <p>{atleta.numero}</p>
              </S.UserInfo>

              <S.ActionGroup>
                <S.PlanButton onClick={() => handleNovaRefeicao(atleta.id_usuario)}>
                  <FiActivity /> Nova Refeição
                </S.PlanButton>
              </S.ActionGroup>

              <S.DeleteButton onClick={() => alert('Excluir...')}>
                <FiTrash2 />
              </S.DeleteButton>
            </S.ProfessionalCard>
          ))}
        </S.ProfessionalList>
      </S.MainContent>

      <AnimatePresence>
        {popupRefeicao.userId && (
          <EditarRefeicao
            userId={popupRefeicao.userId}
            refeicaoId={popupRefeicao.refeicaoId}
            onClose={handleFecharPopup}
          />
        )}
      </AnimatePresence>
    </S.PageContainer>
  );
};

export default NutricionistasPage;