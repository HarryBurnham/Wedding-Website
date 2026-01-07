'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestMember {
  id: string;
  name: string;
  isPlusOne: boolean;
}

interface GuestData {
  id: string;
  code: string;
  primary_guest_name: string;
  members: GuestMember[];
  invited_to_ceremony: boolean;
  invited_to_reception: boolean;
  existing_rsvp?: {
    attending: { [key: string]: boolean };
    meal_choices: { [key: string]: string };
    dietary_restrictions: { [key: string]: string };
    song_request?: string;
    recipe_text?: string;
    recipe_file_name?: string;
  };
}

interface RSVPFormData {
  attending: { [key: string]: boolean };
  meal_choices: { [key: string]: string };
  dietary_restrictions: { [key: string]: string };
  song_request: string;
  recipe_text: string;
  recipe_file: File | null;
}

export default function RSVP() {
  const [step, setStep] = useState<'login' | 'form' | 'success'>('login');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RSVPFormData>({
    attending: {},
    meal_choices: {},
    dietary_restrictions: {},
    song_request: '',
    recipe_text: '',
    recipe_file: null,
  });

  const rsvpDeadline = WEDDING_CONFIG.rsvpDeadline.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Handle code lookup
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/guest/lookup?code=${encodeURIComponent(code.toUpperCase())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Guest not found');
      }

      setGuestData(data);

      // Initialize form data with existing RSVP if present
      const initialAttending: { [key: string]: boolean } = {};
      const initialMeals: { [key: string]: string } = {};
      const initialDietary: { [key: string]: string } = {};

      data.members.forEach((member: GuestMember) => {
        initialAttending[member.id] = data.existing_rsvp?.attending?.[member.id] ?? false;
        initialMeals[member.id] = data.existing_rsvp?.meal_choices?.[member.id] ?? '';
        initialDietary[member.id] = data.existing_rsvp?.dietary_restrictions?.[member.id] ?? '';
      });

      setFormData({
        attending: initialAttending,
        meal_choices: initialMeals,
        dietary_restrictions: initialDietary,
        song_request: data.existing_rsvp?.song_request ?? '',
        recipe_text: data.existing_rsvp?.recipe_text ?? '',
        recipe_file: null,
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
      const submitData = new FormData();
      submitData.append('guest_id', guestData!.id);
      submitData.append('attending', JSON.stringify(formData.attending));
      submitData.append('meal_choices', JSON.stringify(formData.meal_choices));
      submitData.append('dietary_restrictions', JSON.stringify(formData.dietary_restrictions));
      submitData.append('song_request', formData.song_request);
      submitData.append('recipe_text', formData.recipe_text);
      
      if (formData.recipe_file) {
        submitData.append('recipe_file', formData.recipe_file);
      }

      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        body: submitData,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, recipe_file: file }));
    }
  };

  const toggleAttending = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      attending: {
        ...prev.attending,
        [memberId]: !prev.attending[memberId],
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
            {/* Step 1: Enter Code */}
            {step === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <h2 className="font-display text-2xl text-burgundy-900 text-center mb-6">
                  Enter Your RSVP Code
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Please enter the unique code from your invitation to access your personalized RSVP form.
                </p>

                <form onSubmit={handleCodeSubmit}>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Enter your code"
                      className="input-field text-center text-2xl tracking-widest uppercase"
                      maxLength={8}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-center mb-4">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !code}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Looking up...' : 'Continue'}
                  </button>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                  Can't find your code? <a href="/contact" className="text-burgundy-700 hover:underline">Contact us</a>
                </p>
              </motion.div>
            )}

            {/* Step 2: RSVP Form */}
            {step === 'form' && guestData && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card mb-8">
                  <h2 className="font-display text-2xl text-burgundy-900 text-center mb-2">
                    Welcome, {guestData.primary_guest_name}!
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
                      {guestData.members.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center gap-4 p-4 border border-burgundy-100 cursor-pointer hover:bg-burgundy-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.attending[member.id] || false}
                            onChange={() => toggleAttending(member.id)}
                            className="w-5 h-5 rounded border-burgundy-300 text-burgundy-900 focus:ring-burgundy-900"
                          />
                          <span className="flex-1">
                            <span className="font-medium text-gray-800">
                              {member.isPlusOne ? 'Plus One' : member.name}
                            </span>
                            {member.isPlusOne && (
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

                      {guestData.members
                        .filter(member => formData.attending[member.id])
                        .map((member) => (
                          <div key={member.id} className="mb-6 last:mb-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {member.isPlusOne ? 'Plus One' : member.name}
                            </label>
                            <select
                              value={formData.meal_choices[member.id] || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                meal_choices: {
                                  ...prev.meal_choices,
                                  [member.id]: e.target.value,
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

                      {guestData.members
                        .filter(member => formData.attending[member.id])
                        .map((member) => (
                          <div key={member.id} className="mb-6 last:mb-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {member.isPlusOne ? 'Plus One' : member.name}
                            </label>
                            <input
                              type="text"
                              value={formData.dietary_restrictions[member.id] || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                dietary_restrictions: {
                                  ...prev.dietary_restrictions,
                                  [member.id]: e.target.value,
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
                      recipe that means something to you – either type it below or upload a file.
                    </p>

                    <div className="space-y-4">
                      <textarea
                        value={formData.recipe_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, recipe_text: e.target.value }))}
                        placeholder="Type your recipe here..."
                        rows={6}
                        className="input-field resize-none"
                      />

                      <div className="text-center text-gray-400 text-sm">— or —</div>

                      <div
                        className="upload-area"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        {formData.recipe_file ? (
                          <p className="text-burgundy-700">
                            Selected: {formData.recipe_file.name}
                          </p>
                        ) : (
                          <>
                            <svg className="w-8 h-8 mx-auto text-burgundy-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-500">
                              Click to upload a recipe file
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              PDF, Word, text, or image files accepted
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-600 text-center mb-4">{error}</p>
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
