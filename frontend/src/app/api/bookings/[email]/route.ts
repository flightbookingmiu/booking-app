import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch all bookings for a specific user by email
export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params; // User email

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Step 1: Fetch the user by email to get the userId
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Step 2: Fetch all bookings for the user
    const bookings = await db
      .collection('bookings')
      .find({ userId: new ObjectId(userId) })
      .toArray();

    // Step 3: Fetch flight details for each booking
    const bookingsWithFlights = await Promise.all(
      bookings.map(async (booking) => {
        const flight = await db
          .collection('flights')
          .findOne({ _id: new ObjectId(booking.flightId) });

        return {
          ...booking,
          flight, // Add flight details to the booking
        };
      })
    );

    return NextResponse.json(bookingsWithFlights);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST: Create a new booking for a specific user by email
export async function POST(
  request: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params; // User email
  const { flightId, fareType, extras, seatNumber, totalPrice, paymentStatus } = await request.json();

  if (!email || !flightId || !fareType || !seatNumber || !totalPrice || !paymentStatus) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Step 1: Fetch the user by email to get the userId
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Step 2: Create a new booking for the user
    const result = await db.collection('bookings').insertOne({
      userId: new ObjectId(userId),
      flightId: new ObjectId(flightId),
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

// PUT: Update a booking for a specific user by email
export async function PUT(
  request: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params; // User email
  const { bookingId, fareType, extras, seatNumber, totalPrice, paymentStatus } = await request.json();

  if (!email || !bookingId) {
    return NextResponse.json({ error: 'Email and Booking ID are required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Step 1: Fetch the user by email to get the userId
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Step 2: Update the booking for the user
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId), userId: new ObjectId(userId) }, // Ensure the booking belongs to the user
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

// DELETE: Delete a booking for a specific user by email
export async function DELETE(
  request: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params; // User email
  const { bookingId } = await request.json();

  if (!email || !bookingId) {
    return NextResponse.json({ error: 'Email and Booking ID are required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Step 1: Fetch the user by email to get the userId
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Step 2: Delete the booking for the user
    const result = await db.collection('bookings').deleteOne({
      _id: new ObjectId(bookingId),
      userId: new ObjectId(userId), // Ensure the booking belongs to the user
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}