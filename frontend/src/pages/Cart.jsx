import { useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HiShieldCheck } from "react-icons/hi2";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCart } = useContext(CartContext);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const qtyChangeHandler = useCallback(
    (id, qty) => {
      const updated = cartItems.map((item) =>
        item._id === id ? { ...item, qty: Number(qty) } : item,
      );
      updateCart(updated);
    },
    [cartItems, updateCart],
  );

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#f1f3f6] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 shadow-sm rounded-sm text-center max-w-md w-full">
          <img
            src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4dda-b051-35c0518177a8.png?q=90"
            alt="empty"
            className="w-48 mx-auto mb-4"
          />
          <h2 className="text-xl font-medium mb-2">Your cart is empty!</h2>
          <p className="text-sm text-gray-500 mb-6">Add items to it now.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-medium shadow-md"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT: ITEM LIST */}
          <div className="lg:w-[68%]">
            <div className="bg-white shadow-sm rounded-sm mb-4">
              <div className="p-4 border-b flex justify-between items-center">
                <h1 className="text-lg font-medium">
                  My Cart ({cartItems.length})
                </h1>
              
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    removeItemHandler={removeFromCart}
                    qtyChangeHandler={qtyChangeHandler}
                  />
                ))}
              </div>

              {/* STICKY PLACE ORDER BUTTON (Desktop) */}
              <div className="p-4 bg-white border-t flex justify-end sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-[#fb641b] text-white px-12 py-4 rounded-sm font-bold uppercase text-base shadow-md hover:bg-opacity-90"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PRICE DETAILS */}
          <div className="lg:w-[32%] h-fit sticky top-20">
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
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
              <div className="p-4 border-t bg-gray-50">
                <p className="text-[#388e3c] font-bold text-sm flex items-center gap-1">
                  You will save ₹0 on this order
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-gray-500 text-sm font-bold p-2">
              <HiShieldCheck className="text-2xl" />
              <span>
                100% verified Natural Products
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
