import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import { toast } from 'react-toastify';
import MemoryCard from './MemoryCard';
import MemoryForm from './MemoryForm';
import { memoryAPI } from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import Loader from '../common/Loader';



const MemoryWall = () => {
  const { user, isAdmin } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const likedRef = useRef(new Set());
  const [, forceRender] = useState(0);

  const fetchMemories = async (p = 1) => {
    try {
      const { data } = await memoryAPI.getAll({ page: p, limit: 12 });
      if (p === 1) {
        setMemories(data.memories || []);
      } else {
        setMemories((prev) => [...prev, ...(data.memories || [])]);
      }
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleLike = async (id) => {
    try {
      await memoryAPI.like(id);
      const set = likedRef.current;
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      forceRender((n) => n + 1);
      setMemories((prev) =>
        prev.map((m) => {
          if (m._id === id) {
            const liked = set.has(id);
            return {
              ...m,
              likes: liked
                ? [...(m.likes || []), 'temp']
                : (m.likes || []).slice(0, -1),
            };
          }
          return m;
        })
      );
    } catch {
    }
  };

  const handleEdit = async (id, message) => {
    try {
      const { data } = await memoryAPI.edit(id, message);
      setMemories((prev) =>
        prev.map((m) => (m._id === id ? { ...m, message: data.message, edited: true, updatedAt: data.updatedAt } : m))
      );
      toast.success('Memory updated successfully');
    } catch {
      toast.error('Failed to update memory');
    }
  };

  const handleMemoryAdded = (memory) => {
    setMemories((prev) => [memory, ...prev]);
  };

  const loadMore = () => {
    if (page < totalPages) {
      fetchMemories(page + 1);
    }
  };

  return (
    <div>
      {!isAdmin && <MemoryForm onMemoryAdded={handleMemoryAdded} />}

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory, index) => (
              <MemoryCard
                key={memory._id}
                memory={memory}
                index={index}
                onLike={handleLike}
                liked={likedRef.current.has(memory._id)}
                isOwner={user ? (memory.user?._id || memory.user)?.toString() === user._id.toString() : false}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {page < totalPages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
              >
                Load More Memories
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryWall;
