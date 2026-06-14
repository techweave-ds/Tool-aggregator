import AdminGate from '@/components/ui/AdminGate';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Globe, CheckCircle2, AlertCircle, Loader2, ArrowUpRight, X, Plus } from 'lucide-react';

async function fetchGitHub(user, token) {
  const h = { Accept:'application/vnd.github+json', ...(token?{Authorization:`Bearer ${token}`}:{}) };
  const r = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { headers:h });
  if (!r.ok) throw new Error(r.status===403?'Rate limited — add a token':r.status===404?'User not found':`GitHub error ${r.status}`);
  return r.json();
}

async function fetchNetlify(token) {
  const r = await fetch('https://api.netlify.com/api/v1/sites', { headers:{ Authorization:`Bearer ${token}` }});
  if (!r.ok) throw new Error(r.status===401?'Invalid token':`Netlify error ${r.status}`);
  return r.json();
}

function guessCategory(topics=[], lang='', desc='') {
  const s = [...topics, lang, desc].join(' ').toLowerCase();
  if (/trade|trading|crypto|stock|forex/.test(s)) return 'Trading';
  if (/ai|llm|gpt|claude|openai|ml|neural/.test(s)) return 'AI';
  if (/restaurant|food|menu|kitchen/.test(s)) return 'Restaurant';
  if (/automat|bot|workflow|schedule|cron/.test(s)) return 'Automations';
  if (/tool|util|calc|convert/.test(s)) return 'Utilities';
  return 'Development';
}

function repoToTool(r) {
  return {
    id: r.full_name.replace(/\//g,'-'),
    name: r.name.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
    description: r.description||'No description',
    category: guessCategory(r.topics||[], r.language||'', r.description||''),
    status: r.archived?'Archived':'Production', version:'1.0.0', icon:'Github',
    tags: (r.topics||[]).slice(0,5).length ? r.topics.slice(0,5) : [r.language?.toLowerCase()||'github'],
    github: r.html_url, docs:'', demo: r.homepage||'', image:'',
    type:'external', url: r.html_url, route:'',
    changelog:[{version:'1.0.0', date:r.updated_at?.slice(0,10), changes:['Imported from GitHub']}],
    _src:'github',
  };
}

function siteToTool(s) {
  return {
    id: s.id, name: s.name?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())||'Netlify Site',
    description:`Deployed at ${s.ssl_url||s.url||''}`,
    category:'Development', status: s.published_deploy?.state==='ready'?'Production':'Beta',
    version:'1.0.0', icon:'Globe',
    tags:['netlify','deployed'], github: s.build_settings?.repo_url||'',
    docs:'', demo: s.ssl_url||s.url||'', image: s.screenshot_url||'',
    type:'external', url: s.ssl_url||s.url||'', route:'',
    changelog:[{version:'1.0.0', date:s.updated_at?.slice(0,10), changes:['Imported from Netlify']}],
    _src:'netlify',
  };
}

function HelpCard({ children }) {
  return (
    <div className="text-xs leading-relaxed px-4 py-3 rounded-xl font-mono"
      style={{ background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.15)', color:'var(--os-text3)' }}>
      💡 {children}
    </div>
  );
}

function ErrMsg({ msg }) {
  return (
    <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
      style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.2)' }}>
      <AlertCircle size={13}/> {msg}
    </div>
  );
}

function RepoList({ items, selected, onToggle, onSelectAll, color }) {
  const all = items.length>0 && items.every(i => selected.has(i.id));
  return (
    <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[10px] font-mono" style={{ color:'var(--os-text3)' }}>{items.length} found</span>
        <button onClick={onSelectAll} className="text-[10px] font-mono transition-opacity hover:opacity-80"
          style={{ color: all?'var(--os-text3)':color }}>{all?'Deselect all':'Select all'}</button>
      </div>
      <div className="max-h-64 overflow-y-auto no-scroll">
        {items.map(item => {
          const sel = selected.has(item.id);
          return (
            <label key={item.id}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', background: sel?color+'08':'transparent' }}>
              <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                style={{ background: sel?color:'rgba(255,255,255,0.06)', border:`1px solid ${sel?color:'rgba(255,255,255,0.12)'}` }}
                onClick={() => onToggle(item.id)}>
                {sel && <CheckCircle2 size={10} color="#fff" fill="#fff" strokeWidth={3}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color:'var(--os-text)' }}>{item.name}</p>
                <p className="text-[10px] truncate" style={{ color:'var(--os-text3)' }}>{item.desc||item.meta}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.updated && <span className="text-[9px] font-mono" style={{ color:'var(--os-text3)' }}>{item.updated}</span>}
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()} style={{ color:'var(--os-text3)', opacity:0.5 }}>
                  <ArrowUpRight size={11}/>
                </a>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ImportContent() {
  const [ghUser, setGhUser] = useState(''); const [ghToken, setGhToken] = useState('');
  const [ghLoading, setGhLoading] = useState(false); const [ghErr, setGhErr] = useState('');
  const [ghRepos, setGhRepos] = useState([]); const [ghSel, setGhSel] = useState(new Set());
  const [nlToken, setNlToken] = useState('');
  const [nlLoading, setNlLoading] = useState(false); const [nlErr, setNlErr] = useState('');
  const [nlSites, setNlSites] = useState([]); const [nlSel, setNlSel] = useState(new Set());
  const [importing, setImporting] = useState(false); const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('imported-tools')||'[]'); } catch { return []; } });

  async function loadGH() {
    if (!ghUser.trim()) return;
    setGhLoading(true); setGhErr(''); setGhRepos([]);
    try { setGhRepos((await fetchGitHub(ghUser.trim(), ghToken.trim())).filter(r => !r.fork)); }
    catch(e) { setGhErr(e.message); }
    finally { setGhLoading(false); }
  }

  async function loadNL() {
    if (!nlToken.trim()) return;
    setNlLoading(true); setNlErr(''); setNlSites([]);
    try { setNlSites(await fetchNetlify(nlToken.trim())); }
    catch(e) { setNlErr(e.message); }
    finally { setNlLoading(false); }
  }

  function toggle(set, fn, id) { fn(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; }); }

  async function doImport() {
    setImporting(true);
    const newTools = [
      ...ghRepos.filter(r => ghSel.has(r.id)).map(repoToTool),
      ...nlSites.filter(s => nlSel.has(s.id)).map(siteToTool),
    ];
    await new Promise(r => setTimeout(r, 200));
    const existing = JSON.parse(localStorage.getItem('imported-tools')||'[]');
    const merged = [...existing, ...newTools.filter(t => !existing.find(e => e.id===t.id))];
    localStorage.setItem('imported-tools', JSON.stringify(merged));
    // also merge into custom-tools so ToolsPage shows them
    const custom = JSON.parse(localStorage.getItem('custom-tools')||'[]');
    const allCustom = [...custom, ...newTools.filter(t => !custom.find(e => e.id===t.id))];
    localStorage.setItem('custom-tools', JSON.stringify(allCustom));
    setSaved(merged); setGhSel(new Set()); setNlSel(new Set());
    setImporting(false); setDone(true); setTimeout(() => setDone(false), 3000);
  }

  const total = ghSel.size + nlSel.size;

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h1 className="font-display font-bold text-3xl" style={{ color:'var(--os-text)' }}>Import Tools</h1>
          <p className="text-sm mt-1.5" style={{ color:'var(--os-text2)' }}>
            Connect GitHub or Netlify — pick repos and sites — import in one click. No manual entry.
          </p>
        </div>

        {/* GitHub */}
        <div className="rounded-2xl overflow-hidden" style={{ background:'var(--os-card)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(59,130,246,0.12)' }}>
              <Github size={17} style={{ color:'#60a5fa' }}/>
            </div>
            <div>
              <h2 className="font-display font-semibold text-sm" style={{ color:'var(--os-text)' }}>GitHub Repositories</h2>
              <p className="text-[10px] font-mono" style={{ color:'var(--os-text3)' }}>Public repos free · Token needed for private</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <input value={ghUser} onChange={e => setGhUser(e.target.value)}
                onKeyDown={e => e.key==='Enter' && loadGH()}
                placeholder="GitHub username" className="flex-1 px-3 py-2 text-sm rounded-xl"
                style={{ background:'rgba(255,255,255,0.05)' }}/>
              <input value={ghToken} onChange={e => setGhToken(e.target.value)}
                placeholder="Token (optional)" type="password" className="flex-1 px-3 py-2 text-sm rounded-xl"
                style={{ background:'rgba(255,255,255,0.05)' }}/>
            </div>
            <HelpCard>github.com/settings/tokens → New token (classic) → check <code>repo</code> scope.</HelpCard>
            <button onClick={loadGH} disabled={!ghUser.trim()||ghLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40 transition-all"
              style={{ background:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.25)' }}>
              {ghLoading ? <Loader2 size={14} className="animate-spin"/> : <Github size={14}/>}
              {ghLoading ? 'Loading…' : 'Load Repos'}
            </button>
            {ghErr && <ErrMsg msg={ghErr}/>}
            {ghRepos.length > 0 && (
              <RepoList
                items={ghRepos.map(r => ({ id:r.id, name:r.name, desc:r.description||'', meta:r.language||'', url:r.html_url, updated:r.updated_at?.slice(0,10) }))}
                selected={ghSel} onToggle={id => toggle(ghSel, setGhSel, id)}
                onSelectAll={() => setGhSel(new Set(ghRepos.map(r=>r.id)))} color="#3b82f6"
              />
            )}
          </div>
        </div>

        {/* Netlify */}
        <div className="rounded-2xl overflow-hidden" style={{ background:'var(--os-card)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(34,197,94,0.1)' }}>
              <Globe size={17} style={{ color:'#22c55e' }}/>
            </div>
            <div>
              <h2 className="font-display font-semibold text-sm" style={{ color:'var(--os-text)' }}>Netlify Sites</h2>
              <p className="text-[10px] font-mono" style={{ color:'var(--os-text3)' }}>Personal Access Token required</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <input value={nlToken} onChange={e => setNlToken(e.target.value)}
              placeholder="Netlify Personal Access Token" type="password"
              className="w-full px-3 py-2 text-sm rounded-xl" style={{ background:'rgba(255,255,255,0.05)' }}/>
            <HelpCard>app.netlify.com → User settings → Applications → Personal access tokens → New access token.</HelpCard>
            <button onClick={loadNL} disabled={!nlToken.trim()||nlLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
              style={{ background:'rgba(34,197,94,0.1)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.2)' }}>
              {nlLoading ? <Loader2 size={14} className="animate-spin"/> : <Globe size={14}/>}
              {nlLoading ? 'Loading…' : 'Load Sites'}
            </button>
            {nlErr && <ErrMsg msg={nlErr}/>}
            {nlSites.length > 0 && (
              <RepoList
                items={nlSites.map(s => ({ id:s.id, name:s.name, desc:s.ssl_url||s.url||'', meta:'netlify', url:s.ssl_url, updated:s.updated_at?.slice(0,10) }))}
                selected={nlSel} onToggle={id => toggle(nlSel, setNlSel, id)}
                onSelectAll={() => setNlSel(new Set(nlSites.map(s=>s.id)))} color="#22c55e"
              />
            )}
          </div>
        </div>

        {/* Import bar */}
        <AnimatePresence>
          {total > 0 && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
              className="sticky bottom-6 flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
              style={{ background:'rgba(10,15,30,0.95)', border:'1px solid rgba(99,102,241,0.3)', backdropFilter:'blur(20px)', boxShadow:'0 16px 48px rgba(0,0,0,0.5)' }}>
              <div>
                <p className="font-display font-semibold text-sm" style={{ color:'var(--os-text)' }}>{total} selected</p>
                <p className="text-[10px] font-mono" style={{ color:'var(--os-text3)' }}>{ghSel.size} GitHub · {nlSel.size} Netlify</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setGhSel(new Set()); setNlSel(new Set()); }}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg"
                  style={{ background:'rgba(255,255,255,0.06)', color:'var(--os-text3)' }}>Clear</button>
                <button onClick={doImport} disabled={importing}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                  style={{ background: done?'#22c55e':'var(--os-accent)', color:'#fff' }}>
                  {importing ? <Loader2 size={14} className="animate-spin"/> : done ? <CheckCircle2 size={14}/> : <Plus size={14}/>}
                  {importing?'Importing…':done?'Imported!':'Import to WeaveStack'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved */}
        {saved.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-sm" style={{ color:'var(--os-text)' }}>Previously Imported ({saved.length})</h2>
              <button onClick={() => { localStorage.removeItem('imported-tools'); setSaved([]); }}
                className="text-[10px] font-mono flex items-center gap-1" style={{ color:'var(--os-text3)' }}>
                <X size={10}/> Clear all
              </button>
            </div>
            <div className="space-y-1.5">
              {saved.map(t => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background:'var(--os-card)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: t._src==='github'?'#60a5fa':'#22c55e' }}/>
                  <p className="text-sm font-medium flex-1 truncate" style={{ color:'var(--os-text)' }}>{t.name}</p>
                  <span className="text-[10px] font-mono" style={{ color:'var(--os-text3)' }}>{t.category}</span>
                  {t.url && <a href={t.url} target="_blank" rel="noopener noreferrer"
                    style={{ color:'var(--os-text3)', opacity:0.5 }} className="hover:opacity-100">
                    <ArrowUpRight size={13}/>
                  </a>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImportPage() {
  return <AdminGate title="Import Tools"><ImportContent/></AdminGate>;
}
