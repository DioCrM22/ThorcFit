import React, { useState, useEffect } from 'react';
import * as S from './styles';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [imageSrc, setImageSrc] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
  if (user?.id) {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    if (user.metodo_login === 'google') {
      setImageSrc(user.foto_perfil || "/assets/images/default-avatar.png");
    } else if (user.foto_perfil?.startsWith('data:image')) {
      // Foto do banco no formato Base64 já pronta
      setImageSrc(user.foto_perfil);
    } else {
      // Caso ainda precise buscar no back-end
      axios
        .get(`${API_URL}/api/foto-perfil-base64/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        .then((res) => {
          if (res.data?.image?.startsWith('data:image')) {
            setImageSrc(res.data.image);
          } else {
            setImageSrc("/assets/images/default-avatar.png");
          }
        })
        .catch(() => setImageSrc("/assets/images/default-avatar.png"));
    }

    axios
      .get(`${API_URL}/api/usuario-detalhes/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .then((response) => setUserDetails(response.data))
      .catch((error) => console.error('Erro ao buscar detalhes:', error));
  }
}, [user]);


  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const formatContactInfo = () => {
    const info = [];
    if (user?.email) info.push(user.email);
    if (userDetails?.telefone) {
      const phone = userDetails.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      info.push(phone);
    }
    return info.join(' | ');
  };

  return (
    <S.Drawer open={open}>
      <S.CloseButton>
        <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
      </S.CloseButton>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <S.Title>
          <span>THORC</span>
          <span>FIT</span>
        </S.Title>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <S.ProfileSection>
          <S.Avatar
            src={imageSrc || "/assets/images/default-avatar.png"}
            alt="Foto de perfil"
          />

          <S.UserInfoContainer>
            <S.UserName>{user?.nome || 'Usuário'}</S.UserName>
            
            <S.InfoDivider />
            
            <S.ContactInfo>
              {formatContactInfo()}
            </S.ContactInfo>
            
            {userDetails?.objetivo && (
              <>
                <S.InfoDivider />
                <S.ObjectiveText>
                  <strong>Objetivo:</strong> {userDetails.objetivo}
                </S.ObjectiveText>
              </>
            )}
          </S.UserInfoContainer>
        </S.ProfileSection>
      </motion.div>

      <S.NavList>
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <S.NavItem onClick={() => handleNavigate('/perfil-usuario')}>PERFIL</S.NavItem>
          <S.NavItem onClick={() => handleNavigate('/solicitar-companheiros')}>ADICIONAR COMPANHEIROS</S.NavItem>
          <S.NavItem onClick={() => handleNavigate('/ver-treinos')}>VER TREINOS</S.NavItem>
          <S.NavItem onClick={() => handleNavigate('/alimentacao')}>ALIMENTAÇÃO</S.NavItem>
          <S.NavItemExit onClick={logout}>SAIR</S.NavItemExit>
        </motion.div>
      </S.NavList>
    </S.Drawer>
  );
};