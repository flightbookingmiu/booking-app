import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

// GET: Fetch users (all or by email)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email'); // Get email from query parameters

  const { db } = await connectToDatabase();

  try {
    if (email) {
      // Fetch user by email
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Return the user without sensitive information (e.g., password)
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);
    } else {
      // Fetch all users
      const users = await db.collection('users').find({}).toArray();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  const { name, email, password, phone, address, avatar } = await request.json();

  if (!name || !email || !password || !phone || !address) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
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
      avatar: avatar || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT: Update a user
export async function PUT(request: Request) {
  const { userId, name, email, phone, address, avatar } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name, email, phone, address, avatar, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}