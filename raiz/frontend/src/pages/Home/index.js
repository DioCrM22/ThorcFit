// index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Sidebar from './SideBar';
import Tabs from '../../components/Tabs';
import DaySelector from './DaySelector';
import Amigos from './Amigos';
import SolicitacoesAmizade from './SolicitacoesAmizade';
import * as S from './styles';
import { FiX } from 'react-icons/fi';

const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const API_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('authToken');

const getDiaAbreviado = () => diasSemana[new Date().getDay()];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Treino');
  const [activeDay, setActiveDay] = useState(getDiaAbreviado());
  const [showAmigos, setShowAmigos] = useState(false);
  const [showSolicitacoes, setShowSolicitacoes] = useState(false);
  const [treinosDia, setTreinosDia] = useState([]);
  const [treinoAtivo, setTreinoAtivo] = useState(null);
  const [checkboxes, setCheckboxes] = useState({});

  const fetchTreinosDoDia = async (diaAbreviado) => {
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/treino/planos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const treinosArray = Array.isArray(data) ? data : data.planos_treino || [];

      const treinosDoDia = treinosArray.filter(treino => {
        const dataTreino = new Date(treino.data_criacao);
        const dia = diasSemana[dataTreino.getDay()];
        return dia === diaAbreviado && !treino.finalizado;
      });

      setTreinosDia(treinosDoDia);
    } catch (error) {
      console.error('Erro ao buscar treinos do dia:', error);
    }
  };

  const fetchDetalhesExercicios = async (exercicios) => {
      const token = getToken();
      if (!token) return [];

      // Extrair id_exercicio de dentro de exercicio se necessário
      const exerciciosValidos = exercicios
        .map(ex => ex.exercicio?.id_exercicio || ex.id_exercicio)
        .filter(id => id !== undefined && id !== null);

      const requests = exerciciosValidos.map((id_exercicio) =>
        axios.get(`${API_URL}/exercicios/${id_exercicio}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.data.exercicio).catch(() => null)
      );

      const resultados = await Promise.all(requests);
      return resultados.filter(r => r !== null);
    };


  const handleIniciarTreino = async (treino) => {
  if (!treino || !Array.isArray(treino.exercicios_treino)) return;
  if (treinoAtivo?.id_plano_treino === treino.id_plano_treino) return;

  try {
    // 1. Busca os detalhes completos dos exercícios
    const detalhesCompletos = await fetchDetalhesExercicios(treino.exercicios_treino);

    // 2. Mapeia os exercícios com seus detalhes
    const exerciciosDetalhados = treino.exercicios_treino.map((exercicioPlano) => {
      const idExercicio = exercicioPlano.exercicio?.id_exercicio || exercicioPlano.id_exercicio;
      const info = detalhesCompletos.find(d => d.id_exercicio === idExercicio);
      return {
        ...exercicioPlano,
        nome: info?.nome || exercicioPlano.exercicio?.nome  ||'',
        grupo_muscular: info?.grupo_muscular || exercicioPlano.exercicio?.grupo_muscular || '',
      };
    });

    // 3. Atualiza o estado com o treino ativo
    setTreinoAtivo({ 
      ...treino,
      exercicios_treino: exerciciosDetalhados,
      id_historico: Date.now() // ID temporário baseado no timestamp
    });

    // 4. Inicializa os checkboxes como não marcados
    const estadoInicial = {};
    exerciciosDetalhados.forEach((_, i) => estadoInicial[i] = false);
    setCheckboxes(estadoInicial);

  } catch (error) {
    console.error('Erro ao preparar treino:', error);
    // Adicione feedback visual para o usuário
    alert('Erro ao preparar treino. Por favor, tente novamente.');
  }
};

const handleCheckboxChange = async (index) => {
  setCheckboxes(prev => {
    const novoEstado = { ...prev, [index]: !prev[index] };
    return novoEstado;
  });
};

const handleFinalizarTreino = async () => {
  if (!treinoAtivo) {
    console.error('Erro: treino ativo não definido');
    return;
  }

  try {
    // 1. Atualiza o estado localmente
    const treinoFinalizado = {
      ...treinoAtivo,
      concluido: true,
      hora_fim: new Date().toISOString(),
      duracao_minutos: calcularDuracao(treinoAtivo.hora_inicio) // Função auxiliar
    };

    // 2. Limpa o treino ativo
    setTreinoAtivo(null);

    // 3. Atualiza a lista de treinos do dia
    fetchTreinosDoDia(activeDay);

    // 4. Feedback visual
    alert('Treino finalizado com sucesso!');

    // Opcional: Você pode salvar localmente no localStorage
    salvarHistoricoLocal(treinoFinalizado);

  } catch (error) {
    console.error('Erro ao finalizar treino:', error);
    alert('Erro ao finalizar treino');
  }
};

// Funções auxiliares
const calcularDuracao = (horaInicio) => {
  const inicio = new Date(horaInicio);
  const fim = new Date();
  return Math.floor((fim - inicio) / 1000 / 60); // Duração em minutos
};

const salvarHistoricoLocal = (treino) => {
  const historico = JSON.parse(localStorage.getItem('historicoTreinos') || '[]');
  historico.push(treino);
  localStorage.setItem('historicoTreinos', JSON.stringify(historico));
};

  useEffect(() => {
    fetchTreinosDoDia(activeDay);
  }, [activeDay]);

  return (
    <S.Page>
    <NavBar title="THORC FIT" showBack={false} showMenu onMenu={() => setSidebarOpen(true)} />
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <S.Content>
      <S.FloatingButtons>
        <S.SolicitacoesButton whileTap={{ scale: 0.9 }} onClick={() => setShowSolicitacoes(!showSolicitacoes)}>✉️</S.SolicitacoesButton>
        <S.AmigosButton whileTap={{ scale: 0.9 }} onClick={() => setShowAmigos(!showAmigos)}>👥</S.AmigosButton>
      </S.FloatingButtons>

      {showSolicitacoes && <SolicitacoesAmizade />}
      {showAmigos && <Amigos />}

      <S.CenteredLogo>
        <img src="/assets/images/logo.png" alt="Logo ThorcFit" />
        <S.SectionTitle>ROTINA</S.SectionTitle>
      </S.CenteredLogo>

      <Tabs tabs={['Treino', 'Alimentação']} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Treino' && (
        <>
          <DaySelector days={diasSemana} activeDay={activeDay} onSelect={setActiveDay} />

          {treinoAtivo ? (
            <S.TreinoFullscreen>
              <S.TreinoHeader>
                <h3>{treinoAtivo.nome}</h3>
                <S.ButtonSair onClick={() => setTreinoAtivo(null)}><FiX /></S.ButtonSair>
              </S.TreinoHeader>

              <S.TreinoTopo>
                <p><strong>Descrição:</strong> {treinoAtivo.descricao}</p>
                <p><strong>Duração Estimada:</strong> {treinoAtivo.duracao_estimada || 'N/A'} minutos</p>
              </S.TreinoTopo>

              <S.ExerciciosList>
                  {treinoAtivo.exercicios_treino.map((ex, index) => (
                    <S.TreinoCard key={index}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checkboxes[index] || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </label>
                      <S.ExercicioInfo>
                        <S.ExercicioTopo>
                          <h4>{ex.exercicio.nome} - {ex.exercicio.grupo_muscular}</h4>
                        </S.ExercicioTopo>
                        <div>
                          <p><strong>Séries:</strong> {ex.series}</p>
                          <p><strong>Repetições:</strong> {ex.repeticoes}</p>
                          {ex.carga && <p><strong>Carga:</strong> {ex.carga}kg</p>}
                          <p><strong>Descanso:</strong> {ex.tempo_descanso || ex.descanso}s</p>
                          {ex.observacoes && <p><strong>Observações:</strong> {ex.observacoes}</p>}
                        </div>
                      </S.ExercicioInfo>
                    </S.TreinoCard>
                  ))}
                </S.ExerciciosList>

              <S.ButtonFinalizarSozinho onClick={handleFinalizarTreino}>
                Finalizar Treino
              </S.ButtonFinalizarSozinho>
            </S.TreinoFullscreen>
          ) : (
            <S.DayTreinos>
              {treinosDia.length > 0 ? (
                treinosDia.map((treino) => (
                  <S.TreinoCard key={treino.id_plano_treino}>
                    <div>
                      <S.TreinoTipo>{treino.tipo?.toUpperCase() || 'PESSOAL'}</S.TreinoTipo>
                      <S.TreinoNome>{treino.nome}</S.TreinoNome>
                      <S.TreinoObjetivo>{treino.objetivo}</S.TreinoObjetivo>
                      <S.TreinoDetail>💪 {treino.exercicios_treino?.length || 0} exercício(s)</S.TreinoDetail>
                    </div>
                    <S.VerTreinoButton onClick={() => handleIniciarTreino(treino)}>Iniciar</S.VerTreinoButton>
                  </S.TreinoCard>
                ))
              ) : (
                <S.EmptyMessage>Sem treinos neste dia</S.EmptyMessage>
              )}
            </S.DayTreinos>
          )}
        </>
      )}

        {activeTab === 'Alimentação' && (
          <S.EmptyMessage>Plano alimentar ainda não disponível.</S.EmptyMessage>
        )}
      </S.Content>
    </S.Page>
  );
}
