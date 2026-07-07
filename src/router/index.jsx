import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import NotFoundPage from '@/pages/NotFoundPage';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ToolsPage = lazy(() => import('@/pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('@/pages/ToolDetailPage'));
const ImportPage = lazy(() => import('@/pages/ImportPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'tools', element: <ToolsPage /> },
      { path: 'tool/:id', element: <ToolDetailPage /> },
      { path: 'import', element: <ImportPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: '*', element: <NotFoundPage /> },
    ]
  }
]);
