import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const CATS = ['Trading','AI','Development','Utilities','Restaurant','Automations','Archive'];
const STATUSES = ['Production','Beta','Alpha','Archived'];
const blank = { name:'',description:'',category:'Development',status:'Production',version:'1.0.0',type:'external',url:'',tags:'',icon:'Wrench' };

export default function AddToolModal({ open, onClose, onAdd }) {
  const [f, setF] = useState(blank);
  const u = (k,v) => setF(p => ({...p,[k]:v}));

  function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) return;
    const id = f.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') || `tool-${Date.now()}`;
    onAdd({
      ...f, id,
      tags: f.tags.split(',').map(t=>t.trim()).filter(Boolean),
      github:'',docs:'',demo:'',image:'',route:'',
      changelog:[{version:f.version,date:new Date().toISOString().slice(0,10),changes:['Added manually']}],
    });
    setF(blank); onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background:'rgba(15,23,42,0.45)', backdropFilter:'blur(12px)' }}
          onClick={onClose}>
          <motion.div
            initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }}
            exit={{ scale:0.95, opacity:0 }}
            transition={{ type:'spring', stiffness:400, damping:30 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background:'var(--card)', border:'1px solid rgba(99,102,241,0.25)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
              <h2 className="font-display font-bold text-sm" style={{ color:'var(--text)' }}>Add Tool</h2>
              <button onClick={onClose} style={{ color:'var(--text3)' }}><X size={15} /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
              {[['NAME *','name','My Tool',true],['DESCRIPTION','description','What it does…',false]].map(([label,key,ph,req]) => (
                <div key={key}>
                  <label className="block text-[10px] font-mono mb-1.5" style={{ color:'var(--text3)' }}>{label}</label>
                  {key === 'description'
                    ? <textarea value={f[key]} onChange={e => u(key,e.target.value)} rows={2} placeholder={ph}
                        className="w-full px-3 py-2 text-sm rounded-lg resize-none" style={{ background:'var(--bg)' }} />
                    : <input value={f[key]} onChange={e => u(key,e.target.value)} placeholder={ph} required={req}
                        className="w-full px-3 py-2 text-sm rounded-lg" style={{ background:'var(--bg)' }} />
                  }
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[['CATEGORY','category',CATS],['STATUS','status',STATUSES]].map(([label,key,opts]) => (
                  <div key={key}>
                    <label className="block text-[10px] font-mono mb-1.5" style={{ color:'var(--text3)' }}>{label}</label>
                    <select value={f[key]} onChange={e => u(key,e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg" style={{ background:'var(--bg)' }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-mono mb-1.5" style={{ color:'var(--text3)' }}>URL</label>
                <input value={f.url} onChange={e => u('url',e.target.value)} placeholder="https://…"
                  className="w-full px-3 py-2 text-sm rounded-lg" style={{ background:'var(--bg)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-mono mb-1.5" style={{ color:'var(--text3)' }}>TAGS (comma separated)</label>
                <input value={f.tags} onChange={e => u('tags',e.target.value)} placeholder="react, api, automation"
                  className="w-full px-3 py-2 text-sm rounded-lg" style={{ background:'var(--bg)' }} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border:'1px solid rgba(0,0,0,0.08)', color:'var(--text2)' }}>Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background:'var(--accent)', color:'#fff' }}>Add Tool</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
