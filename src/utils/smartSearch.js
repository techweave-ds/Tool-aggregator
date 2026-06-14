let toolsCache = [];

export function initSearch(tools) {
  toolsCache = tools;
}

function fuzzyMatch(text, query) {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();

  // Exact match
  if (t.includes(q)) return true;

  // Fuzzy: each char in query must appear in order in text
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreResult(tool, query) {
  const q = query.toLowerCase().trim();
  let score = 0;
  const name = tool.name.toLowerCase();
  const desc = (tool.description || '').toLowerCase();
  const tags = (tool.tags || []).map(t => t.toLowerCase());
  const cat = (tool.category || '').toLowerCase();

  // Exact name match: highest priority
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 80;
  else if (name.includes(q)) score += 60;

  // Tag match
  tags.forEach(tag => {
    if (tag === q) score += 50;
    else if (tag.includes(q)) score += 30;
  });

  // Category match
  if (cat === q) score += 40;
  else if (cat.includes(q)) score += 20;

  // Description match
  if (desc.includes(q)) score += 10;

  // Partial word match in name
  const nameWords = name.split(' ');
  nameWords.forEach(word => {
    if (word.startsWith(q)) score += 15;
  });

  return score;
}

const CATEGORY_ALIASES = {
  'chat': 'AI',
  'ai': 'AI',
  'llm': 'AI',
  'intelligence': 'AI',
  'machine learning': 'AI',
  'ml': 'AI',
  'trading': 'Trading',
  'stock': 'Trading',
  'crypto': 'Trading',
  'forex': 'Trading',
  'market': 'Trading',
  'development': 'Development',
  'dev': 'Development',
  'code': 'Development',
  'programming': 'Development',
  'utility': 'Utilities',
  'tool': 'Utilities',
  'productivity': 'Utilities',
  'restaurant': 'Restaurant',
  'food': 'Restaurant',
  'menu': 'Restaurant',
  'automation': 'Automations',
  'workflow': 'Automations',
  'pipeline': 'Automations',
  'archive': 'Archive',
  'legacy': 'Archive',
};

const QUERY_PATTERNS = [
  {
    match: (q) => /tool (?:for|to|that) (.+)/i.test(q),
    extract: (q) => q.match(/tool (?:for|to|that) (.+)/i)[1],
    search: (extracted) => ({ type: 'tags', query: extracted })
  },
  {
    match: (q) => /(.+?) (?:automation|bot|system|platform|tool)/i.test(q),
    extract: (q) => q.match(/(.+?) (?:automation|bot|system|platform|tool)/i)[1],
    search: (extracted) => ({ type: 'hybrid', query: extracted })
  },
  {
    match: (q) => /^(?:show me|find|get|list|search)\s+(.+)/i.test(q),
    extract: (q) => q.match(/^(?:show me|find|get|list|search)\s+(.+)/i)[1],
    search: (extracted) => ({ type: 'hybrid', query: extracted })
  }
];

export function searchTools(query, tools = toolsCache) {
  if (!query || !query.trim()) return { results: tools, total: tools.length };
  const q = query.trim();

  // Try natural language patterns
  for (const pattern of QUERY_PATTERNS) {
    if (pattern.match(q)) {
      const extracted = pattern.extract(q);
      const result = pattern.search(extracted);
      if (result.type === 'tags' || result.type === 'hybrid') {
        return executeHybridSearch(result.query, tools);
      }
    }
  }

  // Check if query maps to a category alias
  const aliasCat = CATEGORY_ALIASES[q.toLowerCase()];
  if (aliasCat) {
    const catTools = tools.filter(t => t.category === aliasCat);
    return { results: catTools, total: catTools.length, category: aliasCat };
  }

  return executeHybridSearch(q, tools);
}

function executeHybridSearch(q, tools) {
  const scored = tools
    .map(t => ({ tool: t, score: scoreResult(t, q) }))
    .filter(item => item.score > 0 || fuzzyMatch(toolToText(item.tool), q));

  scored.sort((a, b) => b.score - a.score);

  const results = scored.map(s => s.tool);
  return {
    results,
    total: results.length,
    query: q
  };
}

function toolToText(tool) {
  return [tool.name, tool.description, tool.category, ...(tool.tags || [])].join(' ');
}

export function getCategoryBreakdown(tools = toolsCache) {
  const breakdown = {};
  tools.forEach(t => {
    breakdown[t.category] = (breakdown[t.category] || 0) + 1;
  });
  return Object.entries(breakdown)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStatusBreakdown(tools = toolsCache) {
  const breakdown = {};
  tools.forEach(t => {
    breakdown[t.status] = (breakdown[t.status] || 0) + 1;
  });
  return breakdown;
}

export function getMonthlyTrend(tools = toolsCache) {
  const months = {};
  tools.forEach(t => {
    if (t.changelog && t.changelog.length) {
      const date = t.changelog[0].date;
      if (date) {
        const month = date.slice(0, 7);
        months[month] = (months[month] || 0) + 1;
      }
    }
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}
