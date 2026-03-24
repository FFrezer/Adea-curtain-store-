'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext' // adjust the path as needed
import Image from 'next/image';


interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const [visible, setVisible] = useState(isOpen)
  const router = useRouter()

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    hasMounted,
  } = useCart()

  useEffect(() => {
    setVisible(isOpen)
  }, [isOpen])

  if (!hasMounted) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                <div className="relative w-16 h-16">
               <Image
               src={item.image}
               alt={item.name}
              fill
              className="object-cover rounded"
               />
              </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 text-xs bg-gray-200 rounded"
                    >−</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-xs bg-gray-200 rounded"
                    >+</button>
                  </div>
                  <p className="text-sm font-semibold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t space-y-2">
          {cart.length > 0 && (
            <>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-sm bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
              >
                Clear Cart
              </button>

              <button
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
