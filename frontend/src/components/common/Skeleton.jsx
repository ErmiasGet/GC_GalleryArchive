const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
};

export const CardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-4 w-full" />
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-8 w-8 rounded-full" />
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="skeleton h-64 w-full rounded-2xl" />
    <div className="flex justify-center -mt-16">
      <div className="skeleton h-32 w-32 rounded-full" />
    </div>
    <div className="text-center space-y-3 max-w-md mx-auto">
      <div className="skeleton h-8 w-64 mx-auto" />
      <div className="skeleton h-5 w-40 mx-auto" />
      <div className="skeleton h-20 w-full" />
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="skeleton h-64 rounded-2xl" />
    ))}
  </div>
);

export default Skeleton;
