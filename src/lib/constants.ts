export const WEDDING_CONFIG = {
  partner1: 'Harry Burnham',
  partner2: 'Adia Shane',
  weddingDate: new Date('2026-10-10T15:00:00'),
  
  // Contact
  contactEmail: 'harryadiawedding@gmail.com',

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
    { time: '14:45', event: 'Guests to be seated' },
    { time: '15:00', event: 'Ceremony Begins' },
    { time: '15:30', event: 'Drinks Reception' },
    { time: '17:00', event: 'Speeches' },
    { time: '17:30', event: 'Wedding Breakfast' },
    { time: '19:30', event: 'Evening Reception' },
    { time: '19:45', event: 'Evening Guests Arrive'},
    { time: '21:00', event: 'Evening food Served'},
    { time: '00:00', event: 'Leaving' },
  ],

  // Registry links
  registryLinks: [
    { name: 'Prezola', url: 'https://prezola.com', description: 'Our main gift list' },
  ],

  // Accommodations
  accommodations: [
  {
    name: 'Springwood Fisheries: Caravan & Campsite',
    description: 'Peaceful lakeside campsite with pitches for caravans, motorhomes and tents. Set in scenic countryside with fishing lakes on site. Perfect for guests who enjoy the outdoors.',
    address: 'Ashby Rd, Melbourne, DE73 8BJ',
    website: 'https://www.springwoodfisheries.com/',
    phone: '07904 470047',
    priceRange: '£34-90 per night',
    distanceToVenue: '1.6 miles',
  },
  {
    name: 'Premier Inn: Ashby De La Zouch',
    description: 'Comfortable hotel in beautiful countryside with great nearby transport links. Features interconnecting rooms for families, on-site restaurant, and free parking. Within easy reach of Ashby Castle and Calke Abbey.',
    address: 'Flagstaff Island, Flagstaff Park, Ashby De La Zouch, LE65 1JP',
    website: 'https://www.premierinn.com/gb/en/hotels/england/leicestershire/ashby-de-la-zouch/ashby-de-la-zouch.html',
    phone: '0333 777 3667',
    priceRange: '£112 per night',
    distanceToVenue: '3.9 miles',
  },
  {
    name: 'Harpur\'s of Melbourne',
    description: 'Boutique hotel in the charming Georgian market town of Melbourne. Features nine stylish en-suite rooms, a bar with live music, and restaurant serving wood-fired pizzas and Italian cuisine. Free Wi-Fi and free parking.',
    address: '2 Derby Road, Melbourne, DE73 8FE',
    website: 'https://harpursofmelbourne.co.uk/',
    phone: '01332 862134',
    priceRange: '£109-459 per night',
    distanceToVenue: '5.1 miles',
  },
  {
    name: 'Hermitage Park Hotel',
    description: 'A modern, independent 3-star hotel in Coalville, near Leicester, located at J22 off the M1. Features comfortable rooms, glass atrium restaurant and conference facilities.',
    address: 'Whitwick Road, Coalville, Leicestershire, LE67 3FA',
    website: 'https://direct-book.com/properties/hermitagedirect',
    phone: '+44 (0)1530 814 814',
    priceRange: '£94.50 per night',
    distanceToVenue: '7.0 miles',
  },
  {
    name: 'Radisson Blu Hotel, East Midlands Airport',
    description: 'Chic, contemporary 4-star airport hotel with 218 rooms. Features indoor swimming pool, sauna, steam room, fitness centre, and stylish Runway Brasserie restaurant. Perfect base near Derby, Nottingham, and Leicester.',
    address: 'Herald Way, Pegasus Business Park, Castle Donington, DE74 2TZ',
    website: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-east-midlands-airport',
    phone: '+44 1509 670575',
    priceRange: '£86 per night',
    distanceToVenue: '7.0 miles',
  },
  {
    name: 'Premier Inn: East Midlands Airport',
    description: 'Conveniently located near East Midlands Airport, ideal for guests flying in. Features on-site restaurant, free parking, and comfortable rooms with Premier Inn\'s signature comfy beds.',
    address: 'Pegasus Business Park, Hunter\'s Way, Castle Donington, DE74 2TQ',
    website: 'https://www.premierinn.com/gb/en/hotels/england/leicestershire/east-midlands-airport/east-midlands-airport.html',
    phone: '0333 777 4675',
    priceRange: '£104 per night',
    distanceToVenue: '7.4 miles',
  },
  {
    name: 'Hilton: East Midlands Airport',
    description: 'Conveniently located near East Midlands Airport, ideal for guests flying in. Features on-site restaurant, free parking, and a pool.',
    address: 'M1, Junction, 24 Derby Rd, Derby DE74 2YZ',
    website: 'https://www.hilton.com/en/hotels/emahnhn-hilton-east-midlands-airport/',
    phone: '+44 1509 674000',
    priceRange: '£85',
    distanceToVenue: '9.7 miles',
    },
  ],

  // RSVP deadline
  rsvpDeadline: new Date('2026-08-22'),
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/venue', label: 'Venue & Schedule' },
  { href: '/accommodation', label: 'Accommodation & Travel' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/registry', label: 'Registry' },
  { href: '/info', label: 'Info' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/guests', label: 'Guests' },
  { href: '/admin/rsvps', label: 'RSVPs' },
  { href: '/admin/songs', label: 'Song Requests' },
  { href: '/admin/messages', label: 'Messages' },
];