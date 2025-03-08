// src/app/flight-details/page.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FlightCard from '@/app/components/FlightCard';

export default function FlightDetails() {
  const { data: session } = useSession();
  const router = useRouter();

  const flights = [
    {
      id: '1',
      airline: 'Airline X',
      origin: 'Nicosia',
      destination: 'London',
      price: 200,
      departure: '2025-03-01T10:00:00Z',
      arrival: '2025-03-01T14:00:00Z',
      baggage: '1 checked bag, 1 carry-on',
    },
    {
      id: '2',
      airline: 'Airline Y',
      origin: 'Athens',
      destination: 'New York',
      price: 800,
      departure: '2025-06-15T18:00:00Z',
      arrival: '2025-06-15T22:00:00Z',
      baggage: '2 checked bags',
    },
    // Add more flights as needed
  ];

  const handleBook = (id: string) => {
    if (session) {
      router.push(`/booking/step1?id=${id}`);
    } else {
      router.push(`/login?redirect=/booking/step1&id=${id}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Flights</h2>
      {flights.map(flight => (
        <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
      ))}
    </div>
  );
}