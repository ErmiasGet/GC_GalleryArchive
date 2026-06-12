import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import SafeImage from '../common/SafeImage';

const ImageCard = ({ photo, index, onClick, liked = false, onLike, likesCount = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="aspect-[3/4]">
        <SafeImage
          src={photo.url || photo}
          alt={photo.caption || 'Graduation photo'}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        {photo.caption && (
          <p className="absolute bottom-12 left-4 right-4 text-white text-sm font-medium">
            {photo.caption}
          </p>
        )}
        {onLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm hover:bg-white/30 transition-all pointer-events-auto"
          >
            <HiHeart className={`w-4 h-4 ${liked ? 'fill-current text-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ImageCard;
