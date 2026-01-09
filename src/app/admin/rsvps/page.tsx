'use client';

import { useState, useEffect } from 'react';

export const metadata = {
  title: 'Harry Burnham & Adia Shane | Admin',
};

interface GuestDetail {
  id: number;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
  canBringPlusOne: boolean;
  plusOneFor: number | null;
  attending: boolean | null;
  mealChoice: string | null;
  dietaryRequirements: string | null;
  plusOneFirstName: string | null;
  plusOneLastName: string | null;
  displayName: string;
  submittedAt: string | null;
}

interface PartyRSVP {
  partyId: number;
  partyName: string;
  invitationType: string;
  invitedToCeremony: boolean;
  invitedToReception: boolean;
  hasResponded: boolean;
  attendingCount: number;
  notAttendingCount: number;
  guests: GuestDetail[];
  songRequest: string | null;
  recipeTitle: string | null;
  recipeText: string | null;
}

export default function AdminRSVPs() {
  const [rsvps, setRsvps] = useState<PartyRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'responded' | 'pending' | 'allday' | 'evening'>('all');

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

  const filteredRsvps = rsvps.filter(rsvp => {
    if (filter === 'all') return true;
    if (filter === 'responded') return rsvp.hasResponded;
    if (filter === 'pending') return !rsvp.hasResponded;
    if (filter === 'allday') return rsvp.invitedToCeremony;
    if (filter === 'evening') return !rsvp.invitedToCeremony;
    return true;
  });

  const totalAttending = rsvps.reduce((sum, r) => sum + r.attendingCount, 0);
  const totalNotAttending = rsvps.reduce((sum, r) => sum + r.notAttendingCount, 0);

  const exportRSVPs = () => {
    const headers = ['Party', 'Type', 'Guest Name', 'Plus One?', 'Attending', 'Meal', 'Dietary', 'Song Request'];
    const rows: string[][] = [];

    rsvps.forEach(party => {
      party.guests.forEach(guest => {
        rows.push([
          party.partyName,
          party.invitationType,
          guest.displayName,
          guest.isPlusOne ? 'Yes' : 'No',
          guest.attending === true ? 'Yes' : guest.attending === false ? 'No' : 'Pending',
          guest.mealChoice || '',
          guest.dietaryRequirements || '',
          party.songRequest || '',
        ]);
      });
    });

    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
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
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-gray-900">{rsvps.length}</p>
          <p className="text-sm text-gray-500">Total Parties</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-green-600">{totalAttending}</p>
          <p className="text-sm text-gray-500">Attending</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-red-600">{totalNotAttending}</p>
          <p className="text-sm text-gray-500">Not Attending</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-3xl font-display text-amber-600">{rsvps.reduce((sum, r) => sum + r.guests.filter(g => g.attending === null).length, 0)}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="inline-flex bg-gray-100 rounded p-1 flex-wrap gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'responded', label: 'Responded' },
            { key: 'pending', label: 'Pending' },
            { key: 'allday', label: 'All Day' },
            { key: 'evening', label: 'Evening' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                filter === f.key ? 'bg-white shadow' : 'hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* RSVP List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
        ) : filteredRsvps.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">No RSVPs found.</div>
        ) : (
          filteredRsvps.map(party => (
            <div key={party.partyId} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Party Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{party.partyName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        party.invitedToCeremony ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {party.invitationType}
                      </span>
                      {party.hasResponded ? (
                        <span className="text-xs text-green-600">✓ Responded</span>
                      ) : (
                        <span className="text-xs text-amber-600">⏳ Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-medium">{party.attendingCount}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-red-600 font-medium">{party.notAttendingCount}</span>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="p-4">
                <div className="space-y-3">
                  {party.guests.map(guest => (
                    <div
                      key={guest.id}
                      className={`p-3 rounded ${
                        guest.attending === true ? 'bg-green-50' : 
                        guest.attending === false ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{guest.displayName}</span>
                          {guest.isPlusOne && (
                            <span className="ml-2 text-xs text-purple-600">(+1)</span>
                          )}
                        </div>
                        <span className={`text-sm ${
                          guest.attending === true ? 'text-green-600' : 
                          guest.attending === false ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          {guest.attending === true ? '✓ Attending' : 
                           guest.attending === false ? '✗ Not Attending' : 'Pending'}
                        </span>
                      </div>
                      {guest.attending && (guest.mealChoice || guest.dietaryRequirements) && (
                        <div className="mt-2 text-sm text-gray-600">
                          {guest.mealChoice && <span>Meal: {guest.mealChoice}</span>}
                          {guest.mealChoice && guest.dietaryRequirements && <span className="mx-2">•</span>}
                          {guest.dietaryRequirements && <span>Dietary: {guest.dietaryRequirements}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Song & Recipe */}
                {(party.songRequest || party.recipeTitle) && (
                  <div className="mt-4 pt-4 border-t text-sm">
                    {party.songRequest && (
                      <p className="text-gray-600">🎵 Song: {party.songRequest}</p>
                    )}
                    {party.recipeTitle && (
                      <p className="text-gray-600 mt-1">📖 Recipe: {party.recipeTitle}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

