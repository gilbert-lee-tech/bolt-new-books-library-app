import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BookCard } from './BookCard';

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

export function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
      setFilteredBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.isbn13 && book.isbn13.includes(query))
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">
              {searchQuery ? 'No books match your search.' : 'No books in inventory yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
