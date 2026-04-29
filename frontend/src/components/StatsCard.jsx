import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, trend, color = 'primary', delay = 0 }) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    calm: 'from-calm-500 to-calm-600',
    lavender: 'from-lavender-500 to-lavender-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600',
  };

  const bgColors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    calm: 'bg-calm-50 dark:bg-calm-900/20',
    lavender: 'bg-lavender-50 dark:bg-lavender-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 font-medium ${
              trend === 'up' ? 'text-calm-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${bgColors[color]} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 bg-gradient-to-br ${colors[color]} bg-clip-text`} style={{ color: `var(--tw-gradient-from)` }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
