import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import MoodChart from '../../components/MoodChart';
import { Users, AlertTriangle, MessageSquare, Activity, Shield, Brain, BarChart3, Heart } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 156, patients: 120, doctors: 15, totalMessages: 2340,
    totalAppointments: 89, activeUsers: 42, avgMoodScore: 58,
    highRiskMessages: 12, activeCrisisAlerts: 2
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) { console.log('Demo analytics'); }
  };

  const recentActivity = [
    { action: 'New patient registered', user: 'emma.d@email.com', time: '5 min ago', type: 'info' },
    { action: 'Crisis alert triggered', user: 'carol.w@email.com', time: '15 min ago', type: 'danger' },
    { action: 'Appointment completed', user: 'alice.j@email.com', time: '1 hour ago', type: 'success' },
    { action: 'Doctor assigned', user: 'bob.c@email.com', time: '2 hours ago', type: 'info' },
    { action: 'High risk message detected', user: 'david.p@email.com', time: '3 hours ago', type: 'warning' },
  ];

  const activityColors = {
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-lavender-500" /> Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">System-wide monitoring and management</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Users} label="Total Users" value={analytics.totalUsers} color="primary" delay={1} />
        <StatsCard icon={AlertTriangle} label="Crisis Alerts" value={analytics.activeCrisisAlerts} color="red" delay={2} />
        <StatsCard icon={MessageSquare} label="Total Messages" value={analytics.totalMessages?.toLocaleString()} color="blue" delay={3} />
        <StatsCard icon={Heart} label="Avg Mood Score" value={analytics.avgMoodScore} trend="up" color="calm" delay={4} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={Users} label="Patients" value={analytics.patients} color="primary" delay={5} />
        <StatsCard icon={Activity} label="Doctors" value={analytics.doctors} color="lavender" delay={6} />
        <StatsCard icon={Brain} label="Active Now" value={analytics.activeUsers} color="calm" delay={7} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Mood Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" /> Platform Mood Trend
          </h3>
          <MoodChart data={[]} height={250} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-calm-500" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                className={`p-3 rounded-xl border ${activityColors[item.type]}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs opacity-70">{item.user}</p>
                  </div>
                  <span className="text-xs opacity-70">{item.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
