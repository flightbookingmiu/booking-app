// src/components/ProgressBar.tsx
import { useState } from 'react';

const ProgressBar = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <span className="ml-2">{step}</span>
          {index < steps.length - 1 && (
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;