import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WEDDING_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Harry Burnham & Adia Shane | Our Story',
};

export default function OurStory() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Our Story
          </h1>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {/* How We Met */}
          <div className="mb-16">
            <h2 className="font-display text-3xl text-burgundy-900 mb-6 text-center">
              How We Met
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                {/* Add your story here */}
                ???
              </p>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center my-12">
            <div className="h-px w-24 bg-burgundy-200"></div>
            <svg className="w-8 h-8 mx-4 text-burgundy-300" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0C50 27.6 27.6 50 0 50c27.6 0 50 22.4 50 50 0-27.6 22.4-50 50-50C72.4 50 50 27.6 50 0z" />
            </svg>
            <div className="h-px w-24 bg-burgundy-200"></div>
          </div>

          {/* The Journey */}
          <div className="mb-16">
            <h2 className="font-display text-3xl text-burgundy-900 mb-6 text-center">
              Our Journey Together
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                {/* Add your story here */}
                ???
              </p>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center my-12">
            <div className="h-px w-24 bg-burgundy-200"></div>
            <svg className="w-8 h-8 mx-4 text-burgundy-300" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0C50 27.6 27.6 50 0 50c27.6 0 50 22.4 50 50 0-27.6 22.4-50 50-50C72.4 50 50 27.6 50 0z" />
            </svg>
            <div className="h-px w-24 bg-burgundy-200"></div>
          </div>

          {/* The Proposal */}
          <div className="mb-16">
            <h2 className="font-display text-3xl text-burgundy-900 mb-6 text-center">
              The Proposal
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="mb-6">
                {/* Add your story here */}
                ???
              </p>
            </div>
          </div>

          {/* Photo placeholder */}
          <div className="mt-16 text-center">
            <div className="aspect-[4/3] max-w-2xl mx-auto bg-cream-200 flex items-center justify-center border border-burgundy-100">
              <p className="text-gray-400 text-sm uppercase tracking-widest">
                Add  engagement photo here
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
