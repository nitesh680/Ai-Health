import { motion } from 'framer-motion';

const TypingIndicator = () => (
  <div className="flex items-start gap-3 mb-4">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
      AI
    </div>
    <div className="chat-bubble-ai flex items-center gap-1 py-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
