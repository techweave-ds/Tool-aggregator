import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import CategoryGrid from '@/components/sections/CategoryGrid';
import FeaturedTools from '@/components/sections/FeaturedTools';
import WorkflowSection from '@/components/sections/WorkflowSection';
import RecentUpdates from '@/components/sections/RecentUpdates';
import FooterSection from '@/components/sections/FooterSection';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <CategoryGrid />
      <FeaturedTools />
      <WorkflowSection />
      <RecentUpdates />
      <FooterSection />
    </main>
  );
}
