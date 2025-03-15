import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

// GET: Fetch all bookings
export async function GET() {
  const { db } = await connectToDatabase();

  try {
    const bookings = await db.collection('bookings').find({}).toArray();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST: Create a new booking
export async function POST(request: Request) {
  const { userId, flightId, fareType, extras, seatNumber, totalPrice, paymentStatus } = await request.json();

  if (!userId || !flightId || !fareType || !seatNumber || !totalPrice || !paymentStatus) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('bookings').insertOne({
      user: userId,
      flight: flightId,
      fareType,
      extras,
      seatNumber,
      totalPrice,
      paymentStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Booking created successfully', bookingId: result.insertedId });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PUT: Update a booking
export async function PUT(request: Request) {
  const { bookingId, fareType, extras, seatNumber, totalPrice, paymentStatus } = await request.json();

  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { fareType, extras, seatNumber, totalPrice, paymentStatus, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE: Delete a booking
export async function DELETE(request: Request) {
  const { bookingId } = await request.json();

  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(bookingId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}