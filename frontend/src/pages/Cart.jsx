import { useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCart } = useContext(CartContext);

  // ✅ Memoize total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  // ✅ Memoize remove handler
  const removeItemHandler = useCallback(
    (id) => {
      removeFromCart(id);
      toast.success("Removed from collection");
    },
    [removeFromCart],
  );

  // ✅ Memoize qty change handler
  const qtyChangeHandler = useCallback(
    (id, qty) => {
      const updated = cartItems.map((item) =>
        item._id === id ? { ...item, qty: Number(qty) } : item,
      );
      updateCart(updated);
    },
    [cartItems, updateCart],
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h2>Your bag is empty</h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  removeItemHandler={removeItemHandler}
                  qtyChangeHandler={qtyChangeHandler}
                />
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-4">
              <div className="bg-[#3D4035] p-8 rounded-2xl text-white">
                <p>Subtotal ({cartItems.length} items)</p>

                <h2 className="text-3xl">₹{totalPrice.toLocaleString()}</h2>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full bg-white text-black py-3 rounded-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
