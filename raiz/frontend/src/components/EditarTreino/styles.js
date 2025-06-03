import styled from 'styled-components';
import { motion } from 'framer-motion';

export const AZUL = '#0066cc';
export const LARANJA = '#FF6B35';
export const VERDE = '#35eb21';
export const VERMELHO = '#FF3333';
export const CINZA = '#666';
export const CINZA_CLARO = '#f5f5f5';
export const CINZA_ESCURO = '#333';

export const Container = styled(motion.div)`
  width: 100%;
  max-width: 850px;
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  font-family: 'Golos Text', sans-serif;
  overflow-y: auto;
  max-height: 95vh;

  * {
    font-family: 'Golos Text', sans-serif;
    box-sizing: border-box;
  }

  h2, h3, h4 {
    color: ${CINZA_ESCURO};
    margin-top: 0;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }

  h4 {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-height: 90vh;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    h3 {
    color: ${LARANJA};
    margin-bottom: 20px;
    text-align: center;
    font-weight: 100px;
    }
  }
`;

export const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;

  .fechar-btn {
    padding: 8px 12px;
    min-width: auto;
    border-radius: 12px;
    border-color: ${VERMELHO};
    font-size: 14px;
    height: 36px;
    color: ${VERMELHO};

    svg {
      width: 20px;
      height: 80px;
    }
  }
`;

export const LogoIcon = styled.div`
  text-align: center;
  margin-bottom: 10px;
  img {
    max-width: 200px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;     
  margin-bottom: 20px;
  text-align: center;     

  h2 {
    color: ${AZUL};
    font-family: 'Golos Text', sans-serif;
    font-weight: 700;
    font-size: 1.8rem;
    margin: 0;
  }

  text-shadow: 
   2px 2px 7px rgba(5, 24, 110, 0.15),
  1px 1px 1px rgba(174, 178, 243, 0.6);

  @media (max-width: 480px) {
    h2 {
      font-size: 1.5rem;
    }
  }
`;

export const WorkoutForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${CINZA_ESCURO};
  font-size: 15px;
`;

export const Input = styled(motion.input)`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${AZUL};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

export const DatePickerWrapper = styled.div`
  input {
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.7;
      filter: invert(0.5);
      
      &:hover {
        opacity: 1;
      }
    }
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  min-height: 100px;
  background: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${AZUL};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  @media (max-width: 480px) {
    min-height: 80px;
    padding: 10px 12px;
  }
`;

export const ExerciseForm = styled.div`
  background: ${CINZA_CLARO};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #eee;
`;

export const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
`;

export const ExerciseItem = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  padding: 18px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h4 {
    margin: 0;
    color: ${CINZA_ESCURO};
    font-size: 1.1rem;
  }

  small {
    color: ${CINZA};
    font-size: 0.85rem;
    display: block;
    margin-top: 5px;
  }
`;

export const ExerciseContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 25px;
  margin-top: 15px;

  div {
    strong {
      color: ${CINZA_ESCURO};
      margin-right: 5px;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const ExerciseControls = styled.div`
  display: flex;
  gap: 8px;

  button {
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${CINZA};

    &:hover {
      background: #f5f5f5;
      color: ${AZUL};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const ExerciseRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;

  &:last-child {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    
    &:last-child {
      grid-template-columns: 1fr;
    }
  }
`;

export const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 20px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 2px solid #ccc;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: ${({ center }) => center ? 'center' : 'flex-end'};
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: center;
    margin-top: 25px;
  }
`;

export const PrimaryButton = styled(motion.button)`
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, ${AZUL}, #0080ff);
  color: white;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 102, 204, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 14px;
    min-width: 140px;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: white;
  color: ${AZUL};
  border: 2px solid ${AZUL};
  box-shadow: none;

  &:hover {
    background: #f5faff;
  }
`;

export const AddExerciseButton = styled(PrimaryButton)`
  background: transparent;
  color: ${AZUL};
  border: 2px dashed ${AZUL};
  margin-top: 15px;
  justify-content: center;
  width: 100%;
  box-shadow: none;

  &:hover {
    background: #f5faff;
    border-style: solid;
  }
`;

export const SubmitButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, ${VERDE}, #2bcb20);
  margin-top: 30px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(53, 235, 33, 0.2);

  &:hover {
    box-shadow: 0 4px 12px rgba(53, 235, 33, 0.3);
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${CINZA};
  background: ${CINZA_CLARO};
  border-radius: 10px;
  margin-bottom: 25px;

  p {
    margin-top: 10px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    padding: 30px 15px;
  }
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 20px;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #eee;
    z-index: 1;
    border-radius: 3px;
  }

  @media (max-width: 480px) {
    margin-bottom: 25px;
    padding-bottom: 15px;
  }
`;

export const Step = styled.div`
  position: relative;
  text-align: center;
  flex: 1;
  font-size: 15px;
  font-weight: ${({ active }) => active ? '600' : '400'};
  color: ${({ active }) => active ? AZUL : CINZA};
  padding-bottom: 25px;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ active }) => active ? AZUL : '#ddd'};
    border: 3px solid white;
    z-index: 2;
    transition: all 0.3s ease;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding-bottom: 20px;
  }
`;

export const ReviewContainer = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #eee;

  h2 {
    color: ${LARANJA};
    margin-bottom: 20px;
    text-align: center;
  }

  h3 {
    margin-top: 30px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

export const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;

  strong {
    font-weight: 600;
    color: ${CINZA_ESCURO};
    margin-bottom: 5px;
    display: block;
  }

  span {
    color: ${CINZA};
    word-break: break-word;
    white-space: pre-wrap;
    line-height: 1.5;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  background: #ffe5e5;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-weight: 500;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
`;
