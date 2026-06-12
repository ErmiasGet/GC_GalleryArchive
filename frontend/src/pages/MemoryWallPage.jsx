import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import MemoryWall from '../components/memory/MemoryWall';

const MemoryWallPage = () => {
  return (
    <div className="min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <HiHeart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Memory{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400">
              Wall
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Share your favorite university memories and read heartfelt messages from fellow alumni
          </p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MemoryWall />
      </div>
    </div>
  );
};

export default MemoryWallPage;
