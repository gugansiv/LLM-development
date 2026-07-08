import { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Plus, Trash2, Dumbbell, Timer, Flame } from 'lucide-react';

const Workouts = () => {
  const { state, dispatch } = useFitness();
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'cardio',
    duration: '',
    caloriesBurned: '',
    intensity: 'moderate',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newWorkout.name || !newWorkout.duration) return;

    dispatch({
      type: 'ADD_WORKOUT',
      payload: {
        ...newWorkout,
        duration: Number(newWorkout.duration),
        caloriesBurned: Number(newWorkout.caloriesBurned) || 0,
        date: new Date().toISOString(),
      },
    });

    setNewWorkout({
      name: '',
      type: 'cardio',
      duration: '',
      caloriesBurned: '',
      intensity: 'moderate',
      notes: '',
    });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_WORKOUT', payload: id });
  };

  const today = new Date().toLocaleDateString();
  const todayWorkouts = state.workouts.filter(workout =>
    new Date(workout.date).toLocaleDateString() === today
  );

  const totalCaloriesBurned = todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalDuration = todayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);

  const quickWorkouts = [
    { name: 'Morning Run', type: 'cardio', duration: 30, caloriesBurned: 300, intensity: 'moderate' },
    { name: 'HIIT Session', type: 'hiit', duration: 20, caloriesBurned: 250, intensity: 'high' },
    { name: 'Yoga Flow', type: 'flexibility', duration: 45, caloriesBurned: 150, intensity: 'low' },
    { name: 'Weight Training', type: 'strength', duration: 60, caloriesBurned: 200, intensity: 'moderate' },
    { name: 'Cycling', type: 'cardio', duration: 45, caloriesBurned: 400, intensity: 'moderate' },
  ];

  const handleQuickAdd = (workout) => {
    dispatch({
      type: 'ADD_WORKOUT',
      payload: {
        ...workout,
        notes: '',
        date: new Date().toISOString(),
      },
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'hiit': return '🔥';
      case 'flexibility': return '🧘';
      default: return '🏋️';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-dark mb-6">💪 Workouts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Workout Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Log Workout
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name *</label>
                <input
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Evening Run"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                  className="input-field"
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength Training</option>
                  <option value="hiit">HIIT</option>
                  <option value="flexibility">Flexibility/Yoga</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                    className="input-field"
                    placeholder="30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                  <input
                    type="number"
                    value={newWorkout.caloriesBurned}
                    onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: e.target.value })}
                    className="input-field"
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                <select
                  value={newWorkout.intensity}
                  onChange={(e) => setNewWorkout({ ...newWorkout, intensity: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="veryHigh">Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="How did it feel?"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Add Workout
              </button>
            </form>

            {/* Quick Add Workouts */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-dark mb-3">Quick Add</h3>
              <div className="space-y-2">
                {quickWorkouts.map((workout, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAdd(workout)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded transition text-sm flex items-center"
                  >
                    <span className="mr-2">{getTypeIcon(workout.type)}</span>
                    <div>
                      <span className="font-medium block">{workout.name}</span>
                      <span className="text-gray-500 text-xs">{workout.duration} min • {workout.caloriesBurned} cal</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workout List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg flex items-center">
              <Dumbbell className="w-10 h-10 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Workouts Today</p>
                <p className="text-2xl font-bold text-purple-600">{todayWorkouts.length}</p>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg flex items-center">
              <Flame className="w-10 h-10 text-orange-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Calories Burned</p>
                <p className="text-2xl font-bold text-orange-600">{totalCaloriesBurned}</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex items-center">
              <Timer className="w-10 h-10 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Active Minutes</p>
                <p className="text-2xl font-bold text-blue-600">{totalDuration}</p>
              </div>
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="card">
            <h2 className="text-xl font-bold text-dark mb-4">Today's Workouts</h2>

            {todayWorkouts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No workouts logged today. Get moving!</p>
            ) : (
              <div className="space-y-4">
                {todayWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="border rounded-lg p-4 hover:shadow-md transition flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                        {getTypeIcon(workout.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark">{workout.name}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                          <span className="capitalize">{workout.type}</span>
                          <span>•</span>
                          <span>{workout.duration} min</span>
                          <span>•</span>
                          <span className="capitalize">{workout.intensity}</span>
                          {workout.caloriesBurned > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-orange-600">{workout.caloriesBurned} cal</span>
                            </>
                          )}
                        </div>
                        {workout.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">"{workout.notes}"</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-500 hover:text-red-700 transition p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Workouts History */}
          {state.workouts.length > todayWorkouts.length && (
            <div className="card">
              <h2 className="text-xl font-bold text-dark mb-4">Recent History</h2>
              <div className="space-y-3">
                {state.workouts
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((workout) => (
                    <div
                      key={workout.id}
                      className="border-b pb-3 last:border-0 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getTypeIcon(workout.type)}</span>
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(workout.date).toLocaleDateString()} • {workout.duration} min
                          </p>
                        </div>
                      </div>
                      <span className="text-orange-600 font-semibold">{workout.caloriesBurned} cal</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
