import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiHeart, HiCollection, HiPhotograph, HiHome, HiArrowUp, HiMail, HiUser, HiShieldCheck } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const Footer = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreLinks = [
    { to: '/', label: 'Home', icon: HiHome },
    { to: '/archive', label: 'Graduation Archive', icon: HiCollection },
    { to: '/memory-wall', label: 'Memory Wall', icon: HiHeart },
    { to: '/batch-gallery', label: 'Batch Gallery', icon: HiPhotograph },
  ];

  const accountLinks = isAuthenticated
    ? [
        { to: isAdmin ? '/admin' : '/dashboard', label: isAdmin ? 'Admin Panel' : 'Dashboard', icon: HiShieldCheck },
      ]
    : [
        { to: '/login', label: 'Sign In', icon: HiUser },
        { to: '/register', label: 'Get Started', icon: HiAcademicCap },
      ];

  const resourceLinks = [
    { to: '#', label: 'Privacy Policy' },
    { to: '#', label: 'Terms of Service' },
    { to: '#', label: 'Cookie Policy' },
    { to: '#', label: 'Help Center' },
  ];

  const socialLinks = [
    { icon: FaGithub, href: '#', label: 'GitHub' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-primary-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-800/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-gold-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <HiAcademicCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                GradMemory
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md text-sm">
              Preserving graduation memories, celebrating achievements, and connecting
              generations. A permanent digital archive for your university legacy.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-white hover:scale-110 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-5">
              Explore
            </h3>
            <ul className="space-y-3.5">
              {exploreLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center space-x-2.5 text-gray-400 hover:text-gold-400 transition-all duration-300 group text-sm"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-5">
              Resources
            </h3>
            <ul className="space-y-3.5">
              {resourceLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex items-center space-x-2.5 text-gray-400 hover:text-gold-400 transition-all duration-300 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-gold-500 transition-colors" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mt-6 mb-3">
              Account
            </h3>
            <ul className="space-y-3.5">
              {accountLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center space-x-2.5 text-gray-400 hover:text-gold-400 transition-all duration-300 group text-sm"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-5">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Get notified about new memories, alumni stories, and feature updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full px-5 py-3 rounded-xl font-medium bg-gold-500 text-white hover:bg-gold-600 transition-all duration-300 active:scale-[0.98] text-sm"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} GradMemory. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Made with <span className="text-red-400">&hearts;</span> for alumni everywhere
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-400 hover:text-gold-400 transition-all duration-300 group text-xs"
          >
            <span>Back to top</span>
            <HiArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
