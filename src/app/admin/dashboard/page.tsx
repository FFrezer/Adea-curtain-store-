import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/prisma/db";
import { Order } from "@/lib/types";

// Client Components
import ChartClient from "./Chart";
import ExportButtonClient from "./ExportButton";
import OrderTableClient from "./OrderTableClient";
import LogoutButtonClient from "./LogoutButtonClient";
import Card from "./Card";

export default async function AdminDashboardPage() {
  // 🔐 Protect page
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth");

  if (isAdmin?.value !== "true") {
    redirect("/admin/login");
  }

  // 📦 Fetch Orders
  const ordersFromDB = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  const orders: Order[] = ordersFromDB.map(o => ({
    ...o,
    branch: o.branch ?? "UNKNOWN",
    createdAt: o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt),
  }));

  // 📊 Stats
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === "PENDING").length;
  const delivered = orders.filter(o => o.status === "DELIVERED").length;

  // 📅 Weekly
  const now = new Date();
  const last7Days = new Date();
  last7Days.setDate(now.getDate() - 7);

  const weeklyOrdersList = orders.filter(o => new Date(o.createdAt) >= last7Days);

  const weeklyOrders = weeklyOrdersList.length;
  const weeklyRevenue = weeklyOrdersList.reduce((sum, o) => sum + (o.total || 0), 0);

  // 🏪 Branch stats
  const branchStats: Record<string, number> = {};
  orders.forEach(o => {
    branchStats[o.branch] = (branchStats[o.branch] || 0) + 1;
  });

  // 🏆 Top branch
  let topBranch = "N/A";
  let max = 0;
  for (const [branch, count] of Object.entries(branchStats)) {
    if (count > max) {
      max = count;
      topBranch = branch;
    }
  }

  const latestOrder = orders[0];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <Header />

      {latestOrder && (
        <div className="bg-green-100 p-4 rounded-lg">
          🆕 New Order from {latestOrder.name || "Customer"}
        </div>
      )}

      {/* 📊 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Total Orders" value={totalOrders} />
        <Card title="Revenue" value={`${revenue} ETB`} />
        <Card title="This Week" value={weeklyOrders} />
        <Card title="Pending" value={pending} />
        <Card title="Delivered" value={delivered} />
      </div>

      {/* 💰 Weekly */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Weekly Revenue" value={`${weeklyRevenue} ETB`} />
        <Card title="Top Branch" value={topBranch} />
      </div>

      {/* 🏪 Branch Performance */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏪 Branch Performance</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(branchStats).map(([branch, count]) => (
            <div key={branch} className="border p-4 rounded-xl shadow">
              <h3 className="font-semibold">{branch}</h3>
              <p>{count} orders</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📈 Chart */}
      <ChartClient weeklyOrdersList={weeklyOrdersList} />

      {/* 🧾 Export */}
      <ExportButtonClient orders={orders} />

      {/* 📦 Orders Table */}
      <OrderTableClient orders={orders} />

      <LogoutButtonClient />
    </div>
  );
}

function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold">📊 Admin Dashboard</h1>
    </div>
  );
}