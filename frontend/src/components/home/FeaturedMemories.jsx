import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import { memoryAPI } from '../../utils/api';
import { CardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { getInitials } from '../../utils/helpers';



const sortByLikes = (list) =>
  [...list].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 6);

const FeaturedMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const { data } = await memoryAPI.getAll({ limit: 50 });
        setMemories(sortByLikes(data.memories || []));
      } catch {
        setMemories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  const displayMemories = sortByLikes(memories);

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Heartfelt{' '}
            <span className="gradient-text">Memories</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Words of wisdom and cherished moments shared by our alumni
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMemories.map((memory, index) => (
              <motion.div
                key={memory._id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card p-6 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold">
                      {getInitials(memory.graduate?.fullName)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {memory.graduate?.fullName || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Class of {memory.graduate?.graduationYear || 'N/A'}
                    </p>
                  </div>
                  <span className="text-4xl text-gold-200 group-hover:text-gold-300 transition-colors">
                    &ldquo;
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed italic mb-4">
                  {memory.message}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <HiHeart className="w-4 h-4" />
                    <span>{memory.likes?.length || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMemories;
