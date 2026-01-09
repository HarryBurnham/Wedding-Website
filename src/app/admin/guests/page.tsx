'use client';

import { useState, useEffect } from 'react';

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
  canBringPlusOne: boolean;
  plusOneFor: number | null;
}

interface Party {
  partyId: number;
  partyName: string;
  password: string;
  invitedToCeremony: boolean;
  invitedToReception: boolean;
  invitationType: string;
  guests: Guest[];
  createdAt: string;
}

export default function AdminGuests() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddParty, setShowAddParty] = useState(false);
  const [expandedParty, setExpandedParty] = useState<number | null>(null);

  const [newParty, setNewParty] = useState({
    party_name: '',
    password: '',
    invited_to_ceremony: true,
    invited_to_reception: true,
    guests: [{ first_name: '', last_name: '', can_bring_plus_one: false }],
  });

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('/api/admin/guests');
      const data = await response.json();
      setParties(data.parties || []);
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParty),
      });

      if (response.ok) {
        setShowAddParty(false);
        setNewParty({
          party_name: '',
          password: '',
          invited_to_ceremony: true,
          invited_to_reception: true,
          guests: [{ first_name: '', last_name: '', can_bring_plus_one: false }],
        });
        fetchParties();
      }
    } catch (error) {
      console.error('Error adding party:', error);
    }
  };

  const addGuestField = () => {
    setNewParty(prev => ({
      ...prev,
      guests: [...prev.guests, { first_name: '', last_name: '', can_bring_plus_one: false }],
    }));
  };

  const updateGuestField = (index: number, field: string, value: any) => {
    setNewParty(prev => ({
      ...prev,
      guests: prev.guests.map((g, i) => i === index ? { ...g, [field]: value } : g),
    }));
  };

  const removeGuestField = (index: number) => {
    setNewParty(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
  };

  const exportParties = () => {
    const rows = [['Party Name', 'Password', 'Type', 'Guest Name', 'Can Bring +1']];
    parties.forEach(party => {
      party.guests.forEach(guest => {
        rows.push([
          party.partyName,
          party.invitationType,
          `${guest.firstName} ${guest.lastName}`,
          guest.canBringPlusOne ? 'Yes' : 'No',
        ]);
      });
    });

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parties-and-guests.csv';
    a.click();
  };

  const totalGuests = parties.reduce((sum, p) => sum + p.guests.length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-gray-900">Parties & Guests</h1>
          <p className="text-gray-500 mt-1">{parties.length} parties • {totalGuests} guests</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportParties} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Export CSV
          </button>
          <button onClick={() => setShowAddParty(true)} className="px-4 py-2 text-sm bg-burgundy-900 text-white rounded hover:bg-burgundy-800">
            Add Party
          </button>
        </div>
      </div>

      {/* Add Party Form */}
      {showAddParty && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-display text-gray-900 mb-4">Add New Party</h2>
          <form onSubmit={handleAddParty}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Party Name (Login)</label>
                <input
                  type="text"
                  value={newParty.party_name}
                  onChange={(e) => setNewParty(prev => ({ ...prev, party_name: e.target.value }))}
                  placeholder="e.g. The Smith Family"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input
                  type="text"
                  value={newParty.password}
                  onChange={(e) => setNewParty(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="e.g. smith2026"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Invitation Type */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Invitation Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="invitationType"
                    checked={newParty.invited_to_ceremony}
                    onChange={() => setNewParty(prev => ({ ...prev, invited_to_ceremony: true }))}
                  />
                  <span className="text-sm">🌅 All Day (Ceremony + Reception)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="invitationType"
                    checked={!newParty.invited_to_ceremony}
                    onChange={() => setNewParty(prev => ({ ...prev, invited_to_ceremony: false }))}
                  />
                  <span className="text-sm">🌙 Evening Only (Reception)</span>
                </label>
              </div>
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Guests in this Party</label>
              {newParty.guests.map((guest, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={guest.first_name}
                    onChange={(e) => updateGuestField(index, 'first_name', e.target.value)}
                    placeholder="First name"
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={guest.last_name}
                    onChange={(e) => updateGuestField(index, 'last_name', e.target.value)}
                    placeholder="Last name"
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <label className="flex items-center gap-1 px-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={guest.can_bring_plus_one}
                      onChange={(e) => updateGuestField(index, 'can_bring_plus_one', e.target.checked)}
                    />
                    <span className="text-xs">+1</span>
                  </label>
                  {newParty.guests.length > 1 && (
                    <button type="button" onClick={() => removeGuestField(index)} className="px-2 text-red-500 hover:text-red-700">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addGuestField} className="text-sm text-burgundy-700 hover:text-burgundy-900">
                + Add another guest
              </button>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="px-4 py-2 bg-burgundy-900 text-white rounded hover:bg-burgundy-800">
                Create Party
              </button>
              <button type="button" onClick={() => setShowAddParty(false)} className="px-4 py-2 border rounded hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Party List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
        ) : parties.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
            No parties yet. Add your first party to get started.
          </div>
        ) : (
          parties.map(party => (
            <div key={party.partyId} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedParty(expandedParty === party.partyId ? null : party.partyId)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{party.partyName}</h3>
                    <p className="text-sm text-gray-500">
                      {party.guests.length} guest{party.guests.length !== 1 ? 's' : ''} • 
                      Password: <span className="font-mono">{party.password}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    party.invitedToCeremony ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {party.invitationType}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedParty === party.partyId ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedParty === party.partyId && (
                <div className="border-t px-4 py-4 bg-gray-50">
                  <div className="space-y-2">
                    {party.guests.map(guest => (
                      <div key={guest.id} className="flex items-center justify-between py-2 px-3 bg-white rounded">
                        <div className="flex items-center gap-3">
                          <span>{guest.firstName} {guest.lastName}</span>
                          {guest.isPlusOne && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">+1 Slot</span>
                          )}
                          {guest.canBringPlusOne && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Can bring +1</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
