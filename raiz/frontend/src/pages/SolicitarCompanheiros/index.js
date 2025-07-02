import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  BackButton,
  Logo,
  SearchContainer,
  SearchInput,
  FilterGroup,
  FilterButton,
  UserList,
  UserCard,
  UserImage,
  UserInfo,
  ActionGroup,
  AddButton,
  DeleteButton,
  CheckBadge
} from './styles';

import { FaUserPlus, FaTrashAlt, FaCheck, FaArrowLeft } from 'react-icons/fa';

export default function SolicitarCompanheiros() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [solicitados, setSolicitados] = useState(new Set());

  // MOCK com imagens de exemplo
  const profissionais = [
  { id: 1, nome: 'João Personal', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=1', vinculado: false },
  { id: 2, nome: 'Maria Nutricionista', tipoConta: 'nutricionistas', fotoPerfil: 'https://i.pravatar.cc/70?img=2', vinculado: true },
  { id: 3, nome: 'Pedro Personal', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=3', vinculado: false },
  { id: 4, nome: 'Ana Silva', tipoConta: 'nutricionistas', fotoPerfil: 'https://i.pravatar.cc/70?img=4', vinculado: false },
  { id: 5, nome: 'Carlos Souza', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=5', vinculado: true },
  { id: 6, nome: 'Fernanda Lima', tipoConta: 'nutricionistas', fotoPerfil: 'https://i.pravatar.cc/70?img=6', vinculado: false },
  { id: 7, nome: 'Lucas Oliveira', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=7', vinculado: false },
  { id: 8, nome: 'Beatriz Santos', tipoConta: 'nutricionistas', fotoPerfil: 'https://i.pravatar.cc/70?img=8', vinculado: true },
  { id: 9, nome: 'Rafael Pereira', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=9', vinculado: false },
  { id: 10, nome: 'Juliana Costa', tipoConta: 'nutricionistas', fotoPerfil: 'https://i.pravatar.cc/70?img=10', vinculado: false },
  { id: 11, nome: 'Gustavo Martins', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=11', vinculado: true },
  { id: 12, nome: 'Patrícia Almeida', tipoConta: 'nutricionistas', fotoPerfil: 'https://i.pravatar.cc/70?img=12', vinculado: false },
  { id: 13, nome: 'André Fernandes', tipoConta: 'personais', fotoPerfil: 'https://i.pravatar.cc/70?img=13', vinculado: false },
];


   const filtrarProfissionais = () => {
    return profissionais.filter((p) => {
      const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());
      const filtroMatch =
        filtro === 'todos' ||
        (filtro === 'personais' && p.tipoConta === 'personais') ||
        (filtro === 'nutricionistas' && p.tipoConta === 'nutricionistas');
      return nomeMatch && filtroMatch;
    });
  };

  function toggleSolicitacao(id) {
    setSolicitados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft size={22} />
        </BackButton>
        <Logo src="/assets/images/logo.png" alt="Logo" />
      </Header>

      <SearchContainer>
        <SearchInput
          placeholder="Buscar por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </SearchContainer>

      <FilterGroup>
        <FilterButton active={filtro === 'todos'} onClick={() => setFiltro('todos')}>
          Todos
        </FilterButton>
        <FilterButton active={filtro === 'personais'} onClick={() => setFiltro('personais')}>
          Personais
        </FilterButton>
        <FilterButton active={filtro === 'nutricionistas'} onClick={() => setFiltro('nutricionistas')}>
          Nutricionistas
        </FilterButton>
      </FilterGroup>

      <UserList>
        <AnimatePresence>
          {filtrarProfissionais().map((p) => {
            const pedidoEnviado = solicitados.has(p.id);
            return (
              <UserCard key={p.id}>
                <UserImage src={p.fotoPerfil} alt={`${p.nome} foto`} />
                <UserInfo>
                  <h4>{p.nome}</h4>
                  <p>{p.tipoConta.charAt(0).toUpperCase() + p.tipoConta.slice(1)}</p>
                </UserInfo>
                <ActionGroup>
                  {pedidoEnviado ? (
                    <DeleteButton onClick={() => toggleSolicitacao(p.id)} whileTap={{ scale: 0.95 }}>
                      <FaTrashAlt size={14} />
                      Remover
                    </DeleteButton>
                  ) : (
                    <AddButton onClick={() => toggleSolicitacao(p.id)} whileTap={{ scale: 0.95 }}>
                      <FaUserPlus size={14} />
                      Adicionar
                    </AddButton>
                  )}
                </ActionGroup>
                {pedidoEnviado && (
                  <CheckBadge style={{ backgroundColor: '#2196F3', color: 'white' }}>
                    <FaCheck size={12} />
                  </CheckBadge>
                )}
              </UserCard>
            );
          })}
        </AnimatePresence>
      </UserList>
    </Container>
  );
}