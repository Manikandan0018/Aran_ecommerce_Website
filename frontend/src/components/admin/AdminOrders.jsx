import { useEffect, useState, useCallback, useMemo } from "react";
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
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo")),
    [],
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  /* =========================
     FETCH ORDERS
  ========================= */
  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* =========================
     MEMOIZED FILTERED ORDERS
  ========================= */
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    const s = searchTerm.toLowerCase();

    return orders.filter((order) => {
      const userMatch =
        order.user?.name?.toLowerCase().includes(s) ||
        order.user?.email?.toLowerCase().includes(s);

      const productMatch = order.orderItems.some((item) =>
        item.name.toLowerCase().includes(s),
      );

      const idMatch = order._id.toLowerCase().includes(s);

      return userMatch || productMatch || idMatch;
    });
  }, [orders, searchTerm]);

  /* =========================
     UPDATE STATUS (Optimized)
  ========================= */
  const updateStatus = useCallback(
    async (id, status) => {
      setProcessingId(id);

      try {
        await API.put(
          `/orders/${id}/${status}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        // Update locally instead of refetching everything
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status } : order,
          ),
        );
      } catch {
        alert(`Failed to ${status} order`);
      } finally {
        setProcessingId(null);
      }
    },
    [userInfo],
  );

  /* =========================
     LOADING STATE
  ========================= */
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-2 border-[#3D4035]/10 border-t-[#3D4035] rounded-full animate-spin" />
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
          <HiOutlineMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D4035] opacity-40" />
          <input
            type="text"
            placeholder="Search by name, item or ID..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border bg-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* EMPTY STATE */}
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
              className="bg-white rounded-[2.5rem] shadow-sm border border-[#3D4035]/5 overflow-hidden"
            >
              {/* STATUS BAR */}
              <div className="px-8 py-4 bg-[#FBFBFA] border-b flex justify-between items-center">
                <span className="text-xs font-bold">
                  ID: {order._id.slice(-8).toUpperCase()}
                </span>

                <span className="text-xs">{order.status}</span>
              </div>

              <div className="p-8">
                <p className="text-lg font-bold">{order.user?.name}</p>

                <p className="text-sm text-gray-500">
                  ₹{order.totalAmount.toLocaleString()}
                </p>

                {order.status === "pending" && (
                  <div className="flex gap-4 mt-6">
                    <button
                      disabled={processingId === order._id}
                      onClick={() => updateStatus(order._id, "confirmed")}
                      className="px-6 py-3 bg-black text-white rounded-xl disabled:opacity-50"
                    >
                      Confirm
                    </button>

                    <button
                      disabled={processingId === order._id}
                      onClick={() => updateStatus(order._id, "rejected")}
                      className="px-6 py-3 border border-red-400 text-red-400 rounded-xl"
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
