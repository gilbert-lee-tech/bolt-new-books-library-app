import { MapPin } from 'lucide-react';

interface Library {
  id: string;
  country: string;
  city: string;
  area: string;
}

export function LibraryCard({ library }: { library: Library }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
        <MapPin className="w-12 h-12 text-white opacity-80" />
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">{library.city}</h3>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</span>
            <p className="text-sm text-gray-900 mt-1">{library.country}</p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Area</span>
            <p className="text-sm text-gray-900 mt-1">{library.area}</p>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</span>
            <p className="text-xs text-gray-600 mt-1 font-mono">{library.id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
