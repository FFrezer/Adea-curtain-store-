'use client';

import { useState, useMemo } from 'react';
import ProductCard from "@/components/ProductCard"; 
import Link from 'next/link';
import useProducts from '@/hooks/useProducts';
import useFeaturedProducts from '@/hooks/useFeaturedProducts';
import { CATEGORIES } from '@/constants/categories';

export default function ShopPage() {
  const [category, setCategory] = useState('All');
  const [search ] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [page, setPage] = useState(1);

  const { products, loading, error } = useProducts({ page, roomFilter, category, search });
  const { featuredProducts } = useFeaturedProducts();

  const featuredIds = useMemo(() => new Set(featuredProducts.map(p => p.id)), [featuredProducts]);
  const filtered = products.filter(p => !featuredIds.has(p.id));

  return (
    <div className="p-0">
      {/* Category Filter */}
      <div className="mb-2">
        <label className="block mb-1 font-medium">Filter by Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded w-full md:w-64"
        >
          <option value="All">All</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Room Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Room filter buttons">
        {['Bedroom', 'Livingroom', 'Kidsroom', 'Office'].map(room => (
          <button
            key={room}
            onClick={() => setRoomFilter(room)}
            aria-pressed={roomFilter === room}
            className={`px-3 py-1 rounded-full border ${roomFilter === room ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {room}
          </button>
        ))}
        {roomFilter && (
          <button
            onClick={() => setRoomFilter('')}
            className="px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300"
          >
            Clear Room Filter
          </button>
        )}
      </div>


      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mb-8" aria-label="Featured products">
          <h2 className="text-2xl font-bold mb-4">🌟 Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link href={`/shop/${product.id}`} key={product.id} className="block">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product List */}
      {loading ? (
        <p className="text-center text-gray-400">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" aria-live="polite">
            {filtered.map(product => (
              <Link href={`/shop/${product.id}`} key={product.id} className="block">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${page}`}</span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 border rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
