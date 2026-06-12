import { useState, useRef, useCallback } from 'react';
import { HiSave, HiUpload } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { graduateAPI, uploadAPI } from '../../utils/api';
import { departments } from '../../utils/helpers';
import SafeImage from '../common/SafeImage';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    toast.error(`File too large (${mb}MB). Maximum size is 20MB.`);
    return false;
  }
  return true;
};

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

const DropZone = ({ onFiles, uploading, disabled }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) onFiles(files);
  }, [onFiles]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex items-center justify-center h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
        dragging
          ? 'border-primary-500 bg-primary-50 scale-[1.02]'
          : uploading
          ? 'border-primary-400 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <div className="text-center pointer-events-none">
        <HiUpload className={`w-6 h-6 mx-auto mb-1 ${uploading ? 'text-primary-500 animate-pulse' : dragging ? 'text-primary-500' : 'text-gray-400'}`} />
        <span className="text-xs text-gray-500">
          {uploading ? 'Uploading...' : 'Drop images here or click (max 10)'}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files);
          if (files.length > 0) onFiles(files);
          e.target.value = '';
        }}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

const GraduateForm = ({ graduate, onUpdate }) => {
  const [form, setForm] = useState({
    fullName: graduate?.fullName || '',
    studentId: graduate?.studentId || '',
    department: graduate?.department || '',
    graduationYear: graduate?.graduationYear || 2026,
    quote: graduate?.quote || '',
    biography: graduate?.biography || '',
    favoriteMemory: graduate?.favoriteMemory || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await graduateAPI.updateMyProfile(form);
      onUpdate(data);
      toast.success('Profile updated successfully! Please submit for approval.');
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFileSize(file)) {
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === 'profile') setProfilePreview(previewUrl);
    else setCoverPreview(previewUrl);

    setUploading(true);
    setUploadProgress(0);
    try {
      const uploadFn = type === 'profile' ? uploadAPI.profilePhoto : uploadAPI.coverPhoto;
      const { data } = await uploadFn(file, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(pct);
      });
      onUpdate(data.graduate);
      setProfilePreview(null);
      setCoverPreview(null);
      toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} photo uploaded`);
    } catch {
      toast.error(`${type === 'profile' ? 'Profile' : 'Cover'} photo upload failed`);
      if (type === 'profile') setProfilePreview(null);
      else setCoverPreview(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGalleryFiles = async (files) => {
    const validFiles = files.filter((f) => validateFileSize(f));
    if (validFiles.length === 0) return;

    const previews = validFiles.map((f) => URL.createObjectURL(f));
    setGalleryPreviews((prev) => [...prev, ...previews]);

    setUploading(true);
    setUploadProgress(0);
    try {
      const { data } = await uploadAPI.gallery(validFiles, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(pct);
      });
      onUpdate(data.graduate);
      setGalleryPreviews([]);
      toast.success(`${validFiles.length} photo${validFiles.length > 1 ? 's' : ''} uploaded`);
    } catch {
      toast.error('Gallery upload failed');
      setGalleryPreviews([]);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    await handleGalleryFiles(files);
    e.target.value = '';
  };

  const handleSubmitForApproval = async () => {
    try {
      const { data } = await graduateAPI.submitForApproval();
      onUpdate(data.graduate);
      toast.success('Profile submitted for approval!');
    } catch {
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-6">
            <h3 className="font-semibold text-gray-900">Photos</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Profile Photo</label>
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto bg-gray-100 shadow-md">
                  <SafeImage
                    src={profilePreview || graduate?.profilePhoto}
                    alt="Profile"
                    initials="PH"
                    className="w-full h-full"
                  />
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <div className="text-center text-white">
                    <HiUpload className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Change'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'profile')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <UploadProgress progress={uploadProgress} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cover Photo</label>
              <div className="relative group cursor-pointer">
                <div className="h-28 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                  <SafeImage
                    src={coverPreview || graduate?.coverPhoto}
                    alt="Cover"
                    className="w-full h-full"
                  />
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <div className="text-center text-white">
                    <HiUpload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Change'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'cover')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <UploadProgress progress={uploadProgress} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gallery Photos</label>
              <DropZone
                onFiles={handleGalleryFiles}
                uploading={uploading}
                disabled={uploading}
              />
              <UploadProgress progress={uploadProgress} />
            </div>

            {galleryPreviews.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2 flex items-center justify-between">
                  <span>Preview ({galleryPreviews.length})</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {galleryPreviews.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-full h-16 rounded-lg shadow-sm object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {graduate?.photos?.length > 0 && galleryPreviews.length === 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2 flex items-center justify-between">
                  <span>Uploaded photos</span>
                  <span className="font-medium text-gray-700">{graduate.photos.length}</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {graduate.photos.slice(0, 9).map((photo, i) => (
                    <SafeImage
                      key={i}
                      src={photo.url || photo}
                      alt=""
                      className="w-full h-16 rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-6">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="STU-2020-0001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <div className="input-field bg-gray-50 text-gray-500 flex items-center">
                  Class of 2026
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="font-semibold text-gray-900">Memories & Legacy</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Verse / Quote
              </label>
              <textarea
                name="quote"
                value={form.quote}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Share a meaningful quote or verse..."
                maxLength={300}
              />
              <p className="text-xs text-gray-400 mt-1">{form.quote.length}/300</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biography
              </label>
              <textarea
                name="biography"
                value={form.biography}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about your journey..."
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1">{form.biography.length}/1000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Favorite University Memory
              </label>
              <textarea
                name="favoriteMemory"
                value={form.favoriteMemory}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="What's your most cherished memory from university?"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">{form.favoriteMemory.length}/500</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
              <HiSave className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            {graduate?.status !== 'approved' && (
              <button
                type="button"
                onClick={handleSubmitForApproval}
                disabled={graduate?.status === 'pending'}
                className="btn-gold"
              >
                {graduate?.status === 'pending' ? 'Already Submitted' : 'Submit for Approval'}
              </button>
            )}
          </div>

          {graduate?.adminNote && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>Admin Note:</strong> {graduate.adminNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default GraduateForm;
