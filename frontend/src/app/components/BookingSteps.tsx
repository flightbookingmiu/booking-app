"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Modal,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Flight,
  Person,
  AttachMoney,
  Chair,
  Payment,
  Close,
  Business,
  Email,
  Phone,
  LocationOn,
  CardMembership,
  AirplaneTicket,
    FlightTakeoff,
    AccessTime,
} from "@mui/icons-material";
import styled from "@emotion/styled"; // Correct import format for Emotion styled
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
//import { ObjectId } from "mongodb";

// Custom styled components for consistent, premium design
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(to bottom, #ffffff, #f5f7fa)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
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
  "&:disabled": {
    background: "#cccccc",
    color: "#666",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 8,
    backgroundColor: "#fff",
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  },
  "& .MuiFormLabel-root": {
    color: "#666",
  },
}));

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Company details (hardcoded for demonstration; replace with dynamic data if needed)
const companyDetails = {
  name: "FlightHub Airlines",
  address: "123 Skyway Ave, Cloud City, USA",
  contact: "+1-800-123-4567",
  email: "support@flighthub.com",
};


const saveBooking = async () => {
  if (!session) {
    console.error("No user session found.");
    return;
  }

  const bookingData = {
    userId: session.user.id, // Ensure the session contains the user ID
    flightId: "654321abcdef123456789014", // Replace with the actual flight ID
    fareType: selectedFare,
    extras,
    seatNumber: selectedSeat,
    totalPrice: calculateTotal(),
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`, // Include the access token for authentication
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to save booking");
    }

    const result = await response.json();
    console.log("Booking saved successfully:", result);
  } catch (error) {
    console.error("Error saving booking:", error);
  }
};
const BookingSteps = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFare, setSelectedFare] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    passportNumber: "",
  });
  const [extras, setExtras] = useState({
    baggage: false,
    meals: false,
    insurance: false,
  });
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [seatPrice, setSeatPrice] = useState<number | null>(null);
  const [seatType, setSeatType] = useState<string>("");
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const steps = [
    { label: "Choose Your Fare", icon: <Flight /> },
    { label: "Your Details", icon: <Person /> },
    { label: "Extras", icon: <AttachMoney /> },
    { label: "Select Your Seat", icon: <Chair /> },
    { label: "Check and Pay", icon: <Payment /> },
  ];

  const farePrices = {
    economy: 350,
    business: 600,
    "first-class": 1000,
  };

  const extraPrices = {
    baggage: 50,
    meals: 30,
    insurance: 20,
  };

  const calculateTotal = () => {
    let total = selectedFare ? farePrices[selectedFare as keyof typeof farePrices] || 0 : 0;
    total += extras.baggage ? extraPrices.baggage : 0;
    total += extras.meals ? extraPrices.meals : 0;
    total += extras.insurance ? extraPrices.insurance : 0;
    total += selectedSeat ? (seatPrice ? seatPrice : 0) : 0; // Additional fee for seat selection
    return total;
  };

  const handleNext = () => {
    if (currentStep === 1 && !session) {
      setIsLoginModalOpen(true);
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeat(seatNumber);
  };


  const handlePayment = async () => {
    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }
  
    setIsPaymentLoading(true);
  
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Save the booking to the database
        await saveBooking();
  
        // Set payment success state
        setIsPaymentLoading(false);
        setIsPaymentSuccess(true);
      } catch (error) {
        console.error("Payment or booking save failed:", error);
        setIsPaymentLoading(false);
        alert("Payment or booking save failed. Please try again.");
      }
    }, 2000); // Simulate a 2-second payment processing delay
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn("credentials", { email, password, redirect: false });
      setIsLoginModalOpen(false);
      setCurrentStep(currentStep + 1); // Proceed to next step
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async () => {
    try {
      let avatarUrl = ''; // Initialize avatar URL
  
      // Step 1: Upload the profile picture if it exists
      if (avatar) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', avatar); // Append the file to FormData
  
        // Call the upload endpoint
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData, // No need to set Content-Type header for FormData
        });
  
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload profile picture. Please try again.');
        }
  
        const uploadResult = await uploadResponse.json();
        avatarUrl = uploadResult.filePath; // Get the uploaded file's URL
      }
  
      // Step 2: Call the register endpoint with the avatar URL
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
          phone: signupForm.phone,
          address: signupForm.address,
          avatar: avatarUrl, // Include the avatar URL
        }),
      });
  
      if (!registerResponse.ok) {
        throw new Error('Signup failed. Please try again.');
      }
  
      const registerResult = await registerResponse.json();
      console.log('Signup successful:', registerResult);
  
      // Automatically log in the user after successful signup
      await signIn('credentials', {
        email: signupForm.email,
        password: signupForm.password,
        redirect: false,
      });
  
      // Close the signup modal and proceed to the next step
      setIsSignupModalOpen(false);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Signup error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during signup.');
    }
  };


    const fetchUserIdByEmail = async (email: string) => {
        try {
          // Encode the email for use in the URL
          const encodedEmail = encodeURIComponent(email);
          const response = await fetch(`/api/users/${encodedEmail}`);
      
          if (!response.ok) {
            throw new Error('Failed to fetch user ID');
          }
      
          const data = await response.json();
          return data.userId; // Ensure the API returns the userId
        } catch (error) {
          console.error('Error fetching user ID:', error);
          return null;
        }
      };

 const saveBooking = async () => {
  if (!session || !session.user?.email) {
    console.error("No user session or email found.");
    return;
  } else{console.log("session uSER: ", session.user.email)}

  // Fetch the userId using the email from the session
  const userId = "67c23ec9ad31ff4510fd5c96" ;//await fetchUserIdByEmail(session.user.email);
  if (!userId) {
    console.error("Failed to fetch user ID.");
    return;
  }

  const bookingData = {
    userId: userId,//"67c23ec9ad31ff4510fd5c96", // Convert userId to ObjectId
    flightId: "67c3a8c97904c49536b91486", // Replace with the actual flight ID
    fareType: selectedFare,
    extras,
    seatNumber: selectedSeat,
    totalPrice: calculateTotal(),
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${session.accessToken}`, // Include the access token for authentication
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to save booking");
    }

    const result = await response.json();
    console.log("Booking saved successfully:", result);
  } catch (error) {
    console.error("Error saving booking:", error);
  }
};


  const generateReceiptPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const columnWidth = (pageWidth - margin * 2) / 2; // Two columns for labels and values
  
    // Load the company logo
    const logoUrl = "icons/business.jpeg"; // Path to your logo
    const logo = await loadImage(logoUrl); // Helper function to load the image
  
    // Set font and colors (using Arial for better compatibility)
    doc.setFont("Arial", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
  
    // Header: Company Logo and Receipt ID
    const logoWidth = 20; // Adjust logo width as needed
    const logoHeight = 20; // Adjust logo height as needed
    doc.addImage(logo, "JPEG", margin, 10, logoWidth, logoHeight); // Add logo to the header
    doc.setFontSize(16);
    doc.setTextColor(25, 118, 210); // Blue (#1976d2)
    doc.text("FlightHub Airlines", margin + logoWidth + 10, 20); // Adjust text position based on logo width
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
    const receiptNumber = `Receipt #${Math.floor(Math.random() * 1000000)}`; // Random receipt number
    doc.text(receiptNumber, margin + logoWidth + 10, 30);
  
    // Company Details
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210); // Blue (#1976d2)
    doc.setFillColor(25, 118, 210); // Blue background for table title
    doc.rect(margin, 40, pageWidth - margin * 2, 10, "F"); // Blue rectangle for table title
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Company Details", margin + 5, 48);
    doc.setFontSize(12);
    autoTable(doc, {
      startY: 50,
      body: [
        [companyDetails.name],
        [companyDetails.address],
        [companyDetails.contact],
        [companyDetails.email],
      ],
      theme: "grid",
      bodyStyles: { textColor: [30, 30, 30], fontSize: 10, cellPadding: 2 },
      margin: { left: margin, right: margin },
    });
  
    // Ticket Owner (User Details)
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210); // Blue (#1976d2)
    doc.setFillColor(25, 118, 210); // Blue background for table title
    doc.rect(margin, doc.autoTable.previous.finalY + 10, pageWidth - margin * 2, 10, "F"); // Blue rectangle for table title
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Ticket Owner", margin + 5, doc.autoTable.previous.finalY + 18);
    doc.setFontSize(12);
    autoTable(doc, {
      startY: doc.autoTable.previous.finalY + 20,
      body: [
        [userDetails.name],
        [userDetails.email],
        [userDetails.phone],
        [userDetails.address],
        [userDetails.passportNumber],
      ],
      theme: "grid",
      bodyStyles: { textColor: [30, 30, 30], fontSize: 10, cellPadding: 2 },
      margin: { left: margin, right: margin },
    });
  
    // Flight Itinerary
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210); // Blue (#1976d2)
    doc.setFillColor(25, 118, 210); // Blue background for table title
    doc.rect(margin, doc.autoTable.previous.finalY + 10, pageWidth - margin * 2, 10, "F"); // Blue rectangle for table title
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Flight Itinerary", margin + 5, doc.autoTable.previous.finalY + 18);
    const flightNumber = `FL${Math.floor(Math.random() * 10000)}`; // Random flight number
    const pnr = `PNR${Math.floor(Math.random() * 1000000)}`; // Random PNR
    autoTable(doc, {
      startY: doc.autoTable.previous.finalY + 20,
      body: [
        ["Flight Number", flightNumber],
        ["PNR", pnr],
        ["Route", "New York (JFK) → London (LHR)"],
        ["Airline", "British Airways"],
        ["Departure", new Date("2024-01-01T10:00:00Z").toLocaleString()],
        ["Arrival", new Date("2024-01-05T12:00:00Z").toLocaleString()],
        ["Duration", "7h 30m"],
      ],
      theme: "grid",
      bodyStyles: { textColor: [30, 30, 30], fontSize: 10, cellPadding: 2 },
      margin: { left: margin, right: margin },
    });
  
    // Booking Summary
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210); // Blue (#1976d2)
    doc.setFillColor(25, 118, 210); // Blue background for table title
    doc.rect(margin, doc.autoTable.previous.finalY + 10, pageWidth - margin * 2, 10, "F"); // Blue rectangle for table title
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Booking Summary", margin + 5, doc.autoTable.previous.finalY + 18);
    doc.setFontSize(12);
    const summaryData = [
      ["Fare", selectedFare ? `${selectedFare.charAt(0).toUpperCase() + selectedFare.slice(1)} - ${formatCurrency(farePrices[selectedFare as keyof typeof farePrices])}` : "Not selected"],
      ["Extras", Object.entries(extras).filter(([_, value]) => value).map(([key]) => `${key.charAt(0).toUpperCase() + key.slice(1)} - ${formatCurrency(extraPrices[key as keyof typeof extraPrices])}`).join(", ") || "None"],
      ["Seat", selectedSeat ? `Seat ${selectedSeat} - ${formatCurrency(20)}` : "Not selected"],
    ];
    autoTable(doc, {
      startY: doc.autoTable.previous.finalY + 20,
      body: summaryData,
      theme: "grid",
      bodyStyles: { textColor: [30, 30, 30], fontSize: 10, cellPadding: 2 },
      margin: { left: margin, right: margin },
    });
  
    // Total Amount
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50); // Green (#2e7d32)
    doc.text(`Total Amount Paid: ${formatCurrency(calculateTotal())}`, margin, doc.autoTable.previous.finalY + 10);
    doc.setTextColor(0, 0, 0); // Reset to black
  
    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for booking with FlightHub Airlines!", margin, doc.internal.pageSize.getHeight() - 20);
  
    // Save the PDF
    doc.save(`FlightHub_Receipt_${Date.now()}.pdf`);
  };
  
  // Helper function to load an image
  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ bgcolor: "#e0e0e0", borderRadius: 1, p: 1 }}>
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                textAlign: "center",
                color: index <= currentStep ? "#1976d2" : "#757575",
                fontWeight: index === currentStep ? "bold" : "normal",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: 0.5,
                "&:not(:last-child)": {
                  borderRight: "2px solid #e0e0e0",
                },
              }}
            >
              {step.icon}
              <Typography variant="body2">{step.label}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Step Content */}
      <StyledCard>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {steps[currentStep].icon}
            <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold", color: "#1e1e1e" }}>
              {steps[currentStep].label}
            </Typography>
          </Box>
          {currentStep === 0 && (
            <RadioGroup value={selectedFare} onChange={(e) => setSelectedFare(e.target.value)}>
              <FormControlLabel
                value="economy"
                control={<Radio />}
                label={<Typography>Economy - {formatCurrency(350)}</Typography>}
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                value="business"
                control={<Radio />}
                label={<Typography>Business - {formatCurrency(600)}</Typography>}
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                value="first-class"
                control={<Radio />}
                label={<Typography>First Class - {formatCurrency(1000)}</Typography>}
              />
            </RadioGroup>
          )}
          {currentStep === 1 && (
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <StyledTextField
                fullWidth
                label="Full Name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Email"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Phone Number"
                value={userDetails.phone}
                onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Address"
                value={userDetails.address}
                onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Passport Number"
                value={userDetails.passportNumber}
                onChange={(e) => setUserDetails({ ...userDetails, passportNumber: e.target.value })}
                variant="outlined"
              />
            </Box>
          )}
          {currentStep === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={extras.baggage} onChange={(e) => setExtras({ ...extras, baggage: e.target.checked })} />}
                label={<Typography>Extra Baggage - {formatCurrency(50)}</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={extras.meals} onChange={(e) => setExtras({ ...extras, meals: e.target.checked })} />}
                label={<Typography>In-Flight Meals - {formatCurrency(30)}</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={extras.insurance} onChange={(e) => setExtras({ ...extras, insurance: e.target.checked })} />}
                label={<Typography>Travel Insurance - {formatCurrency(20)}</Typography>}
              />
            </Box>
          )}
          {currentStep === 3 && (




<Box sx={{ mt: 2, maxWidth: "400px", mx: "auto" }}>
  <Typography variant="subtitle1">Preferred Seat</Typography>
  {selectedSeat && (
    <Typography sx={{ mt: 2, color: "#4a5568" }}>
      Selected Seat: {selectedSeat} - {seatType} (Price: ${seatPrice})
    </Typography>
  )}
  <Grid container spacing={1} sx={{ mt: 2 }}>
    {Array.from({ length: 10 }).map((_, rowIndex) => (
      <Grid item xs={12} key={rowIndex}>
        <Grid container spacing={1}>
          {Array.from({ length: 7 }).map((_, seatIndex) => {
            let seatType = "Economy";
            let price = 20;

            // Determine seat type and price
            if (rowIndex < 3) {
              seatType = "First Class";
              price = 100;
            } else if (seatIndex === 0 || seatIndex === 7) {
              seatType = "Window Seat";
              price = 50;
            }

            const seatNumber = rowIndex * 8 + seatIndex + 1;

            return (
              <Grid item xs={1.5} key={seatIndex}>
                <Tooltip title={`${seatType} - Price: $${price}`} arrow>
                  <span>
                    <Button
                      variant={selectedSeat === seatNumber ? "contained" : "outlined"}
                      onClick={() => {
                        setSelectedSeat(seatNumber);
                        setSeatPrice(price);
                        setSeatType(seatType);
                      }}
                      sx={{
                        width: "100%",
                        height: 40,
                        backgroundColor: selectedSeat === seatNumber ? "#1976d2" : (seatType === "First Class" ? "#FFD700" : "#B0E0E6"),
                        color: selectedSeat === seatNumber ? "#fff" : "#1e1e1e",
                        "&:hover": {
                          backgroundColor: selectedSeat === seatNumber ? "#1565c0" : "#d1d5db",
                        },
                      }}
                    >
                      {seatNumber}
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    ))}
  </Grid>

</Box>
          )}
          {currentStep === 4 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#1e1e1e" }}>
                Review Your Booking and Proceed to Payment
              </Typography>
              <Box sx={{ bgcolor: "#f5f7fa", p: 2, borderRadius: 2, mb: 2 }}>
                {/* Company Details */}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
                  Company Details
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Business sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.address}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Contact:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.contact}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Email sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Email:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.email}</Typography>
                  </Grid>
                </Grid>

                {/* Ticket Owner (User Details) */}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
                  Ticket Owner
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Person sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{userDetails.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Email sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Email:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{userDetails.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Phone:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{userDetails.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{userDetails.address}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                    <CardMembership sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Passport Number:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{userDetails.passportNumber}</Typography>
                  </Grid>
                </Grid>

                {/* Flight Itinerary */}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
                  Flight Itinerary
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <Flight sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Flight:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>New York (JFK) → London (LHR)</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <AirplaneTicket sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Airline:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>British Airways</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Departure:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{new Date("2024-01-01T10:00:00Z").toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px", transform: "rotate(180deg)" }} />
                      Return:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>{new Date("2024-01-05T12:00:00Z").toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime sx={{ color: "#1976d2", fontSize: "18px" }} />
                      Duration:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: "#1e1e1e" }}>7h 30m</Typography>
                  </Grid>
                </Grid>

                {/* Booking Summary */}
                <Typography>Fare: {selectedFare ? `${selectedFare.charAt(0).toUpperCase() + selectedFare.slice(1)} - ${formatCurrency(farePrices[selectedFare as keyof typeof farePrices])}` : "Not selected"}</Typography>
                {extras.baggage && <Typography>Extra Baggage - {formatCurrency(extraPrices.baggage)}</Typography>}
                {extras.meals && <Typography>In-Flight Meals - {formatCurrency(extraPrices.meals)}</Typography>}
                {extras.insurance && <Typography>Travel Insurance - {formatCurrency(extraPrices.insurance)}</Typography>}
                {selectedSeat && <Typography>Selected Seat - {formatCurrency(20)}</Typography>}
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e" }}>
                  Total: {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
              {!isPaymentSuccess ? (
                <Box sx={{ mt: 2 }}>
  <Typography variant="h6" sx={{ mb: 2, color: "#1e1e1e" }}>
    Payment Information
  </Typography>
  <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {/* First Row: Card Number */}
    <StyledTextField
      fullWidth
      label="Card Number"
      value={creditCardInfo.cardNumber}
      onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cardNumber: e.target.value })}
      variant="outlined"
    />

    {/* Second Row: Expiry Date, CVV, and Pay Button */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <StyledTextField
        label="Expiry Date (MM/YY)"
        type="month" // Use "month" type for month/year picker
        value={creditCardInfo.expiryDate}
        onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiryDate: e.target.value })}
        variant="outlined"
        sx={{ flex: 1 }}
      />
      <StyledTextField
        label="CVV"
        value={creditCardInfo.cvv}
        onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
        variant="outlined"
        sx={{ flex: 1 }}
      />
      <StyledButton
        onClick={handlePayment}
        disabled={isPaymentLoading}
        sx={{ maxWidth: "120px" }} // Set a minimum width for the button
        startIcon={isPaymentLoading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isPaymentLoading ? "Processing..." : "Pay Now"}
      </StyledButton>
    </Box>
  </Box>
</Box>


              ) : (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32" }}>
                    Payment Successful!
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, color: "#1e1e1e" }}>
                    Receipt Details
                  </Typography>
                  <Box sx={{ bgcolor: "#f5f7fa", p: 2, borderRadius: 2, mb: 2 }}>
                    {/* Company Details */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
                      Company Details
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Business sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.name}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOn sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.address}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Phone sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Contact:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.contact}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Email sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{companyDetails.email}</Typography>
                      </Grid>
                    </Grid>

                    {/* Ticket Owner (User Details) */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
                      Ticket Owner
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Person sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{userDetails.name}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Email sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{userDetails.email}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Phone sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Phone:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{userDetails.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOn sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{userDetails.address}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                        <CardMembership sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Passport Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{userDetails.passportNumber}</Typography>
                      </Grid>
                    </Grid>

                    {/* Flight Itinerary */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e", mb: 2 }}>
                      Flight Itinerary
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <Flight sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Flight:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>New York (JFK) → London (LHR)</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <AirplaneTicket sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Airline:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>British Airways</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Departure:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{new Date("2024-01-01T10:00:00Z").toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <FlightTakeoff sx={{ color: "#1976d2", fontSize: "18px", transform: "rotate(180deg)" }} />
                          Return:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>{new Date("2024-01-05T12:00:00Z").toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                          <AccessTime sx={{ color: "#1976d2", fontSize: "18px" }} />
                          Duration:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ color: "#1e1e1e" }}>7h 30m</Typography>
                      </Grid>
                    </Grid>

                    {/* Booking Summary */}
                    <Typography>Fare: {selectedFare ? `${selectedFare.charAt(0).toUpperCase() + selectedFare.slice(1)} - ${formatCurrency(farePrices[selectedFare as keyof typeof farePrices])}` : "Not selected"}</Typography>
                    {extras.baggage && <Typography>Extra Baggage - {formatCurrency(extraPrices.baggage)}</Typography>}
                    {extras.meals && <Typography>In-Flight Meals - {formatCurrency(extraPrices.meals)}</Typography>}
                    {extras.insurance && <Typography>Travel Insurance - {formatCurrency(extraPrices.insurance)}</Typography>}
                    {selectedSeat && <Typography>Selected Seat - {formatCurrency(20)}</Typography>}
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e1e1e" }}>
                      Total Amount Paid: {formatCurrency(calculateTotal())}
                    </Typography>
                  </Box>
                  <StyledButton
                    onClick={generateReceiptPDF}
                    startIcon={<Payment />}
                  >
                    Download Receipt
                  </StyledButton>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </StyledCard>

      {/* Navigation Buttons */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          sx={{
            color: "#666",
            borderColor: "#ccc",
            "&:hover": { borderColor: "#999", backgroundColor: "#f5f5f5" },
            "&:disabled": { color: "#999", borderColor: "#e0e0e0" },
          }}
        >
          Previous
        </Button>
        <StyledButton
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          startIcon={currentStep === steps.length - 1 ? <Payment /> : null}
        >
          {currentStep === steps.length - 1 ? "Checkout" : "Next"}
        </StyledButton>
      </Box>

      {/* Login Modal */}
      <Modal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        aria-labelledby="login-modal-title"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 400,
          maxWidth: "90%",
        }}>
          <IconButton
            aria-label="close"
            onClick={() => setIsLoginModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
          <Typography id="login-modal-title" variant="h5" sx={{ mb: 2, color: "#1e1e1e" }}>
            Login
          </Typography>
          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            handleLogin(loginForm.email, loginForm.password);
          }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <StyledTextField
              fullWidth
              label="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              variant="outlined"
            />
            <StyledButton type="submit" fullWidth>
              Login
            </StyledButton>
            <Typography sx={{ textAlign: "center", mt: 1, color: "#4a5568" }}>
              Don’t have an account?{" "}
              <Button onClick={() => {
                setIsLoginModalOpen(false);
                setIsSignupModalOpen(true);
              }} sx={{ color: "#1976d2", textTransform: "none" }}>
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Box>
      </Modal>

      {/* Signup Modal */}
      <Modal
        open={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        aria-labelledby="signup-modal-title"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 400,
          maxWidth: "90%",
        }}>
          <IconButton
            aria-label="close"
            onClick={() => setIsSignupModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
          <Typography id="signup-modal-title" variant="h5" sx={{ mb: 2, color: "#1e1e1e" }}>
            Create an Account
          </Typography>
          <Box
  component="form"
  onSubmit={(e) => {
    e.preventDefault();
    handleSignup(); // Call handleSignup without parameters
  }}
  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
>
  <StyledTextField
    fullWidth
    label="Full Name"
    value={signupForm.name}
    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
    variant="outlined"
  />
  <StyledTextField
    fullWidth
    label="Email"
    value={signupForm.email}
    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
    variant="outlined"
  />
  <StyledTextField
    fullWidth
    label="Password"
    type="password"
    value={signupForm.password}
    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
    variant="outlined"
  />
  <StyledTextField
    fullWidth
    label="Phone Number"
    value={signupForm.phone}
    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
    variant="outlined"
  />
  <StyledTextField
    fullWidth
    label="Address"
    value={signupForm.address}
    onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
    variant="outlined"
  />
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        // Handle the file upload logic here (e.g., store in state or upload immediately)
        setAvatar(e.target.files[0]);
    }
    }}
    style={{ marginTop: '16px' }} // Adjust margin as needed
  />
  <StyledButton type="submit" fullWidth>
    Sign Up
  </StyledButton>
  <Typography sx={{ textAlign: "center", mt: 1, color: "#4a5568" }}>
    Already have an account?{" "}
    <Button
      onClick={() => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
      }}
      sx={{ color: "#1976d2", textTransform: "none" }}
    >
      Log In
    </Button>
  </Typography>
</Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingSteps;