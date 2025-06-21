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
    nome: 'Carregando...',
    telefone: 'Carregando...',
    dataNascimento: 'Carregando...',
    genero: 'Carregando...',
    altura: 'Carregando...',
    peso: 'Carregando...',
    objetivo: 'Carregando...',
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await checkSession();
        if (user) {
          const formattedData = {
            nome: user.nome || '',
            telefone: user.telefone || '',
            dataNascimento: user.data_nascimento || '',
            genero: user.genero || '',
            altura: user.altura ? user.altura.toString() : '',
            peso: user.peso ? user.peso.toString() : '',
            objetivo: user.objetivo || '',
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
    if (name === 'altura' || name === 'peso') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    validateField(name, processedValue);
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

    // Mapear campos do frontend para o backend
    const changes = {
      nome: formData.nome,
      telefone: formData.telefone,
      data_nascimento: formData.dataNascimento,
      genero: formData.genero,
      altura_cm: Number(formData.altura),
      peso_kg: Number(formData.peso),
      id_objetivo: objetivoBanco 
    };

    // Adicionar apenas os campos que foram alterados
    Object.keys(changes).forEach(key => {
      if (changes[key] !== userData[key] && changes[key] !== undefined) {
        formDataToSend.append(key, changes[key]);
      }
    });

    // Tratar a imagem separadamente
    if (formData.foto_perfil && formData.foto_perfil !== userData.foto_perfil) {
      if (formData.foto_perfil.startsWith('data:image')) {
        const blob = await fetch(formData.foto_perfil).then(r => r.blob());
        formDataToSend.append('foto_perfil', blob);
      }
    }

    if (formDataToSend.entries().next().done) {
      toast.info('Nenhuma alteração detectada');
      return;
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.put('http://localhost:3001/api/user/usuario-perfil', formDataToSend, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Atualizar estado com os novos dados
    const updatedUser = {
      ...userData,
      ...response.data.usuarioAtualizado,
      dataNascimento: response.data.usuarioAtualizado.data_nascimento,
      altura: response.data.usuarioAtualizado.altura_cm,
      peso: response.data.usuarioAtualizado.peso_kg,
      objetivo: response.data.usuarioAtualizado.id_objetivo // <<< Atualizando local
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
          src={formData.foto_perfil || '/default-avatar.png'} 
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
                value={formData.nome}
                onChange={handleInputChange}
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
          <Label>📱 Telefone</Label>
          {isEditing ? (
            <MaskedInput
              mask="+00 (00) 00000-0000"
              value={formData.telefone}
              unmask={false}
              onAccept={(value) => handleInputChange({ target: { name: 'telefone', value } })}
              bordercolor={AZUL}
              name="telefone"
              placeholder="+55 (11) 91234-5678"
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
            <ViewModeField>{userData.objetivo || 'Não informado'}</ViewModeField>
          )}
        </InputGroup>

        <SpacingLine />

        <InputGroup>
          <Label>📆 Data Nascimento</Label>
          {isEditing ? (
            <Input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
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
                  value={formData.altura}
                  onChange={handleInputChange}
                  error={errors.altura}
                />
              </UnitWrapper>
            ) : (
              <ViewModeField>{userData.altura || 'Não informado'}</ViewModeField>
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
                  value={formData.peso}
                  onChange={handleInputChange}
                  error={errors.peso}
                />
              </UnitWrapper>
            ) : (
              <ViewModeField>{userData.peso || 'Não informado'}</ViewModeField>
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
                value={formData.genero}
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
