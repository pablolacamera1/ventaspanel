import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Título/Breadcrumb */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bienvenido de vuelta
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                admin@ventaspanel.com
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};