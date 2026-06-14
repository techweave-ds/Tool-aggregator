import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
  compareList: [],

  addToCompare: (toolId) => {
    const { compareList } = get();
    if (compareList.length >= 4) return;
    if (compareList.includes(toolId)) return;
    set({ compareList: [...compareList, toolId] });
  },

  removeFromCompare: (toolId) => {
    set({ compareList: get().compareList.filter(id => id !== toolId) });
  },

  clearCompare: () => set({ compareList: [] }),

  isInCompare: (toolId) => get().compareList.includes(toolId),
}));

export default useCompareStore;
