import { useEffect, useState } from "react";
import API from "../../services/api";
import { timeAgo } from "../../utils/timeAgo";
import {
  HiOutlineInbox,
  HiOutlineMagnifyingGlass,
  HiOutlineTruck,
  HiOutlineCheckBadge,
  HiOutlineXCircle,
} from "react-icons/hi2";

const AdminOrders = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = orders.filter((order) => {
      const s = searchTerm.toLowerCase();
      const userMatch =
        order.user?.name?.toLowerCase().includes(s) ||
        order.user?.email?.toLowerCase().includes(s);
      const productMatch = order.orderItems.some((item) =>
        item.name.toLowerCase().includes(s),
      );
      const idMatch = order._id.toLowerCase().includes(s);
      return userMatch || productMatch || idMatch;
    });
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const updateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      await API.put(
        `/orders/${id}/${status}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      await fetchOrders();
    } catch (error) {
      alert(`Failed to ${status} order`);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-2 border-[#3D4035]/10 border-t-[#3D4035] rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3D4035]">
          Accessing Archives
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto bg-[#FAF9F6] min-h-screen">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
            Admin Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3D4035] uppercase tracking-tighter mt-2">
            Order Registry
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <HiOutlineMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4035] text-lg opacity-40" />
          <input
            type="text"
            placeholder="Search by name, item or ID..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#3D4035]/5 focus:border-[#3D4035]/20 outline-none bg-white text-sm transition-all shadow-sm placeholder:text-[#8C8C83]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-[#3D4035]/10">
          <HiOutlineInbox className="mx-auto text-5xl text-[#3D4035]/10 mb-6" />
          <p className="text-sm font-bold text-[#8C8C83] uppercase tracking-widest">
            {searchTerm
              ? "No records match your query"
              : "Registry is currently empty"}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-[2.5rem] shadow-sm border border-[#3D4035]/5 overflow-hidden transition-all hover:shadow-xl hover:shadow-[#3D4035]/5"
            >
              {/* STATUS BAR */}
              <div className="px-8 py-4 bg-[#FBFBFA] border-b border-[#3D4035]/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-[#3D4035] bg-white px-3 py-1 rounded-lg border border-[#3D4035]/5 shadow-sm">
                    ID: {order._id.slice(-8).toUpperCase()}
                  </span>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === "confirmed"
                        ? "bg-green-50 text-green-700"
                        : order.status === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-[#F3E5AB] text-[#3D4035]"
                    }`}
                  >
                    {order.status === "confirmed" && (
                      <HiOutlineCheckBadge className="text-sm" />
                    )}
                    {order.status === "rejected" && (
                      <HiOutlineXCircle className="text-sm" />
                    )}
                    {order.status === "pending" && (
                      <HiOutlineTruck className="text-sm animate-pulse" />
                    )}
                    {order.status}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#8C8C83] uppercase tracking-widest">
                  Received {timeAgo(order.createdAt)}
                </span>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-12 gap-12">
                  {/* CUSTOMER INFO */}
                  <div className="lg:col-span-4 space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-3">
                        Customer Profile
                      </p>
                      <h3 className="text-2xl font-bold text-[#3D4035] tracking-tight truncate">
                        {order.user?.name}
                      </h3>
                      <p className="text-sm font-medium text-[#8C8C83] italic">
                        {order.user?.email}
                      </p>
                    </div>

                    <div className="bg-[#F9F6F0] p-6 rounded-[2rem] border border-[#3D4035]/5 relative overflow-hidden">
                      <p className="text-[9px] font-black uppercase text-[#3D4035]/40 mb-1">
                        Settlement Amount
                      </p>
                      <p className="text-3xl font-black text-[#3D4035] tracking-tighter">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      <HiOutlineCheckBadge className="absolute -right-4 -bottom-4 text-7xl text-[#3D4035]/5" />
                    </div>
                  </div>

                  {/* PRODUCT GALLERY (VISIBLE & CLEAR) */}
                  <div className="lg:col-span-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
                      Ordered Manifest
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {order.orderItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-[#FBFBFA] border border-[#3D4035]/5 group"
                        >
                          <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 flex items-center justify-center p-2 border border-[#3D4035]/5 overflow-hidden">
                            <img
                              src={item.image}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                              alt={item.name}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#3D4035] leading-tight mb-1 truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-bold text-[#8C8C83] uppercase tracking-widest">
                              Qty:{" "}
                              <span className="text-[#3D4035]">
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ACTION AREA */}
                {order.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-[#3D4035]/5">
                    <button
                      disabled={processingId === order._id}
                      onClick={() => updateStatus(order._id, "confirm")}
                      className="flex-1 bg-[#3D4035] text-[#F3E5AB] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-[#3D4035]/10"
                    >
                      {processingId === order._id
                        ? "Processing Selection..."
                        : "Confirm Order"}
                    </button>
                    <button
                      disabled={processingId === order._id}
                      onClick={() => updateStatus(order._id, "reject")}
                      className="px-10 border border-red-100 text-red-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
