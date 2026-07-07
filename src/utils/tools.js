import builtIn from '@/data/tools.json';

export function getAllTools() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom-tools') || '[]');
    const imported = JSON.parse(localStorage.getItem('imported-tools') || '[]');
    const seen = new Set();
    return [...builtIn, ...custom, ...imported].filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  } catch {
    return builtIn;
  }
}
