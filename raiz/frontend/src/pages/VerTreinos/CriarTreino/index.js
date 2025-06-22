import React, { useEffect, useState } from 'react';
import axios from '../../../config/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiTrash2, FiArrowLeft, FiArrowRight, FiEdit2 } from 'react-icons/fi';
import * as S from './styles';

const CriarTreino = ({ onClose, fetchTreinos }) => {  // ✅ Adicionado fetchTreinos
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
  const [buscaExercicio, setBuscaExercicio] = useState('');
  const [carregandoExercicios, setCarregandoExercicios] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(null);
  const [editandoExercicioIndex, setEditandoExercicioIndex] = useState(null);

  const [dadosTreino, setDadosTreino] = useState({
    nome: '',
    objetivo: '',
    descricao: '',
    duracaoEstimada: '',
    exercicios: []
  });

  const [exercicioAtual, setExercicioAtual] = useState({
    id_exercicio: '',
    nome: '',
    grupo_muscular: '',
    series: 3,
    repeticoes: 10,
    carga: '',
    tempo: 30,
    descanso: 45,
    observacoes: '',
    ordem: ''
  });

  const API_URL = 'http://localhost:3001/api';

  const carregarExercicios = async () => {
    setCarregandoExercicios(true);
    setErroCarregamento(null);

    try {
      const token = localStorage.getItem('authToken'); 
      if (!token) throw new Error('Usuário não autenticado');

      const response = await axios.get(`${API_URL}/exercicios`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const exercicios = response.data.exercicios || response.data;
      setExerciciosDisponiveis(exercicios);
      setExerciciosFiltrados(exercicios);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      setErroCarregamento('Erro ao carregar exercícios. Tente novamente.');
    } finally {
      setCarregandoExercicios(false);
    }
  };

  useEffect(() => {
    carregarExercicios();
  }, []);

  useEffect(() => {
    if (!buscaExercicio.trim()) {
      setExerciciosFiltrados(exerciciosDisponiveis);
      return;
    }

    const termo = buscaExercicio.toLowerCase();
    const filtrados = exerciciosDisponiveis.filter(ex => 
      ex.nome.toLowerCase().includes(termo) ||
      (ex.grupo_muscular && ex.grupo_muscular.toLowerCase().includes(termo))
    );

    setExerciciosFiltrados(filtrados);
  }, [buscaExercicio, exerciciosDisponiveis]);

  const selecionarExercicio = (ex) => {
    setExercicioAtual({
      ...exercicioAtual,
      id_exercicio: ex.id_exercicio,
      nome: ex.nome,
      grupo_muscular: ex.grupo_muscular,
      series: 3,
      repeticoes: 10,
      carga: '',
      tempo: 30,
      descanso: 45,
      observacoes: '',
      ordem: dadosTreino.exercicios.length + 1
    });
    setBuscaExercicio(ex.nome);
  };

  const salvarExercicio = () => {
    const exercicio = {
      ...exercicioAtual,
      id_exercicio: parseInt(exercicioAtual.id_exercicio),
      series: parseInt(exercicioAtual.series),
      repeticoes: parseInt(exercicioAtual.repeticoes),
      carga: exercicioAtual.carga ? parseFloat(exercicioAtual.carga) : null,
      tempo: parseInt(exercicioAtual.tempo),
      descanso: parseInt(exercicioAtual.descanso),
      ordem: editandoExercicioIndex !== null ? dadosTreino.exercicios[editandoExercicioIndex].ordem : dadosTreino.exercicios.length + 1
    };

    if (editandoExercicioIndex !== null) {
      const novos = [...dadosTreino.exercicios];
      novos[editandoExercicioIndex] = exercicio;
      setDadosTreino({ ...dadosTreino, exercicios: novos });
    } else {
      setDadosTreino({ ...dadosTreino, exercicios: [...dadosTreino.exercicios, exercicio] });
    }

    resetarFormularioExercicio();
  };

  const editarExercicio = (i) => {
    const exerc = dadosTreino.exercicios[i];
    setExercicioAtual({ 
      ...exerc, 
      carga: exerc.carga || '',
      tempo: exerc.tempo || 30,
      descanso: exerc.descanso || 45
    });
    setEditandoExercicioIndex(i);
    setBuscaExercicio(exerc.nome);
  };

  const removerExercicio = (i) => {
    const lista = dadosTreino.exercicios.filter((_, index) => index !== i);
    setDadosTreino({ ...dadosTreino, exercicios: lista.map((e, i) => ({ ...e, ordem: i + 1 })) });
  };

  const resetarFormularioExercicio = () => {
    setExercicioAtual({
      id_exercicio: '', 
      nome: '', 
      grupo_muscular: '',
      series: 3, 
      repeticoes: 10, 
      carga: '', 
      tempo: 30,
      descanso: 45, 
      observacoes: '', 
      ordem: dadosTreino.exercicios.length + 1
    });
    setEditandoExercicioIndex(null);
    setBuscaExercicio('');
  };

  const salvarTreino = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const payload = {
        nome: dadosTreino.nome,
        objetivo: dadosTreino.objetivo,
        observacoes: dadosTreino.descricao,
        duracao_estimada: dadosTreino.duracaoEstimada,
        exercicios: dadosTreino.exercicios.map(e => ({
          exercicio_id: e.id_exercicio,
          series: e.series,
          repeticoes: e.repeticoes,
          carga: e.carga,
          tempo: e.tempo,
          tempo_descanso: e.descanso,
          observacoes: e.observacoes,
          ordem: e.ordem
        }))
      };

      await axios.post(`${API_URL}/treino/plano`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Treino criado com sucesso!');

      // ✅ Chama o fetchTreinos do pai
      fetchTreinos();

      // ✅ Fecha o modal
      onClose();

    } catch (err) {
      console.error('Erro ao salvar treino', err);
      alert('Erro ao salvar treino');
    }
  };

  return (
    <S.ModalOverlay>
      <S.ModalContainer>
        <S.ModalHeader>
          <h2>Criar Novo Treino</h2>
          <S.CloseButton onClick={onClose}><FiX /></S.CloseButton>
        </S.ModalHeader>

        <S.ProgressBar>
          <S.ProgressStep active={etapaAtual >= 1}>1 <span>Informações</span></S.ProgressStep>
          <S.ProgressStep active={etapaAtual >= 2}>2 <span>Exercícios</span></S.ProgressStep>
          <S.ProgressStep active={etapaAtual >= 3}>3 <span>Revisão</span></S.ProgressStep>
        </S.ProgressBar>

        {etapaAtual === 1 && (
          <S.EtapaContainer
            as={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <S.FormGroup>
              <label>Nome do Treino</label>
              <input 
                value={dadosTreino.nome} 
                onChange={(e) => setDadosTreino({ ...dadosTreino, nome: e.target.value })} 
                placeholder="Ex: Treino de Peito e Tríceps"
              />
            </S.FormGroup>
            <S.FormGroup>
              <label>Objetivo</label>
              <input 
                value={dadosTreino.objetivo} 
                onChange={(e) => setDadosTreino({ ...dadosTreino, objetivo: e.target.value })} 
                placeholder="Ex: Hipertrofia"
              />
            </S.FormGroup>
            <S.FormGroup>
              <label>Descrição</label>
              <textarea 
                value={dadosTreino.descricao} 
                onChange={(e) => setDadosTreino({ ...dadosTreino, descricao: e.target.value })} 
                placeholder="Descreva o treino..."
                rows={3}
              />
            </S.FormGroup>
            <S.FormGroup>
              <label>Duração Estimada (min)</label>
              <input 
                type="number" 
                value={dadosTreino.duracaoEstimada} 
                onChange={(e) => setDadosTreino({ ...dadosTreino, duracaoEstimada: e.target.value })} 
                min="1"
              />
            </S.FormGroup>
            <S.ButtonGroup>
              <S.SecondaryButton onClick={onClose}><FiX /> Cancelar</S.SecondaryButton>
              <S.PrimaryButton onClick={() => setEtapaAtual(2)}>Próximo <FiArrowRight /></S.PrimaryButton>
            </S.ButtonGroup>
          </S.EtapaContainer>
        )}

        <AnimatePresence mode="wait">
          {etapaAtual === 2 && (
            <S.EtapaContainer
              as={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <S.SearchContainer>
                <input
                  type="text"
                  value={buscaExercicio}
                  onChange={(e) => setBuscaExercicio(e.target.value)}
                  placeholder="Buscar exercício por nome ou grupo muscular..."
                />
                
                {carregandoExercicios ? (
                  <S.ExerciciosDropdown>
                    <div>Carregando exercícios...</div>
                  </S.ExerciciosDropdown>
                ) : erroCarregamento ? (
                  <S.ExerciciosDropdown>
                    <div className="error">{erroCarregamento}</div>
                  </S.ExerciciosDropdown>
                ) : buscaExercicio && (
                  <S.ExerciciosDropdown>
                    {exerciciosFiltrados.length > 0 ? (
                      exerciciosFiltrados.map((ex) => (
                        <div
                          key={ex.id_exercicio}
                          onClick={() => selecionarExercicio(ex)}
                          className="exercicio-item"
                        >
                          <strong>{ex.nome}</strong>
                          <span>{ex.grupo_muscular}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        Nenhum exercício encontrado para "{buscaExercicio}"
                      </div>
                    )}
                  </S.ExerciciosDropdown>
                )}
              </S.SearchContainer>

              {exercicioAtual.nome && (
                <S.ExercicioFormContainer>
                  <h3>{exercicioAtual.nome} <small>({exercicioAtual.grupo_muscular})</small></h3>
                  <S.ExerciseDetailsGrid>
                    <S.FormGroup>
                      <label>Séries</label>
                      <input
                        type="number"
                        min="1"
                        value={exercicioAtual.series}
                        onChange={e => setExercicioAtual({ ...exercicioAtual, series: e.target.value })}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <label>Repetições</label>
                      <input
                        type="number"
                        min="1"
                        value={exercicioAtual.repeticoes}
                        onChange={e => setExercicioAtual({ ...exercicioAtual, repeticoes: e.target.value })}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <label>Carga (kg)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercicioAtual.carga}
                        onChange={e => setExercicioAtual({ ...exercicioAtual, carga: e.target.value })}
                        placeholder="Opcional"
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <label>Tempo (s)</label>
                      <input
                        type="number"
                        min="1"
                        value={exercicioAtual.tempo}
                        onChange={e => setExercicioAtual({ ...exercicioAtual, tempo: e.target.value })}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <label>Descanso (s)</label>
                      <input
                        type="number"
                        min="0"
                        value={exercicioAtual.descanso}
                        onChange={e => setExercicioAtual({ ...exercicioAtual, descanso: e.target.value })}
                      />
                    </S.FormGroup>
                    <S.FormGroup fullWidth>
                      <label>Observações</label>
                      <textarea
                        value={exercicioAtual.observacoes}
                        onChange={e => setExercicioAtual({ ...exercicioAtual, observacoes: e.target.value })}
                        placeholder="Notas sobre a execução..."
                        rows={2}
                      />
                    </S.FormGroup>
                  </S.ExerciseDetailsGrid>
                  <S.ButtonGroup>
                    <S.SecondaryButton onClick={resetarFormularioExercicio}>Cancelar</S.SecondaryButton>
                    <S.PrimaryButton onClick={salvarExercicio}>
                      {editandoExercicioIndex !== null ? 'Atualizar' : 'Adicionar'} Exercício
                    </S.PrimaryButton>
                  </S.ButtonGroup>
                </S.ExercicioFormContainer>
              )}

              {dadosTreino.exercicios.length > 0 ? (
                <S.ExerciciosListContainer>
                  <h3>Exercícios no Treino ({dadosTreino.exercicios.length})</h3>
                  {dadosTreino.exercicios
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((ex, i) => (
                      <S.ExercicioListItem key={i}>
                        <div>
                          <strong>{ex.ordem}. {ex.nome}</strong>
                          <div className="exercise-details">
                            <span>{ex.series}x{ex.repeticoes}</span>
                            {ex.carga && <span>{ex.carga}kg</span>}
                            <span>Descanso: {ex.descanso}s</span>
                          </div>
                          {ex.observacoes && <div className="observations">{ex.observacoes}</div>}
                        </div>
                        <S.ActionsGroup>
                          <S.EditButton onClick={() => editarExercicio(i)}><FiEdit2 /></S.EditButton>
                          <S.DeleteButton onClick={() => removerExercicio(i)}><FiTrash2 /></S.DeleteButton>
                        </S.ActionsGroup>
                      </S.ExercicioListItem>
                    ))}
                </S.ExerciciosListContainer>
              ) : (
                <S.EmptyMessage>
                  <p>Nenhum exercício adicionado ainda</p>
                  <small>Busque e adicione exercícios acima</small>
                </S.EmptyMessage>
              )}

              <S.ButtonGroup>
                <S.SecondaryButton onClick={() => setEtapaAtual(1)}><FiArrowLeft /> Voltar</S.SecondaryButton>
                <S.PrimaryButton 
                  onClick={() => setEtapaAtual(3)} 
                  disabled={dadosTreino.exercicios.length === 0}
                >
                  Próximo <FiArrowRight />
                </S.PrimaryButton>
              </S.ButtonGroup>
            </S.EtapaContainer>
          )}

          {etapaAtual === 3 && (
            <S.EtapaContainer
              as={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <h3>Revisão do Treino</h3>
              
              <S.ReviewSection>
                <h4>Informações Básicas</h4>
                <div className="review-item">
                  <strong>Nome:</strong> {dadosTreino.nome || <em>Não informado</em>}
                </div>
                <div className="review-item">
                  <strong>Objetivo:</strong> {dadosTreino.objetivo || <em>Não informado</em>}
                </div>
                <div className="review-item">
                  <strong>Descrição:</strong> {dadosTreino.descricao || <em>Não informada</em>}
                </div>
                <div className="review-item">
                  <strong>Duração Estimada:</strong> {dadosTreino.duracaoEstimada ? `${dadosTreino.duracaoEstimada} minutos` : <em>Não informada</em>}
                </div>
              </S.ReviewSection>

              <S.ReviewSection>
                <h4>Exercícios ({dadosTreino.exercicios.length})</h4>
                {dadosTreino.exercicios
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((ex, i) => (
                    <div key={i} className="exercise-review">
                      <div className="exercise-header">
                        <strong>{ex.ordem}. {ex.nome}</strong>
                      </div>
                      <div className="exercise-details">
                        <span>{ex.series} séries x {ex.repeticoes} repetições</span>
                        {ex.carga && <span>Carga: {ex.carga}kg</span>}
                        <span>Descanso: {ex.descanso}s</span>
                        {ex.tempo && ex.tempo > 0 && <span>Tempo: {ex.tempo}s</span>}
                      </div>
                      {ex.observacoes && (
                        <div className="observations">
                          <strong>Observações:</strong> {ex.observacoes}
                        </div>
                      )}
                      {i < dadosTreino.exercicios.length - 1 && <hr />}
                    </div>
                  ))}
              </S.ReviewSection>

              <S.ButtonGroup>
                <S.SecondaryButton onClick={() => setEtapaAtual(2)}><FiArrowLeft /> Voltar</S.SecondaryButton>
                <S.PrimaryButton onClick={salvarTreino}><FiCheck /> Salvar Treino</S.PrimaryButton>
              </S.ButtonGroup>
            </S.EtapaContainer>
          )}
        </AnimatePresence>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default CriarTreino;