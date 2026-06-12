import { motion } from 'framer-motion';
import { HiUserGroup, HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, color, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="card p-6 hover:shadow-2xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </motion.div>
);

const StatsCards = ({ stats = {} }) => {
  const cards = [
    { icon: HiUserGroup, label: 'Total Graduates', value: stats.totalGraduates || 0,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { icon: HiClock, label: 'Pending', value: stats.pendingGraduates || 0,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600' },
    { icon: HiCheckCircle, label: 'Approved', value: stats.approvedGraduates || 0,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { icon: HiXCircle, label: 'Rejected', value: stats.rejectedGraduates || 0,
      color: 'bg-gradient-to-br from-red-500 to-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} index={i} />
      ))}
    </div>
  );
};

export default StatsCards;
