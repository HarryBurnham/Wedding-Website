'use client';

import { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/lib/constants';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const difference = WEDDING_CONFIG.weddingDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-8 md:gap-16">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
          <div key={label} className="countdown-item">
            <span className="countdown-number animate-pulse-gentle">--</span>
            <span className="countdown-label">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-8 md:gap-16">
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="countdown-label">Minutes</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  );
}
