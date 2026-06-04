import builtIn from '@/data/tools.json';

export function getAllTools() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom-tools') || '[]');
    return [...builtIn, ...custom];
  } catch {
    return builtIn;
  }
}
