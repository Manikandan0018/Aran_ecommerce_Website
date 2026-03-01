import React, { useContext, useState, useMemo, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiMagnifyingGlass,
  HiChevronDown,
  HiOutlineHeart,
} from "react-icons/hi2";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import mainLogo from "../image/logo.jpeg";
import adminIcon from "../image/admin-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Memoized cart count
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // ✅ Memoized first name
  const firstName = useMemo(() => {
    return user?.name?.split(" ")[0] || "";
  }, [user]);

  // ✅ Stable search handler
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/?search=${searchQuery}`);
      }
    },
    [searchQuery, navigate],
  );

  return (
    <nav className="bg-[#2874f0] text-white sticky top-0 z-[100] shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col">
        <div className="flex items-center h-16 md:h-20 gap-2 md:gap-10">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group min-w-fit">
            <img
              src={mainLogo}
              alt="ARAN"
              className="h-8 md:h-10 w-auto object-contain rounded-sm"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl md:text-2xl font-black italic tracking-tighter">
                AR<span className="text-green-400">AN</span>
              </span>
            </div>
          </Link>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-white py-2 px-4 pr-10 rounded-sm text-gray-900 text-sm outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2874f0]"
            >
              <HiMagnifyingGlass className="text-xl" />
            </button>
          </form>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 md:gap-8 ml-auto">
            {/* USER */}
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {user ? (
                <div className="flex items-center gap-1 cursor-pointer font-bold text-sm h-16 md:h-20">
                  <span className="max-w-[80px] truncate">{firstName}</span>
                  <HiChevronDown
                    className={`transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />

                  {showUserMenu && (
                    <div className="absolute top-[75%] right-0 w-56 bg-white text-gray-800 shadow-2xl border rounded-sm py-2 z-[110]">
                      {user.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-blue-50 text-[#2874f0] font-bold border-b"
                        >
                          <img
                            src={adminIcon}
                            alt="Admin"
                            className="w-6 h-6 object-contain"
                          />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/UserOrders"
                        className="block px-4 py-2.5 hover:bg-gray-50 text-sm border-b"
                      >
                        My Orders
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-[#2874f0] px-4 md:px-6 py-1.5 font-bold rounded-sm text-sm"
                >
                  Login
                </Link>
              )}
            </div>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="flex items-center gap-2 relative py-2 group"
            >
              <HiOutlineHeart className="text-2xl group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm hidden lg:block">
                Wishlist
              </span>
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="flex items-center gap-2 relative py-2 group"
            >
              <div className="relative">
                <HiOutlineShoppingBag className="text-2xl group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#2874f0] text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-[#2874f0]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm hidden lg:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
