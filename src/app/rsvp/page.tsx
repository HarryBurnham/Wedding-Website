'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Guest {
  id: number;
  code: string;
  name: string;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
}

interface Party {
  id: number;
  code: string;
  name: string;
  invited_to_ceremony: boolean;
  invited_to_reception: boolean;
}

interface PartyData {
  party: Party;
  guests: Guest[];
  existing_rsvp?: {
    attending: { [key: string]: boolean };
    meal_choices: { [key: string]: string };
    dietary_restrictions: { [key: string]: string };
    song_request?: string;
    recipe_text?: string;
  };
}

interface RSVPFormData {
  attending: { [key: string]: boolean };
  meal_choices: { [key: string]: string };
  dietary_restrictions: { [key: string]: string };
  song_request: string;
  recipe_text: string;
}

export default function RSVP() {
  const [step, setStep] = useState<'login' | 'form' | 'success'>('login');
  const [partyName, setPartyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [partyData, setPartyData] = useState<PartyData | null>(null);

  const [formData, setFormData] = useState<RSVPFormData>({
    attending: {},
    meal_choices: {},
    dietary_restrictions: {},
    song_request: '',
    recipe_text: '',
  });

  const rsvpDeadline = WEDDING_CONFIG.rsvpDeadline.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Handle party login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/party/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_name: partyName.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setPartyData(data);

      // Initialize form data with existing RSVP if present
      const initialAttending: { [key: string]: boolean } = {};
      const initialMeals: { [key: string]: string } = {};
      const initialDietary: { [key: string]: string } = {};

      data.guests.forEach((guest: Guest) => {
        initialAttending[guest.id] = data.existing_rsvp?.attending?.[guest.id] ?? false;
        initialMeals[guest.id] = data.existing_rsvp?.meal_choices?.[guest.id] ?? '';
        initialDietary[guest.id] = data.existing_rsvp?.dietary_restrictions?.[guest.id] ?? '';
      });

      setFormData({
        attending: initialAttending,
        meal_choices: initialMeals,
        dietary_restrictions: initialDietary,
        song_request: data.existing_rsvp?.song_request ?? '',
        recipe_text: data.existing_rsvp?.recipe_text ?? '',
      });

      setStep('form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle RSVP submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_id: partyData!.party.id,
          attending: formData.attending,
          meal_choices: formData.meal_choices,
          dietary_restrictions: formData.dietary_restrictions,
          song_request: formData.song_request,
          recipe_text: formData.recipe_text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttending = (guestId: number) => {
    setFormData(prev => ({
      ...prev,
      attending: {
        ...prev.attending,
        [guestId]: !prev.attending[guestId],
      },
    }));
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            RSVP
          </h1>
          <p className="text-xl text-gray-600">
            Please respond by {rsvpDeadline}
          </p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* RSVP Content */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Login */}
            {step === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <h2 className="font-display text-2xl text-burgundy-900 text-center mb-6">
                  Welcome
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Please enter your party name and password to access your RSVP. 
                  These details were included with your invitation.
                </p>

                <form onSubmit={handleLogin}>
                  <div className="mb-6">
                    <label htmlFor="partyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Party Name
                    </label>
                    <input
                      type="text"
                      id="partyName"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      placeholder="e.g. The Smith Family"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field"
                      required
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600 text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !partyName || !password}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Checking...' : 'Continue'}
                  </button>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                  Can't find your details? <a href="/contact" className="text-burgundy-700 hover:underline">Contact us</a>
                </p>
              </motion.div>
            )}

            {/* Step 2: RSVP Form */}
            {step === 'form' && partyData && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card mb-8">
                  <h2 className="font-display text-2xl text-burgundy-900 text-center mb-2">
                    Welcome, {partyData.party.name}!
                  </h2>
                  <p className="text-gray-600 text-center">
                    Please let us know who will be attending.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Attendance */}
                  <div className="card mb-8">
                    <h3 className="font-display text-xl text-burgundy-900 mb-6">
                      Who will be attending?
                    </h3>

                    <div className="space-y-4">
                      {partyData.guests.map((guest) => (
                        <label
                          key={guest.id}
                          className="flex items-center gap-4 p-4 border border-burgundy-100 cursor-pointer hover:bg-burgundy-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.attending[guest.id] || false}
                            onChange={() => toggleAttending(guest.id)}
                            className="w-5 h-5 rounded border-burgundy-300 text-burgundy-900 focus:ring-burgundy-900"
                          />
                          <span className="flex-1">
                            <span className="font-medium text-gray-800">
                              {guest.isPlusOne ? 'Plus One' : guest.name}
                            </span>
                            {guest.isPlusOne && (
                              <span className="text-gray-500 text-sm ml-2">(Guest)</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Meal Selection - only for attending guests */}
                  {Object.values(formData.attending).some(Boolean) && (
                    <div className="card mb-8">
                      <h3 className="font-display text-xl text-burgundy-900 mb-2">
                        Meal Selection
                      </h3>
                      <p className="text-gray-500 text-sm mb-6">
                        Menu options will be updated closer to the date. Please check back later.
                      </p>

                      {partyData.guests
                        .filter(guest => formData.attending[guest.id])
                        .map((guest) => (
                          <div key={guest.id} className="mb-6 last:mb-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {guest.isPlusOne ? 'Plus One' : guest.name}
                            </label>
                            <select
                              value={formData.meal_choices[guest.id] || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                meal_choices: {
                                  ...prev.meal_choices,
                                  [guest.id]: e.target.value,
                                },
                              }))}
                              className="input-field"
                            >
                              <option value="">Select a meal option</option>
                              {WEDDING_CONFIG.mealOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name} - {option.description}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Dietary Restrictions */}
                  {Object.values(formData.attending).some(Boolean) && (
                    <div className="card mb-8">
                      <h3 className="font-display text-xl text-burgundy-900 mb-6">
                        Dietary Requirements
                      </h3>

                      {partyData.guests
                        .filter(guest => formData.attending[guest.id])
                        .map((guest) => (
                          <div key={guest.id} className="mb-6 last:mb-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {guest.isPlusOne ? 'Plus One' : guest.name}
                            </label>
                            <input
                              type="text"
                              value={formData.dietary_restrictions[guest.id] || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                dietary_restrictions: {
                                  ...prev.dietary_restrictions,
                                  [guest.id]: e.target.value,
                                },
                              }))}
                              placeholder="Any allergies or dietary requirements?"
                              className="input-field"
                            />
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Song Request */}
                  <div className="card mb-8">
                    <h3 className="font-display text-xl text-burgundy-900 mb-6">
                      Song Request
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      What song will get you on the dance floor?
                    </p>
                    <input
                      type="text"
                      value={formData.song_request}
                      onChange={(e) => setFormData(prev => ({ ...prev, song_request: e.target.value }))}
                      placeholder="Song title - Artist"
                      className="input-field"
                    />
                  </div>

                  {/* Recipe */}
                  <div className="card mb-8">
                    <h3 className="font-display text-xl text-burgundy-900 mb-6">
                      Share a Recipe
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      We'd love to collect recipes from our guests! Please share a favourite 
                      recipe that means something to you.
                    </p>

                    <textarea
                      value={formData.recipe_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipe_text: e.target.value }))}
                      placeholder="Type your recipe here..."
                      rows={6}
                      className="input-field resize-none"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600 text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card text-center"
              >
                <svg className="w-16 h-16 mx-auto text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <h2 className="font-display text-3xl text-burgundy-900 mb-4">
                  Thank You!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your RSVP has been received. We can't wait to celebrate with you!
                </p>

                <div className="space-y-4">
                  <a href="/venue" className="btn-secondary block">
                    View Venue Details
                  </a>
                  <a href="/" className="text-burgundy-700 hover:underline block">
                    Return to Home
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
