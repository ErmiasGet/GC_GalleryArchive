import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph, HiFilter } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { batchPhotoAPI } from '../utils/api';
import BatchPhotoGrid from '../components/gallery/BatchPhotoGrid';
import BatchPhotoUploader from '../components/gallery/BatchPhotoUploader';
import useAuth from '../hooks/useAuth';



const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'department', label: 'Department' },
  { value: 'campus', label: 'Campus' },
  { value: 'group', label: 'Group' },
  { value: 'other', label: 'Other' },
];

const BatchGalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploader, setShowUploader] = useState(false);
  const { isAdmin } = useAuth();

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (selectedCategory) params.category = selectedCategory;
      const res = await batchPhotoAPI.getAll(params);
      setPhotos(res.data.photos || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load batch photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [page, selectedCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this batch photo?')) return;
    try {
      await batchPhotoAPI.delete(id);
      toast.success('Photo deleted');
      fetchPhotos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleUploaded = () => {
    setShowUploader(false);
    fetchPhotos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-10 p-12 md:p-16"
        >
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/85 to-transparent" />
          <div className="relative text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 mb-4 shadow-xl">
              <HiPhotograph className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
              Batch Gallery
            </h1>
            <p className="text-gray-300 max-w-xl">
              Browse graduation photos — ceremonies, departments, campus life, and group memories of the Class of 2026
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1" />

          <div className="flex items-center space-x-2">
            <HiFilter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="input py-2 pr-8"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="btn-primary whitespace-nowrap"
            >
              {showUploader ? 'Cancel' : 'Upload Photo'}
            </button>
          )}
        </div>

        {showUploader && isAdmin && (
          <div className="mb-8 max-w-lg mx-auto">
            <BatchPhotoUploader onUploaded={handleUploaded} />
          </div>
        )}

        <BatchPhotoGrid
          photos={photos}
          loading={loading}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchGalleryPage;
