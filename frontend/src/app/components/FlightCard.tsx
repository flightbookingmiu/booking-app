"use client";

import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { FlightTakeoff } from "@mui/icons-material";
import styled from "@emotion/styled";

// Custom styled components for consistent, premium design
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 2,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  background: "#ffffff",
  marginBottom: theme.spacing(2),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "transparent",
  color: "#1976d2",
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  border: "1px solid #1976d2",
  "&:hover": {
    background: "#f0f4ff",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
}));

const FlightCard = ({
  flight,
}: {
  flight: { id: string; origin: string; destination: string; airline: string; duration: string; price: number };
}) => {
  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <img
                alt="Airline logo"
                src="https://placehold.co/40x40"
                style={{ height: 40, width: 40, marginRight: 8 }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1e1e1e",
                    fontSize: "1.25rem",
                  }}
                >
                  {flight.origin} → {flight.destination}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                  }}
                >
                  {flight.airline}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                {flight.duration}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                  }}
                >
                  Included: personal item, carry-on bag, checked bag
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right", minWidth: "120px" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#2e7d32", // Green for price, matching Booking.com’s success color
                fontSize: "1.5rem",
                mb: 1,
              }}
            >
              ${flight.price.toFixed(2)}
            </Typography>
            <Link href={`/flights/${flight.id}`} passHref>
              <StyledButton
                component="a"
                size="small"
                sx={{ width: "100%", justifyContent: "center" }}
              >
                View details
              </StyledButton>
            </Link>
            <Link href={`/flights/${flight.id}`} passHref>
              <StyledButton
                component="a"
                size="small"
                sx={{ width: "100%", justifyContent: "center", mt: 1 }}
              >
                Explore ticket options
              </StyledButton>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default FlightCard;