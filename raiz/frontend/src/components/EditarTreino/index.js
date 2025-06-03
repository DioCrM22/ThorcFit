import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiChevronLeft, FiChevronRight, FiSend } from 'react-icons/fi';
import {
  Container,
  Header,
  LogoIcon,
  WorkoutForm,
  FormGroup,
  Label,
  Input,
  TextArea,
  ExerciseList,
  ExerciseItem,
  ExerciseHeader,
  ExerciseContent,
  ExerciseRow,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  AddExerciseButton,
  EmptyMessage,
  TitleBar,
  StepIndicator,
  Step,
  ReviewContainer,
  ReviewItem,
  DatePickerWrapper,
  ExerciseForm,
  SubmitButton,
  Separator,
} from './styles';

const EditarTreino = ({ userId, workoutId, tipoUsuario, alunosDisponiveis = [], onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [workout, setWorkout] = useState({
    nome: 'Treino de Hipertrofia',
    objetivo: 'Ganho de massa muscular',
    observacoes: 'Focar na execução correta movimentos',
    data_criacao: new Date().toISOString().split('T')[0],
    exercicios: [
      {
        nome: 'Supino Reto',
        grupo_muscular: 'Peito',
        series: 4,
        repeticoes: 10,
        carga_kg: 30,
        equipamento: 'Barra olímpica',
        descanso_segundos: 60
      },
      {
        nome: 'Agachamento Livre',
        grupo_muscular: 'Pernas',
        series: 4,
        repeticoes: 12,
        carga_kg: 40,
        equipamento: 'Barra',
        descanso_segundos: 90
      }
    ]
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
      nome: '',
      grupo_muscular: '',
      series: 3,
      repeticoes: 12,
      carga_kg: '',
      equipamento: '',
      descanso_segundos: 60
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const treinoPayload = {
    ...workout,
    criado_por: userId,
    data_criacao: workout.data_criacao,
  };

  try {
    if (tipoUsuario === 'treinador') {
      if (!alunosSelecionados || alunosSelecionados.length === 0) {
        alert('Selecione pelo menos um aluno para enviar o treino.');
        return;
      }

      for (const alunoId of alunosSelecionados) {
        await fetch('/api/treinos/para-aluno', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alunoId, treino: treinoPayload }),
        });
      }
    } else {
      await fetch('/api/treinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, treino: treinoPayload }),
      });
    }

    onSave(workout);
    onClose();
  } catch (error) {
    console.error('Erro ao salvar o treino:', error);
    alert('Erro ao salvar o treino. Tente novamente.');
  }
};


  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FormGroup>
              <Label>Nome do Treino</Label>
              <Input 
                name="nome" 
                value={workout.nome} 
                onChange={handleInputChange} 
                required 
              />
            </FormGroup>

            <FormGroup>
              <Label>Data de Criação</Label>
              <DatePickerWrapper>
                <Input 
                  type="date" 
                  name="data_criacao" 
                  value={workout.data_criacao} 
                  onChange={handleInputChange} 
                  required 
                />
              </DatePickerWrapper>
            </FormGroup>

            <FormGroup>
              <Label>Objetivo</Label>
              <Input 
                name="objetivo" 
                value={workout.objetivo} 
                onChange={handleInputChange} 
                required 
              />
            </FormGroup>

            <FormGroup>
              <Label>Observações</Label>
              <TextArea 
                name="observacoes" 
                value={workout.observacoes} 
                onChange={handleInputChange} 
                rows="3" 
              />
            </FormGroup>

          {tipoUsuario === 'treinador' && (
            <FormGroup>
              <Label>Selecionar Alunos</Label>
              <select
                multiple
                value={alunosSelecionados}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                  setAlunosSelecionados(selected);
                }}
              >
                {alunosDisponiveis.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </FormGroup>
          )}
          </>
        );
      case 2:
        return (
          <>
            <h3>Adicionar Exercício</h3>
            <ExerciseForm>
              <FormGroup>
                <Label>Nome do Exercício</Label>
                <Input 
                  name="nome" 
                  value={newExercise.nome} 
                  onChange={handleExerciseInputChange} 
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>Grupo Muscular</Label>
                <Input 
                  name="grupo_muscular" 
                  value={newExercise.grupo_muscular} 
                  onChange={handleExerciseInputChange} 
                  required 
                />
              </FormGroup>

              <ExerciseRow>
                <FormGroup>
                  <Label>Carga (kg)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.5"
                    name="carga_kg" 
                    value={newExercise.carga_kg} 
                    onChange={handleExerciseInputChange} 
                    placeholder="0"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Equipamento (opcional)</Label>
                  <Input 
                    name="equipamento" 
                    value={newExercise.equipamento} 
                    onChange={handleExerciseInputChange} 
                    placeholder="Ex: Barra, Halteres"
                  />
                </FormGroup>
              </ExerciseRow>

              <ExerciseRow>
                <FormGroup>
                  <Label>Séries</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    name="series" 
                    value={newExercise.series} 
                    onChange={handleExerciseInputChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Repetições</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    name="repeticoes" 
                    value={newExercise.repeticoes} 
                    onChange={handleExerciseInputChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Descanso (seg)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    name="descanso_segundos" 
                    value={newExercise.descanso_segundos} 
                    onChange={handleExerciseInputChange} 
                    required 
                  />
                </FormGroup>
              </ExerciseRow>

              <AddExerciseButton 
                type="button" 
                onClick={handleAddExercise}
                disabled={!newExercise.nome || !newExercise.grupo_muscular}
              >
                <FiPlus /> Adicionar Exercício
              </AddExerciseButton>
            </ExerciseForm>

            <h3>Exercícios Adicionados</h3>
            {workout.exercicios.length === 0 ? (
              <EmptyMessage>
                <p>Nenhum exercício adicionado ainda</p>
              </EmptyMessage>
            ) : (
              <ExerciseList>
                <AnimatePresence>
                  {workout.exercicios.map((exercise, index) => (
                    <ExerciseItem
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExerciseHeader>
                        <div>
                          <h4>{exercise.nome}</h4>
                          <small>{exercise.grupo_muscular}</small>
                        </div>
                      </ExerciseHeader>

                      <ExerciseContent>
                        <div>
                          <strong>Carga:</strong> {exercise.carga_kg || '0'} kg
                        </div>
                        {exercise.equipamento && (
                          <div>
                            <strong>Equipamento:</strong> {exercise.equipamento}
                          </div>
                        )}
                        <div>
                          <strong>Séries:</strong> {exercise.series}
                        </div>
                        <div>
                          <strong>Repetições:</strong> {exercise.repeticoes}
                        </div>
                        <div>
                          <strong>Descanso:</strong> {exercise.descanso_segundos || '60'} seg
                        </div>
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
            <h2>Revisão Final do Treino</h2>

            <Separator></Separator>
            
            <ReviewItem>
              <strong>Nome do Treino:</strong>
              <span>{workout.nome}</span>
            </ReviewItem>
            
            <ReviewItem>
              <strong>Data:</strong>
              <span>{new Date(workout.data_criacao).toLocaleDateString('pt-BR')}</span>
            </ReviewItem>
            
            <ReviewItem>
              <strong>Objetivo:</strong>
              <span>{workout.objetivo}</span>
            </ReviewItem>
            
            {workout.observacoes && (
              <ReviewItem>
                <strong>Observações:</strong>
                <span>{workout.observacoes}</span>
              </ReviewItem>
            )}
            
            <h3>Exercícios</h3>
            {workout.exercicios.length === 0 ? (
              <EmptyMessage>
                <p>Nenhum exercício adicionado</p>
              </EmptyMessage>
            ) : (
              <ExerciseList>
                <AnimatePresence>
                  {workout.exercicios.map((exercise, index) => (
                    <ExerciseItem
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExerciseHeader>
                        <div>
                          <h4>{exercise.nome}</h4>
                          <small>{exercise.grupo_muscular}</small>
                        </div>
                      </ExerciseHeader>

                      <ExerciseContent>
                        <div>
                          <strong>Carga:</strong> {exercise.carga_kg || '0'} kg
                        </div>
                        {exercise.equipamento && (
                          <div>
                            <strong>Equipamento:</strong> {exercise.equipamento}
                          </div>
                        )}
                        <div>
                          <strong>Séries:</strong> {exercise.series}
                        </div>
                        <div>
                          <strong>Repetições:</strong> {exercise.repeticoes}
                        </div>
                        <div>
                          <strong>Descanso:</strong> {exercise.descanso_segundos || '60'} seg
                        </div>
                      </ExerciseContent>
                    </ExerciseItem>
                  ))}
                </AnimatePresence>
              </ExerciseList>
            )}

            <SubmitButton type="submit">
              <FiSend /> {tipoUsuario === 'treinador' ? 'Enviar Treino para Aluno(s)' : 'Salvar Treino'}
            </SubmitButton>
          </ReviewContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <TitleBar>
        <SecondaryButton onClick={onClose} className="fechar-btn">
          <FiX />
        </SecondaryButton>
      </TitleBar>

      <LogoIcon>
        <img src="/assets/images/logo.png" alt="Logo" />
      </LogoIcon>

      <Header>
        <h2>{workoutId ? 'Editar Treino' : 'Criar Plano de Treino'}</h2>
      </Header>

      <StepIndicator>
        <Step active={step === 1}>1. Informações</Step>
        <Step active={step === 2}>2. Exercícios</Step>
        <Step active={step === 3}>3. Revisão</Step>
      </StepIndicator>

      <WorkoutForm onSubmit={handleSubmit}>
        {renderStep()}

        <ButtonGroup>
          {step > 1 && (
            <SecondaryButton type="button" onClick={prevStep}>
              <FiChevronLeft /> Voltar
            </SecondaryButton>
          )}
          
          {step < 3 ? (
            <PrimaryButton type="button" onClick={nextStep}>
              Próximo <FiChevronRight />
            </PrimaryButton>
          ) : null}
        </ButtonGroup>
      </WorkoutForm>
    </Container>
  );
};

export default EditarTreino;