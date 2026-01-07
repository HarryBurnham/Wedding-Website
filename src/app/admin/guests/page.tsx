'use client';

import { useState, useEffect } from 'react';

interface Guest {
  id: number;
  code: string;
  first_name: string;
  last_name: string;
  is_plus_one: boolean;
  party_id: number;
}

interface Party {
  id: number;
  code: string;
  party_name: string;
  password: string;
  invited_to_ceremony: boolean;
  invited_to_reception: boolean;
  guests: Guest[];
}

export default function AdminGuests() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddParty, setShowAddParty] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState<number | null>(null);
  const [expandedParty, setExpandedParty] = useState<number | null>(null);

  const [newParty, setNewParty] = useState({
    party_name: '',
    password: '',
    invited_to_ceremony: true,
    invited_to_reception: true,
    guests: [{ first_name: '', last_name: '', is_plus_one: false }],
  });

  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    is_plus_one: false,
  });

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('/api/admin/parties');
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
      const response = await fetch('/api/admin/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_name: newParty.party_name,
          password: newParty.password,
          invited_to_ceremony: newParty.invited_to_ceremony,
          invited_to_reception: newParty.invited_to_reception,
          guests: newParty.guests.filter(g => g.first_name && g.last_name),
        }),
      });

      if (response.ok) {
        setShowAddParty(false);
        setNewParty({
          party_name: '',
          password: '',
          invited_to_ceremony: true,
          invited_to_reception: true,
          guests: [{ first_name: '', last_name: '', is_plus_one: false }],
        });
        fetchParties();
      }
    } catch (error) {
      console.error('Error adding party:', error);
    }
  };

  const handleAddGuest = async (partyId: number) => {
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_id: partyId,
          ...newGuest,
        }),
      });

      if (response.ok) {
        setShowAddGuest(null);
        setNewGuest({ first_name: '', last_name: '', is_plus_one: false });
        fetchParties();
      }
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const addGuestField = () => {
    setNewParty(prev => ({
      ...prev,
      guests: [...prev.guests, { first_name: '', last_name: '', is_plus_one: false }],
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
    const rows = [['Party Code', 'Party Name', 'Password', 'Guest Name', 'Plus One', 'Ceremony', 'Reception']];
    
    parties.forEach(party => {
      if (party.guests.length > 0) {
        party.guests.forEach(guest => {
          rows.push([
            party.code,
            party.party_name,
            party.password,
            `${guest.first_name} ${guest.last_name}`,
            guest.is_plus_one ? 'Yes' : 'No',
            party.invited_to_ceremony ? 'Yes' : 'No',
            party.invited_to_reception ? 'Yes' : 'No',
          ]);
        });
      } else {
        rows.push([
          party.code,
          party.party_name,
          party.password,
          '',
          '',
          party.invited_to_ceremony ? 'Yes' : 'No',
          party.invited_to_reception ? 'Yes' : 'No',
        ]);
      }
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
          <p className="text-gray-500 mt-1">
            {parties.length} parties • {totalGuests} guests
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportParties}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddParty(true)}
            className="px-4 py-2 text-sm bg-burgundy-900 text-white rounded hover:bg-burgundy-800 transition-colors"
          >
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

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newParty.invited_to_ceremony}
                  onChange={(e) => setNewParty(prev => ({ ...prev, invited_to_ceremony: e.target.checked }))}
                />
                <span className="text-sm">Ceremony</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newParty.invited_to_reception}
                  onChange={(e) => setNewParty(prev => ({ ...prev, invited_to_reception: e.target.checked }))}
                />
                <span className="text-sm">Reception</span>
              </label>
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Guests in this Party</label>
              {newParty.guests.map((guest, index) => (
                <div key={index} className="flex gap-2 mb-2">
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
                  <label className="flex items-center gap-1 px-3">
                    <input
                      type="checkbox"
                      checked={guest.is_plus_one}
                      onChange={(e) => updateGuestField(index, 'is_plus_one', e.target.checked)}
                    />
                    <span className="text-xs">+1</span>
                  </label>
                  {newParty.guests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGuestField(index)}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addGuestField}
                className="text-sm text-burgundy-700 hover:text-burgundy-900"
              >
                + Add another guest
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-burgundy-900 text-white rounded hover:bg-burgundy-800"
              >
                Create Party
              </button>
              <button
                type="button"
                onClick={() => setShowAddParty(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Party List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
            Loading...
          </div>
        ) : parties.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
            No parties yet. Add your first party to get started.
          </div>
        ) : (
          parties.map((party) => (
            <div key={party.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Party Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedParty(expandedParty === party.id ? null : party.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-gray-400">#{party.code}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{party.party_name}</h3>
                    <p className="text-sm text-gray-500">
                      {party.guests.length} guest{party.guests.length !== 1 ? 's' : ''} • 
                      Password: <span className="font-mono">{party.password}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {party.invited_to_ceremony && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Ceremony
                      </span>
                    )}
                    {party.invited_to_reception && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Reception
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedParty === party.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Guest List */}
              {expandedParty === party.id && (
                <div className="border-t px-4 py-4 bg-gray-50">
                  <div className="space-y-2">
                    {party.guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between py-2 px-3 bg-white rounded"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400">#{guest.code}</span>
                          <span>{guest.first_name} {guest.last_name}</span>
                          {guest.is_plus_one && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                              Plus One
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Guest Form */}
                  {showAddGuest === party.id ? (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGuest.first_name}
                          onChange={(e) => setNewGuest(prev => ({ ...prev, first_name: e.target.value }))}
                          placeholder="First name"
                          className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="text"
                          value={newGuest.last_name}
                          onChange={(e) => setNewGuest(prev => ({ ...prev, last_name: e.target.value }))}
                          placeholder="Last name"
                          className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={newGuest.is_plus_one}
                            onChange={(e) => setNewGuest(prev => ({ ...prev, is_plus_one: e.target.checked }))}
                          />
                          <span className="text-xs">+1</span>
                        </label>
                        <button
                          onClick={() => handleAddGuest(party.id)}
                          className="px-3 py-1 bg-burgundy-900 text-white rounded text-sm hover:bg-burgundy-800"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddGuest(null)}
                          className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddGuest(party.id)}
                      className="mt-4 text-sm text-burgundy-700 hover:text-burgundy-900"
                    >
                      + Add guest to this party
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
