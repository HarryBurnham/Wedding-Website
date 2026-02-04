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
    { time: '00:00', event: 'Evening Guests Arrive'},
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
      name: 'Premier Inn: Ashby De La Zouch',
      description: 'Premier Inn in Ashby De La Zouch',
      address: 'Flagstaff Island, Flagstaff Park, Ashby De La Zouch, LE65 1JP',
      website: 'https://www.premierinn.com/gb/en/hotels/england/leicestershire/ashby-de-la-zouch/ashby-de-la-zouch.html?cid=GLBC_ASHBRE',
      phone: '0333 777 3667',
      priceRange: '£112 per night',
      distanceToVenue: '3.9 miles',
    },
    {
      name: 'Springwood Fisheries: caravan & campsite',
      description: 'A place to camp or setup your caravan',
      address: 'Ashby Rd, Melbourne, Malbourne,. DE73 8BJ',
      website: 'https://www.springwoodfisheries.com/',
      phone: '07904 470047',
      priceRange: '£34-90 per night',
      distanceToVenue: '1.6 miles',
    },
    {
      name: 'Premier Inn: East Midlands Airport Hotel',
      description: 'Premier Inn by East Midlands Airport',
      address: 'Pegasus Business Park, Hunter\'s Way, Castle Donnington, DE74 2TQ',
      website: 'https://www.premierinn.com/gb/en/hotels/england/leicestershire/ashby-de-la-zouch/ashby-de-la-zouch.https://www.premierinn.com/gb/en/hotels/england/leicestershire/east-midlands-airport/east-midlands-airport.html?cid=GLBC_EASPTIhtml?cid=GLBC_ASHBRE',
      phone: '0333 777 4675',
      priceRange: '£104 per night',
      distanceToVenue: '7.4 miles',
    },
    {
      name: 'Hermitage Park Hotel',
      description: 'The Hermitage Park Hotel is a modern, independent, 3 star hotel in Coalville, near Leicester, located at J22 off the M1. Our comfortable rooms, glass atrium restaurant and conference facilities make our hotel the perfect place to sleep, dine and work.',
      address: 'Whitwick Road, Coalville, Near Leicester,, Leicestershire, LE67 3FA',
      website: 'https://direct-book.com/properties/hermitagedirect?locale=en&items[0][adults]=1&items[0][children]=0&items[0][infants]=0&currency=GBP&checkInDate=2026-02-04&checkOutDate=2026-02-05&trackPage=yes',
      phone: '+44 (0)1530 814 814',
      priceRange: '£94.50 per night',
      distanceToVenue: '7.0 miles',
    },
     {
      name: 'Hermitage Park Hotel',
      description: 'The Hermitage Park Hotel is a modern, independent, 3 star hotel in Coalville, near Leicester, located at J22 off the M1. Our comfortable rooms, glass atrium restaurant and conference facilities make our hotel the perfect place to sleep, dine and work.',
      address: 'Whitwick Road, Coalville, Near Leicester,, Leicestershire, LE67 3FA',
      website: 'https://direct-book.com/properties/hermitagedirect?locale=en&items[0][adults]=1&items[0][children]=0&items[0][infants]=0&currency=GBP&checkInDate=2026-02-04&checkOutDate=2026-02-05&trackPage=yes',
      phone: '+44 (0)1530 814 814',
      priceRange: '£94.50 per night',
      distanceToVenue: '7.0 miles',
    },
    {
      name: 'Radisson Blu Hotel, East Midlands Airport',
      description: 'This chic, contemporary airport hotel. Situated near the cities of Derby, Nottingham, and Leicester, it\'s the perfect base for exploring exciting urban attractions as well as the surrounding countryside..',
      address: 'Pegasus Business Park, Herald Way, Derby, DE74 2TZ',
      website: 'https://direct-book.com/properties/hermitagedirect?locale=en&items[0][adults]=1&items[0][children]=0&items[0][infants]=0&currency=GBP&checkInDate=2026-02-04&checkOutDate=2026-02-05&trackPage=yes',
      phone: '+44 1509 670575',
      priceRange: '£86 per night',
      distanceToVenue: '7.0 miles',
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
  { href: '/info', label: 'Info' },
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