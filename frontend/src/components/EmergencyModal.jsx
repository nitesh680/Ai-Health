import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Heart, X, ExternalLink } from 'lucide-react';

const HELPLINES = [
  { name: 'National Crisis Helpline (US)', number: '988', desc: 'Suicide & Crisis Lifeline' },
  { name: 'iCALL (India)', number: '9152987821', desc: 'Psychosocial Helpline' },
  { name: 'Vandrevala Foundation (India)', number: '1860-2662-345', desc: '24/7 Mental Health Support' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'Text-based Support' },
];

const EmergencyModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center emergency-glow">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">You're Not Alone</h2>
                  <p className="text-white/80 text-sm">Immediate help is available</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Breathing exercise */}
              <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-primary-700 dark:text-primary-300">Quick Breathing Exercise</h3>
                </div>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Breathe in for 4 seconds... Hold for 7 seconds... Breathe out for 8 seconds. 
                  Repeat 3 times. You are safe.
                </p>
              </div>

              {/* Helplines */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Crisis Helplines</h3>
                <div className="space-y-2">
                  {HELPLINES.map((line, i) => (
                    <a
                      key={i}
                      href={`tel:${line.number.replace(/\D/g, '')}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{line.name}</p>
                        <p className="text-xs text-slate-500">{line.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">{line.number}</span>
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-2">
                ⚕️ This chatbot is not a replacement for professional medical advice. 
                If you are in immediate danger, please call your local emergency services.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyModal;
