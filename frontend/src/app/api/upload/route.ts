import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `profile-${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), "public", "profiles", fileName);

    // Ensure the "profiles" directory exists
    if (!fs.existsSync(path.join(process.cwd(), "public", "profiles"))) {
      fs.mkdirSync(path.join(process.cwd(), "public", "profiles"), { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ filePath: `/profiles/${fileName}` });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}