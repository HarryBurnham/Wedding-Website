import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Harry & Adia | Registry',
};

export default function Registry() {
  const link = WEDDING_CONFIG.registryLinks[0];

  return (
    <main className="min-h-screen">
      <Navigation />

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

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="card mb-12 text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              Your presence at our wedding is the greatest gift of all. However,
              if you wish to honour us with a gift, we have registered at Prezola.
              The link is below. Thank you for your love and generosity!
            </p>
          </div>

          {link && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card block hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl text-burgundy-900 mb-2 group-hover:text-burgundy-700 transition-colors">
                    {link.name}
                  </h3>
                  {link.description && (
                    <p className="text-gray-600">{link.description}</p>
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
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              If you have any questions about the registry, please don't hesitate to get in touch using the contact Page.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}