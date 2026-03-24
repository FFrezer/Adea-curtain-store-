// src/app/admin/products/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import db from "@/lib/prisma/db";
import EditProductForm from "@/components/EditProductForm";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

// Force SSR (no SSG)
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  if (!id) return notFound(); // safeguard

  const product = await db.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });

  if (!product) return notFound();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Product</h1>
      <EditProductForm product={product} />
    </div>
  );
}