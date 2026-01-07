interface VenuePhotosProps {
  photos: string[];
}

export default function VenuePhotos({ photos }: VenuePhotosProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {photos.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Venue photo ${index + 1}`}
          className="w-full h-48 object-cover rounded shadow"
        />
      ))}
    </div>
  );
}