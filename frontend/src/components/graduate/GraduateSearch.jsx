import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiX } from 'react-icons/hi';
import { departments } from '../../utils/helpers';

const GraduateSearch = ({ onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    department: initialFilters.department || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const cleared = { search: '', department: '' };
    setFilters(cleared);
    onSearch(cleared);
  };

  const hasFilters = filters.search || filters.department;

  return (
    <div className="space-y-4">
      <div className="relative">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search graduates by name, department, or student ID..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input-field pl-12 pr-12 h-14 text-lg"
        />
        {filters.search && (
          <button
            onClick={() => handleChange('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            showFilters || hasFilters
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {hasFilters ? 'Filters Active' : 'Filters'}
        </button>

        {filters.department && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-sm">
            {filters.department}
            <button
              onClick={() => handleChange('department', '')}
              className="ml-2 hover:text-primary-900"
            >
              <HiX className="w-4 h-4" />
            </button>
          </span>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <motion.div
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
        }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {!showFilters && !hasFilters && (
        <p className="text-sm text-gray-400 text-center">
          Use the search bar above or enable filters to find graduates
        </p>
      )}
    </div>
  );
};

export default GraduateSearch;
