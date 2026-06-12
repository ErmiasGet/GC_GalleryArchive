import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { batchPhotoAPI } from '../../utils/api';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const categoryOptions = [
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'department', label: 'Department' },
  { value: 'campus', label: 'Campus' },
  { value: 'group', label: 'Group' },
  { value: 'other', label: 'Other' },
];

const UploadProgress = ({ progress }) => {
  if (progress === 0 || progress === 100) return null;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
      <div
        className="bg-primary-500 h-full rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const BatchPhotoUploader = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('other');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      toast.error('File too large. Maximum size is 20MB.');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      await batchPhotoAPI.upload(file, { graduationYear: 2026, caption, category }, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(pct);
      });
      toast.success('Batch photo uploaded');
      handleRemove();
      setCaption('');
      setCategory('other');
      if (onUploaded) onUploaded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Batch Photo</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!preview ? (
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all">
            <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Click to select an image (max 20MB)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}

        <UploadProgress progress={uploadProgress} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <HiPhotograph className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiUpload className="w-5 h-5" />
          )}
          <span>{uploading ? `Uploading... ${uploadProgress}%` : 'Upload Photo'}</span>
        </button>
      </form>
    </motion.div>
  );
};

export default BatchPhotoUploader;
