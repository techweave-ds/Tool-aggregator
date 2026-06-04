import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';

export default function RootLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const isLanding = pathname === '/';
  return (
    <div className="noise min-h-screen" style={{ background: 'var(--os-bg)' }}>
      <Navbar transparent={isLanding} />
      <Outlet />
    </div>
  );
}
