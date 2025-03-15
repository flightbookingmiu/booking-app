// src/app/api/auth/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  CardMembership,
  FlightTakeoff,
} from "@mui/icons-material";
import styled from "@emotion/styled";

// Custom styled components for consistent, premium design
const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f5f7fa",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  padding: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  maxWidth: "800px",
  width: "90%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
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

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  maxWidth: "600px",
  width: "90%",
}));

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editBooking, setEditBooking] = useState<any | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings/${session?.user.email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoadingBookings(false);
      }
    };

    if (session) {
      fetchBookings();
    }
  }, [session, status, router]);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
  };

  const handleEditBooking = (booking: any) => {
    setEditBooking(booking);
    setOpenDialog(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${session?.user.email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleSaveBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${session?.user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: editBooking._id,
          fareType: editBooking.fareType,
          extras: editBooking.extras,
          seatNumber: editBooking.seatNumber,
          totalPrice: editBooking.totalPrice,
          paymentStatus: editBooking.paymentStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update booking");
      }
      const updatedBooking = await response.json();
      setBookings(bookings.map((booking) => (booking._id === updatedBooking._id ? updatedBooking : booking)));
      setOpenDialog(false);
      setEditBooking(null);
    } catch (err) {
      console.error("Error updating booking:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress sx={{ color: "#1976d2" }} />
      </Box>
    );
  }

  if (!session) {
    return null; // Redirect handled in useEffect
  }

  const user = session.user as {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    passportNumber?: string;
    avatar?: string;
  };

  return (
    <StyledContainer>
      <StyledCard>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            {/* User Profile */}
            <Box sx={{ display: "flex", width: "100%", gap: 4 }}>
              {/* Profile Image */}
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Avatar
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name}
                  sx={{ width: 120, height: 120, border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                />
              </Box>

              {/* User Info */}
              <Box sx={{ flex: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#1e1e1e",
                    mb: 2,
                  }}
                >
                  {user.name}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ color: "#1976d2", fontSize: "18px" }} />
                    {user.email}
                  </Typography>
                  <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone sx={{ color: "#1976d2", fontSize: "18px" }} />
                    {user.phone || "Not provided"}
                  </Typography>
                  <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ color: "#1976d2", fontSize: "18px" }} />
                    {user.address || "Not provided"}
                  </Typography>
                  <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                    <CardMembership sx={{ color: "#1976d2", fontSize: "18px" }} />
                    {user.passportNumber || "Not provided"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Booking History */}
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1e1e1e", mt: 4, mb: 2 }}>
              Booking History
            </Typography>
            {loadingBookings ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                <CircularProgress sx={{ color: "#1976d2" }} />
              </Box>
            ) : error ? (
              <Typography sx={{ color: "#666", textAlign: "center", mt: 2 }}>
                {error}
              </Typography>
            ) : bookings.length === 0 ? (
              <Typography sx={{ color: "#666", textAlign: "center", mt: 2 }}>
                No bookings found.
              </Typography>
            ) : (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2}>
                  {bookings.map((booking, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  color: "#1e1e1e",
                                  mb: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <FlightTakeoff sx={{ color: "#1976d2", fontSize: "20px" }} />
                                {booking.flight.origin} → {booking.flight.destination}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#6b7280",
                                  fontSize: "0.875rem",
                                  mb: 0.5,
                                }}
                              >
                                Date: {new Date(booking.flight.departure).toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#6b7280",
                                  fontSize: "0.875rem",
                                }}
                              >
                                Price: ${booking.flight.price}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <StyledButton
                                onClick={() => handleViewDetails(booking)}
                                size="small"
                                sx={{ flexShrink: 0 }}
                              >
                                View Details
                              </StyledButton>
                              <StyledButton
                                onClick={() => handleEditBooking(booking)}
                                size="small"
                                sx={{ flexShrink: 0, bgcolor: "#ff9800" }}
                              >
                                Edit
                              </StyledButton>
                              <StyledButton
                                onClick={() => handleDeleteBooking(booking._id)}
                                size="small"
                                sx={{ flexShrink: 0, bgcolor: "#f44336" }}
                              >
                                Delete
                              </StyledButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </CardContent>
      </StyledCard>

      {/* Modal for Viewing Booking Details */}
      <StyledModal open={openModal} onClose={handleCloseModal}>
        <ModalContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
            Booking Details
          </Typography>
          {selectedBooking && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>
                <strong>Origin:</strong> {selectedBooking.flight.origin}
              </Typography>
              <Typography>
                <strong>Destination:</strong> {selectedBooking.flight.destination}
              </Typography>
              <Typography>
                <strong>Departure:</strong> {new Date(selectedBooking.flight.departure).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Price:</strong> ${selectedBooking.flight.price}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedBooking.paymentStatus}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <StyledButton onClick={handleCloseModal}>Close</StyledButton>
          </Box>
        </ModalContent>
      </StyledModal>

      {/* Dialog for Editing Booking */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField
            label="Fare Type"
            value={editBooking?.fareType || ""}
            onChange={(e) => setEditBooking({ ...editBooking, fareType: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Extras"
            value={editBooking?.extras || ""}
            onChange={(e) => setEditBooking({ ...editBooking, extras: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Seat Number"
            value={editBooking?.seatNumber || ""}
            onChange={(e) => setEditBooking({ ...editBooking, seatNumber: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Total Price"
            type="number"
            value={editBooking?.totalPrice || ""}
            onChange={(e) => setEditBooking({ ...editBooking, totalPrice: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Payment Status"
            value={editBooking?.paymentStatus || ""}
            onChange={(e) => setEditBooking({ ...editBooking, paymentStatus: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveBooking} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}