'use client';

import { useState, useEffect } from 'react';
import { ProductWithExtras } from '@/types/ProductWithExtras';

interface ProductEditModalProps {
  product: ProductWithExtras;
  onClose: () => void;
  onUpdated: (updatedProduct: ProductWithExtras) => void;
}

const BRANCHES = ['MERKATO', 'PIASSA', 'GERJI'] as const;
const ROOMS = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom'];
const CATEGORIES = ['Curtains', 'Blinds', 'Accessories'];

type Branch = typeof BRANCHES[number];

export default function ProductEditModal({
  product,
  onClose,
  onUpdated,
}: ProductEditModalProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price?.toString() ?? '');
  const [branch, setBranch] = useState<Branch>(product.branch);
  const [room, setRoom] = useState(product.room);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description ?? '');

  useEffect(() => {
    setName(product.name);
    setPrice(product.price?.toString() ?? '');
    setBranch(product.branch);
    setRoom(product.room);
    setCategory(product.category);
    setDescription(product.description ?? '');
  }, [product]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price: price === '' ? null : Number(price),
        branch,
        room,
        category,
        description,
      }),
    });

    if (res.ok) {
      const updatedProduct = await res.json();
      onUpdated(updatedProduct);
      onClose();
    } else {
      alert('Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold">Edit Product</h2>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-1 font-medium">
            Price
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-2 py-1"
            min={0}
            step={0.01}
          />
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="branch" className="block mb-1 font-medium">
            Branch
          </label>
         <select
         value={branch}
        onChange={(e) => setBranch(e.target.value as Branch)}
        >
         {BRANCHES.map((b) => (
        <option key={b} value={b}>{b}</option>
         ))}
        </select>

        </div>

        {/* Room */}
        <div>
          <label htmlFor="room" className="block mb-1 font-medium">
            Room
          </label>
          <select
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            {ROOMS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
