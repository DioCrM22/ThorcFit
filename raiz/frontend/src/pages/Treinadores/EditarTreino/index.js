import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import {
  Container, FormGroup, Label, Input, TextArea, ExerciseList, ExerciseItem,
  ExerciseHeader, ExerciseContent, ExerciseRow, AddExerciseButton,
  EmptyMessage, ReviewContainer, ReviewItem, DatePickerWrapper, ExerciseForm,
  SubmitButton, Separator
} from './styles';

const EditarTreino = ({ userId, workoutId, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState({
    nome: '',
    objetivo: '',
    observacoes: '',
    data_criacao: '',
    exercicios: []
  });

  const [newExercise, setNewExercise] = useState({
    nome: '',
    grupo_muscular: '',
    series: 3,
    repeticoes: 12,
    carga_kg: '',
    equipamento: '',
    descanso_segundos: 60
  });

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const { data } = await axios.get(`/api/treinos/${workoutId}`);
        setWorkout({
          nome: data.nome,
          objetivo: data.objetivo,
          observacoes: data.observacoes || '',
          data_criacao: data.data_criacao.split('T')[0],
          exercicios: data.exercicios || []
        });
      } catch (err) {
        alert('Erro ao carregar o treino.');
      } finally {
        setLoading(false);
      }
    };

    if (workoutId) {
      fetchWorkout();
    }
  }, [workoutId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkout(prev => ({ ...prev, [name]: value }));
  };

  const handleExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = () => {
    if (!newExercise.nome || !newExercise.grupo_muscular) return;
    setWorkout(prev => ({
      ...prev,
      exercicios: [...prev.exercicios, { ...newExercise }]
    }));
    setNewExercise({
      nome: '', grupo_muscular: '', series: 3, repeticoes: 12,
      carga_kg: '', equipamento: '', descanso_segundos: 60
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/treinos/${workoutId}`, {
        nome: workout.nome,
        objetivo: workout.objetivo,
        observacoes: workout.observacoes,
        data_criacao: workout.data_criacao,
        exercicios: workout.exercicios
      });
      alert('Treino atualizado com sucesso!');
      onClose();
    } catch (err) {
      alert('Erro ao atualizar o treino.');
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    if (loading) return <p>Carregando...</p>;

    switch (step) {
      case 1:
        return (
          <>
            <FormGroup>
              <Label>Nome do Treino</Label>
              <Input name="nome" value={workout.nome} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Data de Criação</Label>
              <DatePickerWrapper>
                <Input type="date" name="data_criacao" value={workout.data_criacao} onChange={handleInputChange} required />
              </DatePickerWrapper>
            </FormGroup>
            <FormGroup>
              <Label>Objetivo</Label>
              <Input name="objetivo" value={workout.objetivo} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Observações</Label>
              <TextArea name="observacoes" value={workout.observacoes} onChange={handleInputChange} rows="3" />
            </FormGroup>
          </>
        );

      case 2:
        return (
          <>
            <h3>Adicionar Exercício</h3>
            <ExerciseForm>
              <FormGroup>
                <Label>Nome do Exercício</Label>
                <Input name="nome" value={newExercise.nome} onChange={handleExerciseInputChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Grupo Muscular</Label>
                <Input name="grupo_muscular" value={newExercise.grupo_muscular} onChange={handleExerciseInputChange} required />
              </FormGroup>
              <ExerciseRow>
                <FormGroup>
                  <Label>Carga (kg)</Label>
                  <Input type="number" min="0" name="carga_kg" value={newExercise.carga_kg} onChange={handleExerciseInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Equipamento</Label>
                  <Input name="equipamento" value={newExercise.equipamento} onChange={handleExerciseInputChange} />
                </FormGroup>
              </ExerciseRow>
              <ExerciseRow>
                <FormGroup>
                  <Label>Séries</Label>
                  <Input type="number" name="series" value={newExercise.series} onChange={handleExerciseInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Repetições</Label>
                  <Input type="number" name="repeticoes" value={newExercise.repeticoes} onChange={handleExerciseInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Descanso (seg)</Label>
                  <Input type="number" name="descanso_segundos" value={newExercise.descanso_segundos} onChange={handleExerciseInputChange} />
                </FormGroup>
              </ExerciseRow>
              <AddExerciseButton onClick={handleAddExercise} disabled={!newExercise.nome || !newExercise.grupo_muscular}>
                <FiPlus /> Adicionar Exercício
              </AddExerciseButton>
            </ExerciseForm>

            <h3>Exercícios Adicionados</h3>
            {workout.exercicios.length === 0 ? (
              <EmptyMessage><p>Nenhum exercício adicionado ainda</p></EmptyMessage>
            ) : (
              <ExerciseList>
                <AnimatePresence>
                  {workout.exercicios.map((exercise, index) => (
                    <ExerciseItem key={index}>
                      <ExerciseHeader>
                        <div>
                          <h4>{exercise.nome}</h4>
                          <small>{exercise.grupo_muscular}</small>
                        </div>
                      </ExerciseHeader>
                      <ExerciseContent>
                        <div><strong>Carga:</strong> {exercise.carga_kg || 0} kg</div>
                        {exercise.equipamento && <div><strong>Equipamento:</strong> {exercise.equipamento}</div>}
                        <div><strong>Séries:</strong> {exercise.series}</div>
                        <div><strong>Repetições:</strong> {exercise.repeticoes}</div>
                        <div><strong>Descanso:</strong> {exercise.descanso_segundos || 60} seg</div>
                      </ExerciseContent>
                    </ExerciseItem>
                  ))}
                </AnimatePresence>
              </ExerciseList>
            )}
          </>
        );

      case 3:
        return (
          <ReviewContainer>
            <h2>Revisão Final</h2>
            <Separator />
            <ReviewItem><strong>Nome:</strong> <span>{workout.nome}</span></ReviewItem>
            <ReviewItem><strong>Data:</strong> <span>{new Date(workout.data_criacao).toLocaleDateString('pt-BR')}</span></ReviewItem>
            <ReviewItem><strong>Objetivo:</strong> <span>{workout.objetivo}</span></ReviewItem>
            {workout.observacoes && <ReviewItem><strong>Observações:</strong> <span>{workout.observacoes}</span></ReviewItem>}
            <h3>Exercícios</h3>
            {workout.exercicios.length === 0 ? (
              <EmptyMessage><p>Nenhum exercício adicionado</p></EmptyMessage>
            ) : (
              <ExerciseList>
                <AnimatePresence>
                  {workout.exercicios.map((exercise, index) => (
                    <ExerciseItem key={index}>
                      <ExerciseHeader>
                        <div><h4>{exercise.nome}</h4><small>{exercise.grupo_muscular}</small></div>
                      </ExerciseHeader>
                      <ExerciseContent>
                        <div><strong>Carga:</strong> {exercise.carga_kg || 0} kg</div>
                        <div><strong>Séries:</strong> {exercise.series}</div>
                        <div><strong>Repetições:</strong> {exercise.repeticoes}</div>
                        <div><strong>Descanso:</strong> {exercise.descanso_segundos} seg</div>
                      </ExerciseContent>
                    </ExerciseItem>
                  ))}
                </AnimatePresence>
              </ExerciseList>
            )}
            <SubmitButton type="button" onClick={handleSubmit}>Salvar Treino</SubmitButton>
          </ReviewContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          {step > 1 && <button type="button" onClick={prevStep}>Voltar</button>}
          {step < 3 && <button type="button" onClick={nextStep}>Próximo</button>}
        </div>
      </form>
    </Container>
  );
};

export default EditarTreino;
