import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  MessageSquare, BarChart3, BookOpen, Calendar, Heart,
  Users, AlertTriangle, Settings, Shield, LogOut, Sun, Moon,
  Brain, Activity, Bell, Home, UserCog, FileText, Stethoscope,
  Gamepad2
} from 'lucide-react';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout, isPatient, isDoctor, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const patientLinks = [
    { to: '/patient/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/patient/chat', icon: MessageSquare, label: 'AI Chat' },
    { to: '/patient/mood', icon: Heart, label: 'Mood Tracker' },
    { to: '/patient/journal', icon: BookOpen, label: 'Journal' },
    { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/patient/games', icon: Gamepad2, label: 'Brain Games' },
    { to: '/patient/settings', icon: Settings, label: 'Settings' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/doctor/patients', icon: Users, label: 'My Patients' },
    { to: '/doctor/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/doctor/availability', icon: Activity, label: 'Availability' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: UserCog, label: 'Manage Users' },
    { to: '/admin/crisis', icon: AlertTriangle, label: 'Crisis Alerts' },
    { to: '/admin/audit', icon: Shield, label: 'Audit Logs' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const links = isAdmin ? adminLinks : isDoctor ? doctorLinks : patientLinks;

  const roleColors = {
    patient: 'from-primary-500 to-calm-500',
    doctor: 'from-primary-600 to-lavender-500',
    admin: 'from-lavender-500 to-pink-500'
  };

  const roleLabels = {
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Administrator'
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col
        bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl 
        border-r border-slate-200/50 dark:border-slate-700/50 
        shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40
        transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center shadow-lg`}>
          <Brain className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-xl font-bold gradient-text">MindWell</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabels[user?.role] || 'User'} Panel</p>
          </motion.div>
        )}
      </div>

      {/* Profile card */}
      {!collapsed && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center text-white font-bold text-sm`}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-3' : ''}`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 space-y-1 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
          onClick={toggleTheme}
          className={`sidebar-link w-full ${collapsed ? 'justify-center px-3' : ''}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'justify-center px-3' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Disclaimer */}
      {!collapsed && (
        <div className="p-3">
          <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center leading-tight">
            ⚕️ This chatbot is not a replacement for professional medical advice.
          </p>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
