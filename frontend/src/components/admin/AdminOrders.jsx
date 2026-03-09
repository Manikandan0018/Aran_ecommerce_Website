import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../../services/api";
import { timeAgo } from "../../utils/timeAgo";
import { HiOutlineInbox, HiOutlineMagnifyingGlass } from "react-icons/hi2";

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* =========================
     FILTER ORDERS
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
     UPDATE STATUS
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

  const markDelivered = async (id) => {
    try {
      setProcessingId(id);

      await API.put(
        `/orders/${id}/delivered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "delivered" } : order,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Loading Orders...
      </div>
    );

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto bg-[#FAF9F6] min-h-screen">
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between gap-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        <div className="relative w-full md:w-96">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* EMPTY STATE */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineInbox className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500">
            {searchTerm ? "No matching orders" : "No orders found"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-sm border p-8"
            >
              {/* TOP BAR */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-600"
                        : order.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* CUSTOMER */}
              <p className="font-bold text-lg">{order.user?.name}</p>
              <p className="text-sm text-gray-500 mb-4">
                {timeAgo(order.createdAt)}
              </p>

              {/* ORDER ITEMS */}
              <div className="space-y-3 border-t pt-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold">
                        {item.name} ({item.weight})
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>

              {/* ADDRESS */}
              <div className="mt-4 text-sm text-gray-600">
                <p>📞 {order.phone}</p>
                <p>
                  📍 {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city} -
                  {order.shippingAddress?.postalCode}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-6">
                {order.status === "pending" && (
                  <>
                    <button
                      disabled={processingId === order._id}
                      onClick={() => updateStatus(order._id, "confirmed")}
                      className="px-6 py-2 bg-black text-white rounded-xl"
                    >
                      Confirm
                    </button>

                    <button
                      disabled={processingId === order._id}
                      onClick={() => updateStatus(order._id, "rejected")}
                      className="px-6 py-2 border border-red-500 text-red-500 rounded-xl"
                    >
                      Reject
                    </button>
                  </>
                )}

                {order.status === "confirmed" && (
                  <button
                    disabled={processingId === order._id}
                    onClick={() => markDelivered(order._id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl"
                  >
                    Mark Delivered
                  </button>
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
