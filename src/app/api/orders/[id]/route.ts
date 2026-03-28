import db from "@/lib/prisma/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await db.order.update({
    where: { id: params.id },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(updated);
}