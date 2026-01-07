import Link from 'next/link';
import { NAV_LINKS, WEDDING_CONFIG } from '@/lib/constants';

export default function Footer() {
  const weddingDate = WEDDING_CONFIG.weddingDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <footer className="bg-burgundy-900 text-cream-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Names & Date */}
          <div>
            <h3 className="font-display text-3xl mb-4">
              {WEDDING_CONFIG.partner1} <span className="text-burgundy-300">&</span> {WEDDING_CONFIG.partner2 || '______'}
            </h3>
            <p className="text-cream-300">{weddingDate}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-300 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-4">Get in Touch</h4>
            <p className="text-cream-300 mb-4">
              Have questions? We'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-block border border-cream-300 px-6 py-2 text-sm uppercase tracking-widest hover:bg-cream-100 hover:text-burgundy-900 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-burgundy-800 text-center text-cream-400 text-sm">
          <p>Made with love for our special day</p>
        </div>
      </div>
    </footer>
  );
}
