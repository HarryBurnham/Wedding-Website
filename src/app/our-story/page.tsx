import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'Harry & Adia | Our Story',
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
              <p className="mb-6 text-center">
                Harry and I first met at De Montfort University in 2019 during a freshers' week Korfball training session, where we were the only new players to join that year. For the first few weeks, we only saw each other at training sessions, where we had a fun time competing to see who could score from the furthest spot and other fun games.

                After a few weeks, we went out for our first team social, where we exchanged details and started chatting. That night was great, and we began hanging out more, going shopping in the city, gaming in common rooms, and taking trips to the pub with friends.

                Our relationship started shortly after, luckily just before the COVID lockdowns, and we have been happily together ever since. What started as a chance meeting at training has grown into the life we’re building together today.
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
              <p className="mb-6 text-center">
                Over the past 6 years, we have built an incredible life together and grown through so many important moments side by side. We graduated university together and made it through the challenges of the Covid lockdowns, supporting each other every step of the way. We have travelled across Europe and the US, creating memories we’ll always cherish, and have even bought our first home together.

                In between all of that, we have continued playing Korfball, enjoyed going to Nottingham Panthers games, watched countless F1 races, and, most importantly, have simply loved spending time together. It’s the everyday moments, as much as the big milestones, that have made our life together so special.
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
              <p className="mb-6 text-center">
                Harry proposed on a warm June evening in 2023, while we were in the Mediterranean Sea on a cruise on our way to Santorini. As the sun was setting, he took me out to one of the decks for photos, and then got down on one knee and asked me to marry him.

                Surprisingly, I didn’t cry, but of course, I said yes. We immediately called our parents to share the news, and we’ve been in wedding planning mode ever since. Every moment of this journey has felt so special, simply because we’re doing it together and we can’t wait for everything still to come.
              </p>
            </div>
          </div>

          {/* Photo */}
          <div className="mt-16 text-center">
            <div className="aspect-[4/3] max-w-2xl mx-auto overflow-hidden border border-burgundy-100">
              <Image
                src="/images/our-story/us.jpg"
                alt="Harry and Adia"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}
