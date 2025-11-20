import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LibraryCard } from './LibraryCard';

interface Library {
  id: string;
  country: string;
  city: string;
  area: string;
}

export function LibrariesDashboard() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibraries();
  }, []);

  async function fetchLibraries() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLibraries(data || []);
    } catch (error) {
      console.error('Error fetching libraries:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Library Profile</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading libraries...</p>
          </div>
        ) : libraries.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No libraries found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraries.map((library) => (
              <LibraryCard key={library.id} library={library} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
