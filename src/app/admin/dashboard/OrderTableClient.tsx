'use client';

import { Order } from "@/lib/types";

interface Props {
  orders: Order[];
}

export default function OrderTableClient({ orders }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">📦 Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Customer</th>
              <th className="p-2">Branch</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.name || "N/A"}</td>
                <td className="p-2">{o.branch}</td>
                <td className="p-2">{o.total} ETB</td>
                <td className="p-2">
                  <select
                    defaultValue={o.status}
                    onChange={async e => {
                      await fetch("/api/admin/update-order", {
                        method: "POST",
                        body: JSON.stringify({ id: o.id, status: e.target.value }),
                      });
                      location.reload();
                    }}
                    className="border p-1"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
                <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}