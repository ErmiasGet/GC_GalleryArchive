import { useState } from 'react';

const SafeImage = ({
  src,
  alt = '',
  fallback: CustomFallback,
  initials,
  className = '',
  imgClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || hasError) {
    if (CustomFallback) return CustomFallback;
    if (initials) {
      return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-primary-500 to-gold-500 ${className}`} {...props}>
          <span className="text-white font-bold text-lg">{initials}</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...props}>
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        loading="lazy"
      />
    </div>
  );
};

export default SafeImage;
