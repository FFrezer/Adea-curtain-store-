"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function OrderSuccessPage() {
  const { order } = useCartStore();

  if (!order) {
    return <div className="p-6">No order found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto text-center py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">✅ Order Sent!</h1>

      <p className="text-gray-600 mb-6">
        Thank you <strong>{order.name}</strong> — your order has been sent via WhatsApp.
      </p>

      <div className="border rounded-lg p-4 mb-6 text-left">
        <p><strong>Total:</strong> {order.total} ETB</p>
        <p><strong>Branch:</strong> {order.delivery}</p>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Our team will contact you shortly to confirm your order.
      </p>

      <Link
        href="/shop"
        className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        Continue Shopping
      </Link>
    </div>
  );
}