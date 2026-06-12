import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUserGroup, HiClock, HiCheckCircle, HiXCircle, HiHome, HiUsers, HiPhotograph } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI, batchPhotoAPI } from '../utils/api';
import StatsCards from '../components/dashboard/StatsCards';
import PendingRequests from '../components/dashboard/PendingRequests';
import GraduateList from '../components/dashboard/GraduateList';
import BatchPhotoGrid from '../components/gallery/BatchPhotoGrid';
import BatchPhotoUploader from '../components/gallery/BatchPhotoUploader';
import Loader from '../components/common/Loader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [batchPhotos, setBatchPhotos] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPending(),
      ]);
      setStats(statsRes.data);
      setPending(pendingRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
    fetchData();
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchBatchPhotos = async () => {
    setBatchLoading(true);
    try {
      const res = await batchPhotoAPI.getAll({ limit: 20 });
      setBatchPhotos(res.data.photos);
    } catch {
    } finally {
      setBatchLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'batch') fetchBatchPhotos();
  }, [activeTab]);

  const handleBatchDelete = async (id) => {
    if (!window.confirm('Delete this batch photo?')) return;
    try {
      await batchPhotoAPI.delete(id);
      toast.success('Photo deleted');
      fetchBatchPhotos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', icon: HiClock, count: stats?.pendingGraduates || 0 },
    { id: 'approved', label: 'Approved', icon: HiCheckCircle, count: stats?.approvedGraduates || 0 },
    { id: 'rejected', label: 'Rejected', icon: HiXCircle, count: stats?.rejectedGraduates || 0 },
    { id: 'all', label: 'All Graduates', icon: HiUsers, count: stats?.totalGraduates || 0 },
    { id: 'stats', label: 'Statistics', icon: HiUserGroup },
    { id: 'batch', label: 'Batch Photos', icon: HiPhotograph },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-bg py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-300">Manage graduates, approvals, and content</p>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <HiHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards stats={stats} />

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl my-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="pending"
          >
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
              Pending Approvals ({pending.length})
            </h2>
            <PendingRequests requests={pending} onUpdate={handleUpdate} />
          </motion.div>
        )}

        {activeTab === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="approved"
          >
            <GraduateList statusFilter="approved" refreshTrigger={refreshTrigger} />
          </motion.div>
        )}

        {activeTab === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="rejected"
          >
            <GraduateList statusFilter="rejected" refreshTrigger={refreshTrigger} />
          </motion.div>
        )}

        {activeTab === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="all"
          >
            <GraduateList statusFilter="" refreshTrigger={refreshTrigger} />
          </motion.div>
        )}

        {activeTab === 'batch' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="batch"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900">
                Batch Photos
              </h2>
              <Link
                to="/batch-gallery"
                className="btn-ghost text-sm"
              >
                View Full Gallery
              </Link>
            </div>
            <div className="mb-8 max-w-lg">
              <BatchPhotoUploader onUploaded={fetchBatchPhotos} />
            </div>
            <BatchPhotoGrid
              photos={batchPhotos}
              loading={batchLoading}
              isAdmin={true}
              onDelete={handleBatchDelete}
            />
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="stats"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Class of 2026</h3>
              {stats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                    <span className="text-sm font-medium text-primary-700">Total Graduates</span>
                    <span className="text-lg font-bold text-primary-900">{stats.totalGraduates || 0}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-emerald-50 rounded-xl text-center">
                      <p className="text-xs text-emerald-600 font-medium">Approved</p>
                      <p className="text-lg font-bold text-emerald-900">{stats.approvedGraduates || 0}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl text-center">
                      <p className="text-xs text-amber-600 font-medium">Pending</p>
                      <p className="text-lg font-bold text-amber-900">{stats.pendingGraduates || 0}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl text-center">
                      <p className="text-xs text-red-600 font-medium">Rejected</p>
                      <p className="text-lg font-bold text-red-900">{stats.rejectedGraduates || 0}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No data available</p>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Graduates by Department</h3>
              {stats?.departmentDistribution?.length > 0 ? (
                <div className="space-y-3">
                  {stats.departmentDistribution.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item._id}</span>
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-2 rounded-full bg-gold-500"
                          style={{
                            width: `${Math.max((item.count / Math.max(...stats.departmentDistribution.map((d) => d.count))) * 200, 20)}px`,
                          }}
                        />
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No data available</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
