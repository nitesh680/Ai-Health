import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { moodAPI } from '../../services/api';
import MoodChart from '../../components/MoodChart';
import { Heart, Calendar, TrendingUp, Zap } from 'lucide-react';

const MoodTracker = () => {
  const [moodData, setMoodData] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { emoji: '😢', label: 'very_bad', score: 15, text: 'Terrible', color: 'border-red-300 bg-red-50 dark:bg-red-900/20' },
    { emoji: '😔', label: 'bad', score: 30, text: 'Bad', color: 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' },
    { emoji: '😐', label: 'okay', score: 50, text: 'Okay', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' },
    { emoji: '🙂', label: 'good', score: 70, text: 'Good', color: 'border-green-300 bg-green-50 dark:bg-green-900/20' },
    { emoji: '😊', label: 'great', score: 90, text: 'Great', color: 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  const triggers = ['Work', 'Family', 'Health', 'Social', 'Sleep', 'Exercise', 'Weather', 'Money'];
  const [selectedTriggers, setSelectedTriggers] = useState([]);

  useEffect(() => { loadMoodHistory(); }, []);

  const loadMoodHistory = async () => {
    try {
      const res = await moodAPI.getHistory(30);
      setMoodData(res.data);
    } catch (err) { console.log('Using demo data'); }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    try {
      await moodAPI.log({ score: selectedMood.score, label: selectedMood.label, notes, triggers: selectedTriggers });
      setSubmitted(true);
      loadMoodHistory();
    } catch (err) { setSubmitted(true); }
  };

  const toggleTrigger = (t) => {
    setSelectedTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500" /> Mood Tracker
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Track your emotional wellbeing over time</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Log Mood */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">How are you feeling?</h3>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{selectedMood?.emoji}</div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">Mood Logged!</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Thank you for checking in 💜</p>
              <button onClick={() => { setSubmitted(false); setSelectedMood(null); setNotes(''); setSelectedTriggers([]); }}
                className="btn-secondary mt-4 text-sm">Log Another</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-between gap-2">
                {moods.map((m) => (
                  <motion.button key={m.label} whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMood(m)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                      selectedMood?.label === m.label ? `${m.color} border-primary-400 shadow-lg` : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                    }`}>
                    <span className="text-4xl">{m.emoji}</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{m.text}</span>
                  </motion.button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">What's triggering this?</label>
                <div className="flex flex-wrap gap-2">
                  {triggers.map((t) => (
                    <button key={t} onClick={() => toggleTrigger(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedTriggers.includes(t)
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="input-field min-h-[80px] resize-none" placeholder="What's on your mind..." />
              </div>

              <button onClick={handleSubmit} disabled={!selectedMood}
                className="btn-primary w-full flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" /> Log Mood
              </button>
            </div>
          )}
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> Your Mood Journey
          </h3>
          <MoodChart data={moodData} height={300} />
        </motion.div>
      </div>

      {/* Mood History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-lavender-500" /> Recent Entries
        </h3>
        {moodData.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">No mood entries yet. Start tracking to see your history!</p>
        ) : (
          <div className="space-y-3">
            {moodData.slice(0, 7).map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <span className="text-2xl">{moods.find(x => x.label === m.label)?.emoji || '😐'}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-white capitalize">{(m.label || 'okay')?.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-500">{m.date ? new Date(m.date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-500">{m.score || 50}/100</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodTracker;
