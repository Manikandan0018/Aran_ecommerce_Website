import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { HiOutlineTrash } from "react-icons/hi2";

const CartItem = React.memo(({ item, removeItemHandler, qtyChangeHandler }) => {
  const increaseQty = useCallback(() => {
    qtyChangeHandler(item._id, Math.min(item.countInStock || 10, item.qty + 1));
  }, [item, qtyChangeHandler]);

  const decreaseQty = useCallback(() => {
    qtyChangeHandler(item._id, Math.max(1, item.qty - 1));
  }, [item, qtyChangeHandler]);

  return (
    <div className="bg-white rounded-[2rem] p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4 md:gap-8 border border-slate-100 transition-all">
      <div className="w-32 h-32 bg-[#FBFBFA] rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <img
          src={item.images?.[0] || item.images}
          alt={item.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex-1 w-full">
        <p className="text-[9px] uppercase tracking-widest text-[#A3AD91] font-bold mb-1">
          {item.category || "Artisanal"}
        </p>

        <Link
          to={`/product/${item._id}`}
          className="text-lg font-serif text-[#3D4035]"
        >
          {item.name}
        </Link>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center bg-[#FAF9F6] rounded-xl p-1 border border-slate-100">
            <button onClick={decreaseQty} className="w-8 h-8">
              -
            </button>
            <span className="w-8 text-center text-xs font-bold">
              {item.qty}
            </span>
            <button onClick={increaseQty} className="w-8 h-8">
              +
            </button>
          </div>

          <p className="text-[#3D4035] font-serif text-lg">
            ₹{(item.price * item.qty).toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => removeItemHandler(item._id)}
        className="p-2 text-slate-300 hover:text-red-400"
      >
        <HiOutlineTrash className="text-xl" />
      </button>
    </div>
  );
});

export default CartItem;
