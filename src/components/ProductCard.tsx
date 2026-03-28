"use client";

import Image from "next/image";
import { Prisma } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true; variants: true };
}>;

export default function ProductCard({ product }: { product: ProductWithImages }) {
  const { addToCart } = useCart();

  const image =
    product.image || product.images?.[0]?.url || "/placeholder.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // 🛑 prevent navigation when clicking button

    if (product.price == null) {
      toast.error("No price set");
      return;
    }

    addToCart({
      ...product,
      quantity: 1,
      price: product.price,
      image,
    });

    toast.success("Added to cart");
  };

  return (
    <div className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">
      
      {/* 🖼️ IMAGE */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Optional badge */}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>

      {/* 📦 CONTENT */}
      <div className="p-4 space-y-2">
        
        {/* Name */}
        <h2 className="font-semibold text-base line-clamp-2">
          {product.name}
        </h2>

        {/* Category */}
        <p className="text-xs text-gray-500">{product.category}</p>

        {/* Price */}
        <p className="text-lg font-bold">
          {product.price ? `$${product.price.toFixed(2)}` : "—"}
        </p>

        {/* Action */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 py-2 border rounded-lg text-sm hover:bg-black hover:text-white transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}