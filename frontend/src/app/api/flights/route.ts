import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch flights
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightId = searchParams.get('id'); // Get flight ID from query parameters
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const departureDate = searchParams.get('departureDate');

  const { db } = await connectToDatabase();

  try {
    // If a flight ID is provided, return the specific flight
    if (flightId) {
      const flight = await db.collection('flights').findOne({ _id: new ObjectId(flightId) });
      return flight
        ? NextResponse.json(flight)
        : NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Build the query based on filters
    const query: any = {};
    if (origin && destination) {
      query.origin = origin;
      query.destination = destination;
    }
    if (departureDate) {
      query.departure = departureDate;
    }

    // Fetch filtered flights
    const flights = await db.collection('flights').find(query).toArray();
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}

// POST: Create a new flight
export async function POST(request: Request) {
  const { flightNumber, airline, origin, destination, departure, arrival, duration, price, seatsAvailable } =
    await request.json();

  if (
    !flightNumber ||
    !airline ||
    !origin ||
    !destination ||
    !departure ||
    !arrival ||
    !duration ||
    !price ||
    !seatsAvailable
  ) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('flights').insertOne({
      flightNumber,
      airline,
      origin,
      destination,
      departure: new Date(departure),
      arrival: new Date(arrival),
      duration,
      price,
      seatsAvailable,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Flight created successfully', flightId: result.insertedId });
  } catch (error) {
    console.error('Error creating flight:', error);
    return NextResponse.json({ error: 'Failed to create flight' }, { status: 500 });
  }
}

// PUT: Update a flight
export async function PUT(request: Request) {
  const { flightId, flightNumber, airline, origin, destination, departure, arrival, duration, price, seatsAvailable } =
    await request.json();

  if (!flightId) {
    return NextResponse.json({ error: 'Flight ID is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('flights').updateOne(
      { _id: new ObjectId(flightId) },
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

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json({ error: 'Failed to update flight' }, { status: 500 });
  }
}

// DELETE: Delete a flight
export async function DELETE(request: Request) {
  const { flightId } = await request.json();

  if (!flightId) {
    return NextResponse.json({ error: 'Flight ID is required' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('flights').deleteOne({ _id: new ObjectId(flightId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json({ error: 'Failed to delete flight' }, { status: 500 });
  }
}