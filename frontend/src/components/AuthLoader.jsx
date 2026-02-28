import React from "react";

const AuthLoader = () => {
  return (
    <div className="fixed inset-0 bg-[#FAF9F6]/80 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center">
        {/* Spinner Section */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="w-16 h-16 border-2 border-[#3D4035]/5 rounded-full" />

          {/* Slow Ring */}
          <div className="absolute w-16 h-16 border-t-2 border-[#3D4035]/40 rounded-full animate-spin [animation-duration:2s]" />

          {/* Accent Ring */}
          <div className="absolute w-10 h-10 border-b-2 border-[#D4AF37] rounded-full animate-spin" />
        </div>

        {/* Text Section */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#3D4035] font-black animate-pulse">
            Verifying please wait...
          </p>

          {/* Loading Bar */}
          <div className="w-24 h-[1px] bg-[#3D4035]/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[#D4AF37] w-1/2 animate-loadingBar origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthLoader);
