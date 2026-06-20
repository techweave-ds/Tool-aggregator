import { useRef, useEffect, useState } from 'react';

const COLORS = [
  { from: 'rgba(99,102,241,0.12)', to: 'rgba(139,92,246,0.04)' },
  { from: 'rgba(139,92,246,0.10)', to: 'rgba(6,182,212,0.04)' },
  { from: 'rgba(6,182,212,0.10)', to: 'rgba(59,130,246,0.04)' },
];

export default function HeroOrbs({ count = 3 }) {
  const [orbs, setOrbs] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 300 + Math.random() * 400,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      duration: 12 + Math.random() * 8,
      delay: Math.random() * -12,
      color: COLORS[i % COLORS.length],
    }));
    setOrbs(items);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, ${orb.color.from}, ${orb.color.to})`,
            filter: 'blur(60px)',
            animation: `orbFloat${orb.id} ${orb.duration}s ease-in-out ${orb.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        ${orbs.map((orb, i) => `
          @keyframes orbFloat${i} {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(1); }
            33% { transform: translate(-50%, -50%) translate(${30 + i * 15}px, ${-20 + i * 10}px) scale(${1 + (i * 0.05)}); }
            66% { transform: translate(-50%, -50%) translate(${-20 + i * 10}px, ${30 + i * 10}px) scale(${0.95 - (i * 0.03)}); }
            100% { transform: translate(-50%, -50%) translate(${10 + i * 5}px, ${-10 + i * 5}px) scale(1.02); }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}