export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF9F6] backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer Elegant Ring */}
        <div className="w-20 h-20 border-2 border-[#3D4035]/10 rounded-full"></div>

        {/* Inner Spinning Loader */}
        <div className="absolute w-20 h-20 border-t-2 border-[#3D4035] rounded-full animate-spin"></div>

        {/* Center Pulsing Logo or Dot */}
        <div className="absolute w-2 h-2 bg-[#3D4035] rounded-full animate-pulse"></div>
      </div>

      <div className="mt-8 flex flex-col items-center space-y-2">
        <h2 className="text-xl font-serif text-[#3D4035] tracking-wide animate-pulse">
          Aran
        </h2>
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-8 bg-[#3D4035]/20"></span>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B0B0A8] font-bold">
            Loading please wait...
          </p>
          <span className="h-[1px] w-8 bg-[#3D4035]/20"></span>
        </div>
      </div>
    </div>
  );
}
