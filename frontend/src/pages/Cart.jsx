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
    <div className="bg-[#FAF9F6] min-h-screen py-8 md:py-16 lg:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 border-b border-[#3D4035]/10 pb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A3AD91]">
              Your Selection
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#3D4035] mt-2">
              Shopping Bag
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#3D4035] hover:text-[#6B705C] transition-all group w-fit"
          >
            <HiOutlineArrowLeft className="mr-2 group-hover:-translate-x-2 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Back to Shop
            </span>
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] py-20 md:py-32 px-6 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-50">
              <HiOutlineShoppingBag className="text-3xl text-[#3D4035]/20" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3D4035] mb-4">
              Your bag is empty
            </h2>
            <p className="text-slate-400 mb-10 max-w-xs mx-auto text-sm italic">
              Explore our artisanal collection and find something special.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#3D4035] text-white px-10 py-4 rounded-xl font-bold tracking-[0.1em] uppercase text-[11px] hover:bg-black transition-all shadow-lg"
            >
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ITEM LIST */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-[2rem] p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 md:gap-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                >
                  {/* IMAGE */}
                  <div className="w-full sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#FBFBFA] rounded-2xl p-4 flex-shrink-0 flex items-center justify-center border border-slate-50 overflow-hidden">
                    <img
                      src={item.images?.[0] || item.images}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between w-full text-center sm:text-left">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-[9px] uppercase tracking-widest text-[#A3AD91] font-bold mb-1">
                        {item.category || "Artisanal"}
                      </p>
                      <Link
                        to={`/product/${item._id}`}
                        className="text-lg md:text-xl font-serif text-[#3D4035] hover:text-black transition-colors block leading-tight"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-4 md:gap-10 mt-2">
                      {/* Qty Selector */}
                      <div className="flex items-center bg-[#FAF9F6] rounded-xl p-1 border border-slate-100">
                        <button
                          onClick={() =>
                            qtyChangeHandler(
                              item._id,
                              Math.max(1, item.qty - 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#3D4035] hover:bg-white rounded-lg transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#3D4035]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            qtyChangeHandler(
                              item._id,
                              Math.min(item.countInStock || 10, item.qty + 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#3D4035] hover:bg-white rounded-lg transition-all"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right sm:text-left">
                        <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">
                          Total
                        </p>
                        <p className="text-[#3D4035] font-serif text-lg">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Mobile: Absolute / Desktop: Flex) */}
                  <button
                    onClick={() => removeItemHandler(item._id)}
                    className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </div>
              ))}
            </div>

            {/* SUMMARY PANEL */}
            <div className="lg:col-span-4 mt-8 lg:mt-0 lg:sticky lg:top-24">
              <div className="bg-[#3D4035] rounded-[2.5rem] p-8 md:p-10 text-[#FAF9F6] shadow-2xl shadow-[#3D4035]/20">
                <h2 className="text-lg font-serif tracking-wide mb-8 border-b border-white/10 pb-4 text-[#F3E5AB]">
                  Cart Summary
                </h2>

                <div className="space-y-5 mb-10">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest opacity-70">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-[#A3AD91] italic">Complimentary</span>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="uppercase tracking-[0.2em] text-[10px] text-[#A3AD91]">
                      Grand Total
                    </span>
                    <span className="text-4xl font-serif text-[#F3E5AB]">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#FAF9F6] text-[#3D4035] py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-[#F3E5AB] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl"
                >
                  <HiOutlineSparkles className="text-lg" />
                  Proceed to Checkout
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
                  <HiOutlineShieldCheck className="text-lg" />
                  <p className="text-[9px] uppercase tracking-widest">
                    Secure Harvest Checkout
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
