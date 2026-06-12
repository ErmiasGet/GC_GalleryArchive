import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiEye, HiStar, HiX, HiCheck } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../utils/api';
import { getInitials, getStatusColor, getStatusLabel } from '../../utils/helpers';
import SafeImage from '../common/SafeImage';

const GraduateList = ({ statusFilter, refreshTrigger }) => {
  const [graduates, setGraduates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchGraduates = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const { data } = await adminAPI.getAllGraduates(params);
      setGraduates(data.graduates);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(p);
    } catch {
      setGraduates([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchGraduates(1);
  }, [fetchGraduates, refreshTrigger]);

  const handleToggleFeatured = async (id) => {
    try {
      await adminAPI.toggleFeatured(id);
      setGraduates((prev) =>
        prev.map((g) =>
          g._id === id ? { ...g, isFeatured: !g.isFeatured } : g
        )
      );
      toast.success('Featured status toggled');
    } catch {}
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approve(id);
      toast.success('Graduate approved');
      fetchGraduates(page);
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this graduate from the list?')) return;
    setGraduates((prev) => prev.filter((g) => g._id !== id));
    toast.success('Graduate removed');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-serif font-bold text-gray-900">
          {statusFilter ? `${getStatusLabel(statusFilter)} Graduates` : 'All Graduates'}
          <span className="text-sm font-sans font-normal text-gray-400 ml-2">({total})</span>
        </h2>
        <div className="relative w-full sm:w-72">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 h-10 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : graduates.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400">No {statusFilter || ''} graduates found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {graduates.map((grad, i) => (
              <motion.div
                key={grad._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <SafeImage
                      src={grad.profilePhoto}
                      alt={grad.fullName}
                      initials={getInitials(grad.fullName)}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {grad.fullName}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(grad.status)}`}>
                        {getStatusLabel(grad.status)}
                      </span>
                      {grad.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-700 border border-gold-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {grad.department} &middot; Class of {grad.graduationYear} &middot; ID: {grad.studentId}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      to={`/graduate/${grad._id}`}
                      className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition-all"
                      title="View profile"
                    >
                      <HiEye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(grad._id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        grad.isFeatured
                          ? 'bg-gold-50 text-gold-600 hover:bg-gold-100'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                      title={grad.isFeatured ? 'Remove featured' : 'Mark as featured'}
                    >
                      <HiStar className="w-4 h-4" />
                    </button>
                    {grad.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(grad._id)}
                        className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all"
                        title="Approve"
                      >
                        <HiCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => fetchGraduates(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchGraduates(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GraduateList;
