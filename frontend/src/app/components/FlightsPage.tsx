// src/app/pages/FlightsPage.tsx
import FlightList from '../components/FlightList';

const FlightsPage = ({ flights }: { flights: any[] }) => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Available Flights</h1>
      <FlightList flights={flights} />
    </div>
  );
};

export default FlightsPage;