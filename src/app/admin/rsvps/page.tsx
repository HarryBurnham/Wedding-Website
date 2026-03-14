'use client';

import { useState, useEffect } from 'react';

interface GuestDetail {
  id: number;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
  canBringPlusOne: boolean;
  plusOneFor: number | null;
  invitedToCeremony: boolean;
  invitedToReception: boolean;
  attending: boolean | null;
  starterCheese: boolean | null;
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
  hasAllDayGuests: boolean;
  hasEveningGuests: boolean;
  hasResponded: boolean;
  attendingCount: number;
  notAttendingCount: number;
  pendingCount: number;
  guests: GuestDetail[];
  songRequest: string | null;
}

// Meal name mapping
const MEAL_NAMES: { [key: string]: string } = {
  lamb: 'Herb crust Rump of Lamb',
  chicken: 'Pan Roast Chicken Supreme',
  vegetarian: 'Roast Butternut Squash, Spinach & Mushroom Wellington',
};

const getMealDisplayName = (mealChoice: string | null): string => {
  if (!mealChoice) return '';
  return MEAL_NAMES[mealChoice] || mealChoice;
};

export default function AdminRSVPs() {
  const [rsvps, setRsvps] = useState<PartyRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'responded' | 'pending' | 'allday' | 'evening'>('all');

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch('/api/admin/rsvps', { cache: 'no-store' });
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
    if (filter === 'allday') return rsvp.hasAllDayGuests;
    if (filter === 'evening') return rsvp.hasEveningGuests;
    return true;
  });

  const totalAttending = rsvps.reduce((sum, r) => sum + r.attendingCount, 0);
  const totalNotAttending = rsvps.reduce((sum, r) => sum + r.notAttendingCount, 0);
  const totalPending = rsvps.reduce((sum, r) => sum + r.pendingCount, 0);

  const exportRSVPs = () => {
    const headers = ['Party', 'Guest Name', 'Invitation Type', 'Plus One?', 'Attending', 'Bruschetta', 'Main Course', 'Dietary', 'Song Request'];
    const rows: string[][] = [];

    rsvps.forEach(party => {
      party.guests.forEach(guest => {
        rows.push([
          party.partyName,
          guest.displayName,
          guest.invitedToCeremony ? 'All Day' : 'Evening Only',
          guest.isPlusOne ? 'Yes' : 'No',
          guest.attending === true ? 'Yes' : guest.attending === false ? 'No' : 'Pending',
          guest.starterCheese === true ? 'With cheese' : guest.starterCheese === false ? 'Without cheese' : '',
          getMealDisplayName(guest.mealChoice),
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
          <p className="text-3xl font-display text-amber-600">{totalPending}</p>
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
                      {party.hasAllDayGuests && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                          🌅 All Day
                        </span>
                      )}
                      {party.hasEveningGuests && (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                          🌙 Evening
                        </span>
                      )}
                      {party.hasResponded ? (
                        <span className="text-xs text-green-600">✓ Responded</span>
                      ) : (
                        <span className="text-xs text-amber-600">⏳ Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-green-600 font-medium">{party.attendingCount} attending</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="text-red-600 font-medium">{party.notAttendingCount} not attending</span>
                    {party.pendingCount > 0 && (
                      <>
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="text-amber-600 font-medium">{party.pendingCount} pending</span>
                      </>
                    )}
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
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{guest.displayName}</span>
                          {guest.isPlusOne && (
                            <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded">+1</span>
                          )}
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            guest.invitedToCeremony ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {guest.invitedToCeremony ? '🌅' : '🌙'}
                          </span>
                        </div>
                        <span className={`text-sm ${
                          guest.attending === true ? 'text-green-600' : 
                          guest.attending === false ? 'text-red-600' : 'text-amber-500'
                        }`}>
                          {guest.attending === true ? '✓ Attending' : 
                           guest.attending === false ? '✗ Not Attending' : '⏳ Pending'}
                        </span>
                      </div>
                      
                      {/* Meal details - only show if attending */}
                      {guest.attending && (guest.starterCheese !== null || guest.mealChoice || guest.dietaryRequirements) && (
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          {/* Starter */}
                          {guest.starterCheese !== null && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Bruschetta:</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                guest.starterCheese 
                                  ? 'bg-yellow-100 text-yellow-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {guest.starterCheese ? '🧀 With cheese' : 'Without cheese'}
                              </span>
                            </div>
                          )}
                          
                          {/* Main course */}
                          {guest.mealChoice && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Main:</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                guest.mealChoice === 'lamb' ? 'bg-red-100 text-red-700' :
                                guest.mealChoice === 'chicken' ? 'bg-orange-100 text-orange-700' :
                                guest.mealChoice === 'vegetarian' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {getMealDisplayName(guest.mealChoice)}
                              </span>
                            </div>
                          )}
                          
                          {/* Dietary requirements */}
                          {guest.dietaryRequirements && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Dietary:</span>
                              <span className="text-gray-600">{guest.dietaryRequirements}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Song & Recipe */}
                {party.songRequest  && (
                  <div className="mt-4 pt-4 border-t text-sm">
                    {party.songRequest && (
                      <p className="text-gray-600">🎵 Song: {party.songRequest}</p>
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
