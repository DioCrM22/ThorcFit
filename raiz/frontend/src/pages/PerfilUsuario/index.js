import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';
import styled from 'styled-components';
import axios from 'axios';
import InputWithOptions from '../../components/InputWithOptions';
import { useAuth } from '../../hooks/useAuth';
import { Container, ProfilePicture, EditButton } from './styles';
import NavBar from '../../components/NavBar';
import ImageCropper from './ImageCropper';
import {
  Header,
  ProfileImage,
  PasswordButton,
  UploadLabel,
  InputRow,
  InputGroup,
  Label,
  Input,
  Button,
  ModalBackdrop,
  ModalContent,
  ErrorMessage,
  DoubleInputContainer,
  CompactInputGroup,
  CompactInput,
  SpacingLine,
  Separator,
  UnitWrapper,
  ViewModeField
} from './styles';

const AZUL = '#3a86ff';
const LARANJA = '#FF6B35';
const VERDE = '#229a00';

// Styled para o IMaskInput baseado no seu Input
const MaskedInput = styled(IMaskInput)`
  border: 1px solid ${({ bordercolor }) => bordercolor || '#ccc'};
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
`;

const ProfilePage = () => {

const [userData, setUserData] = useState({
  nome: '',
  telefone: '',
  dataNascimento: '',
  genero: '',
  altura: '',
  peso: '',
  objetivo: '',
  foto_perfil: null
});

  const [formData, setFormData] = useState({ ...userData });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const { updateProfile } = useAuth();
  const { checkSession } = useAuth();
  const navigate = useNavigate();

  const objetivoTexto = {
    'manutenção': 'Manutenção',
    'ganho': 'Ganho de massa muscular',
    'perca': 'Perca de massa muscular'
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await checkSession();
        if (user) {
          const formatarData = (dataISO) => {
            if (!dataISO) return '';
            const [ano, mes, dia] = dataISO.split('-');
            return `${dia}/${mes}/${ano}`;
          };

          const formattedData = {
            nome: user.nome || '',
            telefone: user.telefone || '',
            dataNascimento: formatarData(user.data_nascimento),
            genero: user.genero || '',
            altura: user.altura ? user.altura.toString() : '',
            peso: user.peso ? user.peso.toString() : '',
            objetivo: user.id_objetivo || '',
            foto_perfil: user.foto_perfil || null
          };

          setUserData(formattedData);
          setFormData(formattedData);
        }
      } catch (error) {
        toast.error('Erro ao carregar perfil');
        console.error('Detalhes do erro:', error);
      }
    };
    loadProfile();
  }, [checkSession]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) setFormData(userData);
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  let processedValue = value;

  if (name === 'nome') {
    // Conforme digita, cada palavra já fica com a primeira maiúscula
    processedValue = value
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  if (name === 'altura' || name === 'peso') {
    processedValue = value === '' ? '' : Number(value);
  }

  setFormData(prev => ({ ...prev, [name]: processedValue }));
  validateField(name, processedValue);
};


const handleNameBlur = () => {
  if (!formData.nome) return;

  const formatado = formData.nome
    .split(' ')
    .filter(Boolean) // Remove espaços extras
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  setFormData(prev => ({ ...prev, nome: formatado }));
  validateField('nome', formatado);
};

  const validateField = (name, value) => {
    let error = '';
    
    if (value === '' && !['nome', 'email'].includes(name)) {
      setErrors(prev => ({ ...prev, [name]: error }));
      return true;
    }
  
    switch(name) {
      case 'nome':
        if (!value.match(/^([A-ZÀ-Ÿ][a-zà-ÿ]+)(\s[A-ZÀ-Ÿ][a-zà-ÿ]+)+$/)) {
          error = 'Formato inválido (ex: Freitas Maia)';
        }
        break;
      case 'altura':
        if (isNaN(value) || (value && (value < 100 || value > 250))) {
          error = '100cm-250cm';
        }
        break;
      case 'peso':
        if (isNaN(value) || (value && (value < 30 || value > 300))) {
          error = '30kg-300kg';
        }
        break;
      default:
        break;
    }
  
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

const handleSave = async () => {
  console.log("Salvando...");

  const hasErrors = Object.keys(errors).some(key => errors[key]);
  if (hasErrors) return toast.error('Corrija os campos inválidos');

  try {
    const formDataToSend = new FormData();

    const objetivoMap = {
      'Manutenção': 'manutenção',
      'Ganho de massa muscular': 'ganho',
      'Perca de massa muscular': 'perca'
    };

    const objetivoBanco = objetivoMap[formData.objetivo] || null;

    // Campos para enviar no formato esperado pelo backend
    const changes = {
      nome: formData.nome,
      telefone: formData.telefone,
      data_nascimento: formData.dataNascimento,
      genero: formData.genero,
      altura: Number(formData.altura),
      peso: Number(formData.peso),
      id_objetivo: objetivoBanco
    };

    // Mapeamento entre campos frontend (userData) e backend
    const keyMap = {
      nome: 'nome',
      telefone: 'telefone',
      data_nascimento: 'dataNascimento',
      genero: 'genero',
      altura: 'altura',
      peso: 'peso',
      id_objetivo: 'objetivo'
    };

    // Adiciona apenas campos realmente alterados
    Object.entries(changes).forEach(([backendKey, value]) => {
      const frontendKey = keyMap[backendKey];
      const oldVal = userData[frontendKey]?.toString() ?? '';
      const newVal = value?.toString() ?? '';

      if (oldVal !== newVal && value !== null && value !== undefined && value !== '') {
        formDataToSend.append(backendKey, value);
      }
    });

    // Tratar imagem separadamente
    if (formData.foto_perfil && formData.foto_perfil !== userData.foto_perfil) {
      if (formData.foto_perfil.startsWith('data:image')) {
        const blob = await fetch(formData.foto_perfil).then(r => r.blob());
        formDataToSend.append('foto_perfil', blob);
      }
    }

    // Se nenhum dado foi alterado, avisar o usuário
    if (formDataToSend.entries().next().done) {
      toast.info('Nenhuma alteração detectada');
      return;
    }

    // DEBUG: Mostrar dados que serão enviados
    console.log('Alterações detectadas:');
    for (const pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.put('http://localhost:3001/api/user/usuario-perfil', formDataToSend, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Atualizar estado com os novos dados vindos do backend
    const updatedUser = {
      ...userData,
      ...response.data.usuarioAtualizado,
      dataNascimento: response.data.usuarioAtualizado.data_nascimento,
      altura: response.data.usuarioAtualizado.altura,
      peso: response.data.usuarioAtualizado.peso,
      objetivo: response.data.usuarioAtualizado.id_objetivo
    };

    updateProfile(updatedUser);
    setUserData(updatedUser);
    setFormData(updatedUser);
    setIsEditing(false);
    toast.success('Perfil atualizado!');
  } catch (error) {
    console.error('Erro ao salvar:', error);
    toast.error(error.response?.data?.error || 'Erro ao salvar');
  }
};

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) {
      setShowCropper(true);
      setTempImage(e.target.files[0]);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setFormData(prev => ({ ...prev, foto_perfil: croppedImage }));
    setShowCropper(false);
  };


  return (
    <Container>
      <Header>
        <NavBar 
          title="THORC FIT"
          showBack={true}
          showMenu={false}
          onBack={() => navigate('/HOME')}
        />

        <EditButton 
          onClick={handleEditToggle} 
          isEditing={isEditing}
        >
          <span>
            {isEditing ? '✕' : '✏️'}
          </span>
        </EditButton>
      </Header>

      <ProfilePicture>
        <ProfileImage 
          src={ formData.foto_perfil ? (typeof formData.foto_perfil === 'string' ? formData.foto_perfil 
          : URL.createObjectURL(formData.foto_perfil)) : '/default-avatar.png'}
          alt="Perfil" 
          isEditing={isEditing}
        />
        
        {isEditing && (
          <UploadLabel>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }}
              id="profile-upload"
            />
            <label htmlFor="profile-upload">
              <span className="material-icons">edit</span>
            </label>
          </UploadLabel>
        )}
      </ProfilePicture>

      {showCropper && (
        <ModalBackdrop>
          <ModalContent>
            <h3 style={{ color: AZUL }}>Recortar Foto</h3>
            <ImageCropper
              imageFile={tempImage}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
            />
          </ModalContent>
        </ModalBackdrop>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <InputGroup>
          <Label>👤 Nome Completo</Label>
          {isEditing ? (
            <>
              <Input
                name="nome"
                value={formData.nome || ''}
                onChange={handleInputChange}
                onBlur={handleNameBlur}
                error={errors.nome}
                bordercolor={AZUL}
              />
              {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
            </>
          ) : (
            <ViewModeField>{userData.nome || 'Não informado'}</ViewModeField>
          )}
        </InputGroup>

        <InputGroup>
          <Label>📱 Telefone Celular</Label>
          {isEditing ? (
            <MaskedInput
              mask="+00 (00) 00000-0000"
              value={formData.telefone || ''}
              name="telefone"
              bordercolor={AZUL}
              onAccept={(value) => {
                if (value !== formData.telefone) {
                  setFormData(prev => ({ ...prev, telefone: value }));
                }
              }}
            />
          ) : (
            <ViewModeField>{userData.telefone || 'Não informado'}</ViewModeField>
          )}
        </InputGroup>

        <InputGroup>
          <Label>🥇 Objetivo</Label>
          {isEditing ? (
            <InputWithOptions
              name="objetivo"
              value={formData.objetivo}
              onChange={handleInputChange}
              options={[
                'Manutenção',
                'Ganho de massa muscular',
                'Perca de massa muscular'
              ]}
              bordercolor={AZUL}
            />
          ) : (
            <ViewModeField>{objetivoTexto[userData.objetivo] || 'Não informado'}</ViewModeField>
          )}
        </InputGroup>

        <SpacingLine />

        <InputGroup>
          <Label>📆 Data Nascimento</Label>
          {isEditing ? (
            <Input
              type="date"
              name="dataNascimento"
              value={ isEditing ? (formData.dataNascimento ? formData.dataNascimento.split('/').reverse().join('-') : '') : ''}
              onChange={handleInputChange}
              bordercolor={AZUL}
            />
          ) : (
            <ViewModeField>{userData.dataNascimento || 'Não informado'}</ViewModeField>
          )}
        </InputGroup>

        <DoubleInputContainer>
          <CompactInputGroup>
            <Label>↕️ Altura</Label>
            {isEditing ? (
              <UnitWrapper unit="cm">
                <CompactInput
                  type="number"
                  name="altura"
                  value={formData.altura || ''}
                  onChange={handleInputChange}
                  error={errors.altura}
                />
              </UnitWrapper>
            ) : (
              <ViewModeField>{userData.altura ? `${parseInt(userData.altura, 10)} cm` : 'Não informado'}</ViewModeField>
            )}
            {errors.altura && <ErrorMessage>{errors.altura}</ErrorMessage>}
          </CompactInputGroup>

          <CompactInputGroup>
            <Label>⚖️ Peso</Label>
            {isEditing ? (
              <UnitWrapper unit="kg">
                <CompactInput
                  type="number"
                  name="peso"
                  value={formData.peso || ''}
                  onChange={handleInputChange}
                  error={errors.peso}
                />
              </UnitWrapper>
            ) : (
              <ViewModeField>{userData.peso ? (Number(userData.peso) % 1 === 0 ? `${parseInt(userData.peso, 10)} kg` 
              : `${Number(userData.peso).toFixed(3)} kg`) : 'Não informado'} </ViewModeField>
            )}
            {errors.peso && <ErrorMessage>{errors.peso}</ErrorMessage>}
          </CompactInputGroup>
        </DoubleInputContainer>

        <InputRow>
          <InputGroup>
            <Label>🚻 Gênero</Label>
            {isEditing ? (
              <InputWithOptions
                name="genero"
                value={formData.genero || ''}
                onChange={handleInputChange}
                options={['Feminino', 'Masculino', 'Prefiro não informar']}
                bordercolor={AZUL}
              />
            ) : (
              <ViewModeField>{userData.genero || 'Não informado'}</ViewModeField>
            )}
          </InputGroup>
        </InputRow>

        <Separator>
          <span><img src="/assets/images/iconlogo.png" alt="iconLogo" /></span>
        </Separator>

        {isEditing && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <PasswordButton to="/forgot-password">
              🔐 Alterar Senha
            </PasswordButton>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" cor={VERDE}>
                💾 Salvar Alterações
              </Button>
              
              <Button 
                type="button" 
                cor={LARANJA}
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancelar
              </Button>
            </div>
          </div>
        )}
      </form>
    </Container>
  );
};

export default ProfilePage;
