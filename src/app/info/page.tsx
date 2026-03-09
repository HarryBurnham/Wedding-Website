'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface DressCodeExample {
  label: string;
  description: string;
  imagePath: string;
}

const mensDressCode: DressCodeExample[] = [
  {
    label: 'Navy Suit',
    description: 'Navy suit with a dress shirt and tie – a timeless choice.',
    imagePath: '/images/dress-code/Mens_suit_1.jpg',
  },
  {
    label: 'Green Suit',
    description: 'A warm earth-toned suit with a coordinating waistcoat for added sophistication.',
    imagePath: '/images/dress-code/Mens_suit_2.jpg',
  },
];

const womensDressCode: DressCodeExample[] = [
  {
    label: 'Navy Dress',
    description: 'An elegant knee-length wrap dress in navy – simple and sophisticated.',
    imagePath: '/images/dress-code/Womens_dress_1.jpg',
  },
  {
    label: 'Emerald Gown',
    description: 'A full-length gown in rich emerald – perfect if you\'d like something more dramatic.',
    imagePath: '/images/dress-code/Womens_dress_2.jpg',
  },
];

export default function Info() {
  const [currentMainsIndex, setCurrentMainsIndex] = useState(0);

  useEffect(() => {
    document.title = 'Harry & Adia Wedding | Info';
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
            We kindly ask that you wear a suit or a dress at knee-length or below. 
            Please avoid white and ivory, as these are reserved for the bride.
          </p>

          {/* Men's Examples */}
          <div className="mb-16">
            <h3 className="font-display text-2xl text-burgundy-900 mb-6 text-center">
              For the Gentlemen
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {mensDressCode.map((item, index) => (
                <div key={index} className="text-center">
                  {/* Image */}
                  <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={item.imagePath}
                      alt={`${item.label} - ${item.description}`}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority={index === 0}
                    />
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
                  {/* Image */}
                  <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={item.imagePath}
                      alt={`${item.label} - ${item.description}`}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority={index === 0}
                    />
                  </div>
                  <h4 className="font-display text-xl text-burgundy-900 mb-2">{item.label}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colour Guidance */}
          <div className="mt-12 p-8 bg-cream-50 border-4 border-burgundy-700 text-center rounded-lg shadow-md">
            <p className=" text-xl text-gray-700 mb-4 font-semibold">
              <span className="font-bold text-burgundy-900">Please avoid:</span> red, white, burgundy, all black, and trainers. 
              Navy, charcoal, emerald, and jewel tones work wonderfully. 
              Feel free to bring comfortable trainers to change into after the meal.
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
