import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center shadow-neon-purple"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Ticket className="w-8 h-8 text-white" />
        </motion.div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-400"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
