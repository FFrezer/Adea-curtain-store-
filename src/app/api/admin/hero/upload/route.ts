import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/db";
import path from "path";
import fs from "fs/promises";
import formidable, { Fields, Files } from "formidable";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const form = formidable({ multiples: false });
  const reqNode = req as unknown as import("http").IncomingMessage;

  const [fields, files]: [Fields, Files] = await new Promise((resolve, reject) =>
    form.parse(reqNode, (err, fields, files) => (err ? reject(err) : resolve([fields, files])))
  );

  const file = Array.isArray(files.image) ? files.image[0] : files.image;
  if (!file || !("filepath" in file)) {
    return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
  }

  // Save uploaded file
  const fileExt = path.extname(file.originalFilename || ".png");
  const fileName = `${uuidv4()}${fileExt}`;
  const destination = path.join(process.cwd(), "public", "uploads", fileName);

  const fileBuffer = await fs.readFile(file.filepath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, fileBuffer);

  const imageUrl = `/uploads/${fileName}`;

  const getField = (key: keyof Fields): string => {
    const val = fields[key];
    if (Array.isArray(val)) return val[0];
    return val || "";
  };

  // Create hero banner
  const createdBanner = await prisma.heroBanner.create({
    data: {
      imageUrl,
      title: getField("title"),
      subtitle: getField("subtitle"),
      buttonText: getField("buttonText"),
      buttonUrl: getField("buttonUrl"),
    },
  });

  return NextResponse.json({ success: true, banner: createdBanner });
}