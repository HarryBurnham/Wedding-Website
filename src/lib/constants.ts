export const WEDDING_CONFIG = {
  partner1: 'Harry Burnham',
  partner2: 'Adia Shane',
  weddingDate: new Date('2026-10-10T14:00:00'),
  
  // Contact
  contactEmail: 'your-email@example.com', // Update this

  venue: {
    name: 'Ceremony & Reception Venue',
    address: 'Melbourne Rd, Ashby-de-la-Zouch LE65 1RT',
    description:
      'The ceremony begins at 15:00 and lasts approximately 30 minutes, followed by drinks, wedding breakfast, and dancing at the same venue.',
    mapUrl: 'https://maps.app.goo.gl/kky72eZE5jJPgmQ69',
    photos: [
      '/images/Staunton-Harold-Estate.jpg',
      '/images/Staunton_Harold_Hall.jpg',
      '/images/The_Lake_at_Staunton_Harold_Hall.jpg',
    ], 
  },

  // Schedule
  schedule: [
    { time: '14:30', event: 'Guest Arrival' },
    { time: '15:00', event: 'Ceremony Begins' },
    { time: '00:00', event: 'Drinks Reception' },
    { time: '00:00', event: 'Wedding Breakfast' },
    { time: '00:00', event: 'Speeches' },
    { time: '00:00', event: 'First Dance' },
    { time: '00:00', event: 'Evening Reception' },
    { time: '00:00', event: 'Leaving' },
  ],

  // Meal options
  mealOptions: [
    { id: 'tbc1', name: 'Option 1', description: 'To be confirmed' },
    { id: 'tbc2', name: 'Option 2', description: 'To be confirmed' },
    { id: 'tbc3', name: 'Vegetarian Option', description: 'To be confirmed' },
  ],

  // Registry links
  registryLinks: [
    { name: 'Prezola', url: 'https://prezola.com', description: 'Our main gift list' },
  ],

  // Accommodations
  accommodations: [
    {
      name: 'Nearby Hotel',
      description: 'A lovely hotel close to the venue',
      address: '789 Hotel Street, City, Postcode',
      website: 'https://example.com',
      phone: '01234 567890',
      priceRange: '£80-120 per night',
      distanceToVenue: '0.5 miles',
      hasBlockBooking: true,
      blockCode: 'BURNHAM2026',
    },
  ],

  // RSVP deadline
  rsvpDeadline: new Date('2026-08-01'),
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/venue', label: 'Venue & Schedule' },
  { href: '/accommodation', label: 'Accommodation & Travel' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/registry', label: 'Registry' },
  { href: '/contact', label: 'Contact' },
];

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/guests', label: 'Guests' },
  { href: '/admin/rsvps', label: 'RSVPs' },
  { href: '/admin/recipes', label: 'Recipes' },
  { href: '/admin/messages', label: 'Messages' },
];