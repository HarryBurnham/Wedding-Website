import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Countdown from '@/components/Countdown';
import Link from 'next/link';
import { WEDDING_CONFIG } from '@/lib/constants';

export default function Home() {
  const weddingDate = WEDDING_CONFIG.weddingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
          {/* Decorative element */}
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

      {/* Quick Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Ceremony */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-burgundy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-burgundy-900 mb-3">The Ceremony</h3>
              <p className="text-gray-600 mb-2">{WEDDING_CONFIG.ceremony.time}</p>
              <p className="text-gray-500 text-sm">{WEDDING_CONFIG.ceremony.name}</p>
            </div>

            {/* Reception */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-burgundy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.5458C21 17.0922 19.6569 18.3458 18 18.3458H6C4.34315 18.3458 3 17.0922 3 15.5458M21 15.5458V11.7458C21 10.1994 19.6569 8.94584 18 8.94584H6C4.34315 8.94584 3 10.1994 3 11.7458V15.5458M21 15.5458H3M12 5.54584V8.94584M9 5.54584C9 4.16513 10.3431 3.04584 12 3.04584C13.6569 3.04584 15 4.16513 15 5.54584" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-burgundy-900 mb-3">The Reception</h3>
              <p className="text-gray-600 mb-2">{WEDDING_CONFIG.reception.time}</p>
              <p className="text-gray-500 text-sm">{WEDDING_CONFIG.reception.name}</p>
            </div>

            {/* RSVP */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-burgundy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-burgundy-900 mb-3">RSVP</h3>
              <p className="text-gray-600 mb-2">
                Please respond by {WEDDING_CONFIG.rsvpDeadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <Link href="/rsvp" className="text-burgundy-700 hover:text-burgundy-900 transition-colors underline">
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
