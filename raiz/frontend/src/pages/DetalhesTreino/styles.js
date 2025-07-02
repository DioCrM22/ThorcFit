import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
`;

export const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

export const Erro = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

export const Container = styled.div`
  padding: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;

export const ExercicioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ExercicioCard = styled(motion.div)`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

export const ExNome = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const ExInfo = styled.p`
  font-size: 0.95rem;
  color: #444;
`;

export const ExObs = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;
`;

export const Empty = styled.p`
  color: #888;
  font-style: italic;
  margin-top: 1rem;
`;
