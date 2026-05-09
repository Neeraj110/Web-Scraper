const StorySkeleton = () => (
  <div className="animate-pulse rounded-[1.5rem] border border-black/8 bg-white/80 p-5 shadow-soft">
    <div className="flex items-start justify-between gap-4">
      <div className="h-7 w-24 rounded-full bg-black/10" />
      <div className="h-10 w-28 rounded-full bg-black/10" />
    </div>
    <div className="mt-5 h-6 w-[82%] rounded-full bg-black/10" />
    <div className="mt-3 h-6 w-[65%] rounded-full bg-black/10" />
    <div className="mt-4 flex gap-3">
      <div className="h-8 w-24 rounded-full bg-black/10" />
      <div className="h-8 w-28 rounded-full bg-black/10" />
    </div>
    <div className="mt-8 h-5 w-20 rounded-full bg-black/10" />
  </div>
);

export default StorySkeleton;
