import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // ⭐ CRITICAL
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load cart when user changes
  useEffect(() => {
    if (!user?._id) {
      setCartItems([]);
      return;
    }

    const storedCart =
      JSON.parse(localStorage.getItem(`cartItems_${user._id}`)) || [];

    setCartItems(storedCart);
  }, [user]);

  // ✅ Save cart per user
  const updateCart = (items) => {
    setCartItems(items);

    if (user?._id) {
      localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(items));
    }
  };

  const addToCart = (product, qty) => {
    setCartItems((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);

      let updated;

      if (exists) {
        updated = prevCart.map((item) =>
          item._id === product._id ? { ...item, qty } : item,
        );
      } else {
        updated = [...prevCart, { ...product, qty }];
      }

      if (user?._id) {
        localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(updated));
      }

      return updated;
    });
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    updateCart(updated);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
