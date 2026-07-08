import { Line } from 'react-chartjs-2';
import { useFitness, calculateBMI } from '../context/FitnessContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Progress = () => {
  const { state } = useFitness();
  
  // Prepare weight data for chart
  const weightData = state.weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    value: entry.weight,
  }));

  // Calculate progress stats
  const firstWeight = state.weightHistory.length > 0 ? state.weightHistory[0].weight : state.user.weight;
  const currentWeight = state.weightHistory.length > 0 
    ? state.weightHistory[state.weightHistory.length - 1].weight 
    : state.user.weight;
  const weightChange = currentWeight - firstWeight;
  
  const totalWorkouts = state.workouts.length;
  const totalCaloriesBurned = state.workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalFoodEntries = state.foodLog.length;

  // Get last 7 days food summary
  const getLast7DaysSummary = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      
      const dayEntries = state.foodLog.filter(entry =>
        new Date(entry.date).toLocaleDateString() === dateStr
      );
      
      const totalCals = dayEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: totalCals,
      });
    }
    return last7Days;
  };

  const calorieChartData = {
    labels: getLast7DaysSummary().map(d => d.date),
    datasets: [{
      label: 'Calories Consumed',
      data: getLast7DaysSummary().map(d => d.value),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  const achievements = [
    { title: 'First Workout', icon: '🏋️', achieved: totalWorkouts >= 1 },
    { title: '10 Workouts', icon: '💪', achieved: totalWorkouts >= 10 },
    { title: '50 Workouts', icon: '🔥', achieved: totalWorkouts >= 50 },
    { title: 'Week Tracker', icon: '📅', achieved: state.weightHistory.length >= 7 },
    { title: 'Month Tracker', icon: '🗓️', achieved: state.weightHistory.length >= 30 },
    { title: '100 Food Logs', icon: '🍽️', achieved: totalFoodEntries >= 100 },
    { title: 'Calorie Crusher', icon: '⚡', achieved: totalCaloriesBurned >= 5000 },
    { title: 'Consistency King', icon: '👑', achieved: totalWorkouts >= 30 && totalFoodEntries >= 30 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-dark mb-6">📊 Progress Tracking</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Weight Change</h3>
            {weightChange <= 0 ? (
              <TrendingDown className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingUp className="w-6 h-6 text-red-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${weightChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
          </p>
          <p className="text-sm text-gray-500 mt-1">Since you started</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Workouts</h3>
            <span className="text-2xl">💪</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{totalWorkouts}</p>
          <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Calories Burned</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{totalCaloriesBurned.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Current BMI</h3>
            <span className="text-2xl">📏</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {calculateBMI(currentWeight, state.user.height)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {calculateBMI(currentWeight, state.user.height) < 18.5 ? 'Underweight' : 
             calculateBMI(currentWeight, state.user.height) < 25 ? 'Normal' : 
             calculateBMI(currentWeight, state.user.height) < 30 ? 'Overweight' : 'Obese'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">Weight Progress</h2>
          {weightData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No weight data yet. Start tracking!</p>
            </div>
          ) : (
            <div className="h-64">
              <Line
                data={{
                  labels: weightData.map(d => d.date),
                  datasets: [{
                    label: 'Weight (kg)',
                    data: weightData.map(d => d.value),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                  }],
                }}
                options={chartOptions}
              />
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">Weekly Calories</h2>
          <div className="h-64">
            <Line data={calorieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark mb-4">🏆 Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center transition-all ${
                achievement.achieved
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="font-semibold text-sm">{achievement.title}</p>
              {achievement.achieved && (
                <p className="text-xs mt-1 opacity-80">✓ Unlocked</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card bg-gradient-to-br from-green-400 to-emerald-500 text-white">
          <h3 className="font-semibold mb-2">🎯 Consistency Score</h3>
          <p className="text-4xl font-bold">
            {state.foodLog.length > 0 && state.workouts.length > 0
              ? Math.min(100, Math.round((state.foodLog.length + state.workouts.length) / 2))
              : 0}%
          </p>
          <p className="text-sm mt-2 opacity-80">Keep the streak going!</p>
        </div>

        <div className="card bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
          <h3 className="font-semibold mb-2">📈 Total Entries</h3>
          <p className="text-4xl font-bold">{state.foodLog.length + state.workouts.length}</p>
          <p className="text-sm mt-2 opacity-80">Food + Workouts</p>
        </div>

        <div className="card bg-gradient-to-br from-pink-400 to-rose-500 text-white">
          <h3 className="font-semibold mb-2">❤️ Journey Days</h3>
          <p className="text-4xl font-bold">
            {state.weightHistory.length > 0
              ? Math.ceil((new Date() - new Date(state.weightHistory[0].date)) / (1000 * 60 * 60 * 24))
              : 0}
          </p>
          <p className="text-sm mt-2 opacity-80">Since you started</p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
