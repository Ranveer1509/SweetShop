import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CartContext } from "./cartContextValue";

const getStock = (item) => Number(item?.stock ?? item?.quantityAvailable ?? item?.availableQuantity ?? item?.quantity ?? 0);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart", error);
    }
  }, [cartItems]);

  const addToCart = (sweet, options = {}) => {
    if (!sweet?.id) return;

    const stock = getStock(sweet);
    if (stock <= 0) {
      toast.warning("This sweet is out of stock");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === sweet.id);

      if (existing) {
        if (existing.quantity >= getStock(existing)) {
          toast.warning("Maximum stock reached");
          return prev;
        }

        toast.success(`${sweet.name} added to cart`);
        return prev.map((item) =>
          item.id === sweet.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      toast.success(`${sweet.name} added to cart`);
      return [
        ...prev,
        {
          ...sweet,
          imageUrl: options.imageUrl || sweet.imageUrl,
          quantity: 1,
          stock
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    toast.info("Item removed from cart");
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.quantity >= getStock(item)) {
          toast.warning("Maximum stock reached");
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);

      if (updated.length < prev.length) {
        toast.info("Item removed from cart");
      }

      return updated;
    });
  };

  const clearCart = (showToast = true) => {
    if (showToast) toast.info("Cart cleared");
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const deliveryFee = cartSubtotal > 0 && cartSubtotal < 499 ? 49 : 0;
  const discount = cartSubtotal >= 999 ? Math.round(cartSubtotal * 0.1) : 0;
  const tax = Math.round((cartSubtotal - discount) * 0.05);
  const cartTotal = Math.max(cartSubtotal - discount + deliveryFee + tax, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        discount,
        tax,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
