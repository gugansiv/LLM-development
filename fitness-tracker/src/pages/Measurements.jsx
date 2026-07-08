import { useState } from 'react';
import { useFitness, calculateBMI } from '../context/FitnessContext';
import { Plus, Trash2, Ruler, Weight } from 'lucide-react';

const Measurements = () => {
  const { state, dispatch } = useFitness();
  const [newMeasurement, setNewMeasurement] = useState({
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    calves: '',
    neck: '',
    shoulders: '',
  });

  const [newWeight, setNewWeight] = useState({
    weight: '',
    bodyFat: '',
  });

  const handleSubmitMeasurement = (e) => {
    e.preventDefault();
    const hasValue = Object.values(newMeasurement).some(v => v !== '');
    if (!hasValue) return;

    dispatch({
      type: 'ADD_MEASUREMENT',
      payload: {
        chest: Number(newMeasurement.chest) || null,
        waist: Number(newMeasurement.waist) || null,
        hips: Number(newMeasurement.hips) || null,
        biceps: Number(newMeasurement.biceps) || null,
        thighs: Number(newMeasurement.thighs) || null,
        calves: Number(newMeasurement.calves) || null,
        neck: Number(newMeasurement.neck) || null,
        shoulders: Number(newMeasurement.shoulders) || null,
      },
    });

    setNewMeasurement({
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: '',
      calves: '',
      neck: '',
      shoulders: '',
    });
  };

  const handleSubmitWeight = (e) => {
    e.preventDefault();
    if (!newWeight.weight) return;

    dispatch({
      type: 'ADD_WEIGHT_ENTRY',
      payload: {
        weight: Number(newWeight.weight),
        bodyFat: Number(newWeight.bodyFat) || null,
      },
    });

    setNewWeight({
      weight: '',
      bodyFat: '',
    });
  };

  const latestMeasurements = state.measurements.length > 0
    ? state.measurements[state.measurements.length - 1]
    : null;

  const latestWeight = state.weightHistory.length > 0
    ? state.weightHistory[state.weightHistory.length - 1]
    : state.user.weight;

  const bmi = calculateBMI(latestWeight, state.user.height);

  const measurementFields = [
    { key: 'chest', label: 'Chest', icon: '📏' },
    { key: 'waist', label: 'Waist', icon: '⭕' },
    { key: 'hips', label: 'Hips', icon: '📐' },
    { key: 'biceps', label: 'Biceps (L/R)', icon: '💪' },
    { key: 'thighs', label: 'Thighs', icon: '🦵' },
    { key: 'calves', label: 'Calves', icon: '🦵' },
    { key: 'neck', label: 'Neck', icon: '📍' },
    { key: 'shoulders', label: 'Shoulders', icon: '📊' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-dark mb-6">📏 Body Measurements</h1>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Weight</p>
              <p className="text-3xl font-bold mt-1">{latestWeight || '--'} kg</p>
            </div>
            <Weight className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">BMI</p>
              <p className="text-3xl font-bold mt-1">{bmi}</p>
              <p className="text-xs text-green-100 mt-1">
                {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
              </p>
            </div>
            <Ruler className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Body Fat</p>
              <p className="text-3xl font-bold mt-1">{latestWeight?.bodyFat || '--'}%</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Entries</p>
              <p className="text-3xl font-bold mt-1">{state.measurements.length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Weight Entry */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
            <Weight className="w-5 h-5 mr-2" />
            Log Weight
          </h2>
          <form onSubmit={handleSubmitWeight} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                value={newWeight.weight}
                onChange={(e) => setNewWeight({ ...newWeight, weight: e.target.value })}
                className="input-field"
                placeholder="e.g., 75.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat % (optional)</label>
              <input
                type="number"
                step="0.1"
                value={newWeight.bodyFat}
                onChange={(e) => setNewWeight({ ...newWeight, bodyFat: e.target.value })}
                className="input-field"
                placeholder="e.g., 15.5"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Log Weight
            </button>
          </form>
        </div>

        {/* Add Body Measurements */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
            <Ruler className="w-5 h-5 mr-2" />
            Add Measurements (cm)
          </h2>
          <form onSubmit={handleSubmitMeasurement} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {measurementFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {field.icon} {field.label}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMeasurement[field.key]}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, [field.key]: e.target.value })}
                    className="input-field"
                    placeholder="cm"
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-secondary w-full">
              Save Measurements
            </button>
          </form>
        </div>
      </div>

      {/* Latest Measurements */}
      {latestMeasurements && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-dark mb-4">Latest Measurements</h2>
          <p className="text-sm text-gray-500 mb-4">
            Recorded on {new Date(latestMeasurements.date).toLocaleDateString()}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {measurementFields.map((field) => {
              const value = latestMeasurements[field.key];
              return (
                <div key={field.key} className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">{field.icon} {field.label}</p>
                  <p className="text-xl font-bold text-dark">{value ? `${value} cm` : '--'}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weight History */}
      {state.weightHistory.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-dark mb-4">Weight History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Weight (kg)</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Body Fat %</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">BMI</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {state.weightHistory.slice().reverse().map((entry, index, arr) => {
                  const prevEntry = arr[index + 1];
                  const change = prevEntry ? entry.weight - prevEntry.weight : 0;
                  const entryBmi = calculateBMI(entry.weight, state.user.height);
                  
                  return (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold">{entry.weight} kg</td>
                      <td className="py-3 px-4">{entry.bodyFat ? `${entry.bodyFat}%` : '--'}</td>
                      <td className="py-3 px-4">{entryBmi}</td>
                      <td className={`py-3 px-4 font-medium ${
                        change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Measurement History */}
      {state.measurements.length > 1 && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-dark mb-4">Measurement History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                  {measurementFields.slice(0, 6).map((field) => (
                    <th key={field.key} className="text-left py-3 px-4 text-gray-600 font-medium text-sm">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.measurements.slice().reverse().map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(entry.date).toLocaleDateString()}</td>
                    {measurementFields.slice(0, 6).map((field) => (
                      <td key={field.key} className="py-3 px-4">
                        {entry[field.key] ? `${entry[field.key]}` : '--'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Measurements;
