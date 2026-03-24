"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number; 
  hasMounted: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  // ✅ Load cart on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
    setHasMounted(true);
  }, []);

  // ✅ Save cart when changed
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, hasMounted]);

  // ✅ Sync cart between tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart" && event.newValue) {
        setCart(JSON.parse(event.newValue));
        toast.success("Cart updated in another tab!");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!hasMounted) return null;

const addToCart = (product: Product) => {
  let message = "";

  setCart((prev) => {
    const existing = prev.find((item) => item.id === product.id);

    if (existing) {
      message = `${product.name} quantity increased`;
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    }

    message = `${product.name} added to cart`;
    return [...prev, { ...product, quantity: 1 }];
  });

  // ✅ SAFE: runs after React finishes render
  toast.success(message);
};


  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id: string, qty: number) =>
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );

  const clearCart = () => setCart([]);

  // ✅ Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total, 
       hasMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("Cart context must be used inside CartProvider");
  return context;
};
