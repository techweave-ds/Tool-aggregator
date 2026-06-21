import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles, Zap, Star } from 'lucide-react';
import { getAllTools } from '@/utils/tools';
import { getIcon } from '@/utils/icons';
import useDiscoveryStore from '@/stores/discoveryStore';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

function Carousel({ title, icon: TitleIcon, tools, color = 'var(--accent)' }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  function scroll(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  }

  if (!tools.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TitleIcon size={15} style={{ color }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text3)' }}>{tools.length} tools</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg)' }}>
            <ChevronLeft size={13} style={{ color: 'var(--text3)' }} />
          </button>
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg)' }}>
            <ChevronRight size={13} style={{ color: 'var(--text3)' }} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scroll pb-2">
        {tools.map((tool, i) => {
          const c = CAT_COLORS[tool.category] || 'var(--accent)';
          const Icon = getIcon(tool.icon);
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/tool/${tool.id}`)}
              className="shrink-0 w-56 p-4 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: c + '18' }}>
                  <Icon size={13} style={{ color: c }} />
                </div>
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{tool.name}</span>
              </div>
              <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: 'var(--text3)' }}>{tool.description}</p>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: c + '15', color: c }}>{tool.category}</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${tool.status === 'Production' ? 'badge-prod' : tool.status === 'Beta' ? 'badge-beta' : 'badge-alpha'}`}>
                  {tool.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function DiscoveryCarousels() {
  const allTools = getAllTools();
  const { getTrending, getRecommendations } = useDiscoveryStore();
  const trending = getTrending(allTools);
  const recs = getRecommendations(allTools);

  const recent = [...allTools]
    .filter(t => t.changelog?.[0]?.date)
    .sort((a, b) => b.changelog[0].date.localeCompare(a.changelog[0].date))
    .slice(0, 10);

  const aiFavorites = allTools.filter(t => t.category === 'AI' && t.status === 'Production').slice(0, 8);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-10">
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--accent)' }}>DISCOVER</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--text)' }}>
            Find your next <span className="text-gradient">tool</span>
          </h2>
        </motion.div>

        {trending.length > 0 && <Carousel title="Trending This Week" icon={TrendingUp} tools={trending} color="#f59e0b" />}
        {recs.length > 0 && <Carousel title="Recommended For You" icon={Star} tools={recs} color="#8b5cf6" />}
        <Carousel title="New Releases" icon={Sparkles} tools={recent} color="#06b6d4" />
        <Carousel title="AI Favorites" icon={Zap} tools={aiFavorites} color="#8b5cf6" />
      </div>
    </section>
  );
}
