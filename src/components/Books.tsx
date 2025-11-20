import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BookCard } from './BookCard';
import { BookDetailModal } from './BookDetailModal';

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

interface GroupedBook {
  isbn13: string | null;
  title: string;
  author: string;
  genre: string | null;
  image_url: string | null;
  count: number;
  samples: Book[];
}

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<GroupedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<GroupedBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setBooks(data || []);

      const grouped = groupBooksByISBN(data || []);
      setGroupedBooks(grouped);
      setFilteredBooks(grouped);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  function groupBooksByISBN(booksData: Book[]): GroupedBook[] {
    const groups = new Map<string | null, Book[]>();

    booksData.forEach((book) => {
      const key = book.isbn13 || `no-isbn-${Math.random()}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(book);
    });

    const grouped: GroupedBook[] = Array.from(groups.values()).map((groupBooks) => {
      const first = groupBooks[0];
      return {
        isbn13: first.isbn13,
        title: first.title,
        author: first.author,
        genre: first.genre,
        image_url: first.image_url,
        count: groupBooks.length,
        samples: groupBooks,
      };
    });

    return grouped.sort((a, b) => a.title.localeCompare(b.title));
  }

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = groupedBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.isbn13 && book.isbn13.includes(query))
    );
    setFilteredBooks(filtered);
  }, [searchQuery, groupedBooks]);

  function handleBookImageClick(book: Book) {
    setSelectedBook(book);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedBook(null);
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Books</h1>

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
            {filteredBooks.map((group) => (
              <div key={group.isbn13 || group.title} className="relative">
                <BookCard book={group.samples[0]} onImageClick={handleBookImageClick} />
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {group.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
