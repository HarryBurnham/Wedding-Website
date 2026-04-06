'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EditableField from '@/components/EditableField';
import { WEDDING_CONFIG } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  isPlusOne: boolean;
  canBringPlusOne: boolean;
  plusOneFor: number | null;
  invitedToCeremony: boolean;
  invitedToReception: boolean;
}

interface Party {
  partyId: number;
  partyName: string;
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
}

const MENU = {
  starter: {
    name: 'Bruschetta',
    description: 'Toasted ciabatta topped with fresh Tomatoes, Garlic, Mozzarella, Basil and Olive Oil',
  },
  mains: [
    {
      id: 'lamb',
      name: 'Herb crust Rump of Lamb',
      description: 'Herb Crust Rump of Lamb with Garlic Mash, Roasted Vegetables and a Port Jus',
      sides: ['Garlic Mash', 'Roasted Vegetables', 'Port Jus'],
    },
    {
      id: 'chicken',
      name: 'Pan Roast Chicken Supreme',
      description: 'Pan Roast Chicken Supreme with Garlic Mash, Roasted Vegetables and a Mushroom Sauce',
      sides: ['Garlic Mash', 'Roasted Vegetables', 'Mushroom Sauce'],
    },
    {
      id: 'vegetarian',
      name: 'Roast Butternut Squash, Spinach & Mushroom Wellington',
      description: 'Roast Butternut Squash, Spinach & Mushroom Wellington with Garlic Mash, Roasted Vegetables and Gravy',
      sides: ['Garlic Mash', 'Roasted Vegetables', 'Gravy'],
      isVegetarian: true,
    },
  ],
  dessert: {
    name: 'Sticky Toffee Pudding',
    description: 'Sticky Toffee Pudding, Toffee Sauce & Vanilla Ice Cream',
  },
};

// Previously Saved Label Component
const PreviouslySavedLabel = () => (
  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
    Previously saved
  </span>
);

// Guest Badge Component for Plus-Ones
const GuestOfBadge = ({ mainGuestName }: { mainGuestName: string }) => (
  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
    Guest of {mainGuestName}
  </span>
);

// Invitation Type Badge Component
const InvitationTypeBadge = ({ invitedToCeremony }: { invitedToCeremony: boolean }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${
    invitedToCeremony 
      ? 'bg-green-100 text-green-700' 
      : 'bg-purple-100 text-purple-700'
  }`}>
    {invitedToCeremony ? '🌅 All Day' : '🌙 Evening'}
  </span>
);

// ─── PlusOneNameSection ───────────────────────────────────────────────────────

interface PlusOneNameSectionProps {
  plusOne: Guest;
  mainGuest: Guest;
  guestRSVPs: { [guestId: number]: GuestRSVP };
  isReturningUser: boolean;
  originalRSVPs: { [guestId: number]: GuestRSVP };
  editingPlusOneName: { [guestId: number]: boolean };
  setEditingPlusOneName: React.Dispatch<React.SetStateAction<{ [guestId: number]: boolean }>>;
  updateGuestRSVP: (guestId: number, field: keyof GuestRSVP, value: any) => void;
}

const PlusOneNameSection = ({
  plusOne,
  guestRSVPs,
  isReturningUser,
  originalRSVPs,
  editingPlusOneName,
  setEditingPlusOneName,
  updateGuestRSVP,
}: PlusOneNameSectionProps) => {
  const plusOneRsvp = guestRSVPs[plusOne.id];
  const isEditing = editingPlusOneName[plusOne.id];
  const wasSaved = isReturningUser && !!(originalRSVPs[plusOne.id]?.plusOneFirstName);

  if (wasSaved && !isEditing && plusOneRsvp?.plusOneFirstName) {
    return (
      <div className="bg-purple-50 p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-purple-700 font-medium">Your guest:</p>
          <div className="flex items-center gap-2">
            <PreviouslySavedLabel />
            <button
              type="button"
              onClick={() => setEditingPlusOneName(prev => ({ ...prev, [plusOne.id]: true }))}
              className="text-sm text-burgundy-700 hover:text-burgundy-900 font-medium"
            >
              Edit
            </button>
          </div>
        </div>
        <p className="text-purple-900">
          {plusOneRsvp.plusOneFirstName} {plusOneRsvp.plusOneLastName}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 p-4 rounded">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-purple-700">Please provide your guest's name:</p>
        {wasSaved && isEditing && (
          <button
            type="button"
            onClick={() => setEditingPlusOneName(prev => ({ ...prev, [plusOne.id]: false }))}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Done
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={plusOneRsvp?.plusOneFirstName || ''}
          onChange={(e) => updateGuestRSVP(plusOne.id, 'plusOneFirstName', e.target.value)}
          placeholder="First name"
          className="input-field"
          required
        />
        <input
          type="text"
          value={plusOneRsvp?.plusOneLastName || ''}
          onChange={(e) => updateGuestRSVP(plusOne.id, 'plusOneLastName', e.target.value)}
          placeholder="Last name"
          className="input-field"
        />
      </div>
    </div>
  );
};

// ─── MealSelectionCard ────────────────────────────────────────────────────────

interface MealSelectionCardProps {
  guest: Guest;
  guestRSVPs: { [guestId: number]: GuestRSVP };
  updateGuestRSVP: (guestId: number, field: keyof GuestRSVP, value: any) => void;
  wasPreFilled: (guestId: number, field: keyof GuestRSVP) => boolean;
  getMainGuestForPlusOne: (guest: Guest) => Guest | undefined;
  getDisplayName: (guest: Guest) => string;
}

const MealSelectionCard = ({
  guest,
  guestRSVPs,
  updateGuestRSVP,
  wasPreFilled,
  getMainGuestForPlusOne,
  getDisplayName,
}: MealSelectionCardProps) => {
  const guestRsvp = guestRSVPs[guest.id];
  const mainGuest = guest.isPlusOne ? getMainGuestForPlusOne(guest) : null;
  const displayName = getDisplayName(guest);

  return (
    <div className="card">
      {/* Guest Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h3 className="font-display text-lg text-burgundy-900">
          {displayName}
        </h3>
        {guest.isPlusOne && mainGuest && (
          <GuestOfBadge mainGuestName={mainGuest.firstName} />
        )}
        <InvitationTypeBadge invitedToCeremony={guest.invitedToCeremony} />
      </div>

      {/* Starter Info */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Starter</h4>
        <div className="bg-cream-50 rounded-lg p-4">
          <p className="font-medium text-burgundy-900">{MENU.starter.name}</p>
          <p className="text-sm text-gray-600 mt-1">{MENU.starter.description}</p>
        </div>
      </div>

      {/* Main Course Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-medium text-gray-800">Main Course</h4>
          {wasPreFilled(guest.id, 'mealChoice') && <PreviouslySavedLabel />}
        </div>

        <div className="space-y-3">
          {MENU.mains.map((main) => (
            <button
              key={main.id}
              type="button"
              onClick={() => updateGuestRSVP(guest.id, 'mealChoice', main.id)}
              className={`w-full text-left rounded-lg p-4 border-2 transition-all ${
                guestRsvp?.mealChoice === main.id
                  ? 'border-burgundy-900 bg-burgundy-50'
                  : 'border-gray-200 hover:border-burgundy-200 hover:bg-cream-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-burgundy-900">{main.name}</p>
                    {main.isVegetarian && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Vegetarian
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{main.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {main.sides.map((side, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {side}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                  guestRsvp?.mealChoice === main.id
                    ? 'border-burgundy-900 bg-burgundy-900'
                    : 'border-gray-300'
                }`}>
                  {guestRsvp?.mealChoice === main.id && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dessert Info */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Dessert</h4>
        <div className="bg-cream-50 rounded-lg p-4">
          <p className="font-medium text-burgundy-900">{MENU.dessert.name}</p>
          <p className="text-sm text-gray-600 mt-1">{MENU.dessert.description}</p>
        </div>
      </div>

      {/* Dietary Requirements */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Dietary Requirements or Allergies
          </label>
          {wasPreFilled(guest.id, 'dietaryRequirements') && <PreviouslySavedLabel />}
        </div>
        <input
          type="text"
          value={guestRsvp?.dietaryRequirements || ''}
          onChange={(e) => updateGuestRSVP(guest.id, 'dietaryRequirements', e.target.value)}
          placeholder="Please let us know of any allergies or dietary requirements"
          className="input-field"
        />
      </div>
    </div>
  );
};
// ─── ReviewModal ──────────────────────────────────────────────────────────────

interface ReviewModalProps {
  showReviewModal: boolean;
  loading: boolean;
  error: string;
  guests: Guest[];
  guestRSVPs: { [guestId: number]: GuestRSVP };
  partyExtras: PartyExtras;
  editingSection: 'attendance' | 'meals' | 'extras' | null;
  editingPlusOneName: { [guestId: number]: boolean };
  isReturningUser: boolean;
  originalRSVPs: { [guestId: number]: GuestRSVP };
  setShowReviewModal: (v: boolean) => void;
  setEditingSection: React.Dispatch<React.SetStateAction<'attendance' | 'meals' | 'extras' | null>>;
  setEditingPlusOneName: React.Dispatch<React.SetStateAction<{ [guestId: number]: boolean }>>;
  setPartyExtras: React.Dispatch<React.SetStateAction<PartyExtras>>;
  updateGuestRSVP: (guestId: number, field: keyof GuestRSVP, value: any) => void;
  handleFinalSubmit: () => void;
  getAttendingGuests: () => Guest[];
  getMainGuestForPlusOne: (guest: Guest) => Guest | undefined;
  getPlusOneForGuest: (mainGuestId: number) => Guest | undefined;
  getDisplayName: (guest: Guest) => string;
  getMealOptionName: (mealId: string) => string;
  plusOneNameWasSaved: (plusOneId: number) => boolean;
}

const ReviewModal = ({
  showReviewModal,
  loading,
  error,
  guests,
  guestRSVPs,
  partyExtras,
  editingSection,
  editingPlusOneName,
  isReturningUser,
  originalRSVPs,
  setShowReviewModal,
  setEditingSection,
  setEditingPlusOneName,
  setPartyExtras,
  updateGuestRSVP,
  handleFinalSubmit,
  getAttendingGuests,
  getMainGuestForPlusOne,
  getPlusOneForGuest,
  getDisplayName,
  getMealOptionName,
  plusOneNameWasSaved,
}: ReviewModalProps) => {
  if (!showReviewModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && setShowReviewModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-xl">
          <h2 className="font-display text-2xl text-burgundy-900 text-center">
            Review Your RSVP
          </h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Please confirm your details before submitting
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Attendance Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium text-burgundy-900">Attendance</h3>
              <button
                type="button"
                onClick={() => setEditingSection(editingSection === 'attendance' ? null : 'attendance')}
                className="text-sm text-burgundy-700 hover:text-burgundy-900 font-medium"
              >
                {editingSection === 'attendance' ? 'Done' : 'Edit'}
              </button>
            </div>

            <div className="px-4 py-3 space-y-3">
              {editingSection === 'attendance' ? (
                <div className="space-y-4">
                  {guests.filter(g => !g.isPlusOne).map((guest) => {
                    const plusOne = getPlusOneForGuest(guest.id);
                    const guestRsvp = guestRSVPs[guest.id];

                    return (
                      <div key={guest.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {guest.firstName} {guest.lastName}
                            </span>
                            <InvitationTypeBadge invitedToCeremony={guest.invitedToCeremony} />
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => updateGuestRSVP(guest.id, 'attending', true)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                guestRsvp?.attending === true
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => updateGuestRSVP(guest.id, 'attending', false)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                guestRsvp?.attending === false
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        {guest.canBringPlusOne && plusOne && guestRsvp?.attending && (
                          <div className="ml-4 pl-4 border-l-2 border-purple-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Bringing a guest?</span>
                                <GuestOfBadge mainGuestName={guest.firstName} />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateGuestRSVP(plusOne.id, 'attending', true)}
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
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
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    guestRSVPs[plusOne.id]?.attending === false
                                      ? 'bg-red-600 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                            {guestRSVPs[plusOne.id]?.attending && (
                              <div className="space-y-2">
                                {plusOneNameWasSaved(plusOne.id) && !editingPlusOneName[plusOne.id] ? (
                                  <div className="flex items-center justify-between bg-purple-50 p-2 rounded">
                                    <span className="text-sm text-purple-900">
                                      {guestRSVPs[plusOne.id]?.plusOneFirstName} {guestRSVPs[plusOne.id]?.plusOneLastName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setEditingPlusOneName(prev => ({ ...prev, [plusOne.id]: true }))}
                                      className="text-xs text-burgundy-700 hover:text-burgundy-900 font-medium"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={guestRSVPs[plusOne.id]?.plusOneFirstName || ''}
                                      onChange={(e) => updateGuestRSVP(plusOne.id, 'plusOneFirstName', e.target.value)}
                                      placeholder="First name"
                                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                    <input
                                      type="text"
                                      value={guestRSVPs[plusOne.id]?.plusOneLastName || ''}
                                      onChange={(e) => updateGuestRSVP(plusOne.id, 'plusOneLastName', e.target.value)}
                                      placeholder="Last name"
                                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {guests.filter(g => !g.isPlusOne).map((guest) => {
                    const rsvp = guestRSVPs[guest.id];
                    return (
                      <div key={guest.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">{guest.firstName} {guest.lastName}</span>
                          <InvitationTypeBadge invitedToCeremony={guest.invitedToCeremony} />
                        </div>
                        <span className={`font-medium ${rsvp?.attending ? 'text-green-600' : 'text-red-600'}`}>
                          {rsvp?.attending ? '✓ Attending' : '✗ Not attending'}
                        </span>
                      </div>
                    );
                  })}
                  {guests.filter(g => g.isPlusOne && guestRSVPs[g.id]?.attending).map((guest) => {
                    const mainGuest = getMainGuestForPlusOne(guest);
                    return (
                      <div key={guest.id} className="flex items-center justify-between text-sm ml-4 pl-4 border-l-2 border-purple-200">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{getDisplayName(guest)}</span>
                          {mainGuest && <GuestOfBadge mainGuestName={mainGuest.firstName} />}
                        </div>
                        <span className="font-medium text-green-600">✓ Attending</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Meals Section */}
          {getAttendingGuests().length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <h3 className="font-medium text-burgundy-900">Meal Choices</h3>
                <button
                  type="button"
                  onClick={() => setEditingSection(editingSection === 'meals' ? null : 'meals')}
                  className="text-sm text-burgundy-700 hover:text-burgundy-900 font-medium"
                >
                  {editingSection === 'meals' ? 'Done' : 'Edit'}
                </button>
              </div>

              <div className="px-4 py-3 space-y-3">
                {editingSection === 'meals' ? (
                  <div className="space-y-4">
                    {getAttendingGuests().map((guest) => {
                      const guestRsvp = guestRSVPs[guest.id];
                      const mainGuest = guest.isPlusOne ? getMainGuestForPlusOne(guest) : null;

                      return (
                        <div key={guest.id} className={`space-y-2 ${guest.isPlusOne ? 'ml-4 pl-4 border-l-2 border-purple-200' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              {getDisplayName(guest)}
                            </span>
                            {guest.isPlusOne && mainGuest && (
                              <GuestOfBadge mainGuestName={mainGuest.firstName} />
                            )}
                          </div>
                          <select
                            value={guestRsvp?.mealChoice || ''}
                            onChange={(e) => updateGuestRSVP(guest.id, 'mealChoice', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="">Select main</option>
                            {MENU.mains.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={guestRsvp?.dietaryRequirements || ''}
                            onChange={(e) => updateGuestRSVP(guest.id, 'dietaryRequirements', e.target.value)}
                            placeholder="Dietary requirements"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getAttendingGuests().map((guest) => {
                      const rsvp = guestRSVPs[guest.id];
                      const mainGuest = guest.isPlusOne ? getMainGuestForPlusOne(guest) : null;

                      return (
                        <div key={guest.id} className={`text-sm ${guest.isPlusOne ? 'ml-4 pl-4 border-l-2 border-purple-200' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-700">{getDisplayName(guest)}</span>
                            {guest.isPlusOne && mainGuest && (
                              <GuestOfBadge mainGuestName={mainGuest.firstName} />
                            )}
                          </div>
                          <div className="text-gray-600 space-y-0.5">
                            <p>Main: {getMealOptionName(rsvp?.mealChoice)}</p>
                            {rsvp?.dietaryRequirements && (
                              <p className="text-gray-500 text-xs">Dietary: {rsvp.dietaryRequirements}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extras Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium text-burgundy-900">Song Request</h3>
              <button
                type="button"
                onClick={() => setEditingSection(editingSection === 'extras' ? null : 'extras')}
                className="text-sm text-burgundy-700 hover:text-burgundy-900 font-medium"
              >
                {editingSection === 'extras' ? 'Done' : 'Edit'}
              </button>
            </div>

            <div className="px-4 py-3">
              {editingSection === 'extras' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Song Request</label>
                    <input
                      type="text"
                      value={partyExtras.songRequest}
                      onChange={(e) => setPartyExtras(prev => ({ ...prev, songRequest: e.target.value }))}
                      placeholder="Song title - Artist"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Song Request: </span>
                    <span className="text-gray-700">{partyExtras.songRequest || 'None'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-burgundy-900 text-white rounded-lg font-medium hover:bg-burgundy-800 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm RSVP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RSVP() {
  const [step, setStep] = useState<'login' | 'attendance' | 'meals' | 'extras' | 'success'>('login');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingSection, setEditingSection] = useState<'attendance' | 'meals' | 'extras' | null>(null);
  const [partyName, setPartyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Track which fields are being edited inline (for returning users)
  const [editingDietary, setEditingDietary] = useState<{ [guestId: number]: boolean }>({});
  const [editingPlusOneName, setEditingPlusOneName] = useState<{ [guestId: number]: boolean }>({});
  
  const [party, setParty] = useState<Party | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestRSVPs, setGuestRSVPs] = useState<{ [guestId: number]: GuestRSVP }>({});
  const [partyExtras, setPartyExtras] = useState<PartyExtras>({
    songRequest: '',
  });
  
  // Track if this is a returning user (has existing RSVPs)
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  // Track original values to know what was pre-filled
  const [originalRSVPs, setOriginalRSVPs] = useState<{ [guestId: number]: GuestRSVP }>({});
  const [originalExtras, setOriginalExtras] = useState<PartyExtras | null>(null);

  useEffect(() => {
    document.title = 'Harry & Adia Wedding | RSVP';
  }, []);

  const rsvpDeadline = WEDDING_CONFIG.rsvpDeadline.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Check if a field was pre-filled (for showing "Previously saved" label)
  const wasPreFilled = (guestId: number, field: keyof GuestRSVP): boolean => {
    if (!isReturningUser) return false;
    const original = originalRSVPs[guestId];
    if (!original) return false;
    
    if (field === 'attending') {
      return original.attending !== null;
    }
    return !!original[field];
  };

  // Get invitation type summary for the party
  const getInvitationSummary = (): { hasAllDay: boolean; hasEveningOnly: boolean; allSame: boolean } => {
    const mainGuests = guests.filter(g => !g.isPlusOne);
    const hasAllDay = mainGuests.some(g => g.invitedToCeremony);
    const hasEveningOnly = mainGuests.some(g => !g.invitedToCeremony);
    return {
      hasAllDay,
      hasEveningOnly,
      allSame: !(hasAllDay && hasEveningOnly),
    };
  };

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

      // Check if this is a returning user
      const hasExistingRsvps = data.existingRsvps && Object.keys(data.existingRsvps).length > 0;
      setIsReturningUser(hasExistingRsvps);

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
      
      // Store original values for "Previously saved" detection
      setOriginalRSVPs(JSON.parse(JSON.stringify(initialRSVPs)));

      // Load existing party extras
      if (data.partyExtras) {
        const extras = {
          songRequest: data.partyExtras.songRequest ?? '',
        };
        setPartyExtras(extras);
        setOriginalExtras(JSON.parse(JSON.stringify(extras)));
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
      if (!guest.invitedToCeremony) return false;
      
      if (guest.isPlusOne) {
        const mainGuest = getMainGuestForPlusOne(guest);
        if (mainGuest) {
          return guestRSVPs[mainGuest.id]?.attending;
        }
      }
      return true;
    });
  };

  // Get meal option name by id
  const getMealOptionName = (mealId: string): string => {
    const option = MENU.mains.find(o => o.id === mealId);
    return option ? option.name : mealId || 'Not selected';
  };

  // Check if plus-one name was previously saved
  const plusOneNameWasSaved = (plusOneId: number): boolean => {
    if (!isReturningUser) return false;
    const original = originalRSVPs[plusOneId];
    return !!(original?.plusOneFirstName);
  };

  // Navigate to next step (no saving)
  const handleAttendanceNext = () => {
    if (getAttendingGuests().length === 0) {
      setStep('extras');
    } else {
      setStep('meals');
    }
  };

  const handleMealsNext = () => {
    setStep('extras');
  };

  const handleExtrasNext = () => {
    setShowReviewModal(true);
  };

  // Submit all data
  const handleFinalSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. Save attendance
      const attendanceResponse = await fetch('/api/rsvp/save-attendance', {
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

      if (!attendanceResponse.ok) {
        const data = await attendanceResponse.json();
        throw new Error(data.error || 'Failed to save attendance');
      }

      // 2. Save meals (only if there are attending guests)
      if (getAttendingGuests().length > 0) {
        const mealsResponse = await fetch('/api/rsvp/save-meals', {
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

        if (!mealsResponse.ok) {
          const data = await mealsResponse.json();
          throw new Error(data.error || 'Failed to save meals');
        }
      }

      // 3. Save extras
      const extrasResponse = await fetch('/api/rsvp/save-extras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_id: party!.partyId,
          song_request: partyExtras.songRequest,
        }),
      });

      if (!extrasResponse.ok) {
        const data = await extrasResponse.json();
        throw new Error(data.error || 'Failed to save extras');
      }

      setShowReviewModal(false);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator
  const ProgressBar = () => {
    const hasMeals = guests.some(g => g.invitedToCeremony);
    const steps = hasMeals ? ['Attendance', 'Meals', 'Extras'] : ['Attendance', 'Extras'];
    const currentIndex = step === 'attendance' ? 0
      : step === 'meals' ? 1
      : step === 'extras' ? (hasMeals ? 2 : 1)
      : 0;

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
                      placeholder="e.g. Family Name - Initials"
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
                    {isReturningUser ? `Welcome back, ${party.partyName}!` : `Welcome, ${party.partyName}!`}
                  </h2>
                  
                  {(() => {
                    const summary = getInvitationSummary();
                    if (summary.allSame) {
                      const isAllDay = summary.hasAllDay;
                      return (
                        <>
                          <p className="text-gray-600 text-center">
                            {isReturningUser 
                              ? "You can review and update your RSVP below."
                              : isAllDay 
                                ? "You're invited to join us for the full day celebration."
                                : "You're invited to join us for the evening reception."}
                          </p>
                          <div className="mt-4 text-center">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                              isAllDay 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {isAllDay ? '🌅 All Day Guests' : '🌙 Evening Guests'}
                            </span>
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <p className="text-gray-600 text-center">
                            {isReturningUser 
                              ? "You can review and update your RSVP below."
                              : "Some guests are invited for different parts of the day - please see individual invitations below."}
                          </p>
                          <div className="mt-4 flex justify-center gap-2">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              🌅 All Day
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              🌙 Evening Only
                            </span>
                          </div>
                        </>
                      );
                    }
                  })()}
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
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-medium text-gray-800">
                                {guest.firstName} {guest.lastName}
                              </span>
                              <InvitationTypeBadge invitedToCeremony={guest.invitedToCeremony} />
                              {wasPreFilled(guest.id, 'attending') && (
                                <PreviouslySavedLabel />
                              )}
                            </div>
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
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <p className="text-sm text-gray-600">
                                  Would you like to bring a guest?
                                </p>
                                <GuestOfBadge mainGuestName={guest.firstName} />
                                <InvitationTypeBadge invitedToCeremony={plusOne.invitedToCeremony} />
                                {wasPreFilled(plusOne.id, 'attending') && (
                                  <PreviouslySavedLabel />
                                )}
                              </div>
                              
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
                                <PlusOneNameSection
                                  plusOne={plusOne}
                                  mainGuest={guest}
                                  guestRSVPs={guestRSVPs}
                                  isReturningUser={isReturningUser}
                                  originalRSVPs={originalRSVPs}
                                  editingPlusOneName={editingPlusOneName}
                                  setEditingPlusOneName={setEditingPlusOneName}
                                  updateGuestRSVP={updateGuestRSVP}
                                />
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
                disabled={guests.filter(g => !g.isPlusOne).some(g => guestRSVPs[g.id]?.attending === null)}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getAttendingGuests().length > 0 ? 'Next: Meal Choices' : 'Next: Song Request'}
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

                {/* Menu Overview */}
                <div className="card mb-8 bg-cream-50">
                  <h3 className="font-display text-lg text-burgundy-900 mb-4 text-center">
                    Wedding Breakfast Menu
                  </h3>
                  <div className="text-center text-gray-600 text-sm space-y-2">
                    <p><strong>Starter:</strong> {MENU.starter.name}</p>
                    <p><strong>Mains:</strong> Choice of {MENU.mains.map(m => m.name).join(', ')}</p>
                    <p><strong>Dessert:</strong> {MENU.dessert.name}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {getAttendingGuests().map((guest) => (
                    <MealSelectionCard
                      key={guest.id}
                      guest={guest}
                      guestRSVPs={guestRSVPs}
                      updateGuestRSVP={updateGuestRSVP}
                      wasPreFilled={wasPreFilled}
                      getMainGuestForPlusOne={getMainGuestForPlusOne}
                      getDisplayName={getDisplayName}
                    />
                  ))}
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
                    className="btn-primary flex-1"
                  >
                    Next: Song Request
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
                  
                  {isReturningUser && partyExtras.songRequest ? (
                    <EditableField
                      label="Your song request"
                      value={partyExtras.songRequest}
                      onSave={(value) => setPartyExtras(prev => ({ ...prev, songRequest: value }))}
                      placeholder="Song title - Artist"
                    />
                  ) : (
                    <>
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
                    </>
                  )}
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
                    onClick={handleExtrasNext}
                    className="btn-primary flex-1"
                  >
                    Review RSVP
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
                  {isReturningUser 
                    ? "Your RSVP has been updated. We can't wait to celebrate with you!"
                    : "Your RSVP has been received. We can't wait to celebrate with you!"}
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

      {/* Review Modal */}
      <ReviewModal
        showReviewModal={showReviewModal}
        loading={loading}
        error={error}
        guests={guests}
        guestRSVPs={guestRSVPs}
        partyExtras={partyExtras}
        editingSection={editingSection}
        editingPlusOneName={editingPlusOneName}
        isReturningUser={isReturningUser}
        originalRSVPs={originalRSVPs}
        setShowReviewModal={setShowReviewModal}
        setEditingSection={setEditingSection}
        setEditingPlusOneName={setEditingPlusOneName}
        setPartyExtras={setPartyExtras}
        updateGuestRSVP={updateGuestRSVP}
        handleFinalSubmit={handleFinalSubmit}
        getAttendingGuests={getAttendingGuests}
        getMainGuestForPlusOne={getMainGuestForPlusOne}
        getPlusOneForGuest={getPlusOneForGuest}
        getDisplayName={getDisplayName}
        getMealOptionName={getMealOptionName}
        plusOneNameWasSaved={plusOneNameWasSaved}
      />

      <Footer />
    </main>
  );
}
