'use client';

import { useState, useEffect } from 'react';

interface Guest {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  email?: string;
  has_plus_one: boolean;
  invited_to_ceremony: boolean;
  invited_to_reception: boolean;
  created_at: string;
}

export default function AdminGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    email: '',
    has_plus_one: false,
    invited_to_ceremony: true,
    invited_to_reception: true,
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/admin/guests');
      const data = await response.json();
      setGuests(data.guests || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGuest,
          code: generateCode(),
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewGuest({
          first_name: '',
          last_name: '',
          email: '',
          has_plus_one: false,
          invited_to_ceremony: true,
          invited_to_reception: true,
        });
        fetchGuests();
      }
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' });
      fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const exportGuests = () => {
    const csv = [
      ['Code', 'First Name', 'Last Name', 'Email', 'Has Plus One', 'Ceremony', 'Reception'].join(','),
      ...guests.map(g => [
        g.code,
        g.first_name,
        g.last_name,
        g.email || '',
        g.has_plus_one ? 'Yes' : 'No',
        g.invited_to_ceremony ? 'Yes' : 'No',
        g.invited_to_reception ? 'Yes' : 'No',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Guest List</h1>
        <div className="flex gap-4">
          <button
            onClick={exportGuests}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm bg-burgundy-900 text-white rounded hover:bg-burgundy-800 transition-colors"
          >
            Add Guest
          </button>
        </div>
      </div>

      {/* Add Guest Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-display text-gray-900 mb-4">Add New Guest</h2>
          <form onSubmit={handleAddGuest}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  value={newGuest.first_name}
                  onChange={(e) => setNewGuest(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  value={newGuest.last_name}
                  onChange={(e) => setNewGuest(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newGuest.has_plus_one}
                  onChange={(e) => setNewGuest(prev => ({ ...prev, has_plus_one: e.target.checked }))}
                />
                <span className="text-sm">Has Plus One</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newGuest.invited_to_ceremony}
                  onChange={(e) => setNewGuest(prev => ({ ...prev, invited_to_ceremony: e.target.checked }))}
                />
                <span className="text-sm">Ceremony</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newGuest.invited_to_reception}
                  onChange={(e) => setNewGuest(prev => ({ ...prev, invited_to_reception: e.target.checked }))}
                />
                <span className="text-sm">Reception</span>
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-burgundy-900 text-white rounded hover:bg-burgundy-800"
              >
                Add Guest
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guest List Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : guests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No guests yet. Add your first guest to get started.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Code</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Plus One</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Events</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{guest.code}</td>
                  <td className="px-6 py-4">{guest.first_name} {guest.last_name}</td>
                  <td className="px-6 py-4 text-gray-500">{guest.email || '-'}</td>
                  <td className="px-6 py-4">
                    {guest.has_plus_one && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        +1
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {guest.invited_to_ceremony && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Ceremony
                        </span>
                      )}
                      {guest.invited_to_reception && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Reception
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
