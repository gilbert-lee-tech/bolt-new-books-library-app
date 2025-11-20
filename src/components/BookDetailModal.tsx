import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn13: string | null;
  language: string | null;
  format: string | null;
  genre: string | null;
  status: string;
  image_url: string | null;
}

interface Library {
  id: string;
  country: string;
  city: string;
  area: string;
}

interface BookWithLibraries extends Book {
  libraries: Library[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Available' },
  'checked-out': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Checked Out' },
  'in-transit': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Transit' },
};

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailModal({ book, isOpen, onClose }: BookDetailModalProps) {
  const [bookWithLibraries, setBookWithLibraries] = useState<BookWithLibraries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && book) {
      fetchBookWithLibraries();
    }
  }, [isOpen, book]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  async function fetchBookWithLibraries() {
    if (!book || !book.isbn13) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('libraries_books')
        .select('library_id, libraries(id, country, city, area)')
        .eq('book_isbn13', book.isbn13);

      if (err) throw err;

      const libraries = (data || [])
        .map((item: any) => item.libraries)
        .filter((lib: Library | null) => lib !== null) as Library[];

      setBookWithLibraries({
        ...book,
        libraries,
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load inventory information');
      setBookWithLibraries({ ...book, libraries: [] });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !book) return null;

  const statusStyle = statusColors[book.status] || statusColors.available;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden h-80 flex items-center justify-center">
                    {book.image_url ? (
                      <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                    <p className="text-lg text-gray-600">{book.author}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </div>
                    {book.format && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {book.format}
                      </div>
                    )}
                    {book.genre && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {book.genre}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    {book.isbn13 && (
                      <div>
                        <p className="text-sm text-gray-600">ISBN-13</p>
                        <p className="text-gray-900 font-medium">{book.isbn13}</p>
                      </div>
                    )}
                    {book.language && (
                      <div>
                        <p className="text-sm text-gray-600">Language</p>
                        <p className="text-gray-900 font-medium">{book.language}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Available in {bookWithLibraries?.libraries.length || 0} {bookWithLibraries?.libraries.length === 1 ? 'Library' : 'Libraries'}
                </h3>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                ) : bookWithLibraries && bookWithLibraries.libraries.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bookWithLibraries.libraries.map((library) => (
                      <div
                        key={library.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        <p className="font-semibold text-gray-900">{library.area}</p>
                        <p className="text-sm text-gray-600">{library.city}, {library.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-500">This book is not currently available in any library.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
