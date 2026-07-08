import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FitnessProvider } from './context/FitnessContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Workouts from './pages/Workouts';
import Measurements from './pages/Measurements';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

function App() {
  return (
    <FitnessProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          <Navigation />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/food" element={<FoodLog />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FitnessProvider>
  );
}

export default App;
