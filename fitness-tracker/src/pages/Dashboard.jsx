import { useFitness, calculateCalories, calculateBMI, calculateMacros } from '../context/FitnessContext';
import { TrendingUp, Utensils, Dumbbell, Droplets, Target } from 'lucide-react';

const Dashboard = () => {
  const { state } = useFitness();
  const { user, dailyGoals, foodLog, workouts, weightHistory } = state;

  const today = new Date().toLocaleDateString();
  
  const todayFood = foodLog.filter(entry => 
    new Date(entry.date).toLocaleDateString() === today
  );
  
  const totalCalories = todayFood.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const totalProtein = todayFood.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = todayFood.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = todayFood.reduce((sum, entry) => sum + (entry.fat || 0), 0);
  const waterIntake = todayFood.reduce((sum, entry) => sum + (entry.water || 0), 0);

  const calorieGoal = dailyGoals.calories;
  const caloriesRemaining = calorieGoal - totalCalories;
  const calorieProgress = (totalCalories / calorieGoal) * 100;

  const bmi = calculateBMI(user.weight, user.height);
  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : user.weight;

  const statCards = [
    {
      title: 'Calories',
      value: `${totalCalories}/${calorieGoal}`,
      icon: Utensils,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      subtitle: `${caloriesRemaining >= 0 ? caloriesRemaining : Math.abs(caloriesRemaining)} ${caloriesRemaining >= 0 ? 'remaining' : 'over'}`,
    },
    {
      title: 'Protein',
      value: `${totalProtein}g`,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      subtitle: `Goal: ${dailyGoals.protein}g`,
    },
    {
      title: 'Workouts',
      value: workouts.filter(w => 
        new Date(w.date).toLocaleDateString() === today
      ).length,
      icon: Dumbbell,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      subtitle: 'Today',
    },
    {
      title: 'Water',
      value: `${waterIntake}/${dailyGoals.water} glasses`,
      icon: Droplets,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-100',
      subtitle: 'Stay hydrated!',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">
          Welcome back, {user.name || 'Fitness Enthusiast'}! 👋
        </h1>
        <p className="text-gray-600">Here's your fitness overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-dark">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Calorie Progress Bar */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-dark mb-4">Calorie Progress</h2>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600">Consumed: {totalCalories} cal</span>
          <span className="text-gray-600">Goal: {calorieGoal} cal</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              calorieProgress > 100 ? 'bg-red-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(calorieProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {calorieProgress.toFixed(0)}% of daily goal
        </p>
      </div>

      {/* Macros Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">Macronutrients</h2>
          <div className="space-y-4">
            {[
              { name: 'Protein', current: totalProtein, goal: dailyGoals.protein, color: 'bg-blue-500' },
              { name: 'Carbs', current: totalCarbs, goal: dailyGoals.carbs, color: 'bg-yellow-500' },
              { name: 'Fat', current: totalFat, goal: dailyGoals.fat, color: 'bg-green-500' },
            ].map((macro, index) => {
              const percentage = (macro.current / macro.goal) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{macro.name}</span>
                    <span className="text-gray-600">{macro.current}g / {macro.goal}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${macro.color}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Metrics */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">Health Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Current Weight</p>
              <p className="text-2xl font-bold text-dark">{currentWeight || '--'} kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">BMI</p>
              <p className="text-2xl font-bold text-dark">{bmi}</p>
              <p className="text-xs text-gray-500 mt-1">
                {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Daily Goal</p>
              <p className="text-2xl font-bold text-dark">{calorieGoal} cal</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Activity Level</p>
              <p className="text-lg font-semibold text-dark capitalize">{user.activityLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark mb-4">Today's Food Log</h2>
        {todayFood.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No food entries yet today. Start tracking!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Food</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Calories</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Protein</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Carbs</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Fat</th>
                </tr>
              </thead>
              <tbody>
                {todayFood.slice(0, 5).map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{entry.name}</td>
                    <td className="py-3 px-4">{entry.calories} cal</td>
                    <td className="py-3 px-4">{entry.protein}g</td>
                    <td className="py-3 px-4">{entry.carbs}g</td>
                    <td className="py-3 px-4">{entry.fat}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {todayFood.length > 5 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                +{todayFood.length - 5} more entries. Check the Food Log for details.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
