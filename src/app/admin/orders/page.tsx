import db from "@/lib/prisma/db";
import AdminOrdersList from "@/components/AdminOrdersList";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return <AdminOrdersList orders={orders} />;
}