import { notFound } from "next/navigation";
import db from "@/lib/prisma/db";
import ProductDetail from "@/components/ProductDetail";


type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  if (!id) return <div>Product not found</div>;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!product) return <div>Product not found</div>;

  return <div>{product.name}</div>;
}
