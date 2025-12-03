import { BookOpen, Home, Library, Settings, LogOut } from 'lucide-react';
import { Page } from '../App'

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onSettingsClick: () => void;
}

export function Sidebar({ currentPage, onPageChange, onSettingsClick }: SidebarProps) {
  const isActive = (page: Page) => currentPage === page;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">LibraryHub</h1>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <button
          onClick={() => onPageChange('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('dashboard') ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => onPageChange('books')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('books') ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Books</span>
        </button>
        <button
          onClick={() => onPageChange('libraries')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('libraries') ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Library Profile</span>
        </button>
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
