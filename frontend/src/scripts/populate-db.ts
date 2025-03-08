import { MongoClient, ObjectId } from 'mongodb';
import { hash } from 'bcryptjs';

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const dbName = 'flight-booking'; // Replace with your database name

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+1234567890',
    address: '123 Main St, New York, USA',
    avatar: '/profiles/profile-john.jpg',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phone: '+0987654321',
    address: '456 Elm St, London, UK',
    avatar: '/profiles/profile-jane.jpg',
  },
];

const flights = [
  {
    flightNumber: 'BA123',
    airline: 'British Airways',
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    departure: new Date('2024-01-01T10:00:00Z'),
    arrival: new Date('2024-01-01T18:30:00Z'),
    duration: 510,
    price: 350,
    seatsAvailable: 150,
  },
  {
    flightNumber: 'AA456',
    airline: 'American Airlines',
    origin: 'Los Angeles (LAX)',
    destination: 'Chicago (ORD)',
    departure: new Date('2024-01-02T08:00:00Z'),
    arrival: new Date('2024-01-02T12:00:00Z'),
    duration: 240,
    price: 200,
    seatsAvailable: 200,
  },
  {
    flightNumber: 'DL789',
    airline: 'Delta Airlines',
    origin: 'Atlanta (ATL)',
    destination: 'Miami (MIA)',
    departure: new Date('2024-01-03T09:00:00Z'),
    arrival: new Date('2024-01-03T11:00:00Z'),
    duration: 120,
    price: 150,
    seatsAvailable: 180,
  },
];

const bookings = [
  {
    userId: new ObjectId(), // Will be replaced with actual user ID
    flightId: new ObjectId(), // Will be replaced with actual flight ID
    fareType: 'economy',
    extras: {
      baggage: true,
      meals: false,
      insurance: true,
    },
    seatNumber: 15,
    totalPrice: 420,
    paymentStatus: 'paid',
  },
  {
    userId: new ObjectId(), // Will be replaced with actual user ID
    flightId: new ObjectId(), // Will be replaced with actual flight ID
    fareType: 'business',
    extras: {
      baggage: true,
      meals: true,
      insurance: false,
    },
    seatNumber: 5,
    totalPrice: 600,
    paymentStatus: 'paid',
  },
];

// Main function to populate the database
async function populateDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Insert users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hash(user.password, 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const userInsertResult = await db.collection('users').insertMany(hashedUsers);
    console.log(`${userInsertResult.insertedCount} users inserted`);

    // Insert flights
    const flightInsertResult = await db.collection('flights').insertMany(flights);
    console.log(`${flightInsertResult.insertedCount} flights inserted`);

    // Insert bookings
    const userIds = Object.values(userInsertResult.insertedIds);
    const flightIds = Object.values(flightInsertResult.insertedIds);

    const populatedBookings = bookings.map((booking, index) => ({
      ...booking,
      userId: userIds[index % userIds.length],
      flightId: flightIds[index % flightIds.length],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const bookingInsertResult = await db.collection('bookings').insertMany(populatedBookings);
    console.log(`${bookingInsertResult.insertedCount} bookings inserted`);
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
populateDatabase();