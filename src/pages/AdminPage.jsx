import AdminGate, { useAdmin } from '@/components/ui/AdminGate';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, BarChart3, Layers, Tag, Trash2, Link as LinkIcon } from 'lucide-react';
import { getAllTools } from '@/utils/tools';

const ACCENT_PRESETS = [
  { name:'Indigo',  hex:'#6366f1' },{ name:'Violet', hex:'#8b5cf6' },
  { name:'Cyan',    hex:'#06b6d4' },{ name:'Emerald', hex:'#22c55e' },
  { name:'Amber',   hex:'#f59e0b' },{ name:'Rose',    hex:'#f43f5e' },
];

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

function applyAccent(hex) {
  document.documentElement.style.setProperty('--os-accent', hex);
  document.documentElement.style.setProperty('--os-glow', hex+'33');
  localStorage.setItem('os-accent', hex);
}

function AdminContent() {
  const { lock } = useAdmin();
  const [customTools] = useState(() => { try { return JSON.parse(localStorage.getItem('custom-tools')||'[]'); } catch { return []; } });
  const [imported]    = useState(() => { try { return JSON.parse(localStorage.getItem('imported-tools')||'[]'); } catch { return []; } });

  const allTools = getAllTools();
  const catBreakdown = Object.entries(allTools.reduce((a,t) => { a[t.category]=(a[t.category]||0)+1; return a; }, {})).sort((a,b) => b[1]-a[1]);
  const statusBreakdown = ['Production','Beta','Alpha','Archived'].map(s => ({ s, n: allTools.filter(t => t.status===s).length }));

  useEffect(() => {
    const storedAccent = localStorage.getItem('os-accent');
    if (storedAccent) applyAccent(storedAccent);
  }, []);

  function Card({ title, children }) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid rgba(0,0,0,0.06)' }}>
        <p className="px-5 py-3 text-[9px] font-mono tracking-widest" style={{ color:'var(--text3)', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>{title}</p>
        <div className="p-5">{children}</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background:'var(--green)' }}/>
              <span className="text-[10px] font-mono" style={{ color:'var(--text3)' }}>ADMIN PANEL</span>
            </div>
            <h1 className="font-display font-bold text-3xl" style={{ color:'var(--text)' }}>Admin</h1>
            <p className="text-sm mt-0.5" style={{ color:'var(--text2)' }}>WeaveStack control centre</p>
          </div>
          <button onClick={lock} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
            style={{ border:'1px solid rgba(0,0,0,0.08)', color:'var(--text3)' }}>
            <LogOut size={12}/> Lock
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Total Tools',  val: allTools.length,     color:'#6366f1', icon:Layers },
            { label:'Custom Added', val: customTools.length,  color:'#22c55e', icon:Tag },
            { label:'Imported',     val: imported.length,     color:'#3b82f6', icon:LinkIcon },
            { label:'Production',   val: allTools.filter(t=>t.status==='Production').length, color:'#22c55e', icon:BarChart3 },
          ].map(({ label,val,color,icon:Icon }) => (
            <motion.div key={label} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
              className="p-4 rounded-2xl" style={{ background:'var(--card)', border:'1px solid rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:color+'18' }}>
                  <Icon size={13} style={{ color }}/>
                </div>
                <span className="font-display font-bold text-2xl" style={{ color }}>{val}</span>
              </div>
              <p className="text-[10px] font-mono" style={{ color:'var(--text3)' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <Card title="CATEGORY BREAKDOWN">
            <div className="space-y-3">
              {catBreakdown.map(([cat,n]) => {
                const c = CAT_COLORS[cat]||'var(--accent)';
                const pct = Math.round((n/allTools.length)*100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color:'var(--text2)' }}>{cat}</span>
                      <span className="text-[10px] font-mono" style={{ color:'var(--text3)' }}>{n} · {pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background:'rgba(0,0,0,0.05)' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, delay:0.1 }}
                        className="h-1.5 rounded-full" style={{ background:c }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Status */}
          <Card title="STATUS BREAKDOWN">
            <div className="space-y-3">
              {statusBreakdown.map(({ s,n }) => {
                const c = { Production:'#22c55e',Beta:'#f59e0b',Alpha:'#6366f1',Archived:'#6b7280' }[s];
                return (
                  <div key={s} className="flex items-center justify-between py-2.5" style={{ borderBottom:'1px solid var(--bg)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background:c }}/>
                      <span className="text-xs" style={{ color:'var(--text2)' }}>{s}</span>
                    </div>
                    <span className="font-display font-bold text-lg" style={{ color:c }}>{n}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Appearance */}
        <Card title="APPEARANCE — ACCENT COLOUR">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            {ACCENT_PRESETS.map(a => {
              const cur = document.documentElement.style.getPropertyValue('--os-accent').trim() ||
                getComputedStyle(document.documentElement).getPropertyValue('--os-accent').trim();
              const active = cur.replace(/\s/g,'')===a.hex;
              return (
                <button key={a.name} onClick={() => applyAccent(a.hex)} title={a.name}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{ background:a.hex, transform:active?'scale(1.2)':'scale(1)', boxShadow:active?`0 0 0 2px var(--card), 0 0 0 4px ${a.hex}`:'none' }}/>
              );
            })}
          </div>
          <p className="text-xs font-mono" style={{ color:'var(--text3)' }}>Persists across sessions</p>
        </Card>

        {/* Data management */}
        <Card title="DATA MANAGEMENT">
          <div className="space-y-3">
            {[
              { label:'Clear imported tools', key:'imported-tools', desc:'Remove all tools imported via GitHub/Netlify' },
              { label:'Clear custom tools',   key:'custom-tools',   desc:'Remove all manually added tools' },
              { label:'Clear activity log',   key:'activity-log',   desc:'Reset the activity log' },
              { label:'Clear pinned',         key:'pinned-tools',   desc:'Unpin all tools' },
            ].map(({ label,key,desc }) => (
              <div key={key} className="flex items-center justify-between gap-4 py-2.5" style={{ borderBottom:'1px solid var(--bg)' }}>
                <div>
                  <p className="text-xs font-medium" style={{ color:'var(--text)' }}>{label}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color:'var(--text3)' }}>{desc}</p>
                </div>
                <button onClick={() => { localStorage.removeItem(key); window.location.reload(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all"
                  style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.2)' }}>
                  <Trash2 size={11}/> Clear
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="SYSTEM INFO">
          {[
            ['Version', '2.0.0'],
            ['Stack', 'React · Vite · Tailwind · Framer Motion'],
            ['Deployment', 'Cloudflare Pages via GitHub'],
            ['Total Tools', allTools.length],
          ].map(([k,v]) => (
            <div key={k} className="flex items-center justify-between py-2" style={{ borderBottom:'1px solid var(--bg)' }}>
              <span className="text-[10px] font-mono" style={{ color:'var(--text3)' }}>{k}</span>
              <span className="text-xs font-medium" style={{ color:'var(--text2)' }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminGate title="WeaveStack Admin"><AdminContent/></AdminGate>;
}
