import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch user by email
export async function GET(
  request: Request,
  { params }: { params: { email: string } } // Destructure params directly
) {
  const { email } = params; // Extract email from params

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Decode the email (since it's URL-encoded)
    const decodedEmail = decodeURIComponent(email);

    // Fetch the user by email
    const user = await db.collection('users').findOne({ email: decodedEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user ID
    return NextResponse.json({ userId: user._id.toString() });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}