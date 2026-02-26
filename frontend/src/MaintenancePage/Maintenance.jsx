import React from "react";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

const Maintenance = () => {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
      {/* 1. CLARITY ICON */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-[#3D4035] rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-[#3d403530]">
          <HiOutlineExclamationTriangle className="text-3xl" />
        </div>
      </div>

      {/* 2. THE DIRECT MESSAGE */}
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-6xl font-serif text-[#3D4035] mb-6 tracking-tighter">
          System <br />
          <span className="italic font-light text-[#8C8C83]">Maintenance</span>
        </h1>

        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-[#3D4035] font-medium leading-tight">
            Our site is currently offline for essential updates.
            <span className="block mt-2 text-[#6B705C] font-light italic">
              Please try again in a few moments.
            </span>
          </p>

          <div className="h-[1px] w-12 bg-[#3D4035]/20 mx-auto" />

          <p className="text-sm text-[#B0B0A8] uppercase tracking-[0.3em] font-bold">
            We will be back online shortly
          </p>
        </div>
      </div>

      {/* 3. REFRESH HINT */}
      <button
        onClick={() => window.location.reload()}
        className="mt-12 px-8 py-3 border border-[#3D4035] text-[#3D4035] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3D4035] hover:text-white transition-all"
      >
        Check Again
      </button>

      {/* 4. FOOTER */}
      <div className="absolute bottom-10">
        <p className="text-[10px] uppercase tracking-widest text-[#B0B0A8] font-medium">
          Botanica Admin Control — 2026
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
