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
  background: "linear-gradient(to bottom, #ffffff, #f5f7fa)",
  marginBottom: theme.spacing(2),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976d2, #2196f3)",
  color: "#fff",
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  "&:hover": {
    background: "linear-gradient(45deg, #1565c0, #1e88e5)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
}));

const FlightSearch = () => {
  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4, backgroundColor: "#f5f7fa", borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FlightTakeoff sx={{ color: "#1976d2", fontSize: "24px", mr: 2 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Search summary
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Get an overview of your flight options
            </Typography>
          </Box>
        </Box>
        <Link href="#" passHref>
          <Button sx={{ color: "#1976d2" }}>View summary</Button>
        </Link>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "25%", pr: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Filters
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
            Showing 234 results
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
          <FlightCard
            flight={{
              id: "1",
              origin: "MIA",
              destination: "DSM",
              airline: "American Airlines, operated by Envoy Air As American Eagle",
              duration: "3h 54m",
              price: 493.38,
            }}
          />
          <FlightCard
            flight={{
              id: "2",
              origin: "MIA",
              destination: "DSM",
              airline: "American Airlines",
              duration: "6h 20m",
              price: 443.19,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FlightSearch;