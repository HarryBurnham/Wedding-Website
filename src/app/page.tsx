import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Countdown from '@/components/Countdown';
import Link from 'next/link';
import { WEDDING_CONFIG } from '@/lib/constants';

export default function Home() {
  const weddingDate: string = WEDDING_CONFIG.weddingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const { venue } = WEDDING_CONFIG;

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-cream-100">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="floral" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="1" fill="#722040" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#floral)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-32">
          <div className="mb-8">
            <svg className="w-16 h-16 mx-auto text-burgundy-300" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0C50 27.6 27.6 50 0 50c27.6 0 50 22.4 50 50 0-27.6 22.4-50 50-50C72.4 50 50 27.6 50 0z" />
            </svg>
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-burgundy-700 mb-6">
            Together with their families
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-burgundy-900 mb-4">
            {WEDDING_CONFIG.partner1}
          </h1>

          <p className="font-display text-3xl md:text-4xl text-burgundy-400 italic my-6">&</p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-burgundy-900 mb-8">
            {WEDDING_CONFIG.partner2 || '______'}
          </h1>

          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 mt-8 mb-4">
            Request the pleasure of your company
          </p>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            at the celebration of their marriage
          </p>

          <p className="font-display text-2xl md:text-3xl text-burgundy-900 mt-8">
            {weddingDate}
          </p>

          {/* Countdown */}
          <div className="mt-16 mb-12">
            <Countdown />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/rsvp" className="btn-primary">
              RSVP Now
            </Link>
            <Link href="/venue" className="btn-secondary">
              View Details
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-burgundy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Venue / Travel & Accommodation / RSVP */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">

            {/* Ceremony & Reception */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-burgundy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-burgundy-900 mb-3">
                Ceremony & Reception
              </h3>
              <p className="text-gray-600 mb-2">{venue.time || '15:00'}</p>
              <p className="text-gray-500 text-sm">{venue.name}</p>

              <Link
              href="/venue"
              className="inline-block mt-3 text-sm text-burgundy-700 hover:text-burgundy-900 transition-colors underline"
              >
                View Full Schedule
              </Link>
            </div>

            {/* Travel & Accommodation */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-burgundy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-burgundy-900 mb-3">
                Travel & Accommodation
              </h3>
              <p className="text-gray-600 mb-2">
                Directions & places to stay
              </p>
              <Link
                href="/accommodation"
                className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline"
              >
                View Info
              </Link>
            </div>

            {/* RSVP */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-burgundy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-burgundy-900 mb-3">RSVP</h3>
              <p className="text-gray-600 mb-2">
                Please respond by{' '}
                {WEDDING_CONFIG.rsvpDeadline.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <Link
                href="/rsvp"
                className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline"
              >
                Respond Now
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
