'use client';

import { useState, useEffect } from 'react';

interface GuestDetail {
  id: string;
  name: string;
  is_plus_one: boolean;
  attending: boolean;
  meal_choice: string | null;
  dietary_restriction: string | null;
}

interface RSVPData {
  id: number;
  party_id: number;
  party_code: string;
  party_name: string;
  attending: { [key: string]: boolean };
  meal_choices: { [key: string]: string };
  dietary_restrictions: { [key: string]: string };
  song_request?: string;
  recipe_text?: string;
  submitted_at: string;
  guest_details: GuestDetail[];
}

export default function AdminRSVPs() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'attending' | 'not-attending'>('all');

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch('/api/admin/rsvps');
      const data = await response.json();
      setRsvps(data.rsvps || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAttendingGuests = (rsvp: RSVPData) => {
    return rsvp.guest_details.some(g => g.attending);
  };

  const filteredRsvps = rsvps.filter(rsvp => {
    if (filter === 'all') return true;
    if (filter === 'attending') return hasAttendingGuests(rsvp);
    if (filter === 'not-attending') return !hasAttendingGuests(rsvp);
    return true;
  });

  const totalAttending = rsvps.reduce(
    (sum, rsvp) => sum + rsvp.guest_details.filter(g => g.attending).length,
    0
  );

  const totalNotAttending = rsvps.reduce(
    (sum, rsvp) => sum + rsvp.guest_details.filter(g => !g.attending).length,
    0
  );

  const exportRSVPs = () => {
    const headers = [
      'Party Code',
      'Party Name',
      'Guest Name',
      'Attending',
      'Meal Choice',
      'Dietary Restrictions',
      'Song Request',
      'Submitted',
    ];

    const rows: string[][] = [];
    rsvps.forEach(rsvp => {
      rsvp.guest_details.forEach(guest => {
        rows.push([
          rsvp.party_code,
          rsvp.party_name,
          guest.name,
          guest.attending ? 'Yes' : 'No',
          guest.meal_choice || '',
          guest.dietary_restriction || '',
          rsvp.song_request || '',
          new Date(rsvp.submitted_at).toLocaleDateString(),
        ]);
      });
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-responses.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">RSVP Responses</h1>
        <button
          onClick={exportRSVPs}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-gray-900">{rsvps.length}</p>
          <p className="text-sm text-gray-500">Parties Responded</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-green-600">{totalAttending}</p>
          <p className="text-sm text-gray-500">Guests Attending</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-red-600">{totalNotAttending}</p>
          <p className="text-sm text-gray-500">Guests Not Attending</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="inline-flex bg-gray-100 rounded p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              filter === 'all' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
          >
            All ({rsvps.length})
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              filter === 'attending' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
          >
            Has Attending
          </button>
          <button
            onClick={() => setFilter('not-attending')}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              filter === 'not-attending' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
          >
            None Attending
          </button>
        </div>
      </div>

      {/* RSVP List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
            Loading...
          </div>
        ) : filteredRsvps.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
            No RSVP responses yet.
          </div>
        ) : (
          filteredRsvps.map((rsvp) => (
            <div key={rsvp.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-400">#{rsvp.party_code}</span>
                    <h3 className="text-lg font-medium text-gray-900">{rsvp.party_name}</h3>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    hasAttendingGuests(rsvp)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {rsvp.guest_details.filter(g => g.attending).length} attending
                </span>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 mb-4">
                {rsvp.guest_details.map((guest) => (
                  <div
                    key={guest.id}
                    className={`p-3 rounded ${
                      guest.attending ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {guest.name}
                        {guest.is_plus_one && (
                          <span className="ml-2 text-xs text-purple-600">(Plus One)</span>
                        )}
                      </span>
                      <span className={`text-sm ${guest.attending ? 'text-green-600' : 'text-red-600'}`}>
                        {guest.attending ? '✓ Attending' : '✗ Not Attending'}
                      </span>
                    </div>
                    {guest.attending && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {guest.meal_choice && (
                          <p>Meal: {guest.meal_choice}</p>
                        )}
                        {guest.dietary_restriction && (
                          <p>Dietary: {guest.dietary_restriction}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Song Request & Recipe */}
              <div className="grid md:grid-cols-2 gap-4 text-sm border-t pt-4">
                {rsvp.song_request && (
                  <div>
                    <p className="text-gray-500 mb-1">🎵 Song Request:</p>
                    <p className="text-gray-700">{rsvp.song_request}</p>
                  </div>
                )}
                {rsvp.recipe_text && (
                  <div>
                    <p className="text-gray-500 mb-1">📖 Recipe submitted</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Submitted: {new Date(rsvp.submitted_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
