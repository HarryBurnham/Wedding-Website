'use client';

import { useState, useEffect } from 'react';

interface PartyExtra {
  id: number;
  partyId: number;
  partyName: string;
  guestNames: string[];
  songRequest: string | null;
  submittedAt: string;
}

// Helper to format guest names nicely
const formatGuestNames = (names: string[]): string => {
  if (!names || names.length === 0) return 'Unknown';
  if (names.length === 1) return names[0];
  
  // Split names into first and last
  const parsed = names.map(name => {
    const parts = name.trim().split(' ');
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ') || '';
    return { firstName, lastName };
  });
  
  // Check if all surnames are the same
  const allSameSurname = parsed.every(p => p.lastName === parsed[0].lastName);
  
  if (allSameSurname) {
    const firstNames = parsed.map(p => p.firstName);
    const surname = parsed[0].lastName;
    
    if (firstNames.length === 2) {
      return `${firstNames[0]} & ${firstNames[1]} ${surname}`;
    }
    const lastIndex = firstNames.length - 1;
    return `${firstNames.slice(0, lastIndex).join(', ')} & ${firstNames[lastIndex]} ${surname}`;
  }
  
  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }
  const lastIndex = names.length - 1;
  return `${names.slice(0, lastIndex).join(', ')} & ${names[lastIndex]}`;
};

export default function AdminSongRequests() {
  const [partyExtras, setPartyExtras] = useState<PartyExtra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/recipes', { cache: 'no-store' });
      const data = await response.json();
      setPartyExtras(data.recipes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter songs (has song request)
  const songs = partyExtras.filter(p => p.songRequest && p.songRequest.trim() !== '');

  // Export song requests to CSV
  const exportSongRequestsToCsv = () => {
    if (!songs.length) return;

    const rows = [['Guests', 'Song Request']];
    songs.forEach(song => {
      rows.push([formatGuestNames(song.guestNames), song.songRequest || '']);
    });

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'song-requests.csv';
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Song Requests</h1>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500">{songs.length} song{songs.length !== 1 ? 's' : ''} requested</p>
            {songs.length > 0 && (
              <button
                onClick={exportSongRequestsToCsv}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Export to CSV
              </button>
            )}
          </div>

          {songs.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
              No song requests yet.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Guests</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Song Request</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {songs.map(song => (
                    <tr key={song.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatGuestNames(song.guestNames)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{song.songRequest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
