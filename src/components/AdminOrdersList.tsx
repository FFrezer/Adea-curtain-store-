"use client";

import { useState } from "react";

export default function AdminOrdersList({ orders }: any) {
  const [orderList, setOrderList] = useState(orders);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">📦 Orders</h1>

      {orderList.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orderList.map((order: any) => (
            <div key={order.id} className="border p-5 rounded-xl shadow-sm">
              
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Branch:</strong> {order.branch}</p>
              <p><strong>Total:</strong> {order.total} ETB</p>

              {/* STATUS */}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              {/* CHANGE STATUS */}
              <select
                value={order.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  await fetch(`/api/orders/${order.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                  });

                  setOrderList((prev: any) =>
                    prev.map((o: any) =>
                      o.id === order.id ? { ...o, status: newStatus } : o
                    )
                  );
                }}
                className="mt-2 border px-2 py-1 rounded"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERED">Delivered</option>
              </select>

              {/* ITEMS */}
              <div className="mt-3">
                <h3 className="font-semibold">Items:</h3>
                {order.items.map((item: any) => (
                  <p key={item.id} className="text-sm">
                    • {item.name} × {item.quantity}
                  </p>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}