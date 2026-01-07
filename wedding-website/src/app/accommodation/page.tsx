import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';

export default function Accommodation() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Accommodation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've compiled a list of nearby accommodation options for our guests. 
            We recommend booking early to secure your preferred choice.
          </p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Accommodation List */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {WEDDING_CONFIG.accommodations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {WEDDING_CONFIG.accommodations.map((hotel, index) => (
                <div key={index} className="card">
                  <h3 className="font-display text-2xl text-burgundy-900 mb-4">
                    {hotel.name}
                  </h3>
                  
                  {hotel.description && (
                    <p className="text-gray-600 mb-4">{hotel.description}</p>
                  )}

                  <div className="space-y-3 text-sm">
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

                  {/* Block booking notice */}
                  {hotel.hasBlockBooking && hotel.blockCode && (
                    <div className="mt-6 p-4 bg-burgundy-50 border border-burgundy-100">
                      <p className="text-sm text-burgundy-800">
                        <strong>Block Booking Available:</strong> Use code{' '}
                        <span className="font-mono bg-burgundy-100 px-2 py-0.5">{hotel.blockCode}</span>{' '}
                        when booking to receive our special rate.
                      </p>
                    </div>
                  )}

                  {/* Website link */}
                  {hotel.website && (
                    <div className="mt-6">
                      <a
                        href={hotel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">Accommodation details coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl text-burgundy-900 text-center mb-4">
            Getting There
          </h2>
          <div className="divider mb-8">
            <span className="text-burgundy-700">♦</span>
          </div>

          <div className="space-y-8">
            {/* By Car */}
            <div className="card">
              <h3 className="font-display text-xl text-burgundy-900 mb-3 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 5h8M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                By Car
              </h3>
              <p className="text-gray-600">
                [Add driving directions and parking information here. Include details 
                about available parking at the venue and any nearby car parks.]
              </p>
            </div>

            {/* By Train */}
            <div className="card">
              <h3 className="font-display text-xl text-burgundy-900 mb-3 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1m1-1h6m5 0l2-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v10" />
                </svg>
                By Train
              </h3>
              <p className="text-gray-600">
                [Add train information here. Include the nearest station, typical 
                journey times from major cities, and taxi/transport options from the station.]
              </p>
            </div>

            {/* Taxis */}
            <div className="card">
              <h3 className="font-display text-xl text-burgundy-900 mb-3 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                Local Taxis
              </h3>
              <p className="text-gray-600">
                [Add local taxi company recommendations and contact numbers here.]
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
