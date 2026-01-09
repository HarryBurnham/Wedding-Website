'use client';

import { useState, useEffect } from 'react';

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
  canBringPlusOne: boolean;
  plusOneFor: number | null;
  invitedToCeremony: boolean;
  invitedToReception: boolean;
  invitationType: string;
}

interface Party {
  partyId: number;
  partyName: string;
  password: string;
  guests: Guest[];
  createdAt: string;
}

export default function AdminGuests() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddParty, setShowAddParty] = useState(false);
  const [expandedParty, setExpandedParty] = useState<number | null>(null);
  const [editingParty, setEditingParty] = useState<number | null>(null);
  const [editingGuest, setEditingGuest] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Edit states
  const [editPartyData, setEditPartyData] = useState<{ party_name: string; password: string }>({ party_name: '', password: '' });
  const [editGuestData, setEditGuestData] = useState<{ first_name: string; last_name: string; invited_to_ceremony: boolean; can_bring_plus_one: boolean }>({
    first_name: '',
    last_name: '',
    invited_to_ceremony: true,
    can_bring_plus_one: false,
  });

  const [newParty, setNewParty] = useState({
    party_name: '',
    password: '',
    guests: [{ first_name: '', last_name: '', can_bring_plus_one: false, invited_to_ceremony: true }],
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
          guests: [{ first_name: '', last_name: '', can_bring_plus_one: false, invited_to_ceremony: true }],
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
      guests: [...prev.guests, { first_name: '', last_name: '', can_bring_plus_one: false, invited_to_ceremony: true }],
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

  // Edit Party
  const startEditingParty = (party: Party) => {
    setEditingParty(party.partyId);
    setEditPartyData({ party_name: party.partyName, password: party.password });
    setError('');
  };

  const cancelEditingParty = () => {
    setEditingParty(null);
    setEditPartyData({ party_name: '', password: '' });
    setError('');
  };

  const saveParty = async (partyId: number) => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/guests/${partyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPartyData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update party');
      }

      setEditingParty(null);
      fetchParties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update party');
    } finally {
      setSaving(false);
    }
  };

  const deleteParty = async (partyId: number) => {
    if (!confirm('Are you sure you want to delete this party and all its guests? This cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/guests/${partyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete party');
      }

      setExpandedParty(null);
      fetchParties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete party');
    } finally {
      setSaving(false);
    }
  };

  // Edit Guest
  const startEditingGuest = (guest: Guest) => {
    setEditingGuest(guest.id);
    setEditGuestData({
      first_name: guest.firstName,
      last_name: guest.lastName,
      invited_to_ceremony: guest.invitedToCeremony,
      can_bring_plus_one: guest.canBringPlusOne,
    });
    setError('');
  };

  const cancelEditingGuest = () => {
    setEditingGuest(null);
    setEditGuestData({ first_name: '', last_name: '', invited_to_ceremony: true, can_bring_plus_one: false });
    setError('');
  };

  const saveGuest = async (guestId: number) => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/guests/guest/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editGuestData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update guest');
      }

      setEditingGuest(null);
      fetchParties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest');
    } finally {
      setSaving(false);
    }
  };

  const deleteGuest = async (guestId: number, guestName: string) => {
    if (!confirm(`Are you sure you want to delete ${guestName}? This cannot be undone.`)) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/guests/guest/${guestId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete guest');
      }

      fetchParties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
    } finally {
      setSaving(false);
    }
  };

  // Add guest to existing party
  const [addingGuestToParty, setAddingGuestToParty] = useState<number | null>(null);
  const [newGuestData, setNewGuestData] = useState({
    first_name: '',
    last_name: '',
    invited_to_ceremony: true,
    can_bring_plus_one: false,
  });

  const startAddingGuest = (partyId: number) => {
    setAddingGuestToParty(partyId);
    setNewGuestData({ first_name: '', last_name: '', invited_to_ceremony: true, can_bring_plus_one: false });
    setError('');
  };

  const cancelAddingGuest = () => {
    setAddingGuestToParty(null);
    setNewGuestData({ first_name: '', last_name: '', invited_to_ceremony: true, can_bring_plus_one: false });
    setError('');
  };

  const addGuestToParty = async (partyId: number) => {
    if (!newGuestData.first_name.trim()) {
      setError('First name is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/guests/${partyId}/add-guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuestData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add guest');
      }

      setAddingGuestToParty(null);
      setNewGuestData({ first_name: '', last_name: '', invited_to_ceremony: true, can_bring_plus_one: false });
      fetchParties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guest');
    } finally {
      setSaving(false);
    }
  };

  const exportParties = () => {
    const rows = [['Party Name', 'Password', 'Guest Name', 'Invitation Type', 'Can Bring +1']];
    parties.forEach(party => {
      party.guests.forEach(guest => {
        rows.push([
          party.partyName,
          party.password,
          `${guest.firstName} ${guest.lastName}`,
          guest.invitationType,
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
  const allDayGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.invitedToCeremony).length, 0);
  const eveningOnlyGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => !g.invitedToCeremony).length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-gray-900">Parties & Guests</h1>
          <p className="text-gray-500 mt-1">
            {parties.length} parties • {totalGuests} guests ({allDayGuests} all day, {eveningOnlyGuests} evening only)
          </p>
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

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

            {/* Guests with individual invitation types */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Guests in this Party</label>
              {newParty.guests.map((guest, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center flex-wrap">
                  <input
                    type="text"
                    value={guest.first_name}
                    onChange={(e) => updateGuestField(index, 'first_name', e.target.value)}
                    placeholder="First name"
                    className="flex-1 min-w-[120px] px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={guest.last_name}
                    onChange={(e) => updateGuestField(index, 'last_name', e.target.value)}
                    placeholder="Last name"
                    className="flex-1 min-w-[120px] px-3 py-2 border rounded"
                  />
                  <select
                    value={guest.invited_to_ceremony ? 'all-day' : 'evening'}
                    onChange={(e) => updateGuestField(index, 'invited_to_ceremony', e.target.value === 'all-day')}
                    className="px-3 py-2 border rounded text-sm"
                  >
                    <option value="all-day">🌅 All Day</option>
                    <option value="evening">🌙 Evening</option>
                  </select>
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
          parties.map(party => {
            const partyAllDay = party.guests.filter(g => g.invitedToCeremony).length;
            const partyEvening = party.guests.filter(g => !g.invitedToCeremony).length;
            const isEditingThisParty = editingParty === party.partyId;
            
            return (
              <div key={party.partyId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => !isEditingThisParty && setExpandedParty(expandedParty === party.partyId ? null : party.partyId)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {isEditingThisParty ? (
                      <div className="flex gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editPartyData.party_name}
                          onChange={(e) => setEditPartyData(prev => ({ ...prev, party_name: e.target.value }))}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                          placeholder="Party name"
                        />
                        <input
                          type="text"
                          value={editPartyData.password}
                          onChange={(e) => setEditPartyData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-32 px-3 py-1 border rounded text-sm font-mono"
                          placeholder="Password"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium text-gray-900">{party.partyName}</h3>
                        <p className="text-sm text-gray-500">
                          {party.guests.length} guest{party.guests.length !== 1 ? 's' : ''} • 
                          Password: <span className="font-mono">{party.password}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isEditingThisParty ? (
                      <>
                        <button
                          onClick={() => saveParty(party.partyId)}
                          disabled={saving}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditingParty}
                          className="px-3 py-1 text-xs border rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {partyAllDay > 0 && (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                            {partyAllDay} All Day
                          </span>
                        )}
                        {partyEvening > 0 && (
                          <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                            {partyEvening} Evening
                          </span>
                        )}
                        <button
                          onClick={() => startEditingParty(party)}
                          className="px-2 py-1 text-xs text-gray-500 hover:text-burgundy-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteParty(party.partyId)}
                          className="px-2 py-1 text-xs text-gray-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedParty === party.partyId ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </div>
                </div>

                {expandedParty === party.partyId && (
                  <div className="border-t px-4 py-4 bg-gray-50">
                    <div className="space-y-2">
                      {party.guests.map(guest => {
                        const isEditingThisGuest = editingGuest === guest.id;
                        
                        return (
                          <div key={guest.id} className="flex items-center justify-between py-2 px-3 bg-white rounded">
                            {isEditingThisGuest ? (
                              <div className="flex items-center gap-2 flex-1 flex-wrap">
                                <input
                                  type="text"
                                  value={editGuestData.first_name}
                                  onChange={(e) => setEditGuestData(prev => ({ ...prev, first_name: e.target.value }))}
                                  className="w-28 px-2 py-1 border rounded text-sm"
                                  placeholder="First name"
                                />
                                <input
                                  type="text"
                                  value={editGuestData.last_name}
                                  onChange={(e) => setEditGuestData(prev => ({ ...prev, last_name: e.target.value }))}
                                  className="w-28 px-2 py-1 border rounded text-sm"
                                  placeholder="Last name"
                                />
                                <select
                                  value={editGuestData.invited_to_ceremony ? 'all-day' : 'evening'}
                                  onChange={(e) => setEditGuestData(prev => ({ ...prev, invited_to_ceremony: e.target.value === 'all-day' }))}
                                  className="px-2 py-1 border rounded text-xs"
                                >
                                  <option value="all-day">🌅 All Day</option>
                                  <option value="evening">🌙 Evening</option>
                                </select>
                                {!guest.isPlusOne && (
                                  <label className="flex items-center gap-1 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={editGuestData.can_bring_plus_one}
                                      onChange={(e) => setEditGuestData(prev => ({ ...prev, can_bring_plus_one: e.target.checked }))}
                                    />
                                    +1
                                  </label>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span>{guest.firstName} {guest.lastName}</span>
                                {guest.isPlusOne && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">+1 Slot</span>
                                )}
                                {guest.canBringPlusOne && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Can bring +1</span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              {isEditingThisGuest ? (
                                <>
                                  <button
                                    onClick={() => saveGuest(guest.id)}
                                    disabled={saving}
                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {saving ? '...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={cancelEditingGuest}
                                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    guest.invitedToCeremony ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {guest.invitedToCeremony ? '🌅 All Day' : '🌙 Evening'}
                                  </span>
                                  <button
                                    onClick={() => startEditingGuest(guest)}
                                    className="px-2 py-1 text-xs text-gray-500 hover:text-burgundy-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteGuest(guest.id, `${guest.firstName} ${guest.lastName}`)}
                                    className="px-2 py-1 text-xs text-gray-500 hover:text-red-600"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Add Guest to Party Form */}
                      {addingGuestToParty === party.partyId ? (
                        <div className="flex items-center gap-2 py-2 px-3 bg-blue-50 rounded flex-wrap">
                          <input
                            type="text"
                            value={newGuestData.first_name}
                            onChange={(e) => setNewGuestData(prev => ({ ...prev, first_name: e.target.value }))}
                            className="w-28 px-2 py-1 border rounded text-sm"
                            placeholder="First name"
                          />
                          <input
                            type="text"
                            value={newGuestData.last_name}
                            onChange={(e) => setNewGuestData(prev => ({ ...prev, last_name: e.target.value }))}
                            className="w-28 px-2 py-1 border rounded text-sm"
                            placeholder="Last name"
                          />
                          <select
                            value={newGuestData.invited_to_ceremony ? 'all-day' : 'evening'}
                            onChange={(e) => setNewGuestData(prev => ({ ...prev, invited_to_ceremony: e.target.value === 'all-day' }))}
                            className="px-2 py-1 border rounded text-xs"
                          >
                            <option value="all-day">🌅 All Day</option>
                            <option value="evening">🌙 Evening</option>
                          </select>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={newGuestData.can_bring_plus_one}
                              onChange={(e) => setNewGuestData(prev => ({ ...prev, can_bring_plus_one: e.target.checked }))}
                            />
                            +1
                          </label>
                          <button
                            onClick={() => addGuestToParty(party.partyId)}
                            disabled={saving}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {saving ? '...' : 'Add'}
                          </button>
                          <button
                            onClick={cancelAddingGuest}
                            className="px-3 py-1 text-xs border rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startAddingGuest(party.partyId)}
                          className="w-full py-2 text-sm text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded border border-dashed border-burgundy-200"
                        >
                          + Add guest to this party
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}