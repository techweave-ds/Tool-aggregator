import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="pt-32 pb-16 px-6 min-h-screen flex flex-col items-center justify-center text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'var(--os-accent)' }}>404</p>
        <h1 className="font-display font-bold text-5xl mb-4" style={{ color: 'var(--os-text)' }}>
          Page not found
        </h1>
        <p className="text-sm mb-8 max-w-md" style={{ color: 'var(--os-text2)' }}>
          This page doesn't exist or has been moved.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--os-accent)', color: '#fff' }}>
          <Home size={14} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
