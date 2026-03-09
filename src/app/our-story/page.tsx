import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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
              <p className="mb-6">
                {/* Claude Example: Harry and I first met at university in 2016 during freshers' week at a house party 
                  in Nottingham. I was immediately drawn to his dry sense of humour and passion for 
                  ice hockey – he spent half the evening trying to explain the rules of korfball to 
                  me! We exchanged numbers but didn't talk for weeks. Then, completely by chance, 
                  we bumped into each other at the Students' Union and decided to grab a coffee. 
                  That coffee turned into dinner, and we've been inseparable ever since. */}
                We first met at DMU in 2019 Freshers' week at a Korfball society tryout. 
                something about snapchat on a Korfball night out. 
                We've been inseparable since
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
                {/* Claude Example: Over the past eight years, we've built an incredible life together. We've had 
                 countless adventures – from watching the Nottingham Panthers play at the Motorpoint 
                 Arena to exploring cities across Europe during our holidays. We've supported each 
                 other through career changes (Harry's move into DevOps was a big transition!), 
                 celebrated promotions, and cheered each other on through challenges. We've discovered 
                 a shared love of competitive games – screaming at the NHL while watching matches together. But our favourite moments are the simple 
                 ones: lazy Sunday mornings, planning future trips, and laughing at inside jokes only 
                 we understand. We genuinely can't wait to marry our best friend. */}
                Over the past 6 years, we've built an incredible life together. We've had 
                countless adventures – from watching the Nottingham Panthers play at the Motorpoint 
                Arena to exploring cities across Europe during our holidays.
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
                {/* Claude Example: Harry proposed on a cold December evening in 2024 at Ashby-de-la-Zouch, the location 
                  that would become so special to us. We'd been looking at venues together (very unromantic, 
                  I know!), and Harry suggested we visit one more. As we walked through the gardens at 
                  sunset, he got down on one knee and asked me to marry him. I was completely surprised – 
                  I thought I'd planned the perfect venue hunt, but he'd managed to keep the most important 
                  part a secret! Through happy tears, I said yes. We immediately called our parents to tell 
                  them the news, and we've been in wedding planning mode ever since. Every moment of this 
                  journey has felt special because we're doing it together. */}
                Harry proposed on a warm June evening in 2023 in the Mediterranean Sea on a cruise on our way to Santorini. 
                During sunset, he got down on one knee and asked me to marry him. Surprisingly I didn't cry, I said yes. 
                We immediately called our parents to tell them the news, and we've been in wedding planning mode ever since. 
                Every moment of this journey has felt special because we're doing it together.
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
