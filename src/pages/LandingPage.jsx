import { useState, useCallback, useRef } from 'react';
import WorkshopHero from '@/components/workshop/WorkshopHero';
import WorkflowStory from '@/components/workshop/WorkflowStory';
import StackReveal from '@/components/workshop/StackReveal';
import BuildPaths from '@/components/workshop/BuildPaths';
import FeaturedSystems from '@/components/workshop/FeaturedSystems';
import DiscoveryCta from '@/components/workshop/DiscoveryCta';
import FooterSection from '@/components/sections/FooterSection';
import SYSTEMS from '@/data/systems';

export default function LandingPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [showStack, setShowStack] = useState(false);
  const workflowRef = useRef(null);
  const stackRef = useRef(null);

  const selected = selectedId ? SYSTEMS.find(s => s.id === selectedId) : null;

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setShowStack(false);
    setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleRevealStack = useCallback(() => {
    setShowStack(true);
    setTimeout(() => {
      stackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <main>
      <div id="workshop-top" />
      <WorkshopHero onSelect={handleSelect} selectedId={selectedId} />

      {selected && (
        <div ref={workflowRef}>
          <WorkflowStory system={selected} onRevealStack={handleRevealStack} />
        </div>
      )}

      {selected && showStack && (
        <div ref={stackRef}>
          <StackReveal system={selected} />
        </div>
      )}

      <BuildPaths onSelectSystem={handleSelect} selectedId={selectedId} />
      <FeaturedSystems onSelectSystem={handleSelect} />
      <DiscoveryCta />
      <FooterSection />
    </main>
  );
}
