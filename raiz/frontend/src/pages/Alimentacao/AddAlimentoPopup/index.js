// src/pages/Alimentacao/AddAlimentoPopup/index.js
import React, { useState, useEffect } from 'react';
import * as S from './styles';
import { FiPlusCircle } from 'react-icons/fi';
import CadastroAlimentoPopup from '../CadastroAlimentoPopup';

const API_URL = 'http://localhost:3001/api/alimentos';

export default function AddAlimentoPopup({ isOpen, onClose, onSave, mealId }) {
  const [alimentos, setAlimentos] = useState([]);
  const [selectedAlimento, setSelectedAlimento] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [porcao, setPorcao] = useState('g');
  const [showCadastro, setShowCadastro] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('authToken');

  useEffect(() => {
    if (!isOpen) return;

    const fetchAlimentos = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar alimentos');
        }

        const data = await response.json();
        setAlimentos(data.alimentos || []);
      } catch (error) {
        console.error(error.message);
        alert('Erro ao carregar alimentos. Verifique a conexão ou token.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlimentos();
  }, [isOpen]);

  if (!isOpen) return null;

  const alimentoObj = alimentos.find(a => a.id_alimento === +selectedAlimento);

  const handleSubmit = e => {
    e.preventDefault();
    if (!alimentoObj || !quantidade) return;

    const fator = parseFloat(quantidade) / 100;
    const newFood = {
      id_alimento: alimentoObj.id_alimento,
      nome: alimentoObj.nome,
      quantidade: parseFloat(quantidade),
      porcao,
      calorias: Math.round(alimentoObj.calorias * fator),
      proteinas: +(alimentoObj.proteinas * fator).toFixed(1),
      carboidratos: +(alimentoObj.carboidratos * fator).toFixed(1),
      gorduras: +(alimentoObj.gorduras * fator).toFixed(1)
    };

    onSave(newFood);

    setSelectedAlimento('');
    setQuantidade('');
    setPorcao('g');
    onClose();
  };

  const handleNovoAlimento = () => setShowCadastro(true);

  const handleAlimentoCadastrado = novo => {
    const novoComId = { ...novo, id_alimento: Date.now() };
    const updated = [...alimentos, novoComId];
    setAlimentos(updated);
    setSelectedAlimento(novoComId.id_alimento.toString());
    setShowCadastro(false);
  };

  return (
    <>
      <S.Overlay>
        <S.Modal>
          <S.Bubble /><S.Bubble />
          <S.Header>
            <h2>Adicionar Alimento</h2>
            <S.CloseButton onClick={onClose}>✕</S.CloseButton>
          </S.Header>

          <S.Form onSubmit={handleSubmit}>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
              {loading ? (
                <p>Carregando alimentos...</p>
              ) : (
                <>
                  <S.InputContainer>
                    <S.Label>Alimento</S.Label>
                    <S.InputWrapper>
                      <S.Select
                        value={selectedAlimento}
                        onChange={e => {
                          setSelectedAlimento(e.target.value);
                          const a = alimentos.find(x => x.id_alimento === +e.target.value);
                          setPorcao(a?.unidade_medida || 'g');
                        }}
                        required
                      >
                        <option value="">Selecione um alimento</option>
                        {alimentos.map(a => (
                          <option key={a.id_alimento} value={a.id_alimento}>
                            {a.nome} ({Math.round(a.calorias)} kcal/100{a.unidade_medida})
                          </option>
                        ))}
                      </S.Select>
                    </S.InputWrapper>
                  </S.InputContainer>

                  <S.InputContainer>
                    <S.Label>Quantidade</S.Label>
                    <S.InputWrapper>
                      <S.Input
                        type="number"
                        value={quantidade}
                        onChange={e => setQuantidade(e.target.value)}
                        min="1"
                        step="0.1"
                        hasUnit
                        required
                      />
                      <S.Select
                        value={porcao}
                        onChange={e => setPorcao(e.target.value)}
                        style={{ width: 80, marginLeft: 8 }}
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="unidade">un</option>
                        <option value="colher">colher</option>
                        <option value="xícara">xícara</option>
                      </S.Select>
                    </S.InputWrapper>
                  </S.InputContainer>

                  {alimentoObj && quantidade && (
                    <S.InputContainer>
                      <S.Label>Preview Nutricional</S.Label>
                      <div style={{
                        background: '#f8f9fa',
                        padding: 12,
                        borderRadius: 8,
                        fontSize: 14
                      }}>
                        <div>Calorias: {Math.round(alimentoObj.calorias * (quantidade / 100))} kcal</div>
                        <div>Proteínas: {(alimentoObj.proteinas * (quantidade / 100)).toFixed(1)}g</div>
                        <div>Carboidratos: {(alimentoObj.carboidratos * (quantidade / 100)).toFixed(1)}g</div>
                        <div>Gorduras: {(alimentoObj.gorduras * (quantidade / 100)).toFixed(1)}g</div>
                      </div>
                    </S.InputContainer>
                  )}
                </>
              )}
            </div>

            <S.ButtonGroup>
              <S.PrimaryButton type="submit" disabled={!alimentoObj || !quantidade}>
                <FiPlusCircle /> Adicionar
              </S.PrimaryButton>
              <S.SecondaryButton type="button" onClick={handleNovoAlimento}>
                🍰 Novo Alimento
              </S.SecondaryButton>
            </S.ButtonGroup>
          </S.Form>
        </S.Modal>
      </S.Overlay>

      {showCadastro && (
        <CadastroAlimentoPopup
          isOpen={showCadastro}
          onClose={() => setShowCadastro(false)}
          onSave={handleAlimentoCadastrado}
        />
      )}
    </>
  );
}