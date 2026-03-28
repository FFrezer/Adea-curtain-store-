import { NextResponse } from "next/server";
import db from "@/lib/prisma/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, address, branch, items, total, images } = body;

    // ✅ 1. SAVE TO DATABASE
    const order = await db.order.create({
      data: {
        name,
        email,
        address,
        branch,
        total,
        images,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // ✅ 2. SEND EMAIL
    const orderText = `
🧾 ADE Curtain Store - New Order

👤 Name: ${name}
📧 Email: ${email}
🏬 Branch: ${branch}
🏠 Address: ${address}

🛒 Items:
${items
  .map(
    (item: any) =>
      `• ${item.name} x${item.quantity} - ${item.price * item.quantity} ETB`
  )
  .join("\n")}

💰 Total: ${total} ETB
`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_RECEIVER,
      subject: "🧾 New Curtain Order - ADE Store",
      text: orderText,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}