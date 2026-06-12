import { Link } from 'react-router-dom';
import { HiAcademicCap, HiHeart, HiCollection, HiMail } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-gold-500 flex items-center justify-center">
                <HiAcademicCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                GradMemory
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Preserving graduation memories, celebrating achievements, and connecting
              generations. A permanent digital archive for your university legacy.
            </p>
            <div className="flex space-x-4">
              {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/archive', label: 'Graduation Archive', icon: HiCollection },
                { to: '/memory-wall', label: 'Memory Wall', icon: HiHeart },
                { to: '/archive', label: 'Browse Archive', icon: HiCollection },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-2 text-gray-400 hover:text-gold-400 transition-all duration-300 group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { to: '#', label: 'Contact Us', icon: HiMail },
                { to: '#', label: 'Privacy Policy' },
                { to: '#', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-2 text-gray-400 hover:text-gold-400 transition-all duration-300 group"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GradMemory. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">
            Preserving memories forever
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
