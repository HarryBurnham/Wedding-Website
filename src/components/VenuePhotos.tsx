'use client';

import { useState, useEffect, useRef } from 'react';

interface VenuePhotosProps {
  photos: string[];
}

export default function VenuePhotos({ photos }: VenuePhotosProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [photos]);

  const handleImageLoad = () => {
    if (imgRef.current) {
      setHeight(imgRef.current.offsetHeight);
    }
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div 
      className="w-full max-w-4xl mx-auto relative overflow-hidden rounded-xl shadow-lg"
      style={{ height: height ? `${height}px` : 'auto' }}
    >
      {photos.map((photo, index) => (
        <img
          key={index}
          ref={index === 0 ? imgRef : null}
          src={photo}
          alt={`Venue photo ${index + 1}`}
          onLoad={index === 0 ? handleImageLoad : undefined}
          className={`w-full h-auto transition-opacity duration-700 ${
            index === 0 ? 'relative' : 'absolute top-0 left-0'
          } ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
}