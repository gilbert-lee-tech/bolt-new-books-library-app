import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Books } from './components/Books'
import { LibrariesDashboard } from './components/LibrariesDashboard';
import { SettingsModal } from './components/SettingsModal';
import { ThemeProvider } from './contexts/ThemeContext';

export type Page = 'dashboard' | 'books' | 'libraries';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} onSettingsClick={() => setIsSettingsOpen(true)} />
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'books' && <Books />}
      {currentPage === 'libraries' && <LibrariesDashboard />}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
