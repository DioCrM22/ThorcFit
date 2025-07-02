// index.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Sidebar from './SideBar';
import Tabs from '../../components/Tabs';
import NutritionBars from '../Alimentacao/NutritionBars';
import DaySelector from './DaySelector';
import Amigos from './Amigos';
import SolicitacoesAmizade from './SolicitacoesAmizade';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import * as S from './styles';

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
  const [waterIntake, setWaterIntake] = useState(1200); // valor inicial fixo para teste
  const [totalWaterGoal, setTotalWaterGoal] = useState(2000);
  const [editWaterGoal, setEditWaterGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(totalWaterGoal);
  const navigate = useNavigate();

  const fetchTreinosDoDia = async (diaAbreviado) => {
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/treino/planos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const treinosArray = Array.isArray(data) ? data : data.planos_treino || [];

      const treinosDoDia = treinosArray.filter(treino =>
        (treino.status === 'ativo' || treino.status === 'em-andamento')
      );

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
    await axios.post(`${API_URL}/treino/iniciar/${treino.id_plano_treino}`, {}, {
  headers: { Authorization: `Bearer ${getToken()}` }
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
  if (!treinoAtivo) return;

  try {
    const treinoFinalizado = {
      ...treinoAtivo,
      concluido: true,
      hora_fim: new Date().toISOString(),
      duracao_minutos: calcularDuracao(treinoAtivo.hora_inicio)
    };

    setTreinoAtivo(null);
    fetchTreinosDoDia(activeDay);

    alert('Treino finalizado com sucesso!');

    salvarHistoricoLocal(treinoFinalizado);  // <-- usar aqui, por exemplo

    navigate('/ver-treinos');  // Se adicionou navigate para redirecionar

  } catch (error) {
    console.error('Erro ao finalizar treino:', error);
    alert('Erro ao finalizar treino');
  }
};

const dailyNutrition = {
  protein: 50,
  carbs: 200,
  fat: 30
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

  const handleWaterChange = async (amount) => {
  const newWaterIntake = Math.max(0, Math.min(totalWaterGoal, waterIntake + amount));
  setWaterIntake(newWaterIntake);

  try {
    await axios.put(`${API_URL}/user/water-intake`, { 
      amount: newWaterIntake 
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  } catch (error) {
    console.error('Erro ao atualizar consumo de água:', error);
  }
};

const handleUpdateWaterGoal = async () => {
  if (newGoal < 500) {
    alert('A meta mínima é 500ml');
    return;
  }

  try {
    await axios.put(`${API_URL}/user/water-goal`, { 
      goal: newGoal 
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    
    setTotalWaterGoal(newGoal);
    if (waterIntake > newGoal) setWaterIntake(newGoal);
    setEditWaterGoal(false);
  } catch (error) {
    console.error('Erro ao atualizar meta de água:', error);
  }
};

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

      <Tabs tabs={['Treino', 'Hidratação' ,'Alimentação']} active={activeTab} onChange={setActiveTab} />

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

        {activeTab === 'Hidratação' && (
          <S.WaterTracker>
              <S.WaterHeader>
                <S.WaterTitle>💧 Hidratação Diária</S.WaterTitle>
                <S.EditButton onClick={() => setEditWaterGoal(true)}>🚩Editar Meta</S.EditButton>
              </S.WaterHeader>

              {editWaterGoal && (
                <S.EditPopup>
                  <p>📢 <strong>Sua nutricionista</strong> recomenda o limite diário de água com base nos seus dados.</p>
                  <label htmlFor="metaAgua">Nova meta (em ml):</label>
                  <input
                    type="number"
                    id="metaAgua"
                    value={newGoal}
                    min={500}
                    step={100}
                    onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
                  />
                  <div>
                    <button onClick={handleUpdateWaterGoal}>Salvar</button>
                    <button onClick={() => setEditWaterGoal(false)}>Cancelar</button>
                  </div>
                </S.EditPopup>
              )}

              <S.WaterContent>
                <S.WaterGlassContainer>
                  {/* Garrafa de consumo */}
                  <S.WaterGlass>
                    <S.WaterDrop top="10px" left="30%" />
                    <S.WaterDrop top="20px" left="70%" />
                    <S.GlassTop />
                    <S.GlassBody>
                      <S.WaterFill percentage={(waterIntake / totalWaterGoal) * 100}>
                        <S.BottleCapacity inside percentage={(waterIntake / totalWaterGoal) * 100}>
                          {(waterIntake / 1000).toFixed(1)}L
                        </S.BottleCapacity>
                      </S.WaterFill>
                    </S.GlassBody>
                    <S.GlassBottom />
                    <S.WaterLabel>Seu consumo</S.WaterLabel>
                  </S.WaterGlass>

                  {/* Garrafa da meta */}
                  <S.WaterGlass>
                    <S.WaterDrop top="10px" left="40%" />
                    <S.WaterDrop top="25px" left="60%" />
                    <S.GlassTop />
                    <S.GlassBody>
                      <S.WaterFill percentage={100}>
                        <S.BottleCapacity inside percentage={100}>
                          {(totalWaterGoal / 1000).toFixed(1)}L
                        </S.BottleCapacity>
                      </S.WaterFill>
                    </S.GlassBody>
                    <S.GlassBottom />
                    <S.WaterLabel>Meta diária</S.WaterLabel>
                  </S.WaterGlass>
                </S.WaterGlassContainer>

                <S.WaterControls>
                  <S.WaterButton 
                    onClick={() => handleWaterChange(-250)}
                    disabled={waterIntake <= 0}
                    aria-label="Remover água"
                  >
                    <FiMinus />
                  </S.WaterButton>

                  <S.WaterAmountControl>
                    <span>250ml</span>
                  </S.WaterAmountControl>

                  <S.WaterButton 
                    onClick={() => handleWaterChange(250)}
                    disabled={waterIntake >= totalWaterGoal}
                    aria-label="Adicionar água"
                  >
                    <FiPlus />
                  </S.WaterButton>
                </S.WaterControls>
              </S.WaterContent>
            </S.WaterTracker>
        )}

         {activeTab === 'Alimentação' && ( 
  <>
    {/* Resumo Nutricional */}
    <NutritionBars nutrition={dailyNutrition} />
  </>
)}
</S.Content>
</S.Page>
);
}