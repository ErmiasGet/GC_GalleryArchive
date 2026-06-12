import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOfficeBuilding, HiUserGroup } from 'react-icons/hi';
import GraduateCard from '../components/graduate/GraduateCard';
import GraduateSearch from '../components/graduate/GraduateSearch';
import { graduateAPI } from '../utils/api';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';

const Archive = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [graduates, setGraduates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGraduates = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.department) params.department = filters.department;

      const { data } = await graduateAPI.getAll(params);
      if (p === 1) {
        setGraduates(data.graduates);
      } else {
        setGraduates((prev) => [...prev, ...data.graduates]);
      }
      setTotalPages(data.totalPages);
      setPage(p);
    } catch {
      setGraduates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await graduateAPI.getStatistics();
        setStats(data);
      } catch {}
    };
    fetchStats();
  }, []);

  useEffect(() => {
    fetchGraduates(1);
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.department) params.set('department', newFilters.department);
    setSearchParams(params);
  };

  const loadMore = () => {
    if (page < totalPages) {
      fetchGraduates(page + 1);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=1400&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-primary-900/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Graduation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
              Archive
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore the Class of 2026 alumni directory. Search by name, department, or graduation year.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GraduateSearch onSearch={handleSearch} initialFilters={filters} />

        {stats && !filters.search && !filters.department && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="card p-4 flex items-center space-x-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center">
                <HiOfficeBuilding className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
                <p className="text-sm text-gray-500">Departments</p>
              </div>
            </div>
            <div className="card p-4 flex items-center space-x-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <HiUserGroup className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGraduates}</p>
                <p className="text-sm text-gray-500">Graduates</p>
              </div>
            </div>
          </div>
        )}

        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton count={8} />
          </div>
        ) : graduates.length === 0 ? (
          <EmptyState
            title="No graduates found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {graduates.map((grad, i) => (
                <GraduateCard key={grad._id} graduate={grad} index={i} />
              ))}
            </div>

            {page < totalPages && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Archive;
