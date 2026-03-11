"use client";

import { useState } from "react";
import { ProductWithExtras } from "@/types/product";
import Image from "next/image";
import EditProductForm from "@/components/EditProductForm";
import { useCart } from "@/context/CartContext"; // ✅ import Cart context
import toast from "react-hot-toast";

interface ProductCardProps {
  product: ProductWithExtras;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const { addToCart } = useCart(); // ✅ get addToCart from context

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete product");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: product.images[0]?.url || "/placeholder.png",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="border rounded-xl p-4 shadow-md relative">
      {/* Admin buttons */}
      <div className="absolute top-2 right-2 space-x-2">
        <button
          onClick={() => setShowEdit(true)}
          className="text-blue-600 text-sm hover:underline"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 text-sm hover:underline"
        >
          🗑 Delete
        </button>
      </div>

      {/* Product details */}
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-600 mb-1">💰 ${product.price}</p>
      <p className="text-sm text-gray-500 mb-1">🏢 Branch: {product.branch}</p>
      <p className="text-sm text-gray-500 mb-1">🛏️ Room: {product.room}</p>
      <p className="text-sm text-gray-500 mb-2">📁 Category: {product.category}</p>

      {/* Images */}
      <div className="flex gap-2 overflow-x-auto">
        {product.images.map((img) => (
          <Image
            key={img.id}
            src={img.url}
            alt={product.name}
            width={100}
            height={100}
            className="rounded object-cover"
          />
        ))}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/80 transition"
      >
        🛒 Add to Cart
      </button>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <EditProductForm product={product} />
            <button
              className="mt-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
