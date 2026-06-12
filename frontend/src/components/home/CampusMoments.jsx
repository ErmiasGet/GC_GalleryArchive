import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { HiPhotograph, HiArrowRight } from 'react-icons/hi';
import { batchPhotoAPI } from '../../utils/api';
import BatchPhotoGrid from '../gallery/BatchPhotoGrid';



const CameraSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="22" width="80" height="58" rx="10" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    <circle cx="50" cy="52" r="20" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    <circle cx="50" cy="52" r="10" fill="currentColor" opacity="0.25" />
    <rect x="65" y="16" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    <circle cx="22" cy="32" r="3" fill="currentColor" opacity="0.3" />
    <path d="M30 52L40 62L70 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
  </svg>
);

const CampusMoments = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await batchPhotoAPI.getAll({ limit: 8 });
        setPhotos(res.data.photos || []);
      } catch {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <section ref={ref} className="relative section-padding bg-gray-50 overflow-hidden">
      <CameraSVG className="absolute top-10 right-10 w-72 h-72 text-primary-700 -rotate-12" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <HiPhotograph className="w-4 h-4" />
              <span>Class of 2026 Gallery</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-3">
              Campus{' '}
              <span className="gradient-text">Moments</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Relive the unforgettable moments from your graduation journey
            </p>
          </div>
          <Link
            to="/batch-gallery"
            className="hidden md:inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-300"
          >
            <span>View Full Gallery</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <BatchPhotoGrid
          photos={photos}
          loading={loading}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-10 md:hidden"
        >
          <Link
            to="/batch-gallery"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-50 text-primary-600 font-medium rounded-xl hover:bg-primary-100 transition-all"
          >
            <span>View Full Gallery</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CampusMoments;
