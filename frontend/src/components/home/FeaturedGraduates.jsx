import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiHeart } from 'react-icons/hi';
import { graduateAPI } from '../../utils/api';
import { getInitials } from '../../utils/helpers';
import SafeImage from '../common/SafeImage';
import { CardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';



const FeaturedGraduates = () => {
  const [graduates, setGraduates] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await graduateAPI.getFeatured();
        setGraduates(data);
      } catch {
        setGraduates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-3">
              Featured{' '}
              <span className="gradient-text">Graduates</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Celebrating outstanding members of our alumni community
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-xl bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-primary-600 transition-all duration-300"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-xl bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-primary-600 transition-all duration-300"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : graduates.length === 0 ? (
          <EmptyState
            title="No featured graduates yet"
            description="Featured graduates will appear here once approved"
          />
        ) : (
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {graduates.map((grad, index) => (
              <motion.div
                key={grad._id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-shrink-0 w-72 snap-start"
              >
                <Link to={`/graduate/${grad._id}`} className="block group">
                  <div className="card overflow-hidden">
                    <div className="relative h-48">
                      <SafeImage
                        src={grad.coverPhoto}
                        alt=""
                        initials={getInitials(grad.fullName)}
                        className="w-full h-full"
                        imgClassName="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-lg flex-shrink-0">
                            <SafeImage
                              src={grad.profilePhoto}
                              alt={grad.fullName}
                              initials={getInitials(grad.fullName)}
                              className="w-full h-full rounded-full"
                            />
                          </div>
                          <div className="text-white min-w-0">
                            <h3 className="font-semibold text-sm leading-tight truncate">
                              {grad.fullName}
                            </h3>
                            <p className="text-xs text-white/80 truncate">
                              {grad.department}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                          Class of {grad.graduationYear}
                        </span>
                        {grad.quote && (
                          <span className="text-xs text-gray-400 italic truncate ml-2">
                            &ldquo;{grad.quote.substring(0, 30)}&rdquo;
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {grad.biography || 'No biography provided'}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <HiHeart className="w-4 h-4" />
                          <span>{grad.likes?.length || 0}</span>
                        </div>
                        <span className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                          View Profile
                          <HiArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedGraduates;
