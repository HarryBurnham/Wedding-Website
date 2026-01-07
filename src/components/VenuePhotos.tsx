'use client';

import { useState, useEffect } from 'react';

interface VenuePhotosProps {
  photos: string[];
}

export default function VenuePhotos({ photos }: VenuePhotosProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 3000); // rotate every 3 seconds

    return () => clearInterval(interval);
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="w-full h-96 relative overflow-hidden rounded-xl shadow-lg">
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={`Venue photo ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}