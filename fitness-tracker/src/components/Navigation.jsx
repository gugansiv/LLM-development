import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Ruler, LineChart, Settings, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/food', icon: Utensils, label: 'Food Log' },
    { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
    { path: '/measurements', icon: Ruler, label: 'Measurements' },
    { path: '/progress', icon: LineChart, label: 'Progress' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-dark text-white fixed left-0 top-0 h-full w-64 shadow-xl z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">FitnessPro</h1>
        <p className="text-gray-400 text-sm">Track Your Journey</p>
      </div>
      
      <ul className="mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-4 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white border-r-4 border-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400">Stay consistent!</p>
          <p className="text-sm font-semibold mt-1">💪 You got this!</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
