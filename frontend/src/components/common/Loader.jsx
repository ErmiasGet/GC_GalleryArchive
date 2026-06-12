import { HiAcademicCap } from 'react-icons/hi';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center animate-pulse shadow-xl">
          <HiAcademicCap className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary-600/20 to-gold-500/20 blur-xl animate-pulse" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-gray-500 font-medium text-sm">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  );
};

export default Loader;
