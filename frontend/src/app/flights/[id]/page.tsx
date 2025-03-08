"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { FlightTakeoff, AirplaneTicket, AccessTime } from "@mui/icons-material";
import styled from "@emotion/styled";

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f5f7fa",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 600,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

export default function FlightDetails({ params }) {
  const router = useRouter();
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (params.id) {
        const response = await fetch(`/api/flights/${params.id}`);
        if (!response.ok) {
          console.error('Failed to fetch flight details');
          return;
        }
        const data = await response.json();
        setFlight(data);
      }
    };

    fetchFlightDetails();
  }, [params.id]);

  const handleSelect = () => {
    router.push('/booking');
  };

  if (!flight) {
    return (
      <StyledContainer>
        <CircularProgress sx={{ color: "#1976d2" }} />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledCard>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Your flight to {flight.destination}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FlightTakeoff sx={{ color: "#1976d2" }} />
            {flight.origin} to {flight.destination}
          </Typography>
          <Button onClick={() => router.back()} sx={{ color: "#999" }}>
            <i className="fas fa-times"></i>
          </Button>
        </Box>

        <Box sx={{ mb: 4, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
            Direct · {flight.duration}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Airline: {flight.airline}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Baggage
        </Typography>
        <Box sx={{ mb: 4, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography variant="body2">1 personal item - Fits under the seat in front</Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>Included</Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Fare Rules
        </Typography>
        <Box sx={{ mb: 4, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography variant="body2">You’re allowed to change this flight</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e0e0e0", pt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            ${flight.price.toFixed(2)}
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: "#1976d2", color: "#fff" }} onClick={handleSelect}>
            Select
          </Button>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
}