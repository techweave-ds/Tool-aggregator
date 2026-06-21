import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryBreakdown, getMonthlyTrend, getStatusBreakdown } from '@/utils/smartSearch';
import { getAllTools } from '@/utils/tools';

const STATUS_COLORS = { Production: '#22c55e', Beta: '#f59e0b', Alpha: '#818cf8', Archived: '#6b7280' };
const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
      <p className="font-medium">{label || payload[0].name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function AnalyticsSection() {
  const allTools = getAllTools();
  const catData = getCategoryBreakdown(allTools);
  const monthlyData = getMonthlyTrend(allTools);
  const statusData = Object.entries(getStatusBreakdown(allTools)).map(([name, count]) => ({ name, count, color: STATUS_COLORS[name] || '#6b7280' }));

  return (
    <section className="py-24 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-12">
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--accent)' }}>INSIGHTS</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--text)' }}>
            Platform <span className="text-gradient">analytics</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-mono mb-4" style={{ color: 'var(--text3)' }}>CATEGORY DISTRIBUTION</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="count"
                    onMouseEnter={null}>
                    {catData.map((entry, i) => (
                      <Cell key={i} fill={CAT_COLORS[entry.name] || '#6366f1'} stroke="var(--bg)" strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {catData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px] font-mono">
                  <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[d.name] || '#6366f1' }} />
                  <span style={{ color: 'var(--text3)' }}>{d.name} ({d.count})</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-mono mb-4" style={{ color: 'var(--text3)' }}>TOOL GROWTH</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barCategoryGap={4}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#6366f1" maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-mono mb-4" style={{ color: 'var(--text3)' }}>PRODUCTION VS BETA</p>
            <div className="flex items-center gap-6 h-48 justify-center">
              {statusData.map(s => {
                const total = statusData.reduce((a, b) => a + b.count, 0);
                const pct = Math.round((s.count / total) * 100);
                return (
                  <div key={s.name} className="flex flex-col items-center gap-2">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--bg)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={s.color} strokeWidth="3"
                          strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold font-display" style={{ color: s.color }}>{s.count}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{s.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Category Insights */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-mono mb-4" style={{ color: 'var(--text3)' }}>CATEGORY INSIGHTS</p>
            <div className="space-y-3">
              {catData.slice(0, 5).map(cat => {
                const catTools = allTools.filter(t => t.category === cat.name);
                const recent = catTools.filter(t => t.changelog?.[0]?.date).sort((a, b) => b.changelog[0].date.localeCompare(a.changelog[0].date));
                return (
                  <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg)' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: CAT_COLORS[cat.name] || '#6366f1' }} />
                      <span className="text-sm" style={{ color: 'var(--text)' }}>{cat.name}</span>
                      <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{cat.count} tools</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      {recent[0] && <span style={{ color: 'var(--text3)' }}>Updated: {recent[0].changelog[0].date}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
