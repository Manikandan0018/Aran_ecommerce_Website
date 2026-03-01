import { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlinePower,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/myorders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesID = order._id.toLowerCase().includes(searchLower);
      const matchesProduct = order.orderItems.some((item) =>
        item.name.toLowerCase().includes(searchLower),
      );
      return matchesID || matchesProduct;
    });
  }, [orders, searchQuery]);

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      <div className="max-w-[1240px] mx-auto px-4 py-8">
        {/* Main Flex Container - Ensure align-items-start is present */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT SIDEBAR: FIXED ON LG SCREENS */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 space-y-4">
            {/* User Profile Summary */}
            <div className="bg-white p-4 shadow-sm rounded-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2874f0] rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                {user?.name?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Hello,
                </p>
                <p className="font-bold text-gray-800 truncate">{user?.name}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
              <div className="p-4 border-b text-[#2874f0] font-bold flex items-center gap-4 bg-blue-50/50">
                <HiOutlineShoppingBag className="text-xl" />
                <span className="text-sm uppercase tracking-tight">
                  My Orders
                </span>
                <HiOutlineChevronRight className="ml-auto" />
              </div>

              <div
                onClick={logout}
                className="p-4 flex items-center gap-4 text-gray-500 font-bold text-sm uppercase cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <HiOutlinePower className="text-xl" />
                <span>Logout</span>
              </div>
            </div>

            {/* Minimal Help Text */}
            <div className="p-4 text-[11px] text-gray-400 leading-relaxed">
              <p>© 2026 YourStore. Need help? Contact Support</p>
            </div>
          </aside>

          {/* RIGHT CONTENT: SCROLLABLE */}
          <main className="w-full lg:w-3/4">
            <div className="bg-white shadow-sm rounded-sm min-h-[600px]">
              {/* STICKY SEARCH HEADER */}
              <div className="p-4 border-b bg-white sticky top-0 md:top-[0px] z-20 rounded-t-sm">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search your orders (ID or Product Name)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-sm focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-sm transition-all shadow-sm"
                  />
                  <HiOutlineMagnifyingGlass className="absolute left-4 top-3.5 text-gray-400 text-xl group-focus-within:text-[#2874f0]" />
                </div>
              </div>

              {/* ORDERS LIST */}
              <div className="divide-y divide-gray-100">
                {loadingOrders ? (
                  <div className="p-20 text-center flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">
                      Fetching history...
                    </p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <img
                      src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4dda-b051-35c0518177a8.png?q=90"
                      className="w-48 opacity-40 grayscale"
                      alt="Empty"
                    />
                    <p className="text-gray-500 mt-4 font-medium">
                      No matching orders found.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 md:p-6 hover:bg-gray-50/80 transition-all border-l-4 border-transparent hover:border-[#2874f0]"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* PRODUCT IMAGES GRID */}
                        <div className="flex flex-wrap gap-2 w-full md:w-48 shrink-0">
                          {order.orderItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="w-20 h-20 border border-gray-100 bg-white p-1 rounded-sm shadow-sm relative group"
                            >
                              <img
                                src={item.image}
                                className="w-full h-full object-contain"
                                alt={item.name}
                              />
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          ))}
                        </div>

                        {/* ORDER TEXT INFO */}
                        {/* ORDER TEXT INFO */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                                order.status === "delivered"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : order.status === "confirmed"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          {/* LISTING ALL PRODUCT NAMES */}
                          <div className="space-y-1">
                            {order.orderItems.map((item, index) => (
                              <p
                                key={index}
                                className="text-sm font-bold text-gray-800 leading-tight"
                              >
                                {item.name}
                                <span className="text-gray-500 font-normal ml-2 text-md">
                                  (Qty: {item.quantity})
                                </span>
                              </p>
                            ))}
                          </div>

                          <p className="text-[11px] text-gray-400 pt-1">
                            ID: {order._id.toUpperCase()}
                          </p>
                        </div>

                        {/* PRICE & ACTION */}
                        <div className="md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                          <div>
                            <p className="text-lg font-black text-gray-900 leading-none">
                              ₹{order.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
                              COD / WhatsApp
                            </p>
                          </div>
                          <Link
                            to={`/order/${order._id}`}
                            className="mt-auto text-[#2874f0] text-xs font-bold flex items-center gap-1 hover:underline group"
                          >
                            VIEW DETAILS{" "}
                            <HiOutlineChevronRight className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
