'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import type { ProductWithExtras } from '@/types/product';
import useCart, { CartItem } from "@/hooks/useCart";


export default function ProductDetail({ product }: { product: ProductWithExtras }) {
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || product.image || "/images/placeholder.png"
  );
  const [justAdded, setJustAdded] = useState(false);
   const { addToCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'admin@example.com';

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Product deleted successfully.');
        router.push('/shop');
      } else {
        const data = await res.json();
        alert('Error deleting product: ' + data.error);
      }
    } catch (err) {
      alert('Unexpected error.');
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: selectedImage,
      quantity: 1,
    };

    addToCart(item); // update state & localStorage instantly
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-md border">
             <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-300 ease-in-out hover:scale-105"
              />
            </div>

            {/* Thumbnail Swatches */}
            <div className="flex mt-4 gap-3 overflow-x-auto pb-2">
              {(product.images || []).map((img: { url: string }, idx: number) => {
                const url = img?.url || product.image || "/images/placeholder.png";
                return (
                  <div
                    key={idx}
                    className={`w-20 h-20 relative border-2 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                      selectedImage === url ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(url)}
                  >
                    <Image
                      src={url}
                      alt={`variant-${idx}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-6">${product.price?.toFixed(2)}</p>

            {/* Add to Cart Button */}
            <button
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            {/* Subtle Feedback Message */}
            {justAdded && (
              <p className="text-green-600 mt-2 animate-fade-in">✅ Added to cart!</p>
            )}

            {/* Admin Delete Button */}
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
              >
                🗑️ Delete Product
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
