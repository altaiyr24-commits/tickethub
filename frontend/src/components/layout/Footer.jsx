import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Instagram, Youtube, Send, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const links = [
    {
      title: t('footer.events'),
      items: [
        [t('nav.poster'),   '/events'],
        [t('nav.categories'), '/events'],
        [t('nav.hot'),      '/events?hot=true'],
        [t('nav.top'),      '/events?featured=true'],
      ],
    },
    {
      title: t('footer.company'),
      items: [
        [t('footer.about'),    '#'],
        [t('footer.contacts'), '#'],
        [t('footer.faq'),      '#'],
        [t('footer.support'),  '#'],
      ],
    },
  ];

  return (
    <footer className="border-t border-white/5 mt-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center shadow-neon-purple group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-black text-xl text-gradient">TicketHub</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-5 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="space-y-2 mb-5">
              {[
                { icon: Mail,   text: 'support@tickethub.kz' },
                { icon: Phone,  text: '+7 (727) 000-00-00' },
                { icon: MapPin, text: t('common.kazakhstan') },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-white/35">
                  <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube,   label: 'YouTube' },
                { icon: Send,      label: 'Telegram' },
              ].map(({ icon: Icon, label }) => (
                <motion.button key={label} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:border-brand-400/50 transition-all" title={label}>
                  <Icon className="w-4 h-4 text-white/50" />
                </motion.button>
              ))}
            </div>
          </div>

          {links.map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-xs text-white/50 mb-4 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-white/40 text-sm hover:text-white/80 transition-colors hover:translate-x-1 inline-block duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">{t('footer.rights', { year })}</p>
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-xs">{t('footer.madeIn')}</span>
            <span className="text-white/20 text-xs">₸ KZT</span>
            <span className="text-white/20 text-xs">🔒 SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
