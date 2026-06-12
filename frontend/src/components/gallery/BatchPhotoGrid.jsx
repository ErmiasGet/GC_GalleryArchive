import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph, HiTag, HiCalendar, HiTrash } from 'react-icons/hi';
import SafeImage from '../common/SafeImage';
import Lightbox from './Lightbox';
import EmptyState from '../common/EmptyState';
import { GallerySkeleton } from '../common/Skeleton';

const categoryLabels = {
  ceremony: 'Ceremony',
  department: 'Department',
  campus: 'Campus',
  group: 'Group',
  other: 'Other',
};

const BatchPhotoGrid = ({ photos, loading, onDelete, isAdmin }) => {
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
        title="No batch photos yet"
        description="Batch-wide graduation photos will appear here"
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
              src={photo.url}
              alt={photo.caption || `Batch photo ${photo.graduationYear}`}
              className="w-full h-full"
              imgClassName="group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-3 left-3 right-3 space-y-1">
                <div className="flex items-center space-x-2 text-white/80 text-xs">
                  <HiCalendar className="w-3 h-3" />
                  <span>{photo.graduationYear}</span>
                  <HiTag className="w-3 h-3 ml-1" />
                  <span>{categoryLabels[photo.category] || photo.category}</span>
                </div>
                {photo.caption && (
                  <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                )}
              </div>
            </div>
            {isAdmin && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo._id);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            )}
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

export default BatchPhotoGrid;
