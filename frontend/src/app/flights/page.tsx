// src/app/flights/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import FlightCard from '../components/FlightCard';
import SearchBar from '../components/SearchBar';

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleSearch = async (query: any) => {
    const response = await fetch(`/api/flights?origin=${query.origin}&destination=${query.destination}&departureDate=${query.departureDate}`);
    const data = await response.json();
    setFlights(data);
  };

  const handleSelectFlight = (flightId: string) => {
    if (!isLoggedIn) {
      alert('Please log in or sign up to proceed with booking.');
      router.push('/auth/login');
    } else {
      router.push(`/booking/${flightId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Search Flights</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-8">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={() => handleSelectFlight(flight.id)}
          />
        ))}
      </div>
    </div>
  );
}