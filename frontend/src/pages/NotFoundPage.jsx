import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🎭
        </motion.div>
        <h1 className="font-display text-8xl font-black text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Страница не найдена</h2>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">
          Похоже, это событие уже закончилось или страница была перемещена
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" /> На главную
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      </motion.div>
    </div>
  );
}
