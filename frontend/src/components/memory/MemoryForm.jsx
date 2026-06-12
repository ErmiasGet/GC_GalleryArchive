import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiPaperAirplane, HiExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { memoryAPI, graduateAPI } from '../../utils/api';
import useAuth from '../../hooks/useAuth';

const MemoryForm = ({ onMemoryAdded }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      graduateAPI.getMyProfile()
        .then(() => setHasProfile(true))
        .catch(() => setHasProfile(false));
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await memoryAPI.add(message.trim());
      toast.success('Memory shared!');
      setMessage('');
      if (onMemoryAdded) onMemoryAdded(data);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;
  if (hasProfile === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <HiExclamationCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Create Your Profile First</h3>
            <p className="text-sm text-gray-500">You need a graduate profile to share memories</p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 mb-8"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <HiHeart className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900">Share a Memory</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's your favorite university memory?"
          className="input-field resize-none mb-3"
          rows={3}
          maxLength={300}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{message.length}/300</span>
          <button
            type="submit"
            disabled={!message.trim() || submitting}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-gold-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/25 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
          >
            <HiPaperAirplane className="w-4 h-4" />
            <span>{submitting ? 'Sharing...' : 'Share Memory'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default MemoryForm;
