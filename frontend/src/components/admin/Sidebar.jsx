import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineChartPie, HiOutlineCube, HiOutlineShoppingBag,
  HiOutlineUsers, HiOutlineArrowLeftOnRectangle, HiOutlineHome,
} from "react-icons/hi2";

const Sidebar = ({ onNavClick }) => {
  const location = useLocation();
  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: HiOutlineChartPie },
    { label: "Inventory", path: "/admin/products", icon: HiOutlineCube },
    { label: "Orders", path: "/admin/orders", icon: HiOutlineShoppingBag },
    { label: "Customers", path: "/admin/users", icon: HiOutlineUsers },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-full p-6 lg:p-8">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3D4035] rounded-lg flex items-center justify-center text-white text-xs font-sans">A</div>
          Aran <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold font-sans">Admin</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300 mb-4 px-3 font-sans">Management</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavClick}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
              isActive(item.path)
                ? "bg-[#3D4035] text-white shadow-lg shadow-[#3d403520]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <item.icon className={`text-xl ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
            <span className="text-sm font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-50 pt-6 space-y-1">
        <Link to="/" className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#3D4035] transition-colors group">
          <HiOutlineHome className="text-xl opacity-60 group-hover:opacity-100" />
          <span className="text-sm font-medium">View Storefront</span>
        </Link>
        <button 
          onClick={() => { localStorage.removeItem("userInfo"); window.location.href = "/login"; }}
          className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors group"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl opacity-60 group-hover:opacity-100" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;