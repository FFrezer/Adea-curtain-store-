"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const [visible, setVisible] = useState(isOpen);
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    hasMounted,
  } = useCart();

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  if (!hasMounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">🛒 Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 h-[calc(100%-220px)]">

          {cart.length === 0 ? (
            <div className="text-center mt-20 text-gray-500">
              <p className="text-lg font-medium">Your cart is empty 🛒</p>
              <p className="text-sm">Start adding some products</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex gap-4 border-b pb-4"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-medium line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>

                  {/* Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-3 py-1 text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3 bg-white sticky bottom-0">
            
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Checkout
            </button>

            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}