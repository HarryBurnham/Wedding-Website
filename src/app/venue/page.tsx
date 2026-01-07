import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';

export default function Venue() {
  const weddingDate = WEDDING_CONFIG.weddingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Venue & Schedule
          </h1>
          <p className="text-xl text-gray-600">{weddingDate}</p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Venue Details */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Ceremony */}
            <div className="card">
              <div className="text-center mb-8">
                <svg className="w-12 h-12 mx-auto text-burgundy-900 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h2 className="font-display text-3xl text-burgundy-900">The Ceremony</h2>
              </div>

              <div className="space-y-4 text-center">
                <p className="text-2xl font-display text-burgundy-800">
                  {WEDDING_CONFIG.ceremony.time}
                </p>
                <p className="text-xl text-gray-700">
                  {WEDDING_CONFIG.ceremony.name}
                </p>
                <p className="text-gray-600">
                  {WEDDING_CONFIG.ceremony.address}
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  {WEDDING_CONFIG.ceremony.description}
                </p>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 aspect-video bg-cream-100 flex items-center justify-center border border-burgundy-100">
                {WEDDING_CONFIG.ceremony.mapUrl ? (
                  <iframe
                    src={WEDDING_CONFIG.ceremony.mapUrl}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">Map will be displayed here</p>
                )}
              </div>

              <div className="mt-6 text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WEDDING_CONFIG.ceremony.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline text-sm"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Reception */}
            <div className="card">
              <div className="text-center mb-8">
                <svg className="w-12 h-12 mx-auto text-burgundy-900 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.5458C21 17.0922 19.6569 18.3458 18 18.3458H6C4.34315 18.3458 3 17.0922 3 15.5458M21 15.5458V11.7458C21 10.1994 19.6569 8.94584 18 8.94584H6C4.34315 8.94584 3 10.1994 3 11.7458V15.5458M21 15.5458H3M12 5.54584V8.94584M9 5.54584C9 4.16513 10.3431 3.04584 12 3.04584C13.6569 3.04584 15 4.16513 15 5.54584" />
                </svg>
                <h2 className="font-display text-3xl text-burgundy-900">The Reception</h2>
              </div>

              <div className="space-y-4 text-center">
                <p className="text-2xl font-display text-burgundy-800">
                  {WEDDING_CONFIG.reception.time}
                </p>
                <p className="text-xl text-gray-700">
                  {WEDDING_CONFIG.reception.name}
                </p>
                <p className="text-gray-600">
                  {WEDDING_CONFIG.reception.address}
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  {WEDDING_CONFIG.reception.description}
                </p>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 aspect-video bg-cream-100 flex items-center justify-center border border-burgundy-100">
                {WEDDING_CONFIG.reception.mapUrl ? (
                  <iframe
                    src={WEDDING_CONFIG.reception.mapUrl}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">Map will be displayed here</p>
                )}
              </div>

              <div className="mt-6 text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WEDDING_CONFIG.reception.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline text-sm"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl text-burgundy-900 text-center mb-4">
            Order of the Day
          </h2>
          <div className="divider mb-12">
            <span className="text-burgundy-700">♦</span>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-burgundy-200" />

            {/* Timeline items */}
            <div className="space-y-8">
              {WEDDING_CONFIG.schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <p className="font-display text-2xl text-burgundy-900">{item.time}</p>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-burgundy-900 border-4 border-cream-100" />

                  <div className={`flex-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <p className="text-gray-700">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl text-burgundy-900 mb-4">
            Dress Code
          </h2>
          <div className="divider mb-8">
            <span className="text-burgundy-700">♦</span>
          </div>
          <p className="text-xl text-gray-700 mb-4">Formal Attire</p>
          <p className="text-gray-600">
            We kindly request that guests dress formally for the occasion. 
            Gentlemen are encouraged to wear suits and ladies are welcome to wear 
            cocktail dresses or formal gowns.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
