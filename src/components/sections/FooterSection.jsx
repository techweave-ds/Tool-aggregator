import { Link } from 'react-router-dom';
import { Zap, Github } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="border-t py-16 px-6" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--os-accent), var(--os-violet))' }}>
                <Zap size={14} fill="white" color="white" />
              </div>
              <span className="font-display font-bold text-base" style={{ color: 'var(--os-text)' }}>
                Weave<span style={{ color: 'var(--os-accent)' }}>Stack</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--os-text3)' }}>
              A curated hub of tools, automations, and AI micro-apps. Built for builders.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--os-green)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--os-text3)' }}>All systems operational</span>
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: [['Tools', '/tools'], ['Categories', '/tools'], ['Recent', '/tools']] },
            { title: 'System', links: [['Import', '/import'], ['Admin', '/admin'], ['GitHub', 'https://github.com']] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-xs font-mono tracking-widest mb-4" style={{ color: 'var(--os-text3)' }}>{col.title.toUpperCase()}</p>
              <div className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  to.startsWith('http')
                    ? <a key={label} href={to} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm transition-colors hover:text-white block"
                        style={{ color: 'var(--os-text3)' }}>{label}</a>
                    : <Link key={label} to={to}
                        className="block text-sm transition-colors hover:text-white"
                        style={{ color: 'var(--os-text3)' }}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 flex-wrap gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--os-text3)' }}>
            © 2025 WeaveStack · Built with React, Vite, Tailwind
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80" style={{ color: 'var(--os-text3)' }}>
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
