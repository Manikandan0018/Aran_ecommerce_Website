import React, { useContext, useState, useCallback, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { HiOutlineMapPin, HiOutlineShoppingBag } from "react-icons/hi2";
import API from "../services/api";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  /* =========================
     MEMOIZED TOTAL PRICE
  ========================= */
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  /* =========================
     INPUT HANDLER
  ========================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* =========================
     PLACE ORDER
  ========================= */
  const placeOrderHandler = useCallback(async () => {
    if (placingOrder) return;

    if (cartItems.length === 0) return toast.error("Your bag is empty");

    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      return toast.error("Please provide complete delivery details");
    }

    try {
      setPlacingOrder(true);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo?.token) return toast.error("Login required");

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
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      /* ===== FORMAT WHATSAPP MESSAGE ===== */
      const orderDetails = cartItems
        .map(
          (item, index) =>
            `--------------------------\n` +
            `${index + 1}. ${item.name}\n` +
            `Qty: ${item.qty} | ₹${item.price}\n` +
            `Subtotal: ₹${item.price * item.qty}\n`,
        )
        .join("\n");

      const message = `
NEW ORDER RECEIVED
--------------------------
Order ID: ${createdOrder._id}
Date: ${new Date().toLocaleString()}

CUSTOMER DETAILS
Name: ${address.name}
Phone: ${address.phone}

DELIVERY ADDRESS
${address.street}
${address.city} - ${address.pincode}
India

ORDER ITEMS
${orderDetails}
--------------------------
TOTAL BILL: ₹${totalPrice.toFixed(2)}
--------------------------
Status: Pending Confirmation
Admin Panel: ${window.location.origin}/admin/orders
`;

      const whatsappURL = `https://wa.me/917826920882?text=${encodeURIComponent(
        message,
      )}`;

      window.open(whatsappURL, "_blank");

      toast.success("Order request sent via WhatsApp");
    } catch (error) {
      console.error(error);
      toast.error("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  }, [cartItems, address, totalPrice, placingOrder]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-[#3D4035] mb-3">
            Finalize Your Order
          </h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* LEFT: ADDRESS FORM */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-8">
                <HiOutlineMapPin />
                <h2>Delivery Information</h2>
              </div>

              <input
                name="name"
                placeholder="Recipient Name"
                onChange={handleChange}
                className="w-full mb-4 p-4 rounded-xl"
              />

              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="w-full mb-4 p-4 rounded-xl"
              />

              <input
                name="street"
                placeholder="Street"
                onChange={handleChange}
                className="w-full mb-4 p-4 rounded-xl"
              />

              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                className="w-full mb-4 p-4 rounded-xl"
              />

              <input
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
                className="w-full p-4 rounded-xl"
              />
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-2">
            <div className="bg-[#3D4035] rounded-[2.5rem] p-8 text-white sticky top-28">
              <h2 className="mb-6">Bag Summary</h2>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>
                      {item.name} x {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6 flex justify-between">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={placeOrderHandler}
                disabled={placingOrder}
                className="mt-8 w-full bg-white text-black py-4 rounded-xl disabled:opacity-60"
              >
                {placingOrder ? "Processing..." : "Place Order via WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Checkout);
