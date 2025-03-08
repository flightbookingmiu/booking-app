// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FlightCard from './components/FlightCard';
import { Box, Button, Radio, Checkbox, FormControlLabel, FormGroup, FormControl, FormLabel, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const [flights, setFlights] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false); // Track if it's client-side rendering
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 5;

  // Set isClient to true when the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = async (query: any) => {
    const params = new URLSearchParams();
    if (query.origin) params.append('origin', query.origin);
    if (query.destination) params.append('destination', query.destination);
    if (query.departureDate) params.append('departureDate', query.departureDate);
  
    // Fetch flights from the API
    const response = await fetch(`/api/flights?${params.toString()}`);
    
    if (!response.ok) {
      console.error('Failed to fetch flights:', response.statusText);
      return; // Handle error as needed
    }
  
    const data = await response.json();
  
    // Ensure data is an array of flight objects
    if (Array.isArray(data)) {
      setFlights(data);
    } else {
      console.error('Unexpected data format:', data);
    }
  };

  // Pagination logic
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="font-roboto">
      {/* SearchBar */}
      <SearchBar onSearch={handleSearch} />

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "25%", pr: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Filters
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
              Showing {flights.length} results
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <FormLabel component="legend" sx={{ fontWeight: "bold", mb: 2 }}>
                Stops
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Radio checked />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2">Any</Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        234
                      </Typography>
                    </Box>
                  }
                />
                <Typography variant="body2" sx={{ color: "#6b7280", ml: 4, mb: 2 }}>
                  From $443.19
                </Typography>
                <FormControlLabel
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2">Direct only</Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        1
                      </Typography>
                    </Box>
                  }
                />
                <Typography variant="body2" sx={{ color: "#6b7280", ml: 4, mb: 2 }}>
                  From $493.38
                </Typography>
                <FormControlLabel
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2">1 stop max</Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        129
                      </Typography>
                    </Box>
                  }
                />
                <Typography variant="body2" sx={{ color: "#6b7280", ml: 4, mb: 2 }}>
                  From $443.19
                </Typography>
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <FormLabel component="legend" sx={{ fontWeight: "bold", mb: 2 }}>
                Airlines
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2">American Airlines</Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        136
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked />}
                  label={
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2">United Airlines</Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        98
                      </Typography>
                    </Box>
                  }
                />
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: "bold", mb: 2 }}>
                Flight times
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked />}
                  label={<Typography variant="body2">Departing flight</Typography>}
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Box sx={{ width: "75%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button sx={{ color: "#1976d2", borderBottom: "2px solid #1976d2", pb: 1 }}>
                  Best
                </Button>
                <Button sx={{ color: "#6b7280", pb: 1 }}>Cheapest</Button>
                <Button sx={{ color: "#6b7280", pb: 1 }}>Fastest</Button>
              </Box>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Prices may change if there are{" "}
                <Link href="#" passHref>
                  <Button sx={{ color: "#1976d2", p: 0, minWidth: "auto" }}>additional baggage fees</Button>
                </Link>
              </Typography>
            </Box>
            {isClient && ( // Ensure this runs only on the client side
              currentFlights.length > 0 ? (
                currentFlights.map((flight) => (
                  <FlightCard key={flight._id.toString()} flight={{ ...flight, id: flight._id.toString() }} />
                ))
              ) : (
                <p className="text-gray-500">No flights found. Try adjusting your search criteria.</p>
              )
            )}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              {Array.from({ length: Math.ceil(flights.length / flightsPerPage) }, (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  sx={{ mx: 1, color: currentPage === index + 1 ? "#1976d2" : "#6b7280" }}
                >
                  {index + 1}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}