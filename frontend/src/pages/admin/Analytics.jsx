import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import MoodChart from '../../components/MoodChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const barData = [
    { name: 'Mon', messages: 120, sessions: 45 },
    { name: 'Tue', messages: 180, sessions: 62 },
    { name: 'Wed', messages: 150, sessions: 55 },
    { name: 'Thu', messages: 210, sessions: 78 },
    { name: 'Fri', messages: 190, sessions: 70 },
    { name: 'Sat', messages: 90, sessions: 30 },
    { name: 'Sun', messages: 75, sessions: 25 },
  ];

  const emotionData = [
    { name: 'Anxiety', value: 30, color: '#f59e0b' },
    { name: 'Depression', value: 25, color: '#3b82f6' },
    { name: 'Stress', value: 20, color: '#f97316' },
    { name: 'Happiness', value: 15, color: '#22c55e' },
    { name: 'Anger', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-500" /> Platform Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed insights into platform usage and mental health trends</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Messages & Sessions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="messages" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Messages" />
              <Bar dataKey="sessions" fill="#22c55e" radius={[6, 6, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Emotion Distribution</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie data={emotionData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={5} dataKey="value">
                  {emotionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {emotionData.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{e.name}</span>
                  <span className="ml-auto text-sm font-bold text-slate-800 dark:text-white">{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mood Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Platform Mood Trend (14 Days)</h3>
        <MoodChart data={[]} height={300} />
      </motion.div>
    </div>
  );
};

export default Analytics;
