'use client';

import { useState, useEffect } from 'react';

interface RSVPData {
  id: string;
  guest_id: string;
  guest_name: string;
  guest_code: string;
  attending: { [key: string]: boolean };
  meal_choices: { [key: string]: string };
  dietary_restrictions: { [key: string]: string };
  song_request?: string;
  submitted_at: string;
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

  const isAttending = (rsvp: RSVPData) => {
    return Object.values(rsvp.attending).some(Boolean);
  };

  const filteredRsvps = rsvps.filter(rsvp => {
    if (filter === 'all') return true;
    if (filter === 'attending') return isAttending(rsvp);
    if (filter === 'not-attending') return !isAttending(rsvp);
    return true;
  });

  const exportRSVPs = () => {
    const headers = [
      'Guest Name',
      'Code',
      'Attending',
      'Meal Choices',
      'Dietary Restrictions',
      'Song Request',
      'Submitted',
    ];

    const rows = rsvps.map(rsvp => [
      rsvp.guest_name,
      rsvp.guest_code,
      isAttending(rsvp) ? 'Yes' : 'No',
      Object.values(rsvp.meal_choices).filter(Boolean).join('; '),
      Object.values(rsvp.dietary_restrictions).filter(Boolean).join('; '),
      rsvp.song_request || '',
      new Date(rsvp.submitted_at).toLocaleDateString(),
    ]);

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

  const attendingCount = rsvps.filter(isAttending).length;
  const notAttendingCount = rsvps.length - attendingCount;

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
          <p className="text-sm text-gray-500">Total Responses</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-green-600">{attendingCount}</p>
          <p className="text-sm text-gray-500">Attending</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-red-600">{notAttendingCount}</p>
          <p className="text-sm text-gray-500">Not Attending</p>
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
            Attending ({attendingCount})
          </button>
          <button
            onClick={() => setFilter('not-attending')}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              filter === 'not-attending' ? 'bg-white shadow' : 'hover:bg-gray-200'
            }`}
          >
            Not Attending ({notAttendingCount})
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
                  <h3 className="text-lg font-medium text-gray-900">{rsvp.guest_name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{rsvp.guest_code}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    isAttending(rsvp)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isAttending(rsvp) ? 'Attending' : 'Not Attending'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {/* Attending Members */}
                <div>
                  <p className="text-gray-500 mb-1">Guests Attending:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {Object.entries(rsvp.attending)
                      .filter(([_, attending]) => attending)
                      .map(([memberId]) => (
                        <li key={memberId}>Guest #{memberId.slice(-4)}</li>
                      ))}
                    {!Object.values(rsvp.attending).some(Boolean) && (
                      <li className="text-gray-400">None</li>
                    )}
                  </ul>
                </div>

                {/* Meal Choices */}
                <div>
                  <p className="text-gray-500 mb-1">Meal Choices:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {Object.entries(rsvp.meal_choices)
                      .filter(([_, choice]) => choice)
                      .map(([memberId, choice]) => (
                        <li key={memberId}>{choice}</li>
                      ))}
                    {!Object.values(rsvp.meal_choices).some(Boolean) && (
                      <li className="text-gray-400">Not selected</li>
                    )}
                  </ul>
                </div>

                {/* Dietary Restrictions */}
                {Object.values(rsvp.dietary_restrictions).some(Boolean) && (
                  <div>
                    <p className="text-gray-500 mb-1">Dietary Restrictions:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {Object.entries(rsvp.dietary_restrictions)
                        .filter(([_, restriction]) => restriction)
                        .map(([memberId, restriction]) => (
                          <li key={memberId}>{restriction}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Song Request */}
                {rsvp.song_request && (
                  <div>
                    <p className="text-gray-500 mb-1">Song Request:</p>
                    <p className="text-gray-700">{rsvp.song_request}</p>
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
