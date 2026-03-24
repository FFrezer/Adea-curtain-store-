import { NextRequest, NextResponse } from "next/server"; 
import db from "@/lib/prisma/db";

export async function GET(req: NextRequest) {
  
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room");
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "8", 10);

    // Build filters as Record<string, any> to avoid TS errors
    const filters: Record<string, unknown> = {};

    if (room) filters.room = { contains: room, mode: "insensitive" };
    if (category) filters.category = { contains: category, mode: "insensitive" };
    if (search) filters.name = { contains: search, mode: "insensitive" };

    const totalCount = await db.product.count({ where: filters });
    const products = await db.product.findMany({
      where: filters,
      include: { images: true, variants: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const transformed = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      room: product.room ?? "",
      category: product.category,
      branch: product.branch,
      featured: product.featured,
      createdAt: product.createdAt,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        productId: img.productId,
        createdAt: img.createdAt,
      })),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        image: variant.image,
        productId: variant.productId,
      })),
    }));

    return NextResponse.json({
      products: transformed,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error("API /products error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}