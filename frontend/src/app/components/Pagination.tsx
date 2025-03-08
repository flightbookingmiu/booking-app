// src/app/components/Pagination.tsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          style={{
            margin: '0 0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === index + 1 ? '#2563eb' : '#e5e7eb', // Highlight current page
            color: currentPage === index + 1 ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;