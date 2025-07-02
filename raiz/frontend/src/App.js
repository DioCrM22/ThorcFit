import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home"
import PerfilUsuario from './pages/PerfilUsuario';
import PerfilProfissional from './pages/PerfilProfissional';
import SolicitarCompanheiros from './pages/SolicitarCompanheiros'; // Agora é buscar profissionais
import SolicitarAlunos from './pages/SolicitarAlunos';
import Treinos from './pages/Treinos';
import VerTreinos from './pages/VerTreinos';
import Nutricionistas from './pages/Nutricionistas';
import Treinadores from './pages/Treinadores';                  
import Alimentacao from './pages/Alimentacao'; 
import DetalhesTreino from './pages/DetalhesTreino';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil-usuario" element={<PerfilUsuario />} />
      <Route path="/perfil-profissional" element={<PerfilProfissional />} />
      <Route path="/treino/:id" element={<DetalhesTreino />} />
      
      {/* Rotas adaptadas para vínculos profissionais */}
      <Route path="/solicitar-companheiros" element={<SolicitarCompanheiros />} /> {/* Agora busca profissionais */}
      <Route path="/solicitar-alunos" element={<SolicitarAlunos />} />
      
      {/* Rotas para profissionais (interfaces de trabalho) */}
      <Route path="/nutricionistas" element={<Nutricionistas />} /> {/* Interface para nutricionistas */}
      <Route path="/treinadores" element={<Treinadores />} /> {/* Interface para treinadores */}
      
      {/* Rotas de funcionalidades */}
      <Route path="/treinos" element={<Treinos />} />
      <Route path="/ver-treinos" element={<VerTreinos />} />
      <Route path="/alimentacao" element={<Alimentacao />} />
      
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export default App;