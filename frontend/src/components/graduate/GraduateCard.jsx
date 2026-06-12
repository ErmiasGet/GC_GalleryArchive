import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiHeart } from 'react-icons/hi';
import { getInitials } from '../../utils/helpers';
import SafeImage from '../common/SafeImage';

const GraduateCard = ({ graduate, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/graduate/${graduate._id}`} className="block group">
        <div className="card overflow-hidden">
          <div className="relative h-56">
            <SafeImage
              src={graduate.coverPhoto}
              alt=""
              initials={getInitials(graduate.fullName)}
              className="w-full h-full"
              imgClassName="group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-lg flex-shrink-0">
                <SafeImage
                  src={graduate.profilePhoto}
                  alt={graduate.fullName}
                  initials={getInitials(graduate.fullName)}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="text-white min-w-0">
                <h3 className="font-semibold leading-tight truncate">
                  {graduate.fullName}
                </h3>
                <p className="text-sm text-white/80 truncate">
                  {graduate.department}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Class of {graduate.graduationYear}
              </span>
              {graduate.quote && (
                <span className="text-xs text-gray-400 italic truncate">
                  &ldquo;{graduate.quote.substring(0, 25)}&rdquo;
                </span>
              )}
            </div>
            {graduate.biography && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {graduate.biography.substring(0, 100)}
              </p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <HiHeart className="w-4 h-4" />
                <span>{graduate.likes?.length || 0}</span>
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
  );
};

export default GraduateCard;
