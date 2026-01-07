'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalGuests: number;
  totalResponses: number;
  attending: number;
  notAttending: number;
  pending: number;
  mealCounts: { [key: string]: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Default stats if API not connected yet
  const displayStats = stats || {
    totalGuests: 0,
    totalResponses: 0,
    attending: 0,
    notAttending: 0,
    pending: 0,
    mealCounts: {},
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Guests</p>
          <p className="text-4xl font-display text-burgundy-900 mt-2">
            {displayStats.totalGuests}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Responses</p>
          <p className="text-4xl font-display text-burgundy-900 mt-2">
            {displayStats.totalResponses}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {displayStats.totalGuests > 0
              ? Math.round((displayStats.totalResponses / displayStats.totalGuests) * 100)
              : 0}% response rate
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Attending</p>
          <p className="text-4xl font-display text-green-600 mt-2">
            {displayStats.attending}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Not Attending</p>
          <p className="text-4xl font-display text-red-600 mt-2">
            {displayStats.notAttending}
          </p>
        </div>
      </div>

      {/* Pending Responses */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-gray-900">Pending Responses</h2>
          <span className="text-2xl font-display text-amber-600">
            {displayStats.pending}
          </span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-burgundy-700 rounded-full transition-all duration-500"
            style={{
              width: `${
                displayStats.totalGuests > 0
                  ? ((displayStats.totalGuests - displayStats.pending) / displayStats.totalGuests) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {displayStats.totalGuests - displayStats.pending} of {displayStats.totalGuests} guests have responded
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/guests"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-display text-gray-900 group-hover:text-burgundy-900 transition-colors">
            Manage Guests
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            Add, edit, or remove guests from your list
          </p>
        </Link>

        <Link
          href="/admin/rsvps"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-display text-gray-900 group-hover:text-burgundy-900 transition-colors">
            View RSVPs
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            See all responses and export data
          </p>
        </Link>

        <Link
          href="/admin/recipes"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-display text-gray-900 group-hover:text-burgundy-900 transition-colors">
            Recipe Collection
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            View recipes submitted by guests
          </p>
        </Link>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-lg">
        <h3 className="text-lg font-display text-amber-800 mb-2">
          🔧 Setup Required
        </h3>
        <p className="text-amber-700 text-sm mb-4">
          To get the dashboard working, you need to:
        </p>
        <ol className="list-decimal list-inside text-amber-700 text-sm space-y-2">
          <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a></li>
          <li>Run the database schema (see /database/schema.sql)</li>
          <li>Add your Supabase credentials to .env.local</li>
          <li>Add some test guests to see data here</li>
        </ol>
      </div>
    </div>
  );
}
