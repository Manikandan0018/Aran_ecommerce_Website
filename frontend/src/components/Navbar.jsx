import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
} from "react-icons/hi2";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const cartCount = cartItems.length;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const logoutHandler = () => {
    logout();
    toast.success("See you again soon");
    navigate("/login");
  };

  /* ✅ CLOSE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-[#E9EFDE]/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-[#2C3026]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* 1. Brand Logo - Styled as "ARAN" */}
          <Link to="/" className="group flex flex-col">
            <span className="text-2xl font-bold tracking-[0.2em] text-[#2C3026] leading-none">
              ARAN
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#2C3026]/60 font-medium">
              Natural
            </span>
          </Link>

         

          {/* 3. Icon Actions */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/wishlist"
              className="hover:scale-110 transition-transform"
            >
              <HiOutlineHeart className="text-2xl text-[#2C3026]" />
            </Link>

            <Link
              to="/cart"
              className="relative hover:scale-110 transition-transform"
            >
              <HiOutlineShoppingBag className="text-2xl text-[#2C3026]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#2C3026] text-[#E9EFDE] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ✅ Click-based Profile Menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 rounded-full bg-white/50 border border-[#2C3026]/10 flex items-center justify-center hover:bg-white transition-all shadow-sm"
                >
                  <HiOutlineUser className="text-lg text-[#2C3026]" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-[#2C3026]/5 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-5 py-4 bg-[#2C3026]/5 border-b border-[#2C3026]/5">
                      <p className="text-[10px] uppercase tracking-widest text-[#2C3026]/50 font-bold mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-[#2C3026] truncate">
                        {user.name || user.email}
                      </p>
                    </div>

                    <Link
                      to="/UserOrders"
                      className="block px-5 py-3.5 text-xs uppercase tracking-widest font-bold text-[#2C3026]/70 hover:bg-[#2C3026]/5 hover:text-[#2C3026] transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-5 py-3.5 text-xs uppercase tracking-widest font-bold text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="h-[1px] bg-[#2C3026]/5 mx-5" />

                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-5 py-4 text-xs uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2C3026] border-b-2 border-[#2C3026] pb-0.5 hover:opacity-70 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
