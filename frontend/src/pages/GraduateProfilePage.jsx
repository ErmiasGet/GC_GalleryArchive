import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiChat, HiCalendar, HiOfficeBuilding, HiIdentification } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { graduateAPI, commentAPI } from '../utils/api';
import GalleryGrid from '../components/gallery/GalleryGrid';
import SafeImage from '../components/common/SafeImage';
import { ProfileSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { getInitials, formatDate } from '../utils/helpers';
import useAuth from '../hooks/useAuth';

const GraduateProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await graduateAPI.getById(id);
        setData(res.graduate);
        setComments(res.comments || []);
        if (user && res.graduate.likes?.includes(user._id)) {
          setLiked(true);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to like profiles');
      return;
    }
    try {
      await graduateAPI.like(id);
      setLiked(!liked);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data: comment } = await commentAPI.add(id, newComment.trim());
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment added!');
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-5xl mx-auto px-4 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24">
        <EmptyState
          title="Graduate not found"
          description="The profile you're looking for doesn't exist or hasn't been approved yet"
        />
      </div>
    );
  }

  const graduate = data;

  return (
    <div className="min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-72 md:h-[400px] overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700"
      >
        <SafeImage
          src={graduate.coverPhoto}
          alt={`${graduate.fullName}'s cover`}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 mb-10 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-36 h-36 rounded-2xl border-4 border-white overflow-hidden shadow-2xl flex-shrink-0 bg-white"
          >
            <SafeImage
              src={graduate.profilePhoto}
              alt={graduate.fullName}
              initials={getInitials(graduate.fullName)}
              className="w-full h-full"
            />
          </motion.div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-600 drop-shadow-lg">
              {graduate.fullName}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center space-x-1.5 text-white/80 text-sm">
                <HiOfficeBuilding className="w-4 h-4" />
                <span>{graduate.department}</span>
              </span>
              <span className="flex items-center space-x-1.5 text-white/80 text-sm">
                <HiCalendar className="w-4 h-4" />
                <span>Class of {graduate.graduationYear}</span>
              </span>
              <span className="flex items-center space-x-1.5 text-white/80 text-sm">
                <HiIdentification className="w-4 h-4" />
                <span>{graduate.studentId}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 ${
                liked
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/10'
              }`}
            >
              <HiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{graduate.likes?.length || 0}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          <div className="lg:col-span-2 space-y-8">
            {graduate.quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-5xl text-gold-400 leading-none font-serif">&ldquo;</span>
                  <div>
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      {graduate.quote}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {graduate.biography && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Biography</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {graduate.biography}
                </p>
              </motion.div>
            )}

            {graduate.favoriteMemory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 border-l-4 border-gold-400"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Favorite University Memory
                </h2>
                <p className="text-gray-600 leading-relaxed italic">
                  {graduate.favoriteMemory}
                </p>
              </motion.div>
            )}

            {graduate.photos?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                  Graduation Gallery
                  <span className="text-sm font-sans font-normal text-gray-400 ml-2">
                    ({graduate.photos.length} photos)
                  </span>
                </h2>
                <GalleryGrid photos={graduate.photos} />
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <HiChat className="w-5 h-5 text-primary-600" />
                <span>Leave a Comment</span>
              </h3>
              {isAuthenticated ? (
                <form onSubmit={handleComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a congratulatory message..."
                    className="input-field resize-none mb-3"
                    rows={3}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all disabled:opacity-50"
                  >
                    Post Comment
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  <a href="/login" className="text-primary-600 font-medium">Sign in</a> to leave a comment
                </p>
              )}
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <HiChat className="w-5 h-5" />
                <span>Comments ({comments.length})</span>
              </h3>
              {comments.length === 0 ? (
                <p className="text-sm text-gray-400">No comments yet</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment._id} className="pb-3 border-b border-gray-100 last:border-0">
                      <p className="text-sm text-gray-600">{comment.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduateProfilePage;
