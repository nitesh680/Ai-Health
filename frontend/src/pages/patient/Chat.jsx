import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import VoiceInput from '../../components/VoiceInput';
import TypingIndicator from '../../components/TypingIndicator';
import EmergencyModal from '../../components/EmergencyModal';
import { v4 as uuidv4 } from '../../utils/uuid';

const EMOTION_BADGES = {
  anxiety: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', emoji: '😰' },
  depression: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', emoji: '😔' },
  anger: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', emoji: '😠' },
  happiness: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', emoji: '😊' },
  stress: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', emoji: '😫' },
  loneliness: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', emoji: '😞' },
  neutral: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', emoji: '😐' },
};

const PatientChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [showEmergency, setShowEmergency] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: 'welcome',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your MindWell companion. I'm here to listen, support, and help you through whatever you're feeling.\n\nHow are you doing today? Feel free to share anything on your mind.`,
      type: 'ai',
      emotion: 'happiness',
      timestamp: new Date()
    }]);
  }, [user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      content: text.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowTyping(true);

    try {
      const res = await chatAPI.sendAI({ message: text.trim(), sessionId, language });
      const { aiMessage, analysis, response } = res.data;

      // Check for crisis
      if (analysis.crisis || analysis.riskScore >= 70) {
        setShowEmergency(true);
      }

      setTimeout(() => {
        setShowTyping(false);
        setMessages(prev => [...prev, {
          id: aiMessage?._id || Date.now().toString() + '_ai',
          content: response.message || aiMessage?.content,
          type: 'ai',
          emotion: analysis.emotion,
          sentiment: analysis.sentiment,
          riskScore: analysis.riskScore,
          suggestions: response.suggestions,
          timestamp: new Date()
        }]);
      }, 800 + Math.random() * 1200);
    } catch (err) {
      setShowTyping(false);
      // Fallback response for demo
      const fallbackResponses = [
        "Thank you for sharing that with me. I'm here to listen. Can you tell me more about how you're feeling?",
        "I appreciate your openness. Remember, it's okay to not be okay. What's on your mind?",
        "I hear you. Your feelings are valid. Would you like to explore what might be causing these feelings?",
        "Thank you for trusting me with this. Let's work through it together. What would help you most right now?"
      ];
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_ai',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        type: 'ai',
        emotion: 'neutral',
        timestamp: new Date()
      }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
    sendMessage(transcript);
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-2rem)] max-w-4xl mx-auto p-2 sm:p-4">
      <EmergencyModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />

      {/* Chat Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-calm-500 flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">MindWell AI</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Always here for you</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            className="text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-0 text-slate-700 dark:text-slate-300 px-3 py-1.5 cursor-pointer">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmergency(true)}
            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <AlertTriangle className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-4 scroll-smooth">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                  AI
                </div>
              )}

              <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>

                {/* Emotion badge + risk */}
                {msg.type === 'ai' && msg.emotion && msg.emotion !== 'supportive' && (
                  <div className="flex items-center gap-2 mt-1.5 px-1">
                    {EMOTION_BADGES[msg.emotion] && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EMOTION_BADGES[msg.emotion].color}`}>
                        {EMOTION_BADGES[msg.emotion].emoji} {msg.emotion}
                      </span>
                    )}
                    {msg.riskScore != null && msg.riskScore > 0 && (
                      <span className={`text-xs font-medium ${getRiskColor(msg.riskScore)}`}>
                        Risk: {msg.riskScore}%
                      </span>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 px-1">
                    {msg.suggestions.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 
                        hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors border border-primary-100 dark:border-primary-800">
                        <Sparkles className="w-3 h-3 inline mr-1" />{s}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 px-1">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>

              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {showTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-3 flex items-center gap-2">
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share what's on your mind..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white 
          placeholder-slate-400 dark:placeholder-slate-500 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          disabled={loading}
        />
        <motion.button type="submit" disabled={!input.trim() || loading}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-calm-500 text-white shadow-lg shadow-primary-500/20 
          disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-shadow">
          <Send className="w-5 h-5" />
        </motion.button>
      </motion.form>
    </div>
  );
};

export default PatientChat;
