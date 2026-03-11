import { NextResponse } from "next/server";
import db from "@/lib/prisma/db";
import type { ProductWithExtras } from "@/types/product";

export async function GET() {
  try {
    // Use Record<string, any> for Prisma-safe filter
    const filters: Record<string, unknown> = { featured: true };

    const products = await db.product.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: { images: true, variants: true },
    });

    const transformed: ProductWithExtras[] = products.map((product) => ({
      ...product,
      images: product.images,
      variants: product.variants,
    }));

    return NextResponse.json({ products: transformed });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}