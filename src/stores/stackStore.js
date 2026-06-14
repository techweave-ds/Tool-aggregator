import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STACK_TEMPLATES = {
  'ai-support-bot': {
    id: 'ai-support-bot',
    name: 'AI Support Bot',
    question: 'AI Support Bot',
    description: 'Automated customer support with AI-powered responses and ticket management.',
    tools: ['supportweave', 'knowledgos', 'leadlaunch'],
    explanation: 'SupportWeave handles email triage and response. KnowledgOS provides source-backed answers. LeadLaunch captures follow-up leads.'
  },
  'lead-generation': {
    id: 'lead-generation',
    name: 'Lead Generation System',
    question: 'Lead Generation System',
    description: 'Capture, qualify, and nurture leads with automated workflows.',
    tools: ['leadlaunch', 'supportweave', 'social-scheduler'],
    explanation: 'LeadLaunch captures and qualifies leads. SupportWeave manages follow-up communication. Social Scheduler nurtures through content.'
  },
  'trading-automation': {
    id: 'trading-automation',
    name: 'Trading Automation',
    question: 'Trading Automation',
    description: 'Automated trading signals, risk management, and portfolio tracking.',
    tools: ['crypto-alert-bot', 'orb-scanner', 'position-size-calculator'],
    explanation: 'Crypto Alert Bot monitors market conditions. ORB Scanner identifies breakout setups. Position Size Calculator manages risk.'
  },
  'knowledge-base': {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    question: 'Knowledge Base',
    description: 'Enterprise knowledge management with AI-powered search and discovery.',
    tools: ['knowledgos', 'rag-playground', 'commitkit'],
    explanation: 'KnowledgOS serves as the knowledge hub. RAG Playground optimizes retrieval. CommitKit documents technical workflows.'
  },
  'restaurant-ordering': {
    id: 'restaurant-ordering',
    name: 'Restaurant Ordering System',
    question: 'Restaurant Ordering System',
    description: 'Digital menu, QR ordering, and reservation management for restaurants.',
    tools: ['qr-ordering-system', 'menu-builder', 'reservation-system'],
    explanation: 'QR Ordering System handles customer ordering. Menu Builder manages digital menus. Reservation System handles table booking.'
  },
  'devops-pipeline': {
    id: 'devops-pipeline',
    name: 'DevOps Pipeline',
    question: 'DevOps Pipeline',
    description: 'CI/CD, deployment automation, and infrastructure monitoring.',
    tools: ['ci-cd-pipeline', 'deployment-bot', 'backup-automator'],
    explanation: 'CI/CD Dashboard monitors pipeline health. Deployment Bot automates releases. Backup Automator ensures data safety.'
  },
};

const useStackStore = create(
  persist(
    (set, get) => ({
      savedStacks: [],
      currentQuery: '',
      generatedStack: null,

      setQuery: (query) => set({ currentQuery: query }),

      generateStack: (query) => {
        const q = query.toLowerCase();
        let best = null;
        let bestScore = 0;

        Object.values(STACK_TEMPLATES).forEach(template => {
          const words = template.question.toLowerCase().split(' ');
          const matches = words.filter(w => q.includes(w)).length;
          const score = matches / words.length;
          if (score > bestScore) {
            bestScore = score;
            best = template;
          }
        });

        if (bestScore > 0.2) {
          set({ generatedStack: best });
        } else {
          set({
            generatedStack: {
              id: 'custom-' + Date.now(),
              name: `Stack for "${query}"`,
              question: query,
              description: `A recommended stack of tools for ${query}.`,
              tools: [],
              explanation: 'Try a more specific query like "AI Support Bot" or "Trading Automation".'
            }
          });
        }
      },

      saveStack: (stack) => {
        const { savedStacks } = get();
        const existing = savedStacks.findIndex(s => s.id === stack.id);
        if (existing >= 0) {
          const updated = [...savedStacks];
          updated[existing] = { ...updated[existing], ...stack };
          set({ savedStacks: updated });
        } else {
          set({ savedStacks: [...savedStacks, { ...stack, savedAt: new Date().toISOString() }] });
        }
      },

      removeStack: (id) => {
        set({ savedStacks: get().savedStacks.filter(s => s.id !== id) });
      },

      clearGenerated: () => set({ generatedStack: null }),
    }),
    { name: 'weavestack-stacks' }
  )
);

export { STACK_TEMPLATES };
export default useStackStore;
