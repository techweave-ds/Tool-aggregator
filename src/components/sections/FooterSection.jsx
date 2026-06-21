import { Link } from 'react-router-dom';
import { Zap, Github, ArrowUpRight } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer style={{ background: 'white', borderTop: '1px solid var(--border2)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))', boxShadow: 'var(--glow-indigo)' }}>
                <Zap size={14} fill="white" color="white" />
              </div>
              <span className="font-display font-black text-base" style={{ color: 'var(--text)' }}>
                Weave<span style={{ color: 'var(--accent)' }}>Stack</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: 'var(--text2)' }}>
              A discovery-first platform for tools, automations, and AI systems. Built for builders.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
              <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>All systems operational</span>
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: [['Platform', '/'], ['Tools', '/tools'], ['Categories', '/tools']] },
            { title: 'System', links: [['Import', '/import'], ['Admin', '/admin'], ['GitHub', 'https://github.com/techweave-ds/Tool-aggregator', true]] },
          ].map(col => (
            <div key={col.title}>
              <p className="font-mono text-[10px] tracking-[0.18em] mb-4" style={{ color: 'var(--text3)' }}>{col.title.toUpperCase()}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(([label, to, external]) => (
                  external
                    ? <a key={label} href={to} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm transition-colors hover:text-[var(--accent)]"
                        style={{ color: 'var(--text2)' }}>
                        {label} <ArrowUpRight size={11} />
                      </a>
                    : <Link key={label} to={to}
                        className="text-sm transition-colors hover:text-[var(--accent)]"
                        style={{ color: 'var(--text2)' }}>
                        {label}
                      </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 flex-wrap gap-4"
          style={{ borderTop: '1px solid var(--border2)' }}>
          <p className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
            © 2025 WeaveStack · React · Vite · Tailwind · Cloudflare Pages
          </p>
          <a href="https://github.com/techweave-ds/Tool-aggregator" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-all hover:text-[var(--accent)] hover:-translate-y-0.5"
            style={{ color: 'var(--text3)' }}>
            <Github size={15} />
            <span className="text-xs">techweave-ds</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
