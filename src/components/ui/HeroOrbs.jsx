/* Floating ambient orbs — pure CSS, zero deps */
export default function HeroOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large indigo blob — top left */}
      <div className="orb animate-pulse-glow" style={{
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
        top: -200, left: -150,
        animationDelay: '0s',
      }} />
      {/* Violet blob — top right */}
      <div className="orb animate-pulse-glow" style={{
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(139,92,246,0.05) 55%, transparent 70%)',
        top: -100, right: -100,
        animationDelay: '1.2s',
      }} />
      {/* Cyan blob — bottom center */}
      <div className="orb animate-pulse-glow" style={{
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 55%, transparent 70%)',
        bottom: -80, left: '40%',
        animationDelay: '2.4s',
      }} />
      {/* Amber accent — bottom left */}
      <div className="orb animate-pulse-glow" style={{
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        bottom: 50, left: '10%',
        animationDelay: '0.8s',
      }} />
    </div>
  );
}
