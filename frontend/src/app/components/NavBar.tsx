"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Public,
  Person,
  Logout,
} from "@mui/icons-material";
import styled from "@emotion/styled";
import Image from "next/image"; // Import the Image component

// Custom styled components for consistent, premium design
const StyledNav = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #1976d2, #2196f3)",
  padding: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "#fff",
  color: "#1976d2",
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  "&:hover": {
    background: "#f5f7fa",
    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
  },
}));

const NavBar = () => {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledNav>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Logo */}
        <Link href="/" passHref>
  <Box sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
    <Image
      src="/logo.png" // Path to your logo
      alt="Company Logo"
      width={60} // Set the desired width
      height={60} // Set the desired height
      style={{ marginRight: '8px' }} // Optional: add some margin
    />
    <Typography
      variant="h5"
      sx={{
        color: "#fff",
        fontWeight: "bold",
        textDecoration: "none", // Ensure no underline
        "&:hover": { color: "#e3f2fd" },
        padding: "4px 8px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: 1,
        transition: "color 0.3s ease",
      }}
    >
      Marvel Jets
    </Typography>
  </Box>
</Link>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={2}>
          <StyledButton onClick={() => router.push("/stays")}>
            Stays
          </StyledButton>
          <StyledButton onClick={() => router.push("/")}>
            Flights
          </StyledButton>
        </Stack>

        {/* Globe Icon and User Section (Right) */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            aria-label="globe"
            sx={{
              color: "#fff",
              "&:hover": { color: "#e3f2fd", background: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <Public />
          </IconButton>

          {status === "loading" ? (
            <Typography sx={{ color: "#fff", fontSize: "14px" }}>
              Loading...
            </Typography>
          ) : status === "authenticated" && session ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                src={session.user?.avatar || "/default-avatar.png"}
                alt={session.user?.name || "User "}
                sx={{
 width: 32,
                  height: 32,
                  border: "2px solid #fff",
                  "&:hover": { cursor: "pointer" },
                }}
                onClick={handleMenuOpen}
              />
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "medium",
                  "&:hover": { cursor: "pointer", color: "#e3f2fd" },
                }}
                onClick={handleMenuOpen}
              >
                {session.user?.name}
              </Typography>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: 1,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    mt: 1,
                    background: "#fff",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/api/auth/profile");
                    handleMenuClose();
                  }}
                  sx={{
                    "&:hover": { background: "#f5f7fa", color: "#1976d2" },
                  }}
                >
                  <Person sx={{ mr: 1, color: "#1976d2" }} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    "&:hover": { background: "#f5f7fa", color: "#d32f2f" },
                  }}
                >
                  <Logout sx={{ mr: 1, color: "#d32f2f" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <StyledButton
                onClick={() => router.push("/api/auth/login")}
                sx={{ mr: 1 }}
              >
                Sign In
              </StyledButton>
              <StyledButton
                onClick={() => router.push("/api/auth/signup")}
              >
                Register
              </StyledButton>
            </Stack>
          )}
        </Stack>
      </Stack>
    </StyledNav>
  );
};

export default NavBar;