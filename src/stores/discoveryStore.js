import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDiscoveryStore = create(
  persist(
    (set, get) => ({
      viewedTools: [],
      favorites: [],
      discoveryScore: 0,
      trendingWeights: {},

      trackView: (toolId) => {
        const { viewedTools } = get();
        const updated = [toolId, ...viewedTools.filter(id => id !== toolId)].slice(0, 100);
        const score = Math.min(100, get().discoveryScore + 1);
        const weights = { ...get().trendingWeights };
        weights[toolId] = (weights[toolId] || 0) + 1;
        set({ viewedTools: updated, discoveryScore: score, trendingWeights: weights });
      },

      getRecommendations: (tools) => {
        const { viewedTools, trendingWeights } = get();
        if (viewedTools.length === 0) return [];
        const categories = new Set();
        viewedTools.slice(0, 10).forEach(id => {
          const t = tools.find(t => t.id === id);
          if (t) categories.add(t.category);
        });
        return tools.filter(t =>
          !viewedTools.includes(t.id) && categories.has(t.category)
        ).slice(0, 6);
      },

      getTrending: (tools) => {
        const { trendingWeights } = get();
        return [...tools]
          .filter(t => trendingWeights[t.id])
          .sort((a, b) => (trendingWeights[b.id] || 0) - (trendingWeights[a.id] || 0))
          .slice(0, 6);
      },

      resetScore: () => set({ discoveryScore: 0 }),
    }),
    { name: 'weavestack-discovery' }
  )
);

export default useDiscoveryStore;
