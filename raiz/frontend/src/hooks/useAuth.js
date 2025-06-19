// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // URL base do backend
  const API_BASE_URL = 'http://localhost:3001';

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/signin', { replace: true });
  }, [navigate]);

  const handleAuthSuccess = useCallback((token, userData) => {
    console.log('Salvando token:', token);
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
    setUser(userData);
    setLoading(false);
    navigate('/home', { replace: true });
  }, [navigate]);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('Token enviado no header:', token);
      if (!token) return null;

      const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data) {
        setUser(data);
        return data;
      }
      throw new Error('Dados inválidos');
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      logout();
      return null;
    } finally {
      setInitializing(false);
    }
  }, [logout]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('Token enviado no header (fetchUserProfile):', token);
      const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      logout();
      return null;
    }
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      const { data } = await axios.put(`${API_BASE_URL}/api/user/profile`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data) {
        setUser(data);
        return null;
      } else {
        return 'Erro ao atualizar perfil';
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return error.response?.data?.error || 'Erro ao atualizar perfil';
    } finally {
      setLoading(false);
    }
  };

  const signup = async (nome, email, senha, role, data_nascimento, extra) => {
  setLoading(true);

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      nome,
      email,
      senha,
      role,
      data_nascimento,
      extra // Envia CRN ou CREF dependendo do tipo de conta
    });

    const { token, user } = response.data;

    if (!token) {
      throw new Error("Token não recebido do servidor.");
    }

    // Armazena o token no localStorage
    localStorage.setItem("token", token);

    // Atualiza o contexto de autenticação
    handleAuthSuccess(token, user);

    return { success: true };

  } catch (error) {
    console.error("Erro no signup:", error);
    setLoading(false);

    return {
      success: false,
      error: error.response?.data?.error || "❌ Erro ao cadastrar. Tente novamente."
    };
  }
};


  const signin = async (email, senha) => {
    setLoading(true);
    try {
      console.log('Tentando fazer login com:', { email, url: `${API_BASE_URL}/api/auth/login` });
      
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        senha
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Resposta do servidor:', data);
  
      if (!data.token || !data.user) {
        throw new Error('Resposta inválida do servidor');
      }
  
      handleAuthSuccess(data.token, data.user);
      return { success: true };
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      return { 
        success: false,
        error: error.response?.data?.error || error.message || 'Erro ao fazer login' 
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { 
        email 
      });
      
      if (data.error) {
        return data.error;
      }
      return null;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return error.response?.data?.error || 'Erro ao solicitar recuperação de senha';
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        newPassword
      });
      return data.error || null;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return error.response?.data?.error || 'Erro ao redefinir senha';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{
      user,
      initializing,
      loading,
      checkSession,
      fetchUserProfile,
      signup,
      signin,
      forgotPassword,
      resetPassword,
      updateProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
