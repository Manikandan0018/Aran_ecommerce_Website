export default function AuthLoader() {
  return (
    <div className="fixed inset-0 bg-[#FAF9F6]/80 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring - Static/Subtle */}
          <div className="w-16 h-16 border-2 border-[#3D4035]/5 rounded-full"></div>

          {/* Middle Ring - Slow Spin */}
          <div className="absolute w-16 h-16 border-t-2 border-[#3D4035]/40 rounded-full animate-[spin_2s_linear_infinite]"></div>

          {/* Inner Accent - Fast Spin */}
          <div className="absolute w-10 h-10 border-b-2 border-[#D4AF37] rounded-full animate-[spin_1s_linear_infinite]"></div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#3D4035] font-black animate-pulse">
            Verifying please wait...
          </p>

          {/* Progress Bar Detail */}
          <div className="w-24 h-[1px] bg-[#3D4035]/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[#D4AF37] w-1/2 animate-[loading_1.5s_ease-in-out_infinite] origin-left"></div>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Animation Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `,
        }}
      />
    </div>
  );
}
