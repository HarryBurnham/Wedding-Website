'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface DressCodeExample {
  imagePath: string;
}

const dressCodeExamples: DressCodeExample[] = [
  {
    imagePath: '/images/dress-code/1.jpg',
  },
  {
    imagePath: '/images/dress-code/2.jpg',
  },
  {
    imagePath: '/images/dress-code/4.jpg',
  },
  {
    imagePath: '/images/dress-code/5.jpg',
  },
  {
    imagePath: '/images/dress-code/6.jpg',
  },
  {
    imagePath: '/images/dress-code/7.jpg',
  },
  {
    imagePath: '/images/dress-code/8.jpg',
  },
  {
    imagePath: '/images/dress-code/9.jpg',
  },
  {
    imagePath: '/images/dress-code/10.jpg',
  },
  {
    imagePath: '/images/dress-code/11.jpg',
  },
];

export default function Info() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    document.title = 'Harry & Adia Wedding | Dress Code';
  }, []);

  const goTo = (index: number, dir: 'next' | 'prev') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setAnimating(false);
      setDirection(null);
    }, 300);
  };

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? dressCodeExamples.length - 1 : currentIndex - 1;
    goTo(newIndex, 'prev');
  };

  const handleNext = () => {
    const newIndex = currentIndex === dressCodeExamples.length - 1 ? 0 : currentIndex + 1;
    goTo(newIndex, 'next');
  };

  const current = dressCodeExamples[currentIndex];

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            Dress Code
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inspiration for what to wear on the day
          </p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We kindly ask for our guests to wear a suit or a dress that is tea length or longer.
            Please avoid white and ivory, as these are reserved for the bride.
            Jewel-toned colours are wonderful for the day.
            Fascinators are happily welcomed!
          </p>

          {/* Colour Guidance */}
          <div className="mt-4 mb-12 p-8 bg-cream-50 border-4 border-burgundy-700 text-center rounded-lg shadow-md">
            <p className="text-xl text-gray-700 mb-4 font-semibold">
              <span className="font-bold text-burgundy-900">Please avoid:</span> red, white, burgundy, all black, and trainers.
              Navy, charcoal, emerald, and jewel tones work wonderfully.
              Feel free to bring comfortable shoes to change into after the meal.
            </p>
          </div>

          {/* Carousel */}
          <div className="flex flex-col items-center">
            {/* Image + nav */}
            <div className="relative w-full max-w-sm flex items-center gap-4">
              {/* Prev button */}
              <button
                onClick={handlePrev}
                aria-label="Previous look"
                className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-burgundy-700 text-burgundy-700 flex items-center justify-center hover:bg-burgundy-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Image */}
              <div
                className="flex-1 aspect-[3/4] overflow-hidden rounded-lg shadow-lg"
                style={{
                  opacity: animating ? 0 : 1,
                  transform: animating
                    ? direction === 'next' ? 'translateX(12px)' : 'translateX(-12px)'
                    : 'translateX(0)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                <Image
                  src={current.imagePath}
                  alt = {"image"}
                  width={400}
                  height={533}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                aria-label="Next look"
                className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-burgundy-700 text-burgundy-700 flex items-center justify-center hover:bg-burgundy-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-6">
              {dressCodeExamples.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > currentIndex ? 'next' : 'prev')}
                  aria-label={`Go to look ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none ${
                    i === currentIndex
                      ? 'bg-burgundy-700 w-4'
                      : 'bg-burgundy-200 hover:bg-burgundy-400'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="mt-3 text-sm text-gray-400 tracking-wide">
              {currentIndex + 1} / {dressCodeExamples.length}
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

      <Footer />
    </main>
  );
}
