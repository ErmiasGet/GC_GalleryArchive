import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight, HiZoomIn, HiZoomOut, HiDownload } from 'react-icons/hi';

const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  const [scale, setScale] = useState(1);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    },
    [onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setScale(1);
  }, [currentIndex]);

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-white/70 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.5, 3))}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <HiZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.5, 0.5))}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <HiZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-red-500/80 transition-all"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <HiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <HiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl max-h-[85vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.url || currentImage}
            alt={currentImage.caption || ''}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            style={{ transform: `scale(${scale})`, transition: 'transform 0.3s' }}
          />
          {currentImage.caption && (
            <p className="text-white/70 text-center mt-4 text-sm">
              {currentImage.caption}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
