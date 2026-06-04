import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ADMIN_PIN = '9999'; // change this
const KEY = 'toolos-admin';

export function useAdmin() {
  const [ok, setOk] = useState(() => { try { return sessionStorage.getItem(KEY)==='yes'; } catch { return false; } });
  return {
    ok,
    unlock: () => { sessionStorage.setItem(KEY,'yes'); setOk(true); },
    lock:   () => { sessionStorage.removeItem(KEY); setOk(false); },
  };
}

export default function AdminGate({ children, title='Admin Area' }) {
  const { ok, unlock } = useAdmin();
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [shake, setShake] = useState(false);

  if (ok) return children;

  function tryUnlock(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) { unlock(); }
    else {
      setErr('Incorrect PIN'); setShake(true); setPin('');
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight:'60vh' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background:'var(--os-card)', border:'1px solid rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:'rgba(99,102,241,0.12)' }}>
            <Lock size={18} style={{ color:'var(--os-accent)' }} />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm" style={{ color:'var(--os-text)' }}>{title}</h2>
            <p className="text-[11px] font-mono mt-0.5" style={{ color:'var(--os-text3)' }}>Admin access required</p>
          </div>
        </div>
        <form onSubmit={tryUnlock} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono mb-2" style={{ color:'var(--os-text3)' }}>PIN</label>
            <motion.div animate={shake ? { x:[-8,8,-6,6,-3,3,0] } : {}} transition={{ duration:0.4 }} className="relative">
              <input type={show?'text':'password'} value={pin}
                onChange={e => { setPin(e.target.value); setErr(''); }}
                placeholder="••••" maxLength={8} autoFocus
                className="w-full px-4 py-3 text-center text-lg tracking-widest rounded-xl font-mono pr-10"
                style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${err ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, letterSpacing:'0.3em' }}
              />
              <button type="button" onClick={() => setShow(s=>!s)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--os-text3)' }}>
                {show ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </motion.div>
            {err && <p className="text-xs mt-1.5 font-mono" style={{ color:'#ef4444' }}>{err}</p>}
          </div>
          <button type="submit" disabled={!pin}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background:'var(--os-accent)', color:'#fff' }}>
            <ShieldCheck size={14}/> Unlock
          </button>
          <p className="text-[10px] text-center font-mono" style={{ color:'var(--os-text3)' }}>
            Session only · Locks on tab close · Default PIN: 9999
          </p>
        </form>
      </motion.div>
    </div>
  );
}
