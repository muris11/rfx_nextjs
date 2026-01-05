export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#1A1A1A] border-t-[#E50914] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-[#E50914]">R</span>
          </div>
        </div>
        <p className="text-[#B3B3B3] animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
