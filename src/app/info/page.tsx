'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface DressCodeExample {
  label: string;
  description: string;
  imagePlaceholder: string;
}

const mensDressCode: DressCodeExample[] = [
  {
    label: 'Classic Suit',
    description: 'A well-fitted suit in navy, charcoal, or black with a tie.',
    imagePlaceholder: 'Suit with tie',
  },
  {
    label: 'Morning Suit',
    description: 'For those wanting a traditional formal option.',
    imagePlaceholder: 'Morning suit',
  },
];

const womensDressCode: DressCodeExample[] = [
  {
    label: 'Formal Dress',
    description: 'Midi or full-length dress in elegant fabrics.',
    imagePlaceholder: 'Formal dress',
  },
  {
    label: 'Elegant Separates',
    description: 'A sophisticated blouse with tailored trousers or skirt.',
    imagePlaceholder: 'Elegant separates',
  },
];

// Food images - update these paths when you have real images
const starterImage = ''; // e.g., '/images/food/starter.jpg'
const mainsImages = [
  ''
  // '/public/images/food/main-1.jpg',
  // '/public/images/food/main-2.jpg',
  // '/public/images/food/main-3.jpg',
];
const dessertImage = ''; // e.g., '/images/food/dessert.jpg'

export default function Info() {
  const [currentMainsIndex, setCurrentMainsIndex] = useState(0);

  useEffect(() => {
    document.title = 'Harry & Adia Wedding | Info';
  }, []);

  // Rotate mains images
  useEffect(() => {
    if (mainsImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMainsIndex((prev) => (prev + 1) % mainsImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Wedding Info
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A few extra details to help you prepare for our special day.
          </p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-burgundy-900 mb-4 text-center">
            Dress Code
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We kindly request <span className="font-semibold text-burgundy-900">UK formal</span> attire. 
            Think classic elegance — suits and ties for gentlemen, formal dresses or elegant 
            separates for ladies. Please avoid white or ivory, as these are reserved for the bride.
          </p>

          {/* Men's Examples */}
          <div className="mb-16">
            <h3 className="font-display text-2xl text-burgundy-900 mb-6 text-center">
              For the Gentlemen
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {mensDressCode.map((item, index) => (
                <div key={index} className="text-center">
                  {/* Placeholder image */}
                  <div className="aspect-[3/4] bg-cream-200 mb-4 flex items-center justify-center border border-burgundy-100">
                    <div className="text-center p-4">
                      <svg 
                        className="w-16 h-16 mx-auto text-burgundy-200 mb-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      <p className="text-gray-400 text-sm uppercase tracking-widest">
                        {item.imagePlaceholder}
                      </p>
                    </div>
                  </div>
                  <h4 className="font-display text-xl text-burgundy-900 mb-2">{item.label}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Women's Examples */}
          <div>
            <h3 className="font-display text-2xl text-burgundy-900 mb-6 text-center">
              For the Ladies
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {womensDressCode.map((item, index) => (
                <div key={index} className="text-center">
                  {/* Placeholder image */}
                  <div className="aspect-[3/4] bg-cream-200 mb-4 flex items-center justify-center border border-burgundy-100">
                    <div className="text-center p-4">
                      <svg 
                        className="w-16 h-16 mx-auto text-burgundy-200 mb-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      <p className="text-gray-400 text-sm uppercase tracking-widest">
                        {item.imagePlaceholder}
                      </p>
                    </div>
                  </div>
                  <h4 className="font-display text-xl text-burgundy-900 mb-2">{item.label}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colour Guidance */}
          <div className="mt-12 p-6 bg-cream-50 border border-burgundy-100 text-center">
            <p className="text-gray-600">
              <span className="font-semibold text-burgundy-900">Please avoid:</span> Red, white, 
              burgundy, and trainers. Navy, charcoal, black, emerald, or jewel tones all work 
              beautifully.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <section className="py-8 bg-cream-50">
        <div className="flex items-center justify-center">
          <div className="h-px w-24 bg-burgundy-200"></div>
          <svg className="w-8 h-8 mx-4 text-burgundy-300" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0C50 27.6 27.6 50 0 50c27.6 0 50 22.4 50 50 0-27.6 22.4-50 50-50C72.4 50 50 27.6 50 0z" />
          </svg>
          <div className="h-px w-24 bg-burgundy-200"></div>
        </div>
      </section>

      {/* Food Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-burgundy-900 mb-4 text-center">
            Food & Drink
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We're excited to share a delicious meal with you. More details coming soon!
          </p>

          {/* Food cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter - single image */}
            <div className="text-center">
              <div className="aspect-square bg-cream-200 mb-4 flex items-center justify-center border border-burgundy-100 overflow-hidden">
                {starterImage ? (
                  <img 
                    src={starterImage} 
                    alt="Starter" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg 
                      className="w-12 h-12 mx-auto text-burgundy-200 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                      Photo
                    </p>
                  </div>
                )}
              </div>
              <h4 className="font-display text-xl text-burgundy-900">Starter</h4>
            </div>

            {/* Mains - rotating images */}
            <div className="text-center">
              <div className="aspect-square bg-cream-200 mb-4 flex items-center justify-center border border-burgundy-100 overflow-hidden relative">
                {mainsImages.length > 0 ? (
                  mainsImages.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Main course ${index + 1}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        index === currentMainsIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))
                ) : (
                  <div className="text-center p-4">
                    <svg 
                      className="w-12 h-12 mx-auto text-burgundy-200 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                      Photo
                    </p>
                  </div>
                )}
              </div>
              <h4 className="font-display text-xl text-burgundy-900">Mains</h4>
            </div>

            {/* Dessert - single image */}
            <div className="text-center">
              <div className="aspect-square bg-cream-200 mb-4 flex items-center justify-center border border-burgundy-100 overflow-hidden">
                {dessertImage ? (
                  <img 
                    src={dessertImage} 
                    alt="Dessert" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg 
                      className="w-12 h-12 mx-auto text-burgundy-200 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                      Photo
                    </p>
                  </div>
                )}
              </div>
              <h4 className="font-display text-xl text-burgundy-900">Dessert</h4>
            </div>
          </div>

          {/* Dietary note */}
          <div className="mt-12 p-6 bg-cream-50 border border-burgundy-100 text-center">
            <p className="text-gray-600">
              Please ensure you've noted any dietary requirements when you{' '}
              <a href="/rsvp" className="text-burgundy-700 hover:text-burgundy-900 underline transition-colors">
                RSVP
              </a>
              . We want to make sure everyone is well catered for!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
