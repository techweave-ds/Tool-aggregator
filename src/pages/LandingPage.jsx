import { useState, useEffect } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import CategoryGrid from '@/components/sections/CategoryGrid';
import FeaturedTools from '@/components/sections/FeaturedTools';
import WorkflowSection from '@/components/sections/WorkflowSection';
import RecentUpdates from '@/components/sections/RecentUpdates';
import AnalyticsSection from '@/components/sections/AnalyticsSection';
import DiscoveryCarousels from '@/components/sections/DiscoveryCarousels';
import FooterSection from '@/components/sections/FooterSection';
import StackBuilder from '@/components/ui/StackBuilder';
import { Sparkles } from 'lucide-react';
import useDiscoveryStore from '@/stores/discoveryStore';

export default function LandingPage() {
  const [stackOpen, setStackOpen] = useState(false);
  const { discoveryScore } = useDiscoveryStore();

  return (
    <main>
      <HeroSection />
      <StatsSection />
      <CategoryGrid />

      {/* Stack Builder CTA */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <button onClick={() => setStackOpen(true)}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--os-accent), var(--os-violet))', color: '#fff', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}>
            <Sparkles size={16} />
            What are you trying to build?
          </button>
          <p className="text-xs font-mono mt-3" style={{ color: 'var(--os-text3)' }}>
            AI-powered tool stack recommendations · {discoveryScore > 0 ? `Discovery score: ${discoveryScore}` : 'No signup required'}
          </p>
        </div>
      </section>

      <FeaturedTools />
      <AnalyticsSection />
      <DiscoveryCarousels />
      <WorkflowSection />
      <RecentUpdates />
      <FooterSection />

      <StackBuilder open={stackOpen} onClose={() => setStackOpen(false)} />
    </main>
  );
}
