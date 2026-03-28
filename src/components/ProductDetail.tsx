"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ProductWithExtras } from "@/types/product";
import useCart from "@/hooks/useCart";

export default function ProductDetail({ product }: { product: ProductWithExtras }) {
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || product.image || "/images/placeholder.png"
  );
  const [justAdded, setJustAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const { addToCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.email === "admin@example.com";

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: selectedImage,
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });

    if (res.ok) router.push("/shop");
    else alert("Failed to delete");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      
      {/* 🖼️ IMAGE SECTION */}
      <div>
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden border shadow-sm">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex gap-3 mt-4 overflow-x-auto">
          {(product.images || []).map((img, i) => {
            const url = img?.url || product.image || "/images/placeholder.png";
            return (
              <div
                key={i}
                onClick={() => setSelectedImage(url)}
                className={`relative w-20 h-20 rounded-lg border cursor-pointer ${
                  selectedImage === url ? "border-black" : "border-gray-300"
                }`}
              >
                <Image src={url} alt="" fill className="object-cover rounded-lg" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 📦 PRODUCT INFO */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* Price */}
        <p className="text-2xl font-semibold text-gray-800 mt-2">
          ${product.price ? product.price.toFixed(2) : "—"}
        </p>

        {/* Variants */}
        {product.variants?.length ? (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Options</h3>
            <div className="flex gap-2 flex-wrap">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`px-3 py-1 border rounded ${
                    selectedVariant === v.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className="mt-8 w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800 transition"
        >
          Add to Cart 🛒
        </button>

        {/* Feedback */}
        {justAdded && (
          <p className="text-green-600 mt-2">✅ Added to cart</p>
        )}

        {/* Description */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description || "No description available."}
          </p>
        </div>

        {/* Admin */}
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="mt-8 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            🗑 Delete Product
          </button>
        )}
      </div>
    </div>
  );
}