import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Theme
                </label>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-10 w-16 items-center rounded-full transition-colors bg-gray-200 dark:bg-gray-700"
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white dark:bg-gray-900 transition-transform flex items-center justify-center ${
                      theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  >
                    {theme === 'light' ? (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-blue-400" />
                    )}
                  </span>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
