import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl mb-6">
          🎭
        </motion.div>
        <h1 className="font-display text-8xl font-black text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">{t('notFound.title')}</h2>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">{t('notFound.subtitle')}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" /> {t('notFound.home')}
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {t('common.back')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
