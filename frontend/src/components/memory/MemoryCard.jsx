import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiPencil, HiCheck } from 'react-icons/hi';
import { getInitials } from '../../utils/helpers';

const MemoryCard = ({ memory, index = 0, onLike, liked = false, isOwner = false, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(memory.message);

  const handleSaveEdit = () => {
    if (!editMessage.trim() || editMessage.trim() === memory.message) {
      setEditing(false);
      return;
    }
    if (onEdit) onEdit(memory._id, editMessage.trim());
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditMessage(memory.message);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
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
          {memory.graduate?.department && (
            <p className="text-sm text-gray-500 truncate">
              {memory.graduate.department} &middot; Class of {memory.graduate.graduationYear}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {memory.edited && (
            <span className="text-xs text-gray-400 italic">edited</span>
          )}
          <span className="text-4xl text-gold-200 group-hover:text-gold-300 transition-colors leading-none">
            &ldquo;
          </span>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 mb-4">
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            className="input-field resize-none"
            rows={3}
            maxLength={300}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{editMessage.length}/300</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editMessage.trim()}
                className="px-4 py-1.5 bg-primary-600 text-white text-sm rounded-xl font-medium hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center space-x-1"
              >
                <HiCheck className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 leading-relaxed italic mb-4">
          {memory.message}
        </p>
      )}

      <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-gray-400">
          <HiHeart className="w-4 h-4" />
          <span>{memory.likes?.length || 0}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isOwner && !editing && !memory.edited && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <HiPencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
          {onLike && (
            <button
              onClick={() => onLike(memory._id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                liked
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {liked ? 'Liked' : 'Like'}
            </button>
          )}
        </div>
        <span className="text-gray-400 text-xs">
          {new Date(memory.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default MemoryCard;
