'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalParties: number;
  totalNamedGuests: number;
  totalPlusOneSlots: number;
  totalGuests: number;
  totalAttending: number;
  totalNotAttending: number;
  totalPending: number;
  allDayAttending: number;
  eveningOnlyAttending: number;
  mealCounts: { [key: string]: number };
}

// Meal name mapping
const MEAL_NAMES: { [key: string]: string } = {
  beef: 'Roast Beef',
  chicken: 'Roast Chicken',
  vegetarian: 'Mushroom Wellington',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', { cache: 'no-store' });
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

  const s = stats || {
    totalParties: 0,
    totalNamedGuests: 0,
    totalPlusOneSlots: 0,
    totalGuests: 0,
    totalAttending: 0,
    totalNotAttending: 0,
    totalPending: 0,
    allDayAttending: 0,
    eveningOnlyAttending: 0,
    mealCounts: {},
  };

  const responseRate = s.totalGuests > 0 
    ? Math.round(((s.totalAttending + s.totalNotAttending) / s.totalGuests) * 100) 
    : 0;

  const hasMeals = Object.keys(s.mealCounts).length > 0;

  return (
    <div>
      <h1 className="text-3xl font-display text-gray-900 mb-8">Dashboard</h1>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Parties</p>
          <p className="text-4xl font-display text-burgundy-900 mt-2">{s.totalParties}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Guests</p>
          <p className="text-4xl font-display text-burgundy-900 mt-2">{s.totalGuests}</p>
          <p className="text-xs text-gray-400 mt-1">
            {s.totalNamedGuests} named + {s.totalPlusOneSlots} plus-ones
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Attending</p>
          <p className="text-4xl font-display text-green-600 mt-2">{s.totalAttending}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Not Attending</p>
          <p className="text-4xl font-display text-red-600 mt-2">{s.totalNotAttending}</p>
        </div>
      </div>

      {/* Attendance Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-display text-gray-900 mb-4">Attendance by Event</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                All Day Guests
              </span>
              <span className="font-medium">{s.allDayAttending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                Evening Only Guests
              </span>
              <span className="font-medium">{s.eveningOnlyAttending}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-display text-gray-900 mb-4">Response Progress</h3>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-burgundy-700 rounded-full transition-all duration-500"
              style={{ width: `${responseRate}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{responseRate}% responded</span>
            <span className="text-amber-600">{s.totalPending} pending</span>
          </div>
        </div>
      </div>

      {/* Meal Choices */}
      {hasMeals && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-display text-gray-900 mb-4">Meal Choices</h3>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Main Course</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(s.mealCounts).map(([meal, count]) => (
              <div 
                key={meal} 
                className={`text-center p-3 rounded border ${
                  meal === 'lamb' ? 'bg-red-50 border-red-200' :
                  meal === 'chicken' ? 'bg-orange-50 border-orange-200' :
                  meal === 'vegetarian' ? 'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <p className={`text-2xl font-display ${
                  meal === 'lamb' ? 'text-red-700' :
                  meal === 'chicken' ? 'text-orange-700' :
                  meal === 'vegetarian' ? 'text-green-700' :
                  'text-gray-700'
                }`}>{count}</p>
                <p className={`text-sm ${
                  meal === 'lamb' ? 'text-red-600' :
                  meal === 'chicken' ? 'text-orange-600' :
                  meal === 'vegetarian' ? 'text-green-600' :
                  'text-gray-500'
                }`}>{MEAL_NAMES[meal] || meal}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
            Add parties, manage guests, set passwords
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
          href="/admin/songs"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-display text-gray-900 group-hover:text-burgundy-900 transition-colors">
            Song Requests
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            View song requests submitted by guests
          </p>
        </Link>
      </div>
    </div>
  );
}
