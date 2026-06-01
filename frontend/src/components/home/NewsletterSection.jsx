import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Bell, Gift, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success(t('home.newsletter.success'));
    setEmail('');
    setLoading(false);
  };

  const PERKS = [
    { icon: Bell, text: t('home.newsletter.subtitle') },
    { icon: Gift, text: t('home.newsletter.subtitle') },
    { icon: Zap,  text: t('home.newsletter.subtitle') },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-14"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.12) 50%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid rgba(139,92,246,0.25)',
        }}>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-neon-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-300 mb-5 border border-brand-500/30">
              <Sparkles className="w-4 h-4" />
              <span>{t('home.newsletter.subtitle')}</span>
            </div>
            <h2 className="section-title mb-4">
              {t('home.newsletter.title')}
            </h2>
            <p className="text-white/45 mb-6 leading-relaxed">
              {t('home.newsletter.subtitle')}
            </p>
            <div className="space-y-3">
              {[Bell, Gift, Zap].map((Icon, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/55">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  {t('home.newsletter.subtitle')}
                </div>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t('home.newsletter.placeholder')}
                  className="input-field pl-12 h-14 text-base rounded-2xl w-full" required />
              </div>
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full h-14 text-base rounded-2xl flex items-center justify-center gap-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Sparkles className="w-4 h-4" /> {t('home.newsletter.button')}</>
                }
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
