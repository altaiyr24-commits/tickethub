import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import HotEvents from '@/components/home/HotEvents';
import StatsSection from '@/components/home/StatsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>TicketHub — Билеты на лучшие события Казахстана</title>
      </Helmet>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEvents />
      <StatsSection />
      <HotEvents />
      <NewsletterSection />
    </>
  );
}
