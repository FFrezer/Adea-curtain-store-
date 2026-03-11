'use client';

import Image from "next/image";
import { Product, Image as ProductImage } from "@prisma/client";

interface ProductWithExtras extends Product {
  images?: ProductImage[]; // make optional for safety
}

interface AdminProductCardProps {
  product: ProductWithExtras;
  onEdit?: () => void;
}

export default function AdminProductCard({ product, onEdit }: AdminProductCardProps) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Consider better state update rather than full reload:
        window.location.reload();
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Error deleting product");
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-md relative">
      <div className="absolute top-2 right-2 space-x-2">
        <button
          onClick={onEdit}
          className="text-blue-600 text-sm hover:underline"
          type="button"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 text-sm hover:underline"
          type="button"
        >
          🗑 Delete
        </button>
      </div>

      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-600 mb-1">💰 ${product.price}</p>
      <p className="text-sm text-gray-500 mb-1">🏢 Branch: {product.branch}</p>
      <p className="text-sm text-gray-500 mb-1">🛏️ Room: {product.room}</p>
      <p className="text-sm text-gray-500 mb-2">📁 Category: {product.category}</p>

      {/* Safe rendering of images */}
      <div className="flex gap-2 overflow-x-auto">
        {(product.images ?? []).map((img) => (
          <Image
            key={img.id}
            src={img.url}
            alt={`${product.name} image`}
            width={100}
            height={100}
            className="rounded object-cover"
          />
        ))}
      </div>
    </div>
  );
}
