import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { journalAPI } from '../../services/api';
import { BookOpen, Plus, Sparkles, Trash2, X, PenLine } from 'lucide-react';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [entriesRes, promptsRes] = await Promise.all([journalAPI.getAll(), journalAPI.getPrompts()]);
      setEntries(entriesRes.data);
      setPrompts(promptsRes.data.prompts || []);
    } catch (err) {
      setPrompts([
        "What are three things you're grateful for today?",
        "Describe a moment today that made you smile.",
        "What emotion are you feeling most strongly right now?",
        "Write a letter of appreciation to yourself.",
        "What would make tomorrow a great day?"
      ]);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await journalAPI.create({ title, content, tags: [] });
      setShowCreate(false);
      setTitle('');
      setContent('');
      loadData();
    } catch (err) {
      setEntries(prev => [{ _id: Date.now(), title, content, aiSummary: 'AI analysis processing...', emotion: 'neutral', createdAt: new Date() }, ...prev]);
      setShowCreate(false);
      setTitle('');
      setContent('');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try { await journalAPI.delete(id); } catch (err) {}
    setEntries(prev => prev.filter(e => e._id !== id));
  };

  const EMOTION_COLORS = {
    anxiety: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    depression: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    happiness: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    stress: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    anger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-lavender-500" /> AI Journal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Express yourself freely — AI analyzes your emotions</p>
        </motion.div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Entry
        </motion.button>
      </div>

      {/* Writing Prompts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" /> Writing Prompts
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {prompts.slice(0, 5).map((p, i) => (
            <button key={i} onClick={() => { setShowCreate(true); setTitle('Reflection'); setContent(p + '\n\n'); }}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-600 dark:text-slate-400 
              hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 
              transition-colors border border-slate-200/50 dark:border-slate-600/50 max-w-[250px] text-left">
              "{p.substring(0, 60)}..."
            </button>
          ))}
        </div>
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-lavender-500" /> New Journal Entry
                </h3>
                <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title..." className="input-field text-lg font-semibold" />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind today..."
                  className="input-field min-h-[200px] resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleCreate} disabled={!title.trim() || !content.trim() || loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><Sparkles className="w-4 h-4" /> Save & Analyze</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-800 dark:text-white">No journal entries yet</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Start writing to track your thoughts and emotions</p>
          </div>
        ) : entries.map((entry, i) => (
          <motion.div key={entry._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 group hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">{entry.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <button onClick={() => handleDelete(entry._id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">{entry.content}</p>
            {entry.emotion && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${EMOTION_COLORS[entry.emotion] || EMOTION_COLORS.neutral}`}>
                {entry.emotion}
              </span>
            )}
            {entry.aiSummary && (
              <div className="mt-3 p-3 rounded-xl bg-lavender-50 dark:bg-lavender-900/10 border border-lavender-100 dark:border-lavender-800/30">
                <p className="text-xs font-medium text-lavender-700 dark:text-lavender-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Insight
                </p>
                <p className="text-xs text-lavender-600 dark:text-lavender-400 mt-1">{entry.aiSummary}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
