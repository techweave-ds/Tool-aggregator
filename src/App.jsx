import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { PinnedProvider } from '@/context/PinnedContext';
import { RecentToolsProvider } from '@/context/RecentToolsContext';
import { ActivityProvider } from '@/context/ActivityContext';
import { ToastProvider } from '@/context/ToastContext';
import { router } from '@/router';
export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <PinnedProvider>
            <RecentToolsProvider>
              <ActivityProvider>
                <RouterProvider router={router} />
              </ActivityProvider>
            </RecentToolsProvider>
          </PinnedProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
