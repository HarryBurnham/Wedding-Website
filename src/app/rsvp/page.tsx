'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

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
  invitedToCeremony: boolean;
  invitedToReception: boolean;
}

interface GuestRSVP {
  attending: boolean | null;
  mealChoice: string;
  dietaryRequirements: string;
  plusOneFirstName: string;
  plusOneLastName: string;
}

interface PartyExtras {
  songRequest: string;
  recipeTitle: string;
  recipeText: string;
}

export default function RSVP() {
  const [step, setStep] = useState<'login' | 'attendance' | 'meals' | 'extras' | 'success'>('login');
  const [partyName, setPartyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [party, setParty] = useState<Party | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestRSVPs, setGuestRSVPs] = useState<{ [guestId: number]: GuestRSVP }>({});
  const [partyExtras, setPartyExtras] = useState<PartyExtras>({
    songRequest: '',
    recipeTitle: '',
    recipeText: '',
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

      setParty(data.party);
      setGuests(data.guests);

      // Initialize RSVPs for each guest
      const initialRSVPs: { [guestId: number]: GuestRSVP } = {};
      data.guests.forEach((guest: Guest) => {
        const existingRsvp = data.existingRsvps?.[guest.id];
        initialRSVPs[guest.id] = {
          attending: existingRsvp?.attending ?? null,
          mealChoice: existingRsvp?.mealChoice ?? '',
          dietaryRequirements: existingRsvp?.dietaryRequirements ?? '',
          plusOneFirstName: existingRsvp?.plusOneFirstName ?? '',
          plusOneLastName: existingRsvp?.plusOneLastName ?? '',
        };
      });
      setGuestRSVPs(initialRSVPs);

      // Load existing party extras
      if (data.partyExtras) {
        setPartyExtras({
          songRequest: data.partyExtras.songRequest ?? '',
          recipeTitle: data.partyExtras.recipeTitle ?? '',
          recipeText: data.partyExtras.recipeText ?? '',
        });
      }

      setStep('attendance');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update guest RSVP
  const updateGuestRSVP = (guestId: number, field: keyof GuestRSVP, value: any) => {
    setGuestRSVPs(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value,
      },
    }));
  };

  // Get the main guest for a plus-one
  const getMainGuestForPlusOne = (plusOneGuest: Guest): Guest | undefined => {
    return guests.find(g => g.id === plusOneGuest.plusOneFor);
  };

  // Get the plus-one guest for a main guest
  const getPlusOneForGuest = (mainGuestId: number): Guest | undefined => {
    return guests.find(g => g.plusOneFor === mainGuestId);
  };

  // Get display name for a guest (uses plus-one name if provided)
  const getDisplayName = (guest: Guest): string => {
    if (guest.isPlusOne) {
      const rsvp = guestRSVPs[guest.id];
      if (rsvp?.plusOneFirstName) {
        return `${rsvp.plusOneFirstName} ${rsvp.plusOneLastName || ''}`.trim();
      }
      const mainGuest = getMainGuestForPlusOne(guest);
      return mainGuest ? `${mainGuest.firstName}'s Guest` : 'Guest';
    }
    return `${guest.firstName} ${guest.lastName}`;
  };

  // Get attending guests (for meals step)
  const getAttendingGuests = (): Guest[] => {
    return guests.filter(guest => {
      const rsvp = guestRSVPs[guest.id];
      if (!rsvp?.attending) return false;
      
      // For plus-ones, only show if the main guest is bringing them
      if (guest.isPlusOne) {
        const mainGuest = getMainGuestForPlusOne(guest);
        if (mainGuest) {
          return guestRSVPs[mainGuest.id]?.attending;
        }
      }
      return true;
    });
  };

  // Save attendance and move to meals
  const handleAttendanceNext = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rsvp/save-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_id: party!.partyId,
          guest_rsvps: Object.entries(guestRSVPs).map(([guestId, rsvp]) => ({
            guest_id: parseInt(guestId),
            attending: rsvp.attending,
            plus_one_first_name: rsvp.plusOneFirstName || null,
            plus_one_last_name: rsvp.plusOneLastName || null,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      // If no one is attending, skip to extras
      if (getAttendingGuests().length === 0) {
        setStep('extras');
      } else {
        setStep('meals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Save meals and move to extras
  const handleMealsNext = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rsvp/save-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_rsvps: Object.entries(guestRSVPs)
            .filter(([guestId]) => {
              const guest = guests.find(g => g.id === parseInt(guestId));
              return guest && guestRSVPs[parseInt(guestId)]?.attending;
            })
            .map(([guestId, rsvp]) => ({
              guest_id: parseInt(guestId),
              meal_choice: rsvp.mealChoice,
              dietary_requirements: rsvp.dietaryRequirements,
            })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setStep('extras');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Save extras and complete
  const handleExtrasSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rsvp/save-extras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_id: party!.partyId,
          song_request: partyExtras.songRequest,
          recipe_title: partyExtras.recipeTitle,
          recipe_text: partyExtras.recipeText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator
  const ProgressBar = () => {
    const steps = ['Attendance', 'Meals', 'Extras'];
    const currentIndex = step === 'attendance' ? 0 : step === 'meals' ? 1 : step === 'extras' ? 2 : 0;
    
    if (step === 'login' || step === 'success') return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= currentIndex ? 'bg-burgundy-900 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${
                i <= currentIndex ? 'text-burgundy-900' : 'text-gray-400'
              }`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-1 mx-2 ${
                  i < currentIndex ? 'bg-burgundy-900' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
          <ProgressBar />

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

            {/* Step 2: Attendance */}
            {step === 'attendance' && party && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card mb-8">
                  <h2 className="font-display text-2xl text-burgundy-900 text-center mb-2">
                    Welcome, {party.partyName}!
                  </h2>
                  <p className="text-gray-600 text-center">
                    {party.invitedToCeremony 
                      ? "You're invited to join us for the full day celebration."
                      : "You're invited to join us for the evening reception."}
                  </p>
                  <div className="mt-4 text-center">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      party.invitedToCeremony 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {party.invitedToCeremony ? '🌅 All Day Guest' : '🌙 Evening Guest'}
                    </span>
                  </div>
                </div>

                <div className="card mb-8">
                  <h3 className="font-display text-xl text-burgundy-900 mb-6">
                    Who will be attending?
                  </h3>

                  <div className="space-y-6">
                    {guests.filter(g => !g.isPlusOne).map((guest) => {
                      const plusOne = getPlusOneForGuest(guest.id);
                      const guestRsvp = guestRSVPs[guest.id];

                      return (
                        <div key={guest.id} className="border border-burgundy-100 rounded-lg p-4">
                          {/* Main Guest */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-gray-800">
                              {guest.firstName} {guest.lastName}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => updateGuestRSVP(guest.id, 'attending', true)}
                                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                  guestRsvp?.attending === true
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Attending
                              </button>
                              <button
                                type="button"
                                onClick={() => updateGuestRSVP(guest.id, 'attending', false)}
                                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                  guestRsvp?.attending === false
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Not Attending
                              </button>
                            </div>
                          </div>

                          {/* Plus One Section */}
                          {guest.canBringPlusOne && plusOne && guestRsvp?.attending && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 mb-3">
                                Would you like to bring a guest?
                              </p>
                              
                              <div className="flex gap-2 mb-4">
                                <button
                                  type="button"
                                  onClick={() => updateGuestRSVP(plusOne.id, 'attending', true)}
                                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                    guestRSVPs[plusOne.id]?.attending === true
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateGuestRSVP(plusOne.id, 'attending', false)}
                                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                    guestRSVPs[plusOne.id]?.attending === false
                                      ? 'bg-red-600 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  No
                                </button>
                              </div>

                              {/* Plus One Name Entry */}
                              {guestRSVPs[plusOne.id]?.attending && (
                                <div className="bg-purple-50 p-4 rounded">
                                  <p className="text-sm text-purple-700 mb-3">
                                    Please provide your guest's name:
                                  </p>
                                  <div className="grid grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      value={guestRSVPs[plusOne.id]?.plusOneFirstName || ''}
                                      onChange={(e) => updateGuestRSVP(plusOne.id, 'plusOneFirstName', e.target.value)}
                                      placeholder="First name"
                                      className="input-field"
                                      required
                                    />
                                    <input
                                      type="text"
                                      value={guestRSVPs[plusOne.id]?.plusOneLastName || ''}
                                      onChange={(e) => updateGuestRSVP(plusOne.id, 'plusOneLastName', e.target.value)}
                                      placeholder="Last name"
                                      className="input-field"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAttendanceNext}
                  disabled={loading || guests.filter(g => !g.isPlusOne).some(g => guestRSVPs[g.id]?.attending === null)}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Next: Meal Choices'}
                </button>
              </motion.div>
            )}

            {/* Step 3: Meals */}
            {step === 'meals' && party && (
              <motion.div
                key="meals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card mb-8">
                  <h2 className="font-display text-2xl text-burgundy-900 text-center mb-2">
                    Meal Choices
                  </h2>
                  <p className="text-gray-600 text-center">
                    Please select meal preferences for each attending guest.
                  </p>
                </div>

                <div className="space-y-6">
                  {getAttendingGuests().map((guest) => {
                    const displayName = getDisplayName(guest);
                    const guestRsvp = guestRSVPs[guest.id];

                    return (
                      <div key={guest.id} className="card">
                        <h3 className="font-display text-lg text-burgundy-900 mb-4">
                          {displayName}
                          {guest.isPlusOne && (
                            <span className="ml-2 text-sm text-purple-600">(Guest)</span>
                          )}
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meal Choice
                            </label>
                            <select
                              value={guestRsvp?.mealChoice || ''}
                              onChange={(e) => updateGuestRSVP(guest.id, 'mealChoice', e.target.value)}
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

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dietary Requirements
                            </label>
                            <input
                              type="text"
                              value={guestRsvp?.dietaryRequirements || ''}
                              onChange={(e) => updateGuestRSVP(guest.id, 'dietaryRequirements', e.target.value)}
                              placeholder="Any allergies or dietary requirements?"
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {error && (
                  <div className="mt-4 mb-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-center">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep('attendance')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleMealsNext}
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Next: Song & Recipe'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Extras (Song & Recipe) */}
            {step === 'extras' && party && (
              <motion.div
                key="extras"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card mb-8">
                  <h2 className="font-display text-2xl text-burgundy-900 text-center mb-2">
                    Almost Done!
                  </h2>
                  <p className="text-gray-600 text-center">
                    Just a couple more things...
                  </p>
                </div>

                {/* Song Request */}
                <div className="card mb-6">
                  <h3 className="font-display text-xl text-burgundy-900 mb-4">
                    🎵 Song Request
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    What song will get you on the dance floor?
                  </p>
                  <input
                    type="text"
                    value={partyExtras.songRequest}
                    onChange={(e) => setPartyExtras(prev => ({ ...prev, songRequest: e.target.value }))}
                    placeholder="Song title - Artist"
                    className="input-field"
                  />
                </div>

                {/* Recipe */}
                <div className="card mb-8">
                  <h3 className="font-display text-xl text-burgundy-900 mb-4">
                    📖 Share a Recipe
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    We'd love to collect recipes from our guests! Please share a favourite 
                    recipe that means something to you.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipe Name
                      </label>
                      <input
                        type="text"
                        value={partyExtras.recipeTitle}
                        onChange={(e) => setPartyExtras(prev => ({ ...prev, recipeTitle: e.target.value }))}
                        placeholder="e.g. Grandma's Apple Pie"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipe
                      </label>
                      <textarea
                        value={partyExtras.recipeText}
                        onChange={(e) => setPartyExtras(prev => ({ ...prev, recipeText: e.target.value }))}
                        placeholder="Ingredients and instructions..."
                        rows={8}
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-center">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => getAttendingGuests().length > 0 ? setStep('meals') : setStep('attendance')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExtrasSubmit}
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success */}
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
