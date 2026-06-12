import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiUserGroup, HiCalendar, HiOfficeBuilding, HiPhotograph } from 'react-icons/hi';
import { graduateAPI } from '../../utils/api';

const Counter = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = Math.ceil(value / (duration * 60));
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold gradient-text">
      {count}
      {suffix}
    </span>
  );
};

const statConfig = [
  { key: 'totalGraduates', icon: HiUserGroup, suffix: '+', label: 'Graduates', color: 'from-blue-500 to-indigo-600' },
  { key: 'totalBatches', icon: HiCalendar, suffix: '', label: 'Batches', color: 'from-gold-400 to-gold-600' },
  { key: 'totalDepartments', icon: HiOfficeBuilding, suffix: '+', label: 'Departments', color: 'from-emerald-500 to-teal-600' },
  { key: 'totalPhotos', icon: HiPhotograph, suffix: '+', label: 'Photos', color: 'from-purple-500 to-pink-600' },
];

const DiplomaSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 140V60L100 40L140 60V140L100 160L60 140Z" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <path d="M60 60L100 80L140 60" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <path d="M100 80V120" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <path d="M80 50L100 60L120 50" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <rect x="85" y="125" width="30" height="6" rx="3" fill="currentColor" opacity="0.3" />
  </svg>
);

const StarsSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 40L33 48L42 48L35 53L37 62L30 57L23 62L25 53L18 48L27 48L30 40Z" fill="currentColor" opacity="0.3" />
    <path d="M160 30L162 35L168 35L163 39L165 44L160 41L155 44L157 39L152 35L158 35L160 30Z" fill="currentColor" opacity="0.25" />
    <path d="M140 170L143 176L150 176L144 180L147 186L140 182L133 186L136 180L130 176L137 176L140 170Z" fill="currentColor" opacity="0.2" />
    <path d="M20 150L22 154L27 154L23 157L25 161L20 158L15 161L17 157L13 154L18 154L20 150Z" fill="currentColor" opacity="0.35" />
    <path d="M170 120L172 125L178 125L173 129L175 134L170 130L165 134L167 129L162 125L168 125L170 120Z" fill="currentColor" opacity="0.2" />
  </svg>
);

const StatisticsSection = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    graduateAPI.getStatistics().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <section className="relative section-padding bg-gradient-to-b from-gray-50 to-white overflow-hidden">

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Our Growing{' '}
            <span className="gradient-text">Archive</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A testament to academic excellence and cherished memories of the Class of 2026
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statConfig.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="card p-8 text-center hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <Counter value={stats ? stats[stat.key] : 0} suffix={stat.suffix} />
                  <p className="text-gray-500 font-medium mt-2">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
