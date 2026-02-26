import { TrendingUp, TrendingDown } from 'lucide-react';

export const KPICard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </h3>
          {change && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                vs mes anterior
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Icon size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </div>
    </div>
  );
};