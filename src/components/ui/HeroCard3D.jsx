import { useRef, useState, useEffect } from 'react';

export default function HeroCard3D({ system, onClose }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const handle = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      setTilt({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 });
    };
    el.addEventListener('mousemove', handle);
    return () => el.removeEventListener('mousemove', handle);
  }, []);

  const color = system?.color || 'var(--accent)';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      className="relative cursor-pointer select-none"
      style={{
        perspective: '800px',
        width: 240,
        height: 320,
      }}
    >
      {/* Stack layers */}
      {[0, 1, 2].map((layer) => (
        <div
          key={layer}
          className="absolute inset-0 rounded-2xl transition-all duration-300"
          style={{
            background: layer === 0 ? 'var(--card)' : layer === 1 ? 'var(--card2)' : 'var(--surface)',
            border: `1px solid ${color}${20 - layer * 5}`,
            transform: `
              translateZ(${-layer * 8}px)
              rotateX(${tilt.x + (isHovered ? layer * 0.5 : 0)}deg)
              rotateY(${tilt.y + (isHovered ? layer * 0.5 : 0)}deg)
              translateY(${isHovered ? -4 - layer * 2 : layer * 4}px)
            `,
            boxShadow: `var(--shadow-lg), 0 0 40px ${color}${10 - layer * 3}`,
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 10 - layer,
          }}
        />
      ))}

      {/* Front card content */}
      <div
        className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
        style={{
          background: 'var(--card)',
          border: `1px solid ${color}25`,
          transform: `
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)
            translateY(${isHovered ? -6 : 0}px)
          `,
          boxShadow: isHovered ? `var(--shadow-xl), 0 0 60px ${color}15` : `var(--shadow-md), 0 0 20px ${color}08`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.2s' : 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s',
          zIndex: 11,
        }}
      >
        {system ? (
          <>
            <div className="text-5xl mb-4" style={{ transform: 'translateZ(20px)' }}>{system.icon}</div>
            <h3 className="font-display font-bold text-lg mb-1 tracking-tight" style={{ color: 'var(--text)', transform: 'translateZ(15px)' }}>
              {system.name}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)', maxWidth: 180, transform: 'translateZ(10px)' }}>
              {system.shortDesc || system.description?.slice(0, 60)}
            </p>
            <div className="mt-3 px-3 py-1 rounded-full text-[10px] font-mono font-medium" style={{ background: `${color}12`, color, transform: 'translateZ(12px)' }}>
              {system.domain} · {system.setup || 'Quick setup'}
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4" style={{ transform: 'translateZ(20px)' }}>🧩</div>
            <h3 className="font-display font-bold text-lg mb-1 tracking-tight" style={{ color: 'var(--text)', transform: 'translateZ(15px)' }}>
              Select a system
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)', maxWidth: 180, transform: 'translateZ(10px)' }}>
              Choose from the tabs below to see the tool stack
            </p>
          </>
        )}
      </div>
    </div>
  );
}