"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import useProducts from "@/hooks/useProducts";
import useFeaturedProducts from "@/hooks/useFeaturedProducts";
import { CATEGORIES } from "@/constants/categories";

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");

  const { products, loading, error } = useProducts({
    page,
    roomFilter,
    category,
    search,
  });

  const { featuredProducts } = useFeaturedProducts();

  const featuredIds = useMemo(
    () => new Set(featuredProducts.map((p) => p.id)),
    [featuredProducts]
  );

  let filtered = products.filter((p) => !featuredIds.has(p.id));

  // 🔽 Sorting
  if (sort === "price-low") {
    filtered = [...filtered].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sort === "price-high") {
    filtered = [...filtered].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* 🔍 FILTER + SEARCH BAR */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border px-3 py-2 rounded"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Sorting */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="latest">Latest</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      {/* 🏠 ROOM FILTER */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["Bedroom", "Livingroom", "Kidsroom", "Office"].map((room) => (
          <button
            key={room}
            onClick={() => setRoomFilter(room)}
            className={`px-4 py-1 rounded-full border ${
              roomFilter === room
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {room}
          </button>
        ))}
        {roomFilter && (
          <button
            onClick={() => setRoomFilter("")}
            className="px-4 py-1 rounded-full bg-red-100 text-red-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* 🌟 FEATURED */}
      {featuredProducts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🌟 Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/shop/${product.id}`} key={product.id}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 📦 PRODUCTS */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <p className="text-lg font-medium">No products found 😕</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Link href={`/shop/${product.id}`} key={product.id}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* 🔁 PAGINATION */}
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={() => {
                setPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 font-medium">Page {page}</span>

            <button
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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