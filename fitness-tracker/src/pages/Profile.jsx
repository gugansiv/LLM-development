import { useState } from 'react';
import { useFitness, calculateCalories, calculateMacros } from '../context/FitnessContext';
import { Save, User } from 'lucide-react';

const Profile = () => {
  const { state, dispatch } = useFitness();
  const [userData, setUserData] = useState({
    name: state.user.name || '',
    age: state.user.age || '',
    gender: state.user.gender || '',
    height: state.user.height || '',
    weight: state.user.weight || '',
    activityLevel: state.user.activityLevel || 'moderate',
    goal: state.user.goal || 'maintain',
  });

  const [goals, setGoals] = useState({
    calories: state.dailyGoals.calories,
    protein: state.dailyGoals.protein,
    carbs: state.dailyGoals.carbs,
    fat: state.dailyGoals.fat,
    water: state.dailyGoals.water,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch({
      type: 'SET_USER',
      payload: {
        ...userData,
        age: Number(userData.age) || null,
        height: Number(userData.height) || null,
        weight: Number(userData.weight) || null,
      },
    });

    // Auto-calculate calorie goals based on profile
    const calculatedCalories = calculateCalories({
      ...userData,
      age: Number(userData.age),
      height: Number(userData.height),
      weight: Number(userData.weight),
    });
    
    const macros = calculateMacros(calculatedCalories, userData.goal);

    dispatch({
      type: 'SET_DAILY_GOALS',
      payload: {
        calories: calculatedCalories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      },
    });

    alert('Profile saved successfully! Your daily goals have been updated.');
  };

  const handleSaveGoals = (e) => {
    e.preventDefault();
    dispatch({
      type: 'SET_DAILY_GOALS',
      payload: {
        calories: Number(goals.calories),
        protein: Number(goals.protein),
        carbs: Number(goals.carbs),
        fat: Number(goals.fat),
        water: Number(goals.water),
      },
    });
    alert('Daily goals updated successfully!');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.removeItem('fitnessTrackerData');
      window.location.reload();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-dark mb-6">👤 Profile & Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="input-field"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={userData.age}
                  onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                  className="input-field"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={userData.height}
                  onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                  className="input-field"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={userData.weight}
                  onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                  className="input-field"
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
              <select
                value={userData.activityLevel}
                onChange={(e) => setUserData({ ...userData, activityLevel: e.target.value })}
                className="input-field"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="veryActive">Very Active (physical job + training)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <select
                value={userData.goal}
                onChange={(e) => setUserData({ ...userData, goal: e.target.value })}
                className="input-field"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Muscle</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center">
              <Save className="w-4 h-4 mr-2" />
              Save Profile & Calculate Goals
            </button>
          </form>
        </div>

        {/* Daily Goals */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">🎯 Daily Goals</h2>
          <form onSubmit={handleSaveGoals} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Calories Target
              </label>
              <input
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals({ ...goals, calories: e.target.value })}
                className="input-field"
                placeholder="2000"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={goals.protein}
                  onChange={(e) => setGoals({ ...goals, protein: e.target.value })}
                  className="input-field"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={goals.carbs}
                  onChange={(e) => setGoals({ ...goals, carbs: e.target.value })}
                  className="input-field"
                  placeholder="250"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={goals.fat}
                  onChange={(e) => setGoals({ ...goals, fat: e.target.value })}
                  className="input-field"
                  placeholder="65"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Intake (glasses/day)</label>
              <input
                type="number"
                value={goals.water}
                onChange={(e) => setGoals({ ...goals, water: e.target.value })}
                className="input-field"
                placeholder="8"
              />
            </div>

            <button type="submit" className="btn-secondary w-full">
              Update Goals
            </button>
          </form>

          {/* Current Stats */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-dark mb-3">Current Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">BMI</p>
                <p className="text-lg font-bold">
                  {userData.height && userData.weight
                    ? (userData.weight / ((userData.height / 100) ** 2)).toFixed(1)
                    : '--'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">BMR</p>
                <p className="text-lg font-bold">
                  {userData.age && userData.gender && userData.height && userData.weight
                    ? Math.round(
                        userData.gender === 'male'
                          ? 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5
                          : 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161
                      )
                    : '--'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold text-dark mb-4">⚙️ Data Management</h2>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
          <div>
            <h3 className="font-semibold text-red-800">Danger Zone</h3>
            <p className="text-sm text-red-600">This will permanently delete all your tracked data</p>
          </div>
          <button
            onClick={handleClearData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold text-dark mb-4">ℹ️ About FitnessPro</h2>
        <div className="space-y-2 text-gray-600">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Features:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Calorie and macro tracking</li>
            <li>Workout logging with multiple types</li>
            <li>Body measurements tracking</li>
            <li>Weight history with BMI calculation</li>
            <li>Progress charts and analytics</li>
            <li>Achievement system</li>
            <li>Local data storage (private & secure)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
