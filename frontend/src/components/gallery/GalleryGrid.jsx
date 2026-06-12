import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph } from 'react-icons/hi';
import Lightbox from './Lightbox';
import SafeImage from '../common/SafeImage';
import EmptyState from '../common/EmptyState';
import { GallerySkeleton } from '../common/Skeleton';

const GalleryGrid = ({ photos, loading = false }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (direction) => {
    setCurrentIndex((prev) => {
      if (direction === 'prev') return prev === 0 ? photos.length - 1 : prev - 1;
      return prev === photos.length - 1 ? 0 : prev + 1;
    });
  };

  if (loading) return <GallerySkeleton />;

  if (!photos || photos.length === 0) {
    return (
      <EmptyState
        icon={HiPhotograph}
        title="No photos yet"
        description="Gallery photos will appear here once uploaded"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo._id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => openLightbox(index)}
          >
            <SafeImage
              src={photo.url || photo}
              alt={photo.caption || 'Graduation photo'}
              className="w-full h-full"
              imgClassName="group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {photo.caption && (
                <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium">
                  {photo.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={photos}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={navigate}
        />
      )}
    </>
  );
};

export default GalleryGrid;
