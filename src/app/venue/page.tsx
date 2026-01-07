import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VenuePhotos from '@/components/VenuePhotos';
import { WEDDING_CONFIG } from '@/lib/constants';

export default function Venue() {
  const weddingDate = WEDDING_CONFIG.weddingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const { venue } = WEDDING_CONFIG;

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
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl text-burgundy-900 mb-4">
            {venue.name}
          </h2>
          <p className="text-gray-600 mb-4">{venue.address}</p>
          <p className="text-gray-500 mb-6">{venue.description}</p>

          {/* Venue Photos */}
          <VenuePhotos photos={venue.photos} />

          {/* Map */}
          <div className="mt-8 aspect-video bg-cream-100 flex items-center justify-center border border-burgundy-100">
            {venue.mapUrl ? (
              <iframe
                src={venue.mapUrl}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <p className="text-gray-400 text-sm">Map will be displayed here</p>
            )}
          </div>

          <div className="mt-6">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                venue.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline text-sm"
            >
              Get Directions
            </a>
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
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-burgundy-200" />

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