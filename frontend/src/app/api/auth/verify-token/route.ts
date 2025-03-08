// src/app/api/auth/verify-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // npm install jsonwebtoken

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key"); // Replace with your secret
    return NextResponse.json({ id: decoded.id }, { status: 200 }); // Adjust based on your token payload
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}