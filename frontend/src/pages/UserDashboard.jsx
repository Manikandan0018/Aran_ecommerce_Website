import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import {
  HiOutlineShoppingBag,
  HiOutlineArchiveBox,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import ImageWithLoader from "../components/ImageWithLoader";
import ImagePreviewModal from "../components/ImagePreviewModal";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/my", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!user) return <DashboardSkeleton />;

  const statusStyles = (status) => {
    const base =
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ";
    if (status === "confirmed")
      return base + "bg-green-50 text-green-700 border border-green-100";
    if (status === "rejected")
      return base + "bg-red-50 text-red-700 border border-red-100";
    return base + "bg-orange-50 text-orange-700 border border-orange-100";
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      {/* 1. ELEGANT HEADER */}
      <section className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-[#F0F0EB] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B0B0A8] font-bold mb-2">
              Member Sanctuary
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3D4035] tracking-tighter">
              Welcome,{" "}
              <span className="italic font-light">
                {user.name.split(" ")[0]}
              </span>
            </h1>
            <p className="text-[#8C8C83] text-sm font-light mt-1">
              {user.email}
            </p>
          </div>
          <Link
            to="/"
            className="bg-[#3D4035] text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2C2E27] transition-all"
          >
            Return to Shop
          </Link>
        </div>
      </section>

      {/* 2. ORDER HISTORY */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <HiOutlineArchiveBox className="text-[#3D4035] text-xl" />
          <h2 className="text-xl font-serif text-[#3D4035]">Order History</h2>
          <div className="flex-1 h-[1px] bg-[#F0F0EB]" />
        </div>

        {loadingOrders ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-[#F0F0EB]">
            <HiOutlineShoppingBag className="mx-auto text-4xl text-[#B0B0A8] mb-4" />
            <p className="text-[#8C8C83] font-serif italic text-lg">
              No journeys taken yet.
            </p>
            <Link
              to="/"
              className="text-[#3D4035] border-b border-[#3D4035] text-xs uppercase font-bold tracking-widest mt-4 inline-block pb-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-[#F0F0EB] hover:shadow-xl hover:shadow-[#3d403505] transition-all duration-500"
              >
                {/* ORDER HEADER */}
                <div className="bg-[#FBFBFA] px-8 py-6 border-b border-[#F0F0EB] flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-[#B0B0A8] font-bold">
                      Ref: #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#8C8C83]">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-[#B0B0A8] font-bold mb-1">
                        Status
                      </p>
                      <span className={statusStyles(order.status)}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right border-l pl-6 border-[#F0F0EB]">
                      <p className="text-[10px] uppercase tracking-widest text-[#B0B0A8] font-bold mb-1">
                        Total
                      </p>
                      <p className="text-lg font-serif text-[#3D4035]">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="p-4 sm:p-8 grid gap-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-6 p-4 rounded-3xl hover:bg-[#FAF9F6] transition-colors group"
                    >
                      {/* IMAGE: OBJECT CONTAIN FOR FULL VISIBILITY */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-2 border border-[#F0F0EB] overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-110"
                          onClick={() => setPreviewImage(item.image)}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#3D4035] font-serif text-lg truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#B0B0A8] font-bold uppercase tracking-widest mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[#3D4035] font-bold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#B0B0A8]">
                          ₹{item.price} / unit
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

// --- ELEGANT SHIMMER LOADERS ---
const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto p-12 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-[3rem] mb-12" />
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem]" />
      ))}
    </div>
  </div>
);

const OrderSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] h-64 border border-[#F0F0EB] animate-pulse" />
);

export default UserDashboard;
