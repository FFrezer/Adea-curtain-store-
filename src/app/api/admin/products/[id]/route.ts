// src/app/api/product/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/db";

interface ProductUpdateBody {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  branch?: "MERKATO" | "PIASSA" | "GERJI";
  room?: string;
}

// GET /api/product/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true, variants: true, detailImages: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/product/[id]
export async function PUT(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: ProductUpdateBody = await _req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        branch: body.branch,
        room: body.room,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/product/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Delete related images and variants first
    await prisma.image.deleteMany({ where: { productId: params.id } });
    await prisma.productImage.deleteMany({ where: { productId: params.id } });
    await prisma.variant.deleteMany({ where: { productId: params.id } });

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}