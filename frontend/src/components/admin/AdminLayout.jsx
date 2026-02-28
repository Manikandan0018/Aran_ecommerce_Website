import { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* =========================
     STABLE HANDLERS
  ========================= */
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  /* =========================
     BODY SCROLL LOCK (Mobile)
  ========================= */
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
  }, [isSidebarOpen]);

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen w-full overflow-x-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-100 
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onNavClick={closeSidebar} />

        {/* Close Button (Mobile) */}
        <button
          className="absolute top-6 right-4 lg:hidden text-slate-400 p-2"
          onClick={closeSidebar}
        >
          <HiOutlineXMark size={24} />
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE HEADER */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3D4035] rounded-lg flex items-center justify-center text-white text-[10px]">
              A
            </div>
            <span className="font-serif text-[#3D4035] font-bold">
              Aran Admin
            </span>
          </div>

          <button
            onClick={openSidebar}
            className="p-2 text-[#3D4035] bg-slate-50 rounded-xl"
          >
            <HiOutlineBars3 size={24} />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
