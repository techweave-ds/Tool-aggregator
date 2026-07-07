import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';

export default function RootLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const isLanding = pathname === '/';
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar transparent={isLanding} />
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-6 h-6 rounded-full" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.6s linear infinite' }} /></div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
