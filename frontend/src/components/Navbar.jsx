import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* =========================
     MEMOIZED VALUES
  ========================= */

  const cartCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  /* =========================
     HANDLERS
  ========================= */

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const logoutHandler = useCallback(() => {
    logout();
    toast.success("See you again soon");
    navigate("/login");
  }, [logout, navigate]);

  /* =========================
     CLOSE ON OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =========================
     UI
  ========================= */

  return (
    <nav className="bg-[#E9EFDE]/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-[#2C3026]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold tracking-[0.2em] text-[#2C3026]">
              ARAN
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#2C3026]/60">
              Natural
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/wishlist">
              <HiOutlineHeart className="text-2xl text-[#2C3026]" />
            </Link>

            <Link to="/cart" className="relative">
              <HiOutlineShoppingBag className="text-2xl text-[#2C3026]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#2C3026] text-[#E9EFDE] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full bg-white/50 border border-[#2C3026]/10 flex items-center justify-center"
                >
                  <HiOutlineUser className="text-lg text-[#2C3026]" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-[#2C3026]/5">
                    <div className="px-5 py-4 bg-[#2C3026]/5 border-b border-[#2C3026]/5">
                      <p className="text-[10px] uppercase tracking-widest text-[#2C3026]/50 font-bold">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-[#2C3026] truncate">
                        {user.name || user.email}
                      </p>
                    </div>

                    <Link
                      to="/UserOrders"
                      onClick={closeMenu}
                      className="block px-5 py-3 text-xs uppercase font-bold"
                    >
                      My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMenu}
                        className="block px-5 py-3 text-xs uppercase font-bold text-[#D4AF37]"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-5 py-4 text-xs uppercase font-bold text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#2C3026]"
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

export default React.memo(Navbar);
