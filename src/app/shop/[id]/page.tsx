// src/app/shop/[id]/page.tsx
import { notFound } from "next/navigation";
import db from "@/lib/prisma/db";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { id } = await params; // ✅ unwrap the Promise

  if (!id) return notFound(); // safeguard

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}