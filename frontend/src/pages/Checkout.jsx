import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import {
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

import API from "../services/api"

const Checkout = () => {
  const { cartItems } = useContext(CartContext);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  
const placeOrderHandler = async () => {
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
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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

    // ✅ 1. Format Product Details with Image Links
    const orderDetails = cartItems
      .map(
        (item, index) =>
          `--------------------------\n` +
          `${index + 1}.  *${item.name}*\n` +
          `   Qty: ${item.qty} | Price: ₹${item.price}\n` +
          `   Subtotal: ₹${item.price * item.qty}\n` +
          `    View Image: ${item.images?.[0] || "No Image"}`,
      )
      .join("\n");

    // ✅ 2. Construct a professional, highly readable message
    const message = ` *NEW ORDER RECEIVED* 
--------------------------
 *Order ID:* ${createdOrder._id}
*Date:* ${new Date().toLocaleString()}

 *CUSTOMER DETAILS*
Name: ${address.name}
Phone: ${address.phone}

 *DELIVERY ADDRESS*
${address.street}
${address.city} - ${address.pincode}
India

 *ORDER ITEMS*
${orderDetails}
--------------------------
 *TOTAL BILL: ₹${totalPrice.toFixed(2)}*
--------------------------

 *Status:* Pending Confirmation
*Admin Panel:* ${window.location.origin}/admin/orders`;

    // ✅ 3. Launch WhatsApp
    const whatsappURL = `https://wa.me/917826920882?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");

    toast.success("Order request sent via WhatsApp");
  } catch (error) {
    console.error(error);
    toast.error("Order failed");
  }
};
  


  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-[#3D4035] mb-3">
            Finalize Your Order
          </h1>
          <p className="text-[#8C8C83] font-light italic">
            Confirm your details for a personal delivery experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* ✅ Address Form Section */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-[#F0F0EB]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#E5EADD] rounded-full flex items-center justify-center text-[#3D4035]">
                  <HiOutlineMapPin className="text-xl" />
                </div>
                <h2 className="text-2xl font-serif text-[#3D4035]">
                  Delivery Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] ml-2 mb-1 block">
                    Recipient Name
                  </label>
                  <input
                    name="name"
                    placeholder="e.g. Jane Doe"
                    onChange={handleChange}
                    className="w-full bg-[#F9F9F7] border-transparent rounded-2xl p-4 text-[#3D4035] outline-none focus:bg-white focus:ring-1 focus:ring-[#A3AD91] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] ml-2 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    placeholder="+91 00000 00000"
                    onChange={handleChange}
                    className="w-full bg-[#F9F9F7] border-transparent rounded-2xl p-4 text-[#3D4035] outline-none focus:bg-white focus:ring-1 focus:ring-[#A3AD91] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] ml-2 mb-1 block">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    placeholder="600001"
                    onChange={handleChange}
                    className="w-full bg-[#F9F9F7] border-transparent rounded-2xl p-4 text-[#3D4035] outline-none focus:bg-white focus:ring-1 focus:ring-[#A3AD91] transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] ml-2 mb-1 block">
                    Street Address
                  </label>
                  <input
                    name="street"
                    placeholder="House No, Apartment, Landmark"
                    onChange={handleChange}
                    className="w-full bg-[#F9F9F7] border-transparent rounded-2xl p-4 text-[#3D4035] outline-none focus:bg-white focus:ring-1 focus:ring-[#A3AD91] transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] ml-2 mb-1 block">
                    City / Town
                  </label>
                  <input
                    name="city"
                    placeholder="Your City"
                    onChange={handleChange}
                    className="w-full bg-[#F9F9F7] border-transparent rounded-2xl p-4 text-[#3D4035] outline-none focus:bg-white focus:ring-1 focus:ring-[#A3AD91] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-[#3D4035] rounded-[2.5rem] p-8 text-[#FAF9F6] sticky top-28 shadow-xl shadow-[#3d403520]">
              <div className="flex items-center gap-3 mb-8 border-b border-[#FAF9F6]/10 pb-6">
                <HiOutlineShoppingBag className="text-2xl text-[#E5EADD]" />
                <h2 className="text-xl font-serif uppercase tracking-widest">
                  Bag Summary
                </h2>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-[#FAF9F6]">
                        {item.name}
                      </span>
                      <span className="text-xs text-[#E5EADD]/60">
                        Qty: {item.qty}
                      </span>
                    </div>
                    <span className="font-serif italic text-[#E5EADD]">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#FAF9F6]/10">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#E5EADD]/80">
                    Total Due
                  </span>
                  <span className="text-3xl font-serif">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={placeOrderHandler}
                className="mt-10 w-full bg-[#FAF9F6] text-[#3D4035] py-5 rounded-2xl font-bold tracking-widest uppercase text-sm hover:bg-[#E5EADD] transition-all active:scale-[0.98] shadow-lg shadow-black/10 flex items-center justify-center gap-3"
              >
                Place Order via WhatsApp
              </button>

              <p className="text-[10px] text-center mt-6 text-[#E5EADD]/40 leading-relaxed">
                By clicking, you will be redirected to WhatsApp to confirm your
                order details with us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
