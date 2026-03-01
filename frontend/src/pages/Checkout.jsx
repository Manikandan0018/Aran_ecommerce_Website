import React, { useContext, useState, useCallback, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { HiCheckCircle, HiTruck } from "react-icons/hi2";
import API from "../services/api";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
  });

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }, []);

  const placeOrderHandler = useCallback(async () => {
    if (placingOrder) return;
    if (cartItems.length === 0) return toast.error("Your cart is empty");
    if (
      !address.name ||
      !address.phone ||
      !address.pincode ||
      !address.street
    ) {
      return toast.error("Please fill the address fields");
    }

    try {
      setPlacingOrder(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) return toast.error("Please login to continue");

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || "",
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

      const { data: createdOrder } = await API.post("/orders", orderPayload, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      // WhatsApp Formatting
      const orderDetails = cartItems
        .map(
          (item, i) =>
            `${i + 1}. ${item.name} (x${item.qty}) - ₹${item.price * item.qty}`,
        )
        .join("\n");

      const message = `🛍️ *NEW ORDER: #${createdOrder._id.slice(-6)}*\n\n*Customer:* ${address.name}\n*Phone:* ${address.phone}\n\n*Address:*\n${address.street}, ${address.city} - ${address.pincode}\n\n*Items:*\n${orderDetails}\n\n*Total Amount: ₹${totalPrice}*\n\n_Sent from Website_`;

      window.open(
        `https://wa.me/917826920882?text=${encodeURIComponent(message)}`,
        "_blank",
      );
      toast.success("Order request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setPlacingOrder(false);
    }
  }, [cartItems, address, totalPrice, placingOrder]);

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
     

      <div className="max-w-[1200px] mx-auto sm:px-4 flex flex-col lg:flex-row gap-4">
        <div className="lg:w-[68%] space-y-4">
         

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <div className="bg-[#458afa] p-4 text-white flex gap-4">
          
              <p className="font-bold uppercase text-sm">Delivery Address</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                name="name"
                value={address.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-3 rounded-sm text-sm focus:border-[#2874f0] outline-none"
              />
              <input
                required
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="border p-3 rounded-sm text-sm focus:border-[#2874f0] outline-none"
              />
              <input
                required
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="border p-3 rounded-sm text-sm focus:border-[#2874f0] outline-none"
              />
              <input
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                placeholder="City/District/Town"
                className="border p-3 rounded-sm text-sm focus:border-[#2874f0] outline-none"
              />
              <textarea
                name="street"
                required
                value={address.street}
                onChange={handleChange}
                placeholder="Address (Area and Street)"
                className="border p-3 rounded-sm text-sm focus:border-[#2874f0] outline-none md:col-span-2 h-24"
              />
            
            </div>
          </div>

          {/* STEP 3: ORDER SUMMARY */}
          <div className="bg-white shadow-sm rounded-sm">
            <div className="p-4 border-b flex gap-4">
              <span className="bg-gray-100 text-[#2874f0] font-bold px-2 py-0.5 rounded-sm text-sm">
                1
              </span>
              <p className="font-bold uppercase text-sm text-gray-500">
                Order Summary
              </p>
            </div>
            <div className="p-4 bg-gray-50 border-b">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center mb-2"
                >
                  <p className="text-sm font-medium">
                    {item.name}{" "}
                    <span className="text-gray-400">x {item.qty}</span>
                  </p>
                  <p className="text-sm font-bold">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: PAYMENT (STARK ACTION) */}
          <div className="bg-white shadow-sm rounded-sm">
            <div className="p-4 flex gap-4 bg-gray-50">
              <span className="bg-gray-100 text-[#2874f0] font-bold px-2 py-0.5 rounded-sm text-sm">
                2
              </span>
              <p className="font-bold uppercase text-sm text-gray-500">
                Payment Options
              </p>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-6 text-green-700 bg-green-50 px-4 py-2 rounded-full text-sm font-bold">
                <HiTruck /> Complete order via WhatsApp for Cash on Delivery
              </div>
              <button
                onClick={placeOrderHandler}
                disabled={placingOrder}
                className="w-full md:w-80 bg-[#fb641b] text-white py-4 font-bold uppercase text-lg shadow-lg hover:bg-[#e65a16] transition-all disabled:opacity-50"
              >
                {placingOrder ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: PRICE SIDEBAR */}
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
                <span className="text-[#388e3c]">FREE</span>
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
