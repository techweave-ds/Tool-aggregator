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

const STATUS_HEALTH = { Production: 'healthy', Beta: 'healthy', Alpha: 'stable', Archived: 'dormant' };

export function getToolHealth(tool) {
  const base = STATUS_HEALTH[tool.status] || 'unknown';
  if (tool.changelog && tool.changelog.length > 0) {
    const dates = tool.changelog.map(c => new Date(c.date)).filter(d => !isNaN(d));
    if (dates.length > 0) {
      const last = Math.max(...dates);
      const months = (Date.now() - last) / (1000 * 60 * 60 * 24 * 30);
      if (months > 18) return 'dormant';
      if (months > 12) return 'stable';
      if (months > 3) return 'maintained';
      return 'active';
    }
  }
  return base;
}

export function getHealthColor(health) {
  const map = { active: '#22c55e', maintained: '#3b82f6', stable: '#f59e0b', dormant: '#6b7280', healthy: '#22c55e', unknown: '#94a3b8' };
  return map[health] || '#94a3b8';
}

export function getHealthLabel(health) {
  const map = { active: 'Active', maintained: 'Maintained', stable: 'Stable', dormant: 'Dormant', healthy: 'Healthy', unknown: 'Unknown' };
  return map[health] || 'Unknown';
}
