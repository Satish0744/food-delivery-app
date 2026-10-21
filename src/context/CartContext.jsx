import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => loadFromStorage("cart", []));
  const [appliedCoupon, setAppliedCoupon] = useState(() =>
    loadFromStorage("coupon", null)
  );

  useEffect(() => {
    saveToStorage("cart", cart);
  }, [cart]);

  useEffect(() => {
    saveToStorage("coupon", appliedCoupon);
  }, [appliedCoupon]);

  const addToCart = (item, customization = {}, quantity = 1) => {
    const customKey = JSON.stringify(customization);
    const cartId = `${item.id}-${customKey}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.cartId === cartId);
      if (existing) {
        return prev.map((c) =>
          c.cartId === cartId ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [
        ...prev,
        {
          cartId,
          id: item.id,
          name: item.name,
          image: item.image,
          basePrice: item.price,
          customization,
          quantity,
        },
      ];
    });
  };

  const increaseQty = (cartId) => {
    setCart((prev) =>
      prev.map((c) =>
        c.cartId === cartId ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  const decreaseQty = (cartId) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.cartId === cartId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getItemPrice = (cartItem) => {
    let price = cartItem.basePrice;
    const extras = cartItem.customization?.extras || [];
    extras.forEach((e) => (price += e.price));
    return price * cartItem.quantity;
  };

  const subtotal = cart.reduce((sum, item) => sum + getItemPrice(item), 0);

  const deliveryFee = subtotal === 0 ? 0 : subtotal > 500 ? 0 : 40;
  const taxes = Math.round(subtotal * 0.05);

  const discount = appliedCoupon ? appliedCoupon.discountValue : 0;

  const total = subtotal + deliveryFee + taxes - discount;

  const applyCoupon = (code) => {
    const coupons = {
      WELCOME50: { code: "WELCOME50", discountValue: 50, minOrder: 200 },
      FLAT100: { code: "FLAT100", discountValue: 100, minOrder: 400 },
      SAVE20: { code: "SAVE20", discountValue: 75, minOrder: 300 },
    };
    const coupon = coupons[code.toUpperCase()];
    if (!coupon) return { success: false, message: "Invalid coupon code" };
    if (subtotal < coupon.minOrder)
      return {
        success: false,
        message: `Minimum order of ₹${coupon.minOrder} required`,
      };
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon applied! You saved ₹${coupon.discountValue}` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        getItemPrice,
        subtotal,
        deliveryFee,
        taxes,
        discount,
        total,
        cartCount,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};