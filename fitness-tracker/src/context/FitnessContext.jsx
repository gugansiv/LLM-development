import { createContext, useContext, useReducer, useEffect } from 'react';

const FitnessContext = createContext();

const initialState = {
  user: {
    name: '',
    age: null,
    gender: '',
    height: null,
    weight: null,
    activityLevel: 'moderate',
    goal: 'maintain',
  },
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 8,
  },
  foodLog: [],
  workouts: [],
  measurements: [],
  weightHistory: [],
};

function fitnessReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    
    case 'SET_DAILY_GOALS':
      return { ...state, dailyGoals: { ...state.dailyGoals, ...action.payload } };
    
    case 'ADD_FOOD_ENTRY':
      return { 
        ...state, 
        foodLog: [...state.foodLog, { ...action.payload, id: Date.now() }] 
      };
    
    case 'DELETE_FOOD_ENTRY':
      return {
        ...state,
        foodLog: state.foodLog.filter(entry => entry.id !== action.payload)
      };
    
    case 'ADD_WORKOUT':
      return {
        ...state,
        workouts: [...state.workouts, { ...action.payload, id: Date.now() }]
      };
    
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout.id !== action.payload)
      };
    
    case 'ADD_MEASUREMENT':
      return {
        ...state,
        measurements: [...state.measurements, { ...action.payload, id: Date.now(), date: new Date().toISOString() }]
      };
    
    case 'ADD_WEIGHT_ENTRY':
      return {
        ...state,
        weightHistory: [...state.weightHistory, { ...action.payload, id: Date.now(), date: new Date().toISOString() }]
      };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

export function FitnessProvider({ children }) {
  const [state, dispatch] = useReducer(fitnessReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('fitnessTrackerData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsed });
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      user: state.user,
      dailyGoals: state.dailyGoals,
      foodLog: state.foodLog,
      workouts: state.workouts,
      measurements: state.measurements,
      weightHistory: state.weightHistory,
    };
    localStorage.setItem('fitnessTrackerData', JSON.stringify(dataToSave));
  }, [state]);

  return (
    <FitnessContext.Provider value={{ state, dispatch }}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}

export const calculateCalories = (user) => {
  const { age, gender, height, weight, activityLevel, goal } = user;
  
  if (!age || !gender || !height || !weight) return 2000;
  
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
  
  const goalAdjustments = {
    lose: -500,
    maintain: 0,
    gain: 500,
  };
  
  return Math.round(tdee + (goalAdjustments[goal] || 0));
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export const calculateMacros = (calories, goal) => {
  const ratios = {
    lose: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  };
  
  const ratio = ratios[goal] || ratios.maintain;
  
  return {
    protein: Math.round((calories * ratio.protein) / 4),
    carbs: Math.round((calories * ratio.carbs) / 4),
    fat: Math.round((calories * ratio.fat) / 9),
  };
};
