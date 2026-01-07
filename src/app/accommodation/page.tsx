import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';

export default function TravelAccommodation() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Travel & Accommodation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about getting to our wedding and where to stay.
          </p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl text-burgundy-900 text-center mb-4">
            Getting There
          </h2>
          <div className="divider mb-12">
            <span className="text-burgundy-700">♦</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* By Car */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-burgundy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-burgundy-900">By Car</h3>
              </div>
              <p className="text-gray-600 mb-4">
                [Add driving directions here. Include major motorways, estimated journey times from key locations, and any specific turn-by-turn directions for the final approach.]
              </p>
              <div className="bg-cream-100 p-4 rounded">
                <p className="text-sm text-gray-600">
                  <strong>Parking:</strong> [Add parking information - is there parking at the venue? Nearby car parks? Any costs?]
                </p>
              </div>
            </div>

            {/* By Train */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-burgundy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-burgundy-900">By Train</h3>
              </div>
              <p className="text-gray-600 mb-4">
                [Add train information - nearest station, typical journey times from London/other major cities, frequency of trains.]
              </p>
              <div className="bg-cream-100 p-4 rounded">
                <p className="text-sm text-gray-600">
                  <strong>Nearest Station:</strong> [Station name, X miles from venue]
                </p>
              </div>
            </div>

            {/* By Air */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-burgundy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-burgundy-900">By Air</h3>
              </div>
              <p className="text-gray-600">
                [Add information about nearest airports and how to get from there to the venue. Include approximate travel times.]
              </p>
            </div>

            {/* Sat Nav */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-burgundy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-burgundy-900">Sat Nav / GPS</h3>
              </div>
              <p className="text-gray-600 mb-4">
                For your sat nav, use the following postcode:
              </p>
              <div className="bg-cream-100 p-4 rounded text-center">
                <p className="text-xl font-mono text-burgundy-900">LE65 1RT</p>
              </div>

              {/* Waze Tip */}
              <div className="bg-burgundy-900 text-white p-6 rounded-lg mt-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-burgundy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm">
                    If you use Waze, it will take you to the correct entrance straight to the house. 
                    We can’t guarantee where a standard sat nav will take you.
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
      </section>

      {/* Taxis & Local Transport */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl text-burgundy-900 text-center mb-4">
            Taxis & Local Transport
          </h2>
          <div className="divider mb-12">
            <span className="text-burgundy-700">♦</span>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
            <p className="text-gray-600 text-center mb-8">
              We recommend booking taxis in advance, especially for the journey home at the end of the night. 
              Here are some local taxi companies we recommend:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Taxi Company 1 */}
              <div className="border border-burgundy-100 p-6 rounded-lg">
                <h3 className="font-display text-xl text-burgundy-900 mb-3">
                  [Taxi Company Name]
                </h3>
                <div className="space-y-2">
                  <a 
                    href="tel:01onal123456" 
                    className="flex items-center gap-3 text-burgundy-700 hover:text-burgundy-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-lg">01onal 123456</span>
                  </a>
                  <p className="text-gray-500 text-sm">
                    [Add notes - e.g., "24 hour service", "Book in advance recommended"]
                  </p>
                </div>
              </div>

              {/* Taxi Company 2 */}
              <div className="border border-burgundy-100 p-6 rounded-lg">
                <h3 className="font-display text-xl text-burgundy-900 mb-3">
                  [Taxi Company Name]
                </h3>
                <div className="space-y-2">
                  <a 
                    href="tel:01onal654321" 
                    className="flex items-center gap-3 text-burgundy-700 hover:text-burgundy-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-lg">01onal 654321</span>
                  </a>
                  <p className="text-gray-500 text-sm">
                    [Add notes]
                  </p>
                </div>
              </div>

              {/* Taxi Company 3 */}
              <div className="border border-burgundy-100 p-6 rounded-lg">
                <h3 className="font-display text-xl text-burgundy-900 mb-3">
                  [Taxi Company Name]
                </h3>
                <div className="space-y-2">
                  <a 
                    href="tel:01onal111222" 
                    className="flex items-center gap-3 text-burgundy-700 hover:text-burgundy-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-lg">01onal 111222</span>
                  </a>
                  <p className="text-gray-500 text-sm">
                    [Add notes]
                  </p>
                </div>
              </div>

              {/* Uber/Bolt notice */}
              <div className="border border-burgundy-100 p-6 rounded-lg bg-cream-50">
                <h3 className="font-display text-xl text-burgundy-900 mb-3">
                  Ride-Sharing Apps
                </h3>
                <p className="text-gray-600 text-sm">
                  Uber and Bolt are available in the area, though availability may be limited late at night. 
                  We recommend having a local taxi number as backup.
                </p>
              </div>
            </div>
          </div>

          {/* Pro tip */}
          <div className="bg-burgundy-900 text-white p-6 rounded-lg">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-burgundy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-lg mb-2">Top Tip</h4>
                <p className="text-burgundy-100 text-sm">
                  We strongly recommend pre-booking your taxi home before the wedding day, 
                  as it can be difficult to find available cabs late in the evening. 
                  The reception ends at midnight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl text-burgundy-900 text-center mb-4">
            Where to Stay
          </h2>
          <div className="divider mb-8">
            <span className="text-burgundy-700">♦</span>
          </div>

          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We recommend booking accommodation early to secure your preferred choice. 
            Here are some options near the venue:
          </p>

          {WEDDING_CONFIG.accommodations.length > 0 ? (
            <div className="space-y-6">
              {WEDDING_CONFIG.accommodations.map((hotel, index) => (
                <div key={index} className="card">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-2xl text-burgundy-900 mb-2">
                        {hotel.name}
                      </h3>
                      
                      {hotel.description && (
                        <p className="text-gray-600 mb-4">{hotel.description}</p>
                      )}

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-burgundy-700 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600">{hotel.address}</span>
                        </div>

                        {hotel.distanceToVenue && (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-burgundy-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-gray-600">{hotel.distanceToVenue} from venue</span>
                          </div>
                        )}

                        {hotel.priceRange && (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-burgundy-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600">{hotel.priceRange}</span>
                          </div>
                        )}

                        {hotel.phone && (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-burgundy-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${hotel.phone}`} className="text-burgundy-700 hover:text-burgundy-900 transition-colors">
                              {hotel.phone}
                            </a>
                          </div>
                        )}
                      </div>

                    {/* Website link */}
                    {hotel.website && (
                      <div className="flex-shrink-0">
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-sm inline-block"
                        >
                          Book Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Accommodation details coming soon...</p>
            </div>
          )}

          {/* Other options */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Try these sites:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.booking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline"
              >
                Booking.com
              </a>
              <a
                href="https://www.airbnb.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline"
              >
                Airbnb
              </a>
              <a
                href="https://www.tripadvisor.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline"
              >
                TripAdvisor
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
