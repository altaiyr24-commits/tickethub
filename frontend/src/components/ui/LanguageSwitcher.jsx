import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'ru', label: 'РУС', flag: '🇷🇺' },
  { code: 'kz', label: 'ҚАЗ', flag: '🇰🇿' },
  { code: 'en', label: 'ENG', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const change = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl hover:border-brand-400/40 transition-all text-sm font-semibold"
      >
        <Globe className="w-4 h-4 text-brand-400" />
        <span>{current.flag}</span>
        <span className="hidden sm:block text-white/70">{current.label}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-36 glass-dark rounded-2xl border border-white/10 shadow-glass overflow-hidden z-50"
            >
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => change(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 ${
                    i18n.language === lang.code ? 'text-brand-400 font-semibold' : 'text-white/70'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {i18n.language === lang.code && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
