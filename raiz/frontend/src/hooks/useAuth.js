// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const API_BASE_URL = 'http://localhost:3001';
const TOKEN_KEY = 'authToken'; // Chave única para o token

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    navigate('/signin', { replace: true });
  }, [navigate]);

  const handleAuthSuccess = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
    setLoading(false);
    navigate('/home', { replace: true });
  }, [navigate]);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setInitializing(false);
        return null;
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data && data.usuario) {
        setUser(data.usuario);
        return data.usuario;
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

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data && data.usuario) {
        setUser(data.usuario);
        return data.usuario;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      logout();
      return null;
    }
  }, [logout]);


  const updateProfile = useCallback(async (updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const { data } = await axios.put(`${API_BASE_URL}/api/user/usuario-perfil`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data.usuarioAtualizado || data);
      return data.usuarioAtualizado || null;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return error.response?.data?.error || 'Erro ao atualizar perfil';
    } finally {
      setLoading(false);
    }
  }, []);


  const signup = useCallback(async (nome, email, senha, role, data_nascimento, extra) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        nome, email, senha, role, data_nascimento, extra
      });

      const { token, user } = response.data;
      if (!token) throw new Error("Token não recebido");
      
      handleAuthSuccess(token, user);
      return { success: true };
    } catch (error) {
      console.error("Erro no signup:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao cadastrar"
      };
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const signin = useCallback(async (email, senha) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email, senha
      });

      if (!data.token || !data.user) {
        throw new Error('Resposta inválida do servidor');
      }

      handleAuthSuccess(data.token, data.user);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login' 
      };
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      return data.error || null;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return error.response?.data?.error || 'Erro ao solicitar recuperação de senha';
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email, newPassword) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email, newPassword
      });
      return data.error || null;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return error.response?.data?.error || 'Erro ao redefinir senha';
    } finally {
      setLoading(false);
    }
  }, []);

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