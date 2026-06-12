import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiCheckCircle, HiClock, HiXCircle, HiPhotograph, HiLogout } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { graduateAPI } from '../utils/api';
import GraduateForm from '../components/graduate/GraduateForm';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { getStatusColor, getStatusLabel } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const { graduate, user, updateGraduate, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await graduateAPI.getMyProfile();
        updateGraduate(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    if (user && !graduate) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) {
    return <Loader fullScreen />;
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: HiUser },
    { id: 'photos', label: 'My Gallery', icon: HiPhotograph },
  ];

  return (
    <div className="min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-bg py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-300">
                Welcome back, {graduate?.fullName || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {graduate?.status && (
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(
                    graduate.status
                  )}`}
                >
                  {getStatusLabel(graduate.status)}
                </span>
              )}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <HiLogout className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl mb-8 overflow-x-auto">
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
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          graduate ? (
            <GraduateForm graduate={graduate} onUpdate={updateGraduate} />
          ) : (
            <EmptyState
              title="No Profile Found"
              description="Something went wrong loading your profile"
            />
          )
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-gray-900">
                My Gallery
              </h2>
              <span className="text-sm text-gray-500">
                {graduate?.photos?.length || 0} photos
              </span>
            </div>
            <GalleryGrid photos={graduate?.photos || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
