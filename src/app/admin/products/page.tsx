import db from "@/lib/prisma/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AdminProductList from "@/components/AdminProductList";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login?callbackUrl=/admin/products");
  }

  const products = await db.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return <AdminProductList session={session} products={products} />;
}