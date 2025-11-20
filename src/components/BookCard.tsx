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

const statusColors: Record<string, { bg: string; text: string }> = {
  available: { bg: 'bg-green-100', text: 'text-green-700' },
  'checked-out': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'in-transit': { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export function BookCard({ book }: { book: Book }) {
  const statusStyle = statusColors[book.status] || statusColors.available;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {book.image_url ? (
          <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
          {book.status}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-xs mb-3">{book.author}</p>

        <div className="space-y-2 text-xs text-gray-700 flex-1">
          {book.isbn13 && (
            <div>
              <span className="font-medium text-gray-900">ISBN:</span> {book.isbn13}
            </div>
          )}
          {book.language && (
            <div>
              <span className="font-medium text-gray-900">Language:</span> {book.language}
            </div>
          )}
          {book.format && (
            <div>
              <span className="font-medium text-gray-900">Format:</span> {book.format}
            </div>
          )}
          {book.genre && (
            <div>
              <span className="font-medium text-gray-900">Genre:</span> {book.genre}
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          ID: {book.id.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
}
