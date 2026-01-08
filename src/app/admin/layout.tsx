'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_LINKS } from '@/lib/constants';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'wedding2026';
    
    if (password === adminPassword) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-display text-gray-900 text-center mb-6">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded mb-4"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-burgundy-900 text-white py-3 rounded hover:bg-burgundy-800 transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-6">
            <Link href="/" className="text-burgundy-700 hover:underline text-sm">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-display text-burgundy-900">Wedding Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {ADMIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-burgundy-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
