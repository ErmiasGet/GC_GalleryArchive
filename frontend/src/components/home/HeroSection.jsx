import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiAcademicCap, HiPhotograph, HiHeart } from 'react-icons/hi';
import { graduateAPI } from '../../utils/api';

const heroImages = [
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80',
  'https://images.unsplash.com/photo-1621976360623-004224992a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
];

const collageImages = [
  { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80', x: 0, y: 0, w: 'col-span-2 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80', x: 2, y: 0, w: 'col-span-1 row-span-1' },
  { src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', x: 2, y: 1, w: 'col-span-1 row-span-1' },
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    graduateAPI.getStatistics().then(({ data }) => setLiveStats(data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Graduates', value: liveStats ? `${liveStats.totalGraduates}+` : '...', icon: HiAcademicCap },
    { label: 'Photos', value: liveStats ? `${liveStats.totalPhotos}+` : '...', icon: HiPhotograph },
    { label: 'Departments', value: liveStats ? `${liveStats.totalDepartments}+` : '...', icon: HiHeart },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={heroImages[currentImage]}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === currentImage ? 'bg-gold-400 w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative p-8 md:p-10 rounded-3xl bg-black/60 backdrop-blur-md border border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                <span className="text-white/80 text-sm font-medium">
                  Class of 2026 Archive
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6"
              >
                Preserving{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                  Memories
                </span>
                , Celebrating Achievements
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-200 leading-relaxed mb-8 max-w-xl"
              >
                A permanent digital archive for your university graduation memories.
                Connect with your batchmates, relive precious moments, and be part of
                your university's eternal legacy.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-gold-500 text-white font-semibold rounded-2xl hover:bg-gold-600 transition-all duration-300 shadow-2xl shadow-gold-500/30 hover:shadow-gold-500/50 flex items-center space-x-3"
                >
                  <span>Join the Archive</span>
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/archive"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Explore Archive
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center space-x-8 mt-10"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[550px]">
              {collageImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                  className={`${img.w} rounded-2xl overflow-hidden shadow-2xl relative group`}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                className="absolute -bottom-5 -right-5 w-44 h-44 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-6 shadow-2xl flex items-center justify-center z-10"
              >
                <div className="text-center text-white">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-4xl font-bold"
                  >
                    2026
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="text-sm opacity-90"
                  >
                    Forever Golden
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
