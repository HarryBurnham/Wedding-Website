import { useState, useEffect } from 'react';

interface VenuePhotosProps {
  photos: string[];
  autoRotateInterval?: number; // optional, in milliseconds
}

export default function VenuePhotos({
  photos,
  autoRotateInterval = 5000, // default 5 seconds
}: VenuePhotosProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const prevPhoto = () =>
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  const nextPhoto = () =>
    setCurrentIndex((currentIndex + 1) % photos.length);

  // Auto-rotation effect
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, autoRotateInterval);

    return () => clearInterval(interval); // cleanup on close/unmount
  }, [isOpen, autoRotateInterval, photos.length]);

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {photos.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Venue photo ${index + 1}`}
            className="w-full h-48 object-cover rounded shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-2xl font-bold z-50"
          >
            ×
          </button>

          {/* Previous */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white text-3xl font-bold z-50"
          >
            ‹
          </button>

          {/* Current Photo */}
          <img
            src={photos[currentIndex]}
            alt={`Venue photo ${currentIndex + 1}`}
            className="max-w-4xl max-h-[90vh] rounded shadow-lg"
          />

          {/* Next */}
          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white text-3xl font-bold z-50"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}