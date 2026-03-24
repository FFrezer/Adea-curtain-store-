'use client';

import type { ProductWithExtras } from '@/types/product';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProductRoute, getProductApiRoute } from '@/lib/routes';

export default function EditProductForm({ product }: { product: ProductWithExtras }) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price?.toString() ?? '');
  const [branch, setBranch] = useState(product.branch);
  const [room, setRoom] = useState(product.room);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) return alert('Please enter a valid price');

    const res = await fetch(getProductApiRoute(product.id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: priceNum, branch, room, category, description }),
    });

    if (res.ok) {
      // fully type-safe page navigation
      router.push(getProductRoute(product.id));
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to update product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={product.id} />

      <div>
        <label className="block mb-1">Product Name</label>
        <input
          name="name"
          className="border px-3 py-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Price</label>
        <input
          name="price"
          type="number"
          step="0.01"
          className="border px-3 py-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Branch</label>
        <select
          name="branch"
          className="border px-3 py-2 w-full rounded"
          value={branch}
          onChange={(e) => setBranch(e.target.value as 'MERKATO' | 'PIASSA' | 'GERJI')}
          required
        >
          <option value="MERKATO">MERKATO</option>
          <option value="PIASSA">PIASSA</option>
          <option value="GERJI">GERJI</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Room</label>
        <input
          name="room"
          className="border px-3 py-2 w-full rounded"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <input
          name="category"
          className="border px-3 py-2 w-full rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          className="border px-3 py-2 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}