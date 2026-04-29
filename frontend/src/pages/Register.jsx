import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff, Stethoscope, Shield, Heart } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'patient', label: 'Patient', icon: Heart, desc: 'Get AI support & track your wellness', color: 'from-primary-500 to-calm-500' },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope, desc: 'Monitor & support your patients', color: 'from-primary-600 to-lavender-500' },
    { id: 'admin', label: 'Admin', icon: Shield, desc: 'Manage the entire platform', color: 'from-lavender-500 to-pink-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      const redirectPath = data.user.role === 'admin' ? '/admin/dashboard' :
                          data.user.role === 'doctor' ? '/doctor/dashboard' :
                          '/patient/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-calm-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute top-10 right-20 w-80 h-80 bg-calm-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10">
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-calm-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Join MindWell</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Create your account to get started</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">I am a</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                      role === r.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                    }`}>
                    <r.icon className={`w-6 h-6 mx-auto mb-1 ${role === r.id ? 'text-primary-500' : 'text-slate-400'}`} />
                    <p className={`text-sm font-semibold ${role === r.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>{r.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="input-field pl-12" placeholder="Jane Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="input-field pl-12" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="input-field pl-12 pr-12" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign in</Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
          ⚕️ This chatbot is not a replacement for professional medical advice.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
