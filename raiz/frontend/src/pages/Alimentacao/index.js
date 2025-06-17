// src/pages/Alimentacao/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiPlus, FiMinus, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import NavBar from '../../components/NavBar';
import NutritionBars from './NutritionBars';
import FloatingNutriButton from './FloatingNutriButton';
import MealCard from './MealCard';
import AddAlimentoPopup from './AddAlimentoPopup';
import * as S from './styles';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AlimentacaoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState(0);
  const [totalWaterGoal, setTotalWaterGoal] = useState(2500);
  const [editWaterGoal, setEditWaterGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(totalWaterGoal);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diarioAlimentar, setDiarioAlimentar] = useState(null);
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Café da Manhã',
      tipo: 'café_da_manhã',
      items: []
    },
    {
      id: 2,
      name: 'Lanche da Manhã',
      tipo: 'lanche_manhã',
      items: []
    },
    {
      id: 3,
      name: 'Almoço',
      tipo: 'almoço',
      items: []
    },
    {
      id: 4,
      name: 'Lanche da Tarde',
      tipo: 'lanche_tarde',
      items: []
    },
    {
      id: 5,
      name: 'Jantar',
      tipo: 'jantar',
      items: []
    }
  ]);

  // Carregar dados do diário alimentar
  useEffect(() => {
    if (user) {
      loadDiarioAlimentar();
    }
  }, [user, currentDate]);

  const loadDiarioAlimentar = async () => {
    try {
      setLoading(true);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:3001/api/alimentacao/diario/${dateString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDiarioAlimentar(data);
        setWaterIntake(data.agua_ml || 0);
        
        // Organizar refeições por tipo
        const mealsByType = {};
        if (data.refeicoes) {
          data.refeicoes.forEach(refeicao => {
            if (!mealsByType[refeicao.tipo_refeicao]) {
              mealsByType[refeicao.tipo_refeicao] = [];
            }
            mealsByType[refeicao.tipo_refeicao].push(...refeicao.alimentos);
          });
        }

        // Atualizar meals com os dados carregados
        setMeals(prevMeals => prevMeals.map(meal => ({
          ...meal,
          items: mealsByType[meal.tipo] || []
        })));
      } else if (response.status === 404) {
        // Não há diário para esta data, criar um novo
        setDiarioAlimentar(null);
        setWaterIntake(0);
        setMeals(prevMeals => prevMeals.map(meal => ({
          ...meal,
          items: []
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar diário alimentar:', error);
    } finally {
      setLoading(false);
    }
  };

  const dailyNutrition = {
    calories: meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.calorias || 0), 0), 0),
    targetCalories: diarioAlimentar?.meta_calorias || 2200,
    protein: meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.proteinas || 0), 0), 0),
    carbs: meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.carboidratos || 0), 0), 0),
    fat: meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.gorduras || 0), 0), 0)
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
    setShowCalendar(false);
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowCalendar(false);
  };

  const handleWaterChange = async (amount) => {
    const newWaterIntake = Math.max(0, Math.min(totalWaterGoal, waterIntake + amount));
    setWaterIntake(newWaterIntake);
    
    try {
      const dateString = currentDate.toISOString().split('T')[0];
      
      await fetch('http://localhost:3001/api/alimentacao/agua', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: dateString,
          agua_ml: newWaterIntake
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar consumo de água:', error);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleAddFood = (mealId) => {
    setCurrentMeal(mealId);
    setShowAddFood(true);
  };

  const handleSaveFood = async (newFood) => {
    try {
      const meal = meals.find(m => m.id === currentMeal);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const response = await fetch('http://localhost:3001/api/alimentacao/refeicao', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: dateString,
          tipo_refeicao: meal.tipo,
          alimento: newFood
        })
      });

      if (response.ok) {
        // Recarregar dados após adicionar alimento
        await loadDiarioAlimentar();
      }
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
    }
    
    setShowAddFood(false);
  };

  const handleRemoveFood = async (mealId, foodIndex) => {
    try {
      const meal = meals.find(m => m.id === mealId);
      const food = meal.items[foodIndex];
      
      if (food.id_alimento_refeicao) {
        await fetch(`http://localhost:3001/api/alimentacao/refeicao/${food.id_alimento_refeicao}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        // Recarregar dados após remover alimento
        await loadDiarioAlimentar();
      }
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
    }
  };

  const handleUpdateWaterGoal = async () => {
    try {
      await fetch('http://localhost:3001/api/user/meta-agua', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meta_agua_ml: newGoal
        })
      });
      
      setTotalWaterGoal(newGoal);
      if (waterIntake > newGoal) setWaterIntake(newGoal);
      setEditWaterGoal(false);
    } catch (error) {
      console.error('Erro ao atualizar meta de água:', error);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar title="THORC FIT" showBack onBack={() => navigate('/home')} />
        <S.Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Carregando dados alimentares...
          </div>
        </S.Container>
      </>
    );
  }

  return (
    <>
      <NavBar title="THORC FIT" showBack onBack={() => navigate('/home')} />

      <S.Container>
        {/* Seletor de Data */}
        <S.DaySelector>
          <S.DayButton onClick={() => changeDate(-1)}>
            <FiChevronLeft size={20} />
          </S.DayButton>
          
          <FloatingNutriButton />

          <S.CurrentDayContainer>
            <S.CurrentDay>
              {currentDate.toDateString() === new Date().toDateString() ? '🎯 Hoje' : 
              currentDate.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() ? '⏭️ Amanhã' : 
              formatDate(currentDate)}
              
              <S.CalendarButton onClick={toggleCalendar}>
                <FiCalendar size={18} />
              </S.CalendarButton>
              
              {showCalendar && (
                <S.CalendarPopup>
                  <Calendar 
                    onChange={handleDateChange}
                    value={currentDate}
                    locale="pt-BR"
                  />
                </S.CalendarPopup>
              )}
            </S.CurrentDay>
          </S.CurrentDayContainer>

          <S.DayButton onClick={() => changeDate(1)}>
            <FiChevronRight size={20} />
          </S.DayButton>
        </S.DaySelector>

        {/* Resumo Nutricional */}
        <NutritionBars nutrition={dailyNutrition} />

        {/* Hidratação */}
        <S.WaterTracker>
          <S.WaterHeader>
            <S.WaterTitle>💧 Hidratação Diária</S.WaterTitle>
            <S.EditButton onClick={() => setEditWaterGoal(true)}>🚩Editar Meta</S.EditButton>
          </S.WaterHeader>

          {editWaterGoal && (
            <S.EditPopup>
              <p>
                📢 <strong>Sua nutricionista</strong> recomenda o limite diário de água com base nos seus dados.
              </p>
              <label htmlFor="metaAgua">Nova meta (em ml):</label>
              <input
                type="number"
                id="metaAgua"
                value={newGoal}
                min={500}
                step={100}
                onChange={(e) => setNewGoal(parseInt(e.target.value))}
              />
              <div>
                <button onClick={handleUpdateWaterGoal}>
                  Salvar
                </button>
                <button onClick={() => setEditWaterGoal(false)}>Cancelar</button>
              </div>
            </S.EditPopup>
          )}
          
          <S.WaterContent>
            <S.WaterGlassContainer>
              {/* Garrafa de consumo */}
              <S.WaterGlass>
                <S.WaterDrop top="10px" left="30%" />
                <S.WaterDrop top="20px" left="70%" />
                <S.GlassTop />
                <S.GlassBody>
                  <S.WaterFill percentage={(waterIntake / totalWaterGoal) * 100}>
                    <S.BottleCapacity inside percentage={(waterIntake / totalWaterGoal) * 100}>
                      {(waterIntake / 1000).toFixed(1)}L
                    </S.BottleCapacity>
                  </S.WaterFill>
                </S.GlassBody>
                <S.GlassBottom />
                <S.WaterLabel>Seu consumo</S.WaterLabel>
              </S.WaterGlass>
              
              {/* Garrafa de meta */}
              <S.WaterGlass>
                <S.WaterDrop top="10px" left="40%" />
                <S.WaterDrop top="25px" left="60%" />
                <S.GlassTop />
                <S.GlassBody>
                  <S.WaterFill percentage={100}>
                    <S.BottleCapacity inside percentage={100}>
                      {(totalWaterGoal / 1000).toFixed(1)}L
                    </S.BottleCapacity>
                  </S.WaterFill>
                </S.GlassBody>
                <S.GlassBottom />
                <S.WaterLabel>Meta diária</S.WaterLabel>
              </S.WaterGlass>
            </S.WaterGlassContainer>
            
            <S.WaterControls>
              <S.WaterButton 
                onClick={() => handleWaterChange(-250)}
                disabled={waterIntake <= 0}
                aria-label="Remover água"
              >
                <FiMinus />
              </S.WaterButton>
              
              <S.WaterAmountControl>
                <span>250ml</span>
              </S.WaterAmountControl>
              
              <S.WaterButton 
                onClick={() => handleWaterChange(250)}
                disabled={waterIntake >= totalWaterGoal}
                aria-label="Adicionar água"
              >
                <FiPlus />
              </S.WaterButton>
            </S.WaterControls>
          </S.WaterContent>
        </S.WaterTracker>

        {/* Refeições */}
        {meals.map(meal => (
          <MealCard 
            key={meal.id} 
            meal={meal} 
            onAddFood={() => handleAddFood(meal.id)}
            onRemoveFood={handleRemoveFood}
          />
        ))}
      </S.Container>

      {/* Popup para adicionar alimento */}
      <AddAlimentoPopup
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        onSave={handleSaveFood}
        mealId={currentMeal}
      />
    </>
  );
};

export default AlimentacaoPage;