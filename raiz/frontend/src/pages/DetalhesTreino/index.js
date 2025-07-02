import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './styles';

export default function DetalhesTreino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchTreino = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`http://localhost:3001/api/treino/plano/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Plano retornado:", data);
        setTreino(data.plano || null); // Ajustado pra pegar plano correto
      } catch (err) {
        setErro('Erro ao carregar treino.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreino();
  }, [id]);

  if (loading) return <S.Loading>Carregando treino...</S.Loading>;
  if (erro) return <S.Erro>{erro}</S.Erro>;
  if (!treino) return <S.Erro>Treino não encontrado.</S.Erro>;

  return (
    <S.Page>
      <NavBar title="Detalhes do Treino" showBack onBack={() => navigate(-1)} />
      <S.Container>
        <S.Title>{treino.nome}</S.Title>
        {treino.descricao && <S.Description>{treino.descricao}</S.Description>}

        <S.SectionTitle>Exercícios</S.SectionTitle>

        <S.ExercicioList>
          {Array.isArray(treino.exercicios_treino) && treino.exercicios_treino.length > 0 ? (
            treino.exercicios_treino.map((item, index) => {
              const ex = item.exercicio;
              return (
                <S.ExercicioCard
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <S.ExNome>{ex?.nome || 'Exercício sem nome'}</S.ExNome>
                  <S.ExInfo>Grupo muscular: {ex?.grupo_muscular || '-'}</S.ExInfo>
                  <S.ExInfo>Séries: {item.series} | Repetições: {item.repeticoes}</S.ExInfo>
                  {item.carga && <S.ExInfo>Carga: {item.carga} kg</S.ExInfo>}
                  {item.tempo_descanso && <S.ExInfo>Descanso: {item.tempo_descanso} s</S.ExInfo>}
                  {item.observacoes && <S.ExObs>Obs: {item.observacoes}</S.ExObs>}
                </S.ExercicioCard>
              );
            })
          ) : (
            <S.Empty>Nenhum exercício cadastrado.</S.Empty>
          )}
        </S.ExercicioList>
      </S.Container>
    </S.Page>
  );
}
