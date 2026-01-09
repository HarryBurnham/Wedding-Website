'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export const metadata = {
  title: 'Harry Burnham & Adia Shane | FAQ',
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'WHAT IS THE DRESS CODE?',
    answer: 'We kindly request formal attire. Gentlemen are encouraged to wear suits or smart trousers with a jacket. Ladies may wear formal dresses, gowns, or elegant separates. Please avoid white or ivory as these are reserved for the bride.',
  },
  {
    question: 'CAN I BRING A PLUS ONE?',
    answer: 'Due to venue capacity, we are only able to accommodate those guests named on your invitation. If you have been allocated a plus one, this will be indicated on your RSVP. We hope you understand.',
  },
  {
    question: 'ARE CHILDREN INVITED?',
    answer: 'Whilst we love your little ones, we have chosen to make our wedding an adult-only occasion. We hope this gives you the opportunity to let your hair down and enjoy the celebrations!',
  },
  {
    question: 'WHAT TIME SHOULD I ARRIVE?',
    answer: 'Please arrive at least 30 minutes before the ceremony begins to allow time to find your seat and settle in. The ceremony will start promptly, so we recommend arriving by 1:30 PM.',
  },
  {
    question: 'IS THERE PARKING AVAILABLE?',
    answer: 'Yes, there is complimentary parking available at the venue. Please follow signs to the car park upon arrival. For those who prefer not to drive, we recommend booking a taxi in advance - see our Travel page for local taxi numbers.',
  },
  {
    question: 'WILL THERE BE VEGETARIAN/VEGAN OPTIONS?',
    answer: 'Absolutely! We will be offering vegetarian and vegan meal options. Please indicate any dietary requirements when you RSVP, and we will ensure you are catered for.',
  },
  {
    question: 'CAN I TAKE PHOTOS DURING THE CEREMONY?',
    answer: 'We kindly ask that you keep your phones and cameras away during the ceremony so that everyone can be fully present. We have hired a professional photographer who will capture all the special moments. Feel free to take as many photos as you like during the reception!',
  },
  {
    question: 'WHAT HAPPENS IF IT RAINS?',
    answer: 'Don\'t worry - we have a wet weather contingency plan! The venue has beautiful indoor spaces that will be used if the weather doesn\'t cooperate. The celebration will go on regardless!',
  },
  {
    question: 'WHEN IS THE RSVP DEADLINE?',
    answer: 'Please RSVP by 1st August 2026. This helps us finalise numbers with our caterers and ensure everything runs smoothly on the day. You can RSVP through our website using the details on your invitation.',
  },
  {
    question: 'IS THERE ACCOMMODATION NEARBY?',
    answer: 'Yes! We have compiled a list of nearby hotels and B&Bs on our Travel & Accommodation page. Some have special rates for wedding guests - check the page for booking codes.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-900 mb-6">
            FAQ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our special day.
          </p>
          <div className="divider">
            <span className="text-burgundy-700">♦</span>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-burgundy-900 bg-white">
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-cream-50 transition-colors"
                >
                  <span className="font-display text-lg tracking-wide text-burgundy-900">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <svg 
                      className="w-6 h-6 text-burgundy-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Still have questions? We'd love to hear from you.
            </p>
            <a href="/contact" className="btn-primary inline-block">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
