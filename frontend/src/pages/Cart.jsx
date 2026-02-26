import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCart } = useContext(CartContext);

  const removeItemHandler = (id) => {
    removeFromCart(id);
    toast.success("Removed from collection");
  };

  const qtyChangeHandler = (id, qty) => {
    const updated = cartItems.map((item) =>
      item._id === id ? { ...item, qty: Number(qty) } : item,
    );
    updateCart(updated);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <div className="bg-[#F9F6F0] min-h-screen py-10 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#3D4035]/10 pb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
              Your Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-[#3D4035] uppercase tracking-tighter mt-2">
              Shopping Bag
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#3D4035] opacity-60 hover:opacity-100 transition-all group"
          >
            <HiOutlineArrowLeft className="mr-2 group-hover:-translate-x-2 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Return to Harvest
            </span>
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-32 px-6 text-center border border-[#3D4035]/5 shadow-sm">
            <div className="w-24 h-24 bg-[#F9F6F0] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#3D4035]/5">
              <HiOutlineShoppingBag className="text-4xl text-[#3D4035]/30" />
            </div>
            <h2 className="text-3xl font-bold text-[#3D4035] uppercase tracking-tighter mb-4">
              Your bag is empty
            </h2>
            <p className="text-[#6B705C] mb-10 max-w-sm mx-auto font-medium italic">
              "Every great kitchen starts with a single artisanal choice."
            </p>
            <Link
              to="/"
              className="inline-block bg-[#3D4035] text-[#F3E5AB] px-12 py-5 rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] hover:bg-black transition-all shadow-xl shadow-[#3D4035]/20"
            >
              Discover Organics
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* ITEM LIST */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-[2.5rem] p-4 md:p-6 flex flex-row items-center gap-4 md:gap-8 border border-[#3D4035]/5 hover:shadow-lg hover:shadow-[#3D4035]/5 transition-all duration-500"
                >
                  {/* IMAGE - MAINTAINING FULL VISIBILITY */}
                  <div className="w-24 h-24 md:w-36 md:h-36 bg-[#FBFBFA] rounded-3xl p-3 flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#3D4035]/5">
                    <img
                      src={item.images?.[0] || item.images}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-black mb-1">
                        {item.category}
                      </p>
                      <Link
                        to={`/product/${item._id}`}
                        className="text-base md:text-xl font-bold text-[#3D4035] hover:text-black transition-colors block truncate pr-4"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      {/* Qty Selector */}
                      <div className="flex items-center bg-[#F9F6F0] rounded-xl p-1 border border-[#3D4035]/5">
                        <button
                          onClick={() =>
                            qtyChangeHandler(
                              item._id,
                              Math.max(1, item.qty - 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#3D4035] font-bold hover:bg-white rounded-lg transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black text-[#3D4035]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            qtyChangeHandler(
                              item._id,
                              Math.min(item.countInStock, item.qty + 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#3D4035] font-bold hover:bg-white rounded-lg transition-all"
                        >
                          +
                        </button>
                      </div>

                      <div className="hidden md:block">
                        <p className="text-[9px] uppercase text-[#8C8C83] font-black tracking-widest mb-1">
                          Price
                        </p>
                        <p className="text-[#3D4035] font-bold text-sm italic">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="ml-auto md:ml-0 text-right md:text-left">
                        <p className="text-[9px] uppercase text-[#8C8C83] font-black tracking-widest mb-1">
                          Total
                        </p>
                        <p className="text-[#3D4035] font-black text-sm md:text-lg tracking-tighter">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItemHandler(item._id)}
                    className="p-2 md:p-4 text-[#8C8C83] hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="text-xl md:text-2xl" />
                  </button>
                </div>
              ))}
            </div>

            {/* SUMMARY PANEL */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="bg-[#3D4035] rounded-[3rem] p-8 md:p-10 text-[#F3E5AB] shadow-2xl shadow-[#3D4035]/30">
                <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-[#F3E5AB]/20 pb-4">
                  Cart Summary
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-white italic">Complimentary</span>
                  </div>

                  <div className="pt-6 border-t border-[#F3E5AB]/20 flex justify-between items-end">
                    <span className="font-black uppercase tracking-[0.2em] text-xs">
                      Total Amount
                    </span>
                    <span className="text-4xl font-black tracking-tighter leading-none">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#F3E5AB] text-[#3D4035] py-6 rounded-2xl font-black tracking-[0.2em] uppercase text-[11px] hover:bg-white transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <HiOutlineSparkles className="text-lg" />
                  Click to Order
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
                  <HiOutlineShieldCheck className="text-lg" />
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    SSL Encrypted Harvest
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
