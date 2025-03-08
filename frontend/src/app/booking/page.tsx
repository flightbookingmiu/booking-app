// src/app/booking/page.tsx
'use client';

import BookingSteps from '../components/BookingSteps';

export default function BookingPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <BookingSteps />
    </div>
  );
}