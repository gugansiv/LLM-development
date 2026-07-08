import { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Plus, Trash2, Search } from 'lucide-react';

const FoodLog = () => {
  const { state, dispatch } = useFitness();
  const [newEntry, setNewEntry] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    water: 0,
    mealType: 'breakfast',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toLocaleDateString();
  const todayFood = state.foodLog.filter(entry =>
    new Date(entry.date).toLocaleDateString() === today
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.name || !newEntry.calories) return;

    dispatch({
      type: 'ADD_FOOD_ENTRY',
      payload: {
        ...newEntry,
        calories: Number(newEntry.calories),
        protein: Number(newEntry.protein) || 0,
        carbs: Number(newEntry.carbs) || 0,
        fat: Number(newEntry.fat) || 0,
        water: Number(newEntry.water) || 0,
        date: new Date().toISOString(),
      },
    });

    setNewEntry({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      water: 0,
      mealType: 'breakfast',
    });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_FOOD_ENTRY', payload: id });
  };

  const filteredFood = todayFood.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCalories = todayFood.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const totalProtein = todayFood.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = todayFood.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = todayFood.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  const quickAddFoods = [
    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Rice (1 cup)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
    { name: 'Egg (1 large)', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
    { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
    { name: 'Oats (1 cup)', calories: 150, protein: 5, carbs: 27, fat: 2.5 },
    { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  ];

  const handleQuickAdd = (food) => {
    dispatch({
      type: 'ADD_FOOD_ENTRY',
      payload: {
        ...food,
        water: 0,
        mealType: 'snack',
        date: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-dark mb-6">🍽️ Food Log</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Food Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Food Entry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
                <input
                  type="text"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories *</label>
                <input
                  type="number"
                  value={newEntry.calories}
                  onChange={(e) => setNewEntry({ ...newEntry, calories: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 350"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newEntry.protein}
                    onChange={(e) => setNewEntry({ ...newEntry, protein: e.target.value })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={newEntry.carbs}
                    onChange={(e) => setNewEntry({ ...newEntry, carbs: e.target.value })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={newEntry.fat}
                    onChange={(e) => setNewEntry({ ...newEntry, fat: e.target.value })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  value={newEntry.mealType}
                  onChange={(e) => setNewEntry({ ...newEntry, mealType: e.target.value })}
                  className="input-field"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full">
                Add Entry
              </button>
            </form>

            {/* Quick Add Foods */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-dark mb-3">Quick Add</h3>
              <div className="space-y-2">
                {quickAddFoods.map((food, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAdd(food)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded transition text-sm"
                  >
                    <span className="font-medium">{food.name}</span>
                    <span className="text-gray-500 ml-2">{food.calories} cal</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Food List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Calories</p>
              <p className="text-2xl font-bold text-orange-600">{totalCalories}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-2xl font-bold text-blue-600">{totalProtein}g</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-2xl font-bold text-yellow-600">{totalCarbs}g</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Fat</p>
              <p className="text-2xl font-bold text-green-600">{totalFat}g</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark">Today's Entries</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search food..."
                />
              </div>
            </div>

            {filteredFood.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No food entries found for today.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Food</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Meal</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Calories</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Protein</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Carbs</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Fat</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFood.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{entry.name}</td>
                        <td className="py-3 px-4 capitalize">{entry.mealType}</td>
                        <td className="py-3 px-4">{entry.calories}</td>
                        <td className="py-3 px-4">{entry.protein}g</td>
                        <td className="py-3 px-4">{entry.carbs}g</td>
                        <td className="py-3 px-4">{entry.fat}g</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
