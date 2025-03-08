"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Person,
  Lock,
  CloudUpload,
  Close,
} from "@mui/icons-material";
import styled from "@emotion/styled"; // Correct import format for Emotion styled

// Custom styled components for consistent, premium design
const StyledContainer = styled(Box)(({ theme }) => ({
  bgcolor: "#f5f7fa",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
}));

const StyledCard = styled(Box)(({ theme }) => ({
  bgcolor: "#fff",
  borderRadius: 2,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  p: theme.spacing(4),
  maxWidth: "500px",
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
  "&:disabled": {
    background: "#cccccc",
    color: "#666",
  },
}));

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let avatarUrl = "";
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
        avatarUrl = uploadResult.filePath; // Path to the uploaded file
      } catch (error) {
        console.error("Avatar upload failed:", error);
        alert("Failed to upload avatar. Please try again.");
        setLoading(false);
        return;
      }
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, address, avatar: avatarUrl }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      router.push("/api/auth/login");
    } else {
      alert(data.error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <StyledContainer>
      <StyledCard>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#1e1e1e",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Person sx={{ color: "#1976d2", fontSize: "32px" }} />
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
          >
            <Grid container spacing={2}>
              {/* Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
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
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
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
              </Grid>

              {/* Phone */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
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
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
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
              </Grid>

              {/* Profile Picture */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload sx={{ color: "#1976d2" }} />}
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#1976d2",
                      "&:hover": { borderColor: "#1976d2", background: "#f5f7fa" },
                      borderRadius: 8,
                      padding: "8px 16px",
                    }}
                  >
                    Upload
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                  </Button>
                  {avatarPreview && (
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <Avatar
                        src={avatarPreview}
                        alt="Avatar Preview"
                        sx={{ width: 80, height: 80, border: "2px solid #fff" }}
                      />
                      <IconButton
                        aria-label="remove avatar"
                        onClick={handleRemoveAvatar}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "#d32f2f",
                          color: "#fff",
                          "&:hover": { bgcolor: "#b71c1c" },
                          borderRadius: "50%",
                          p: 0.5,
                        }}
                      >
                        <Close sx={{ fontSize: "16px" }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            <StyledButton
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : null}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </StyledButton>

            <Typography
              sx={{
                textAlign: "center",
                color: "#4a5568",
                mt: 2,
                "& a": {
                  color: "#1976d2",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                },
              }}
            >
              Already have an account?{" "}
              <Link href="/api/auth/login" passHref>
                <Typography component="a" sx={{ display: "inline" }}>
                  Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
}