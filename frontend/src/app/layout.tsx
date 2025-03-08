// src/app/layout.tsx
'use client'; // <-- Add this line

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import Theme from "./theme";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const handleSearch = (query: any) => {
    console.log('Search Query:', query);
    // Implement flight search logic here
  };

  return (
    <html lang="en">
      <body>
        <Theme>
        <SessionProvider>
          <AuthProvider>
          <ModalProvider>
            <NavBar />
            
            <main>{children}</main>
            </ModalProvider>
          </AuthProvider>
        </SessionProvider>
        </Theme>
      </body>
    </html>
  );
}