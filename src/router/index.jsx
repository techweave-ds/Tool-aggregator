import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import LandingPage from '@/pages/LandingPage';
import ToolsPage from '@/pages/ToolsPage';
import ToolDetailPage from '@/pages/ToolDetailPage';
import ImportPage from '@/pages/ImportPage';
import AdminPage from '@/pages/AdminPage';
import NotFoundPage from '@/pages/NotFoundPage';

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
