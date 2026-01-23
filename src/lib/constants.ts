export const WEDDING_CONFIG = {
  partner1: 'Harry Burnham',
  partner2: 'Adia Shane',
  weddingDate: new Date('2026-10-10T15:00:00'),
  
  // Contact
  contactEmail: 'your-email@example.com', // Update this

  venue: {
    name: 'Ceremony & Reception Venue',
    address: 'Melbourne Rd, Ashby-de-la-Zouch LE65 1RT',
    time: '15:00',
    description:
      'The ceremony begins at 15:00 and lasts approximately 30 minutes, followed by drinks, wedding breakfast, and dancing at the same venue.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2413.1036664283333!2d-1.4416852872279375!3d52.78443877201547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879fb7eaf43ea91%3A0x7d6c96e00dbc525b!2sStaunton%20Harold%20Hall%2C%20Melbourne%20Rd%2C%20Ashby-de-la-Zouch%20LE65%201RT!5e0!3m2!1sen!2suk!4v1767802812279!5m2!1sen!2suk',
    photos: [
      '/images/Staunton_Harold_Hall.jpg',
      '/images/grounds.jpg',
      '/images/salon.jpg',
      '/images/library.jpg',
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
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/guests', label: 'Guests' },
  { href: '/admin/rsvps', label: 'RSVPs' },
  { href: '/admin/recipes', label: 'Recipes' },
  { href: '/admin/messages', label: 'Messages' },
];