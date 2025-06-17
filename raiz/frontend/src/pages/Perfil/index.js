// src/pages/Perfil/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
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

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    nome: 'Carregando...',
    email: 'Carregando...',
    telefone: 'Carregando...',
    dataNascimento: 'Carregando...',
    genero: 'Carregando...',
    altura: 'Carregando...',
    peso: 'Carregando...',
    objetivo: 'Carregando...',
    avatar: null
  });

  const [formData, setFormData] = useState({ ...userData });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3001/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        
        const formattedData = {
          nome: profileData.nome || '',
          email: profileData.email || '',
          telefone: profileData.telefone || '',
          dataNascimento: profileData.data_nascimento ? profileData.data_nascimento.split('T')[0] : '',
          genero: profileData.genero || '',
          altura: profileData.altura ? profileData.altura.toString() : '',
          peso: profileData.peso ? profileData.peso.toString() : '',
          objetivo: profileData.id_objetivo || '',
          avatar: profileData.avatar || null
        };
        
        setUserData(formattedData);
        setFormData(formattedData);
      } else {
        toast.error('Erro ao carregar perfil');
      }
    } catch (error) {
      toast.error('Erro ao carregar perfil');
      console.error('Detalhes do erro:', error);
    } finally {
      setLoading(false);
    }
  };

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
          error = 'Formato inválido (ex: João Silva)';
        }
        break;
      case 'email':
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          error = 'Email inválido';
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
      const updateData = {
        nome: formData.nome,
        telefone: formData.telefone,
        data_nascimento: formData.dataNascimento,
        genero: formData.genero,
        altura: Number(formData.altura),
        peso: Number(formData.peso),
        id_objetivo: formData.objetivo
      };

      // Remover campos vazios ou inalterados
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === userData[key.replace('data_nascimento', 'dataNascimento').replace('id_objetivo', 'objetivo')]) {
          delete updateData[key];
        }
      });

      if (Object.keys(updateData).length === 0 && formData.avatar === userData.avatar) {
        toast.info('Nenhuma alteração detectada');
        return;
      }

      const response = await fetch('http://localhost:3001/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Atualizar estado com os novos dados
        const formattedUpdatedData = {
          ...userData,
          nome: updatedUser.nome || userData.nome,
          telefone: updatedUser.telefone || userData.telefone,
          dataNascimento: updatedUser.data_nascimento ? updatedUser.data_nascimento.split('T')[0] : userData.dataNascimento,
          genero: updatedUser.genero || userData.genero,
          altura: updatedUser.altura ? updatedUser.altura.toString() : userData.altura,
          peso: updatedUser.peso ? updatedUser.peso.toString() : userData.peso,
          objetivo: updatedUser.id_objetivo || userData.objetivo,
          avatar: updatedUser.avatar || userData.avatar
        };
        
        updateProfile(updatedUser);
        setUserData(formattedUpdatedData);
        setFormData(formattedUpdatedData);
        setIsEditing(false);
        toast.success('Perfil atualizado com sucesso!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar perfil');
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) {
      setShowCropper(true);
      setTempImage(e.target.files[0]);
    }
  };

  const handleCropComplete = async (croppedImage) => {
    try {
      // Aqui você pode implementar o upload da imagem para o backend
      // Por enquanto, vamos apenas atualizar o estado local
      setFormData(prev => ({ ...prev, avatar: croppedImage }));
      setShowCropper(false);
      
      // TODO: Implementar upload de imagem para o backend
      toast.info('Upload de imagem será implementado em breve');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao fazer upload da imagem');
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <NavBar 
            title="PERFIL FIT"
            showBack={true}
            showMenu={false}
            onBack={() => navigate('/home')}
          />
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Carregando perfil...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <NavBar 
          title="PERFIL FIT"
          showBack={true}
          showMenu={false}
          onBack={() => navigate('/home')}
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
          src={formData.avatar || '/default-avatar.png'} 
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
          <Label>📧 Email</Label>
          <ViewModeField>{userData.email || 'Não informado'}</ViewModeField>
        </InputGroup>

        <InputGroup>
          <Label>📱 Telefone</Label>
          {isEditing ? (
            <InputMask
              mask="+99 (99) 99999-9999"
              value={formData.telefone}
              onChange={handleInputChange}
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  name="telefone"
                  bordercolor={AZUL}
                />
              )}
            </InputMask>
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
                { value: 'perca', label: 'Perda de peso' },
                { value: 'ganho', label: 'Ganho de massa muscular' },
                { value: 'manutenção', label: 'Manutenção do peso' }
              ]}
              bordercolor={AZUL}
            />
          ) : (
            <ViewModeField>
              {userData.objetivo === 'perca' ? 'Perda de peso' : 
               userData.objetivo === 'ganho' ? 'Ganho de massa muscular' :
               userData.objetivo === 'manutenção' ? 'Manutenção do peso' :
               'Não informado'}
            </ViewModeField>
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
            <ViewModeField>
              {userData.dataNascimento ? 
                new Date(userData.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 
                'Não informado'}
            </ViewModeField>
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
              <ViewModeField>{userData.altura ? `${userData.altura} cm` : 'Não informado'}</ViewModeField>
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
              <ViewModeField>{userData.peso ? `${userData.peso} kg` : 'Não informado'}</ViewModeField>
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
                options={[
                  { value: 'feminino', label: 'Feminino' },
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'outro', label: 'Prefiro não informar' }
                ]}
                bordercolor={AZUL}
              />
            ) : (
              <ViewModeField>
                {userData.genero === 'feminino' ? 'Feminino' :
                 userData.genero === 'masculino' ? 'Masculino' :
                 userData.genero === 'outro' ? 'Prefiro não informar' :
                 'Não informado'}
              </ViewModeField>
            )}
          </InputGroup>
        </InputRow>

        <Separator>
          <span><img src="/assets/images/iconlogo.png" alt="iconLogo" /></span>
        </Separator>

        {isEditing && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <PasswordButton to="/forgot-password">
              🔑 Alterar Senha
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
