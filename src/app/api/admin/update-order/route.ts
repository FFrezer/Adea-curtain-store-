import db from "@/lib/prisma/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, status } = await req.json();

  await db.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}