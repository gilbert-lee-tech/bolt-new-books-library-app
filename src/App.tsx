import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Books } from './components/Books'
import { LibrariesDashboard } from './components/LibrariesDashboard';

type Page = 'dashboard' | 'books' | 'libraries';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'books' && <Books />}
      {currentPage === 'libraries' && <LibrariesDashboard />}
    </div>
  );
}

export default App;
