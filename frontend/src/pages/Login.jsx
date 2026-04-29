import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      const redirectPath = data.user.role === 'admin' ? '/admin/dashboard' :
                          data.user.role === 'doctor' ? '/doctor/dashboard' :
                          '/patient/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-calm-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-calm-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-lavender-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 p-12">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-calm-500 flex items-center justify-center mb-8 shadow-2xl shadow-primary-500/30">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="gradient-text">MindWell</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Your AI-powered mental health companion. Get empathetic support, track your mood, and connect with professionals.
          </p>
          <div className="space-y-3">
            {['AI-Powered Emotional Support', 'Mood Tracking & Analytics', 'Connect with Therapists'].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
                className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-calm-500" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          <div className="glass-card p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="lg:hidden w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-calm-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your wellness journey</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="input-field pl-12 pr-12" placeholder="••••••••" />
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
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">Create one</Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
            ⚕️ This chatbot is not a replacement for professional medical advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
