'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Order } from "@/lib/types";

interface Props {
  weeklyOrdersList: Order[];
}

export default function ChartClient({ weeklyOrdersList }: Props) {
  const map: Record<string, number> = {};

  weeklyOrdersList.forEach(o => {
    const date = new Date(o.createdAt).toLocaleDateString();
    map[date] = (map[date] || 0) + 1;
  });

  const data = Object.entries(map).map(([date, count]) => ({
    date,
    orders: count,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="mb-4 font-semibold">📈 Orders (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="orders" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}