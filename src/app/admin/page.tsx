'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalParties: number;
  totalGuests: number;
  totalResponses: number;
  attendingGuests: number;
  notAttendingGuests: number;
  pendingParties: number;
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

  const displayStats = stats || {
    totalParties: 0,
    totalGuests: 0,
    totalResponses: 0,
    attendingGuests: 0,
    notAttendingGuests: 0,
    pendingParties: 0,
    mealCounts: {},
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Parties</p>
          <p className="text-4xl font-display text-burgundy-900 mt-2">
            {displayStats.totalParties}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Guests</p>
          <p className="text-4xl font-display text-burgundy-900 mt-2">
            {displayStats.totalGuests}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Guests Attending</p>
          <p className="text-4xl font-display text-green-600 mt-2">
            {displayStats.attendingGuests}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Not Attending</p>
          <p className="text-4xl font-display text-red-600 mt-2">
            {displayStats.notAttendingGuests}
          </p>
        </div>
      </div>

      {/* Response Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-gray-900">RSVP Progress</h2>
          <span className="text-gray-600">
            {displayStats.totalResponses} of {displayStats.totalParties} parties responded
          </span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-burgundy-700 rounded-full transition-all duration-500"
            style={{
              width: `${
                displayStats.totalParties > 0
                  ? (displayStats.totalResponses / displayStats.totalParties) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <p className="text-sm text-amber-600 mt-2">
          {displayStats.pendingParties} parties still pending
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/guests"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-display text-gray-900 group-hover:text-burgundy-900 transition-colors">
            Manage Parties & Guests
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            Add parties, manage guests, and set passwords
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
          🔧 Setup Guide
        </h3>
        <p className="text-amber-700 text-sm mb-4">
          To get started:
        </p>
        <ol className="list-decimal list-inside text-amber-700 text-sm space-y-2">
          <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a></li>
          <li>Run the database schema from /database/schema.sql</li>
          <li>Add your Supabase credentials to .env.local</li>
          <li>Add parties with their login passwords</li>
          <li>Add guests to each party</li>
          <li>Share party names and passwords with your guests</li>
        </ol>
      </div>
    </div>
  );
}
