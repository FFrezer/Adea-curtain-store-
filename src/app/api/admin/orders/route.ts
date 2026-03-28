//src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/db";

export async function POST(req: Request) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: body,
  });

  return NextResponse.json(order);
}