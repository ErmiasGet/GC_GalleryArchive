import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiLogout, HiAcademicCap, HiCollection, HiHeart, HiHome, HiPhotograph } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: HiHome },
    { to: '/archive', label: 'Archive', icon: HiCollection },
    { to: '/memory-wall', label: 'Memories', icon: HiHeart },
    { to: '/batch-gallery', label: 'Gallery', icon: HiPhotograph },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <HiAcademicCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold gradient-text">
              GradMemory
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-primary-50 text-primary-700 hover:bg-primary-100"
                >
                  <HiUser className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin' : 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl transition-all duration-300 text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <HiLogout className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl font-medium transition-all duration-300 text-gray-600 hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 font-medium rounded-xl transition-all duration-300 shadow-lg bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl transition-all duration-300 text-gray-600 hover:bg-gray-100"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-primary-700 font-medium hover:bg-primary-50 transition-all duration-300"
                    >
                      <HiUser className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-all duration-300 w-full"
                    >
                      <HiLogout className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300"
                    >
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
