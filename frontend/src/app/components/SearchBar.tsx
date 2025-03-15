"use client";

import { useState } from "react";
import Select from "react-select";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
} from "@mui/material";
import { FlightTakeoff, Person } from "@mui/icons-material";
import styled from "@emotion/styled";

// Custom styled components for consistent, premium design
const StyledContainer = styled(Box)(({ theme }) => ({
  background: "#f5f7fa",
  padding: theme.spacing(4, 0),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
}));

const StyledSearchBox = styled(Box)(({ theme }) => ({
  background: "#fff",
  padding: theme.spacing(3),
  borderRadius: 2,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "1200px",
  mx: "auto",
  border: `1px solid #e0e0e0`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976d2, #2196f3)",
  color: "#fff",
  padding: theme.spacing(1.5, 3),
  borderRadius: 8,
  "&:hover": {
    background: "linear-gradient(45deg, #1565c0, #1e88e5)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
}));

const airports = [
  { value: "JFK", label: "John F. Kennedy International Airport (JFK) - New York" },
  { value: "LAX", label: "Los Angeles International Airport (LAX) - Los Angeles" },
  { value: "ORD", label: "O'Hare International Airport (ORD) - Chicago" },
  { value: "DFW", label: "Dallas/Fort Worth International Airport (DFW) - Dallas" },
  { value: "ATL", label: "Hartsfield-Jackson Atlanta International Airport (ATL) - Atlanta" },
  { value: "LHR", label: "Heathrow Airport (LHR) - London" },
  { value: "CDG", label: "Charles de Gaulle Airport (CDG) - Paris" },
  { value: "DXB", label: "Dubai International Airport (DXB) - Dubai" },
  { value: "HND", label: "Haneda Airport (HND) - Tokyo" },
  { value: "PEK", label: "Beijing Capital International Airport (PEK) - Beijing" },
  { value: "FRA", label: "Frankfurt Airport (FRA) - Frankfurt" },
  { value: "AMS", label: "Amsterdam Airport Schiphol (AMS) - Amsterdam" },
  { value: "SIN", label: "Singapore Changi Airport (SIN) - Singapore" },
  { value: "ICN", label: "Incheon International Airport (ICN) - Seoul" },
  { value: "DEN", label: "Denver International Airport (DEN) - Denver" },
  { value: "SFO", label: "San Francisco International Airport (SFO) - San Francisco" },
  { value: "MIA", label: "Miami International Airport (MIA) - Miami" },
  { value: "YYZ", label: "Toronto Pearson International Airport (YYZ) - Toronto" },
  { value: "SYD", label: "Sydney Kingsford Smith Airport (SYD) - Sydney" },
  { value: "MAD", label: "Adolfo Suárez Madrid–Barajas Airport (MAD) - Madrid" },
];

const SearchBar = ({ onSearch }: { onSearch: (query: any) => void }) => {
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("round-trip");
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    onSearch({
      origin: origin?.value || null,
      destination: destination?.value || null,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : null,
      tripType,
      passengers,
    });
  };

  return (
    <StyledContainer>
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
        {/* First Row: Title and Description */}
        <Stack direction="column" spacing={1} sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#1e1e1e",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Compare and Book Cheap Flights with Ease
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4a5568",
              textAlign: "center",
              fontSize: "1.125rem",
            }}
          >
            Discover your next dream destination
          </Typography>
        </Stack>

        {/* Second Row: Search Fields */}
        <StyledSearchBox>
          <Stack direction="column" spacing={2}>
            {/* Trip Type Selection */}
            <RadioGroup
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              sx={{ display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value="round-trip"
                control={<Radio sx={{ color: "#1976d2", "&.Mui-checked": { color: "#1976d2" } }} />}
                label={<Typography sx={{ color: "#1e1e1e" }}>Round-trip</Typography>}
              />
              <FormControlLabel
                value="one-way"
                control={<Radio sx={{ color: "#1976d2", "&.Mui-checked": { color: "#1976d2" } }} />}
                label={<Typography sx={{ color: "#1e1e1e" }}>One-way</Typography>}
              />
            </RadioGroup>

            {/* Search Fields */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 2 }}
              alignItems="flex-start"
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px" }} />
                  From
                </Typography>
                <Select
                  options={airports}
                  value={origin}
                  onChange={(selectedOption) => setOrigin(selectedOption)}
                  placeholder="Select origin airport"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 8,
                      borderColor: "#e0e0e0",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#1976d2" },
                      minHeight: "56px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#666",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#f5f7fa" : "white",
                      color: "#1e1e1e",
                      "&:hover": { backgroundColor: "#f5f7fa", color: "#1976d2" },
                    }),
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px", transform: "rotate(180deg)" }} />
                  To
                </Typography>
                <Select
                  options={airports}
                  value={destination}
                  onChange={(selectedOption) => setDestination(selectedOption)}
                  placeholder="Select destination airport"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 8,
                      borderColor: "#e0e0e0",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#1976d2" },
                      minHeight: "56px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#666",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#f5f7fa" : "white",
                      color: "#1e1e1e",
                      "&:hover": { backgroundColor: "#f5f7fa", color: "#1976d2" },
                    }),
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px" }} />
                  Departure Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 8,
                      background: "#fff",
                      "& .MuiInputBase-input": { padding: "14px 16px", color: "#1e1e1e" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                        boxShadow: "0 0 0 2px #1976d240",
                      },
                    },
                  }}
                  sx={{ "& .MuiInputLabel-root": { color: "#666" } }}
                />
              </Box>
              {tripType === "round-trip" && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px" }} />
                    Return Date
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 8,
                        background: "#fff",
                        "& .MuiInputBase-input": { padding: "14px 16px", color: "#1e1e1e" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1976d2",
                          boxShadow: "0 0 0 2px #1976d240",
                        },
                      },
                    }}
                    sx={{ "& .MuiInputLabel-root": { color: "#666" } }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Person sx={{ color: "#1976d2", fontSize: "18px" }} />
                  Passengers
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    sx: {
                      borderRadius: 8,
                      background: "#fff",
                      "& .MuiInputBase-input": { padding: "14px 16px", color: "#1e1e1e" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                        boxShadow: "0 0 0 2px #1976d240",
                      },
                    },
                  }}
                  sx={{ "& .MuiInputLabel-root": { color: "#666" } }}
                />
              </Box>
              <StyledButton
                onClick={handleSearch}
                startIcon={<FlightTakeoff sx={{ color: "#fff" }} />}
                sx={{ mt: tripType === "round-trip" ? 0 : 2, flexShrink: 0 }}
              >
                Search
              </StyledButton>
            </Stack>
          </Stack>
        </StyledSearchBox>
      </Box>
    </StyledContainer>
  );
};

export default SearchBar;