import { useMemo, useCallback, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineChartPie,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineHome,
} from "react-icons/hi2";

/* ===============================
   MEMOIZED MENU ITEM COMPONENT
================================ */
const MenuItem = memo(({ item, active, onNavClick }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      onClick={onNavClick}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
        active
          ? "bg-[#3D4035] text-white shadow-lg shadow-[#3d403520]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon
        className={`text-xl ${
          active ? "text-white" : "text-slate-400 group-hover:text-slate-900"
        }`}
      />
      <span className="text-sm font-medium tracking-wide">{item.label}</span>
    </Link>
  );
});

const Sidebar = memo(({ onNavClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  /* ===============================
     STABLE MENU CONFIG
  ================================ */
  const menuItems = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: HiOutlineChartPie,
      },
      {
        label: "Inventory",
        path: "/admin/products",
        icon: HiOutlineCube,
      },
      {
        label: "Orders",
        path: "/admin/orders",
        icon: HiOutlineShoppingBag,
      },
      {
        label: "Customers",
        path: "/admin/users",
        icon: HiOutlineUsers,
      },
    ],
    [],
  );

  /* ===============================
     ACTIVE ROUTE CHECK
     (supports nested routes)
  ================================ */
  const isActive = useCallback(
    (path) => location.pathname.startsWith(path),
    [location.pathname],
  );

  /* ===============================
     LOGOUT (NO HARD RELOAD)
  ================================ */
  const handleLogout = useCallback(() => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex flex-col h-full p-6 lg:p-8">
      {/* LOGO */}
      <div className="mb-10 px-2">
        <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3D4035] rounded-lg flex items-center justify-center text-white text-xs font-sans">
            A
          </div>
          Aran
          <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold font-sans">
            Admin
          </span>
        </h2>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300 mb-4 px-3 font-sans">
          Management
        </p>

        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            item={item}
            active={isActive(item.path)}
            onNavClick={onNavClick}
          />
        ))}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="border-t border-slate-50 pt-6 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#3D4035] transition-colors group"
        >
          <HiOutlineHome className="text-xl opacity-60 group-hover:opacity-100" />
          <span className="text-sm font-medium">View Storefront</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors group"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl opacity-60 group-hover:opacity-100" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
});

export default Sidebar;
