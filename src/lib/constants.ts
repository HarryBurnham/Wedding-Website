export const WEDDING_CONFIG = {
  // Couple details
  partner1: 'Harry Burnham',
  partner2: '', // Add partner name here
  weddingDate: new Date('2026-10-10T14:00:00'),
  
  // Contact
  contactEmail: 'your-email@example.com', // Update this
  
  // Venue details (update these)
  ceremony: {
    name: 'Ceremony Venue',
    address: '123 Wedding Lane, City, Postcode',
    time: '14:00',
    description: 'Please arrive 30 minutes before the ceremony begins.',
    mapUrl: '', // Add Google Maps embed URL
  },
  reception: {
    name: 'Reception Venue',
    address: '456 Celebration Road, City, Postcode',
    time: '17:00',
    description: 'Drinks reception followed by dinner and dancing.',
    mapUrl: '', // Add Google Maps embed URL
  },
  
  // Schedule
  schedule: [
    { time: '13:30', event: 'Guest Arrival' },
    { time: '14:00', event: 'Ceremony Begins' },
    { time: '14:45', event: 'Drinks Reception' },
    { time: '17:00', event: 'Wedding Breakfast' },
    { time: '19:30', event: 'Speeches' },
    { time: '20:30', event: 'First Dance' },
    { time: '21:00', event: 'Evening Reception' },
    { time: '00:00', event: 'Carriages' },
  ],
  
  // Meal options (update when confirmed)
  mealOptions: [
    { id: 'tbc1', name: 'Option 1', description: 'To be confirmed' },
    { id: 'tbc2', name: 'Option 2', description: 'To be confirmed' },
    { id: 'tbc3', name: 'Vegetarian Option', description: 'To be confirmed' },
  ],
  
  // Registry links
  registryLinks: [
    { name: 'Prezola', url: 'https://prezola.com', description: 'Our main gift list' },
    // Add more registry links as needed
  ],
  
  // Accommodations (update these)
  accommodations: [
    {
      name: 'Nearby Hotel',
      description: 'A lovely hotel close to the venue',
      address: '789 Hotel Street, City, Postcode',
      website: 'https://example.com',
      phone: '01onal 123456',
      priceRange: '£80-120 per night',
      distanceToVenue: '0.5 miles',
      hasBlockBooking: true,
      blockCode: 'BURNHAM2026',
    },
    // Add more accommodations
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
