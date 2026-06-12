import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import StatisticsSection from '../components/home/StatisticsSection';
import RecentGraduates from '../components/home/RecentGraduates';
import FeaturedGraduates from '../components/home/FeaturedGraduates';
import FeaturedMemories from '../components/home/FeaturedMemories';
import CampusMoments from '../components/home/CampusMoments';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <StatisticsSection />
      <CampusMoments />
      <RecentGraduates />
      <FeaturedGraduates />
      <FeaturedMemories />
    </motion.div>
  );
};

export default Home;
