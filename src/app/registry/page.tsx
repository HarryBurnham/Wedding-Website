import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Harry & Adia | Registry',
};

export default function Registry() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Gift Registry
          </h1>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Registry Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {/* Message */}
          <div className="card mb-12 text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              Your presence at our wedding is the greatest gift of all. However, 
              if you wish to honour us with a gift, we have registered at the 
              following places. Thank you for your love and generosity!
            </p>
          </div>

          {/* Registry Links */}
          <div className="space-y-6">
            {WEDDING_CONFIG.registryLinks.length > 0 ? (
              WEDDING_CONFIG.registryLinks.map((registry, index) => (
                <a
                  key={index}
                  href={registry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card block hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl text-burgundy-900 mb-2 group-hover:text-burgundy-700 transition-colors">
                        {registry.name}
                      </h3>
                      {registry.description && (
                        <p className="text-gray-600">{registry.description}</p>
                      )}
                    </div>
                    <svg
                      className="w-6 h-6 text-burgundy-400 group-hover:text-burgundy-700 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Registry details coming soon...</p>
              </div>
            )}
          </div>

          {/* Recommended UK Registries */}
          <div className="mt-16">
            <h2 className="font-display text-3xl text-burgundy-900 text-center mb-4">
              Recommended Registry Sites
            </h2>
            <p className="text-gray-600 text-center mb-8">
              These universal registry platforms allow you to add gifts from any UK store:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-display text-xl text-burgundy-900 mb-2">Prezola</h3>
                <p className="text-gray-600 text-sm mb-4">
                  The UK's favourite wedding gift list. Mix homeware, honeymoon funds, 
                  experiences, and charity donations.
                </p>
                <a
                  href="https://prezola.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy-700 hover:underline text-sm"
                >
                  Visit Prezola →
                </a>
              </div>

              <div className="card">
                <h3 className="font-display text-xl text-burgundy-900 mb-2">MyRegistry</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Universal gift list where you can add items from any store worldwide, 
                  online or brick-and-mortar.
                </p>
                <a
                  href="https://myregistry.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy-700 hover:underline text-sm"
                >
                  Visit MyRegistry →
                </a>
              </div>

              <div className="card">
                <h3 className="font-display text-xl text-burgundy-900 mb-2">Joy</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Add items from any store with their browser extension. 
                  Offers zero-fee cash funds.
                </p>
                <a
                  href="https://withjoy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy-700 hover:underline text-sm"
                >
                  Visit Joy →
                </a>
              </div>

              <div className="card">
                <h3 className="font-display text-xl text-burgundy-900 mb-2">Moonsift</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Clean, modern registry design. Perfect for mixing big-name 
                  retailers with small boutiques.
                </p>
                <a
                  href="https://moonsift.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy-700 hover:underline text-sm"
                >
                  Visit Moonsift →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
