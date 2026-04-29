import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { moodAPI, userAPI } from '../../services/api';
import api from '../../services/api';
import StatsCard from '../../components/StatsCard';
import MoodChart from '../../components/MoodChart';
import EmergencyModal from '../../components/EmergencyModal';
import { Heart, Brain, Calendar, Target, AlertTriangle, Flame, TrendingUp, Smile, BookOpen, Activity, Award, Shield, Play, Pause, X, Music, Footprints, Wind, Sun, Moon } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [analytics, setAnalytics] = useState({ avgScore: 65, trend: 'stable', totalEntries: 0 });
  const [dailyCheckIn, setDailyCheckIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState('Low');
  const [profile, setProfile] = useState(null);
  
  // Activity modals state
  const [activeActivity, setActiveActivity] = useState(null);
  const [meditationState, setMeditationState] = useState({ isPlaying: false, timeLeft: 300, breathPhase: 'inhale' });
  const [walkState, setWalkState] = useState({ isWalking: false, timeLeft: 600, steps: 0 });
  const [musicState, setMusicState] = useState({ isPlaying: false, currentTrack: 0 });

  useEffect(() => {
    loadData();
  }, [user?.id]);

  // Meditation timer effect
  useEffect(() => {
    let interval;
    if (meditationState.isPlaying && meditationState.timeLeft > 0) {
      interval = setInterval(() => {
        setMeditationState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          // Cycle through breathing phases (4 seconds each)
          const cyclePosition = (300 - newTimeLeft) % 12;
          let newPhase = prev.breathPhase;
          if (cyclePosition < 4) newPhase = 'inhale';
          else if (cyclePosition < 8) newPhase = 'hold';
          else newPhase = 'exhale';
          
          if (newTimeLeft <= 0) {
            return { ...prev, timeLeft: 0, isPlaying: false, breathPhase: 'exhale' };
          }
          return { ...prev, timeLeft: newTimeLeft, breathPhase: newPhase };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [meditationState.isPlaying]);

  // Walk timer effect
  useEffect(() => {
    let interval;
    if (walkState.isWalking && walkState.timeLeft > 0) {
      interval = setInterval(() => {
        setWalkState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          // Simulate steps (about 100 steps per minute)
          const newSteps = prev.steps + Math.floor(Math.random() * 3) + 1;
          
          if (newTimeLeft <= 0) {
            return { ...prev, timeLeft: 0, isWalking: false, steps: newSteps };
          }
          return { ...prev, timeLeft: newTimeLeft, steps: newSteps };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [walkState.isWalking]);

  const loadData = async () => {
    // Fetch profile data separately to ensure badges and contacts load
    try {
      if (user?.id) {
        const profileRes = await userAPI.getProfile(user.id);
        setProfile(profileRes.data);
        console.log('Profile loaded:', profileRes.data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }

    // Fetch other data
    try {
      const [moodRes, analyticsRes, stressRes] = await Promise.all([
        moodAPI.getHistory(30),
        moodAPI.getAnalytics(),
        api.get('/chat/stress')
      ]);
      setMoodData(moodRes.data);
      setAnalytics(analyticsRes.data);
      setStressLevel(stressRes.data.stressLevel || 'Low');
    } catch (err) {
      console.log('Using demo data for mood/stress');
    }
  };

  const moodEmojis = [
    { emoji: '😢', label: 'very_bad', score: 15, text: 'Terrible' },
    { emoji: '😔', label: 'bad', score: 30, text: 'Bad' },
    { emoji: '😐', label: 'okay', score: 50, text: 'Okay' },
    { emoji: '🙂', label: 'good', score: 70, text: 'Good' },
    { emoji: '😊', label: 'great', score: 90, text: 'Great' },
    { emoji: '🤬', label: 'angry', score: 10, text: 'angry' },
  ];

  const handleMoodCheckIn = async (mood) => {
    setSelectedMood(mood);
    try {
      await moodAPI.log({ score: mood.score, label: mood.label, emotions: [], notes: '' });
      setDailyCheckIn(true);
    } catch (err) {
      setDailyCheckIn(true); // Still show success for demo
    }
  };

  const copingSuggestions = [
    { icon: '🧘', title: '5-Minute Meditation', desc: 'Start with guided breathing', action: 'meditation', color: 'from-purple-500 to-indigo-500' },
    { icon: '📝', title: 'Gratitude Journal', desc: 'Write 3 things you\'re grateful for', action: 'journal', color: 'from-green-500 to-emerald-500' },
    { icon: '🚶', title: 'Take a Walk', desc: '10 minutes of light exercise', action: 'walk', color: 'from-orange-500 to-amber-500' },
    { icon: '🎵', title: 'Calming Music', desc: 'Listen to soothing sounds', action: 'music', color: 'from-blue-500 to-cyan-500' },
  ];

  const handleActivityClick = (action) => {
    if (action === 'journal') {
      navigate('/patient/journal');
    } else {
      setActiveActivity(action);
      if (action === 'meditation') {
        setMeditationState({ isPlaying: false, timeLeft: 300, breathPhase: 'inhale' });
      } else if (action === 'walk') {
        setWalkState({ isWalking: false, timeLeft: 600, steps: 0 });
      } else if (action === 'music') {
        setMusicState({ isPlaying: false, currentTrack: 0 });
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <EmergencyModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your wellness overview for today</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmergency(true)}
          className="btn-danger flex items-center gap-2 emergency-glow self-start"
        >
          <AlertTriangle className="w-5 h-5" />
          Emergency Help
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard icon={Heart} label="Avg Mood Score" value={analytics.avgScore} trend={analytics.trend === 'improving' ? 'up' : analytics.trend === 'declining' ? 'down' : 'stable'} color="primary" delay={1} />
        <StatsCard icon={Activity} label="Stress Level" value={stressLevel} color={stressLevel === 'High' ? 'danger' : stressLevel === 'Medium' ? 'orange' : 'calm'} delay={2} />
        <StatsCard icon={Flame} label="Current Streak" value={`${profile?.streaks || user?.streaks || 0} days`} color="orange" delay={3} />
        <StatsCard icon={BookOpen} label="Journal Entries" value={analytics.totalEntries || 0} color="lavender" delay={4} />
        <StatsCard icon={Target} label="Reward Points" value={profile?.points || user?.points || 0} color="primary" delay={5} />
      </div>

      {/* Daily Check-in + Mood Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Check-in */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Smile className="w-5 h-5 text-primary-500" /> Daily Check-in
          </h3>
          {dailyCheckIn ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">{selectedMood?.emoji || '🙂'}</div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">Thanks for checking in!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You're feeling {selectedMood?.text || 'good'} today</p>
              <div className="mt-4 px-4 py-2 rounded-xl bg-calm-50 dark:bg-calm-900/20 text-calm-700 dark:text-calm-400 text-sm">
                ✨ Keep going! Your streak is growing.
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">How are you feeling right now?</p>
              <div className="flex justify-between gap-2">
                {moodEmojis.map((mood) => (
                  <motion.button key={mood.label} whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}
                    onClick={() => handleMoodCheckIn(mood)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{mood.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Mood Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> Mood Trends (Last 14 Days)
          </h3>
          <MoodChart data={moodData} height={220} />
        </motion.div>
      </div>

      {/* Gamification & Family Guardian Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> Your Badges
          </h3>
          {profile?.badges?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {profile.badges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <span className="text-xl">{badge.icon || '🏆'}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400">
              <p className="text-sm">No badges yet. Keep tracking your mood and writing journals to earn badges!</p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total Points</span>
              <span className="font-bold text-primary-500">{profile?.points || 0} pts</span>
            </div>
          </div>
        </motion.div>

        {/* Family Guardian Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-500" /> Family Guardian Mode
          </h3>
          {profile?.trustedContacts?.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {profile.trustedContacts.filter(c => c.consentGiven).length} of {profile.trustedContacts.length} contacts can receive crisis alerts
              </p>
              <div className="flex -space-x-2">
                {profile.trustedContacts.slice(0, 5).map((contact, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white dark:border-slate-800 ${contact.consentGiven ? 'bg-green-500' : 'bg-slate-400'}`}>
                    {contact.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                ))}
                {profile.trustedContacts.length > 5 && (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm font-bold border-2 border-white dark:border-slate-800">
                    +{profile.trustedContacts.length - 5}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No trusted contacts added yet.</p>
              <button onClick={() => window.location.href = '/patient/settings'} className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                Add contacts in Settings →
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Coping Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-lavender-500" /> Suggested Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {copingSuggestions.map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleActivityClick(item.action)}
              className="glass-card p-5 cursor-pointer group hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-3 shadow-md`}>
                {item.icon}
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-500 transition-colors">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Meditation Modal */}
      {activeActivity === 'meditation' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-md w-full text-center"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Wind className="w-6 h-6 text-purple-500" /> 5-Minute Meditation
              </h3>
              <button onClick={() => setActiveActivity(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-primary-500 mb-4">
                {formatTime(meditationState.timeLeft)}
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-400">
                {meditationState.breathPhase === 'inhale' && 'Breathe In...'}
                {meditationState.breathPhase === 'hold' && 'Hold...'}
                {meditationState.breathPhase === 'exhale' && 'Breathe Out...'}
              </div>
            </div>

            <div className="w-32 h-32 mx-auto mb-6 relative">
              <motion.div
                animate={{
                  scale: meditationState.breathPhase === 'inhale' ? 1.5 : meditationState.breathPhase === 'hold' ? 1.5 : 1,
                  opacity: meditationState.isPlaying ? 0.6 : 0.3
                }}
                transition={{ duration: meditationState.breathPhase === 'inhale' ? 4 : meditationState.breathPhase === 'exhale' ? 4 : 0 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wind className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setMeditationState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                className="btn-primary flex items-center gap-2 px-6"
              >
                {meditationState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {meditationState.isPlaying ? 'Pause' : 'Start'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Walk Modal */}
      {activeActivity === 'walk' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-md w-full text-center"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Footprints className="w-6 h-6 text-orange-500" /> Take a Walk
              </h3>
              <button onClick={() => setActiveActivity(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-5xl font-bold text-orange-500 mb-2">
                {formatTime(walkState.timeLeft)}
              </div>
              <p className="text-slate-600 dark:text-slate-400">10 minutes of light exercise</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 mb-6">
              <Footprints className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                {walkState.steps} steps
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Keep moving!</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setWalkState(prev => ({ ...prev, isWalking: !prev.isWalking }))}
                className="btn-primary bg-gradient-to-r from-orange-500 to-amber-500 flex items-center gap-2 px-6"
              >
                {walkState.isWalking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {walkState.isWalking ? 'Pause' : 'Start Walking'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Music Modal */}
      {activeActivity === 'music' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Music className="w-6 h-6 text-blue-500" /> Mind Relaxing Music
              </h3>
              <button onClick={() => setActiveActivity(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Playlist Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { id: 'piano', name: 'Piano', icon: Music, color: 'purple' },
                { id: 'nature', name: 'Nature', icon: Wind, color: 'green' },
                { id: 'morning', name: 'Morning', icon: Sun, color: 'orange' },
                { id: 'sleep', name: 'Sleep', icon: Moon, color: 'indigo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMusicState(prev => ({ ...prev, currentPlaylist: tab.id }))}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    musicState.currentPlaylist === tab.id
                      ? `bg-${tab.color}-500 text-white shadow-lg`
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* YouTube Video Embed - Using Real Working Videos */}
            <div className="relative rounded-xl overflow-hidden mb-4 bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                width="100%"
                height="100%"
                src={{
                  piano: 'https://www.youtube.com/embed/3NycM9lYdRI?autoplay=1&mute=0',
                  nature: 'https://www.youtube.com/embed/eKFTSSKCzWA?autoplay=1&mute=0',
                  morning: 'https://www.youtube.com/embed/1ZYbU82GVz4?autoplay=1&mute=0',
                  sleep: 'https://www.youtube.com/embed/yIQd2Ya0Ziw?autoplay=1&mute=0',
                }[musicState.currentPlaylist || 'piano']}
                title="Relaxing Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>

            {/* Playlist Info */}
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                🎵 Playing: {{ piano: 'Relaxing Piano Music', nature: 'Nature Sounds & Forest', morning: 'Morning Meditation Music', sleep: 'Deep Sleep Music' }[musicState.currentPlaylist || 'piano']}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PatientDashboard;
