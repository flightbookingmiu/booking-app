import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch a specific flight by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Validate the flight ID
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid flight ID' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Fetch the flight by ID
    const flight = await db.collection('flights').findOne({ _id: new ObjectId(id) });

    // If flight is not found, return a 404 error
    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Return the flight data
    return NextResponse.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    return NextResponse.json({ error: 'Failed to fetch flight' }, { status: 500 });
  }
}

// PUT: Update a specific flight by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { flightNumber, airline, origin, destination, departure, arrival, duration, price, seatsAvailable } =
    await request.json();

  // Validate the flight ID
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid flight ID' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Update the flight
    const result = await db.collection('flights').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          flightNumber,
          airline,
          origin,
          destination,
          departure: new Date(departure),
          arrival: new Date(arrival),
          duration,
          price,
          seatsAvailable,
          updatedAt: new Date(),
        },
      }
    );

    // If no flight was matched, return a 404 error
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Return success message
    return NextResponse.json({ message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json({ error: 'Failed to update flight' }, { status: 500 });
  }
}

// DELETE: Delete a specific flight by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Validate the flight ID
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid flight ID' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    // Delete the flight
    const result = await db.collection('flights').deleteOne({ _id: new ObjectId(id) });

    // If no flight was deleted, return a 404 error
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Return success message
    return NextResponse.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json({ error: 'Failed to delete flight' }, { status: 500 });
  }
}