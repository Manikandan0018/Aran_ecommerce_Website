import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { HiTruck } from "react-icons/hi2";
import API from "../services/api";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);

  const [placingOrder, setPlacingOrder] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
  });

  /* ===============================
     FETCH SAVED ADDRESSES
  ================================ */
  useEffect(() => {
    const fetchAddresses = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) return;

      try {
        const { data } = await API.get("/users/addresses", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setSavedAddresses(data);
      } catch {
        toast.error("Failed to load saved addresses");
      }
    };

    fetchAddresses();
  }, []);



  const deleteAddress = async (id) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    try {
      const { data } = await API.delete(`/users/addresses/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      setSavedAddresses(data);

      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }

      toast.success("Address deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ===============================
     TOTAL PRICE
  ================================ */
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  /* ===============================
     INPUT CHANGE
  ================================ */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* ===============================
     PLACE ORDER
  ================================ */
  const placeOrderHandler = useCallback(async () => {
    if (placingOrder) return;

    if (cartItems.length === 0) {
      return toast.error("Your cart is empty");
    }

    if (
      !address.name ||
      !address.phone ||
      !address.pincode ||
      !address.street
    ) {
      return toast.error("Please fill the address fields");
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) return toast.error("Please login to continue");

    try {
      setPlacingOrder(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || "",
          weight: item.weight, // ⭐ variant weight
          price: item.price,
          quantity: item.qty,
        })),
        shippingAddress: {
          address: address.street,
          city: address.city,
          postalCode: address.pincode,
          country: "India",
        },
        phone: address.phone,
        totalAmount: totalPrice,
      };

      /* CREATE ORDER */
      const { data: createdOrder } = await API.post("/orders", orderPayload, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      /* SAVE ADDRESS IF NEW */
      if (!selectedAddressId) {
        const { data } = await API.post("/users/addresses", address, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setSavedAddresses(data);
      }

      /* WHATSAPP MESSAGE */
      /* WHATSAPP MESSAGE */
      const orderDetails = cartItems
        .map(
          (item, i) =>
            `${i + 1}. ${item.name} (${item.weight}) x${item.qty} - ₹${item.price * item.qty}`,
        )
        .join("\n");

      const message =
        `NEW ORDER #${createdOrder._id.slice(-6)}\n\n` +
        `Customer: ${address.name}\n` +
        `Phone: ${address.phone}\n\n` +
        `Address:\n${address.street}, ${address.city} - ${address.pincode}\n\n` +
        `Items:\n${orderDetails}\n\n` +
        `Total Amount: ₹${totalPrice}`;

      const phone = "917826920882"; // no + or spaces

      const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");

      toast.success("Order request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setPlacingOrder(false);
    }
  }, [cartItems, address, totalPrice, placingOrder, selectedAddressId]);

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      <div className="max-w-[1200px] mx-auto sm:px-4 flex flex-col lg:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="lg:w-[68%] space-y-4">
          {/* ADDRESS */}
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <div className="bg-[#458afa] p-4 text-white">
              <p className="font-bold uppercase text-sm">Delivery Address</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={address.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-3 rounded-sm text-sm"
              />

              <input
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="Mobile number"
                className="border p-3 rounded-sm text-sm"
              />

              <input
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="border p-3 rounded-sm text-sm"
              />

              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                className="border p-3 rounded-sm text-sm"
              />

              <textarea
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="Address"
                className="border p-3 rounded-sm text-sm md:col-span-2 h-24"
              />
            </div>
          </div>

          {savedAddresses.length > 0 && (
            <div className="md:col-span-2 mb-4 space-y-3">
              <p className="text-sm font-semibold">Saved Addresses</p>

              {savedAddresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`border p-3 rounded cursor-pointer flex justify-between ${
                    selectedAddressId === addr._id
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedAddressId(addr._id);
                      setAddress(addr);
                    }}
                  >
                    <p className="text-sm font-medium">{addr.name}</p>
                    <p className="text-xs text-gray-600">
                      {addr.street}, {addr.city} - {addr.pincode}
                    </p>
                    <p className="text-xs">{addr.phone}</p>
                  </div>

                  <button
                    onClick={() => deleteAddress(addr._id)}
                    className="text-red-500 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ORDER SUMMARY */}
          <div className="bg-white shadow-sm rounded-sm">
            <div className="p-4 border-b">
              <p className="font-bold uppercase text-sm text-gray-500">
                Order Summary
              </p>
            </div>

            <div className="p-4 bg-gray-50">
              {cartItems.map((item) => (
                <div
                  key={item._id + item.weight}
                  className="flex justify-between items-center mb-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.name} ({item.weight})
                    </p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>

                  <p className="text-sm font-bold">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white shadow-sm rounded-sm">
            <div className="p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-6 text-green-700 bg-green-50 px-4 py-2 rounded-full text-sm font-bold">
                <HiTruck /> Complete order via WhatsApp (Cash on Delivery)
              </div>

              <button
                onClick={placeOrderHandler}
                disabled={placingOrder}
                className="w-full md:w-80 bg-[#fb641b] text-white py-4 font-bold uppercase text-lg shadow-lg"
              >
                {placingOrder ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-[32%] h-fit sticky top-20">
          <div className="bg-white shadow-sm rounded-sm">
            <h3 className="text-gray-500 font-bold uppercase text-sm p-4 border-b">
              Price Details
            </h3>

            <div className="p-4 space-y-4">
              <div className="flex justify-between text-base">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-base">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>

              <div className="border-t border-dashed pt-4 flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Checkout);
