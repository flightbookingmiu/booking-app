import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { hash } from 'bcryptjs';
export async function POST(request: Request) {
    const { name, email, password, phone, address, avatar } = await request.json();
  
    if (!name || !email || !password || !phone || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
  
    const { db } = await connectToDatabase();
  
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
  
    // Hash password
    const hashedPassword = await hash(password, 12);
  
    // Insert new user
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      avatar,
    });
  
    return NextResponse.json({ message: 'User registered successfully', userId: result.insertedId });
  }