"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import styled from "@emotion/styled"; // Correct import format for Emotion styled
import Link from "next/link";

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
  maxWidth: "400px",
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      alert(result.error);
    } else {
      router.push("/");
    }
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
            <Lock sx={{ color: "#1976d2", fontSize: "32px" }} />
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#666", // Gray for labels
                fontSize: "1rem",
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Lock sx={{ color: "#1976d2", fontSize: "18px" }} />
              Email:
            </Typography>
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
            <Typography
              variant="body1"
              sx={{
                color: "#666", // Gray for labels
                fontSize: "1rem",
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Lock sx={{ color: "#1976d2", fontSize: "18px" }} />
              Password:
            </Typography>
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
            <StyledButton
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : null}
            >
              {loading ? "Logging in..." : "Login"}
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
              Don’t have an account?{" "}
              <Link href="/api/auth/signup" passHref>
                <Typography component="a" sx={{ display: "inline" }}>
                  Sign Up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
}