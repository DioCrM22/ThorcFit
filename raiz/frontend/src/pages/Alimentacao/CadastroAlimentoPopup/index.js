import React, { useState } from 'react';
import * as S from './styles';

const CadastroAlimentoPopup = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nome: '',
    calorias: '',
    proteinas: '',
    carboidratos: '',
    gorduras: '',
    porcao_padrao: '',
  });

  const fieldConfigs = {
    nome: { label: 'Nome do Alimento', type: 'text', unit: '', placeholder: 'Ex.: Arroz branco' },
    calorias: { label: 'Calorias', type: 'number', unit: 'kcal', placeholder: 'Ex.: 130' },
    proteinas: { label: 'Proteínas', type: 'number', unit: 'g', placeholder: 'Ex.: 2.5' },
    carboidratos: { label: 'Carboidratos', type: 'number', unit: 'g', placeholder: 'Ex.: 28' },
    gorduras: { label: 'Gorduras', type: 'number', unit: 'g', placeholder: 'Ex.: 0.3' },
    porcao_padrao: { label: 'Porção Padrão', type: 'text', unit: '', placeholder: 'Ex.: 100g' },
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch('http://localhost:3001/api/alimentos/createalimento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ cabeçalho com o token
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao cadastrar alimento');
    }

    const data = await response.json();
    onSave(data); // caso queira atualizar o estado com o alimento criado
    onClose();
  } catch (error) {
    console.error('Erro ao salvar alimento:', error.message);
    alert('Erro ao salvar alimento. Verifique os dados ou tente novamente.');
  }
};

  if (!isOpen) return null;

  return (
    <S.Overlay>
      <S.Modal>
        <S.Bubble />
        <S.Bubble />

        <S.Header>
          <h2>Cadastrar Alimento</h2>
          <S.CloseButton onClick={onClose}>✕</S.CloseButton>
        </S.Header>

        <S.Content>
          <S.Form onSubmit={handleSubmit}>
            {Object.entries(fieldConfigs).map(([field, config]) => (
              <S.InputGroup key={field}>
                <S.Label htmlFor={field}>{config.label}</S.Label>
                <S.InputWrapper>
                  <S.Input
                    id={field}
                    name={field}
                    type={config.type}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={config.placeholder}
                  />
                  {config.unit && <S.Unit>{config.unit}</S.Unit>}
                </S.InputWrapper>
              </S.InputGroup>
            ))}

            <S.ButtonContainer>
              <S.SecondaryButton type="button" onClick={onClose}>
                Cancelar
              </S.SecondaryButton>
              <S.PrimaryButton type="submit">
                Salvar
              </S.PrimaryButton>
            </S.ButtonContainer>
          </S.Form>
        </S.Content>
      </S.Modal>
    </S.Overlay>
  );
};

export default CadastroAlimentoPopup;