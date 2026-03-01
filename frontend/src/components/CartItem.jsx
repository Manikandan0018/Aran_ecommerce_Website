import React from "react";
import { Link } from "react-router-dom";

const CartItem = React.memo(({ item, removeItemHandler, qtyChangeHandler }) => {
  return (
    <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row gap-6">
      {/* Product Image & Qty Control */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 border border-gray-100 p-2 flex items-center justify-center">
          <img
            src={item.images?.[0] || item.image}
            alt={item.name}
            className="max-h-full object-contain"
          />
        </div>

        {/* Qty Switcher */}
        <div className="flex items-center gap-0 border border-gray-300 rounded-sm overflow-hidden h-8">
          <button
            onClick={() =>
              qtyChangeHandler(item._id, Math.max(1, item.qty - 1))
            }
            className="w-8 h-full bg-white border-r border-gray-300 hover:bg-gray-50 font-bold"
          >
            -
          </button>
          <input
            type="text"
            readOnly
            value={item.qty}
            className="w-10 text-center text-sm font-bold focus:outline-none"
          />
          <button
            onClick={() => qtyChangeHandler(item._id, item.qty + 1)}
            className="w-8 h-full bg-white border-l border-gray-300 hover:bg-gray-50 font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2">
        <div>
          <Link
            to={`/product/${item._id}`}
            className="text-base font-medium text-gray-900 hover:text-[#2874f0] truncate block"
          >
            {item.name}
          </Link>
          <p className="text-sm text-gray-400 mt-1 capitalize">
            {item.category}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">
            ₹{item.price.toLocaleString()}
          </span>
          <span className="text-gray-400 line-through text-xs">
            ₹{item.price + 200}
          </span>
          <span className="text-[#388e3c] text-xs font-bold">
            Big deal
          </span>
        </div>

        <div className="flex gap-4 mt-6">
         
          <button
            onClick={() => removeItemHandler(item._id)}
            className="text-sm cursor-pointer text-red-500 font-bold uppercase hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Delivery Status */}
      <div className="w-full sm:w-48 text-sm">
        <p>
          Delivery by <span className="font-bold">5 days</span> |{" "}
          <span className="text-[#388e3c]">Free</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">7 Days Replacement Policy</p>
      </div>
    </div>
  );
});

export default CartItem;
