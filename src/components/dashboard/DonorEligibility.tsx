
import { useState, useEffect } from "react";

interface DonorEligibilityProps {
  nextEligibleDate: Date | null;
}

const DonorEligibility = ({ nextEligibleDate }: DonorEligibilityProps) => {
  const calculateDaysLeft = () => {
    if (!nextEligibleDate) return 0;
    
    const today = new Date();
    const diffTime = nextEligibleDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const eligibilityPercentage = () => {
    const daysLeft = calculateDaysLeft();
    // Changed from 90 days to match the new 90-day eligibility period
    const percentage = ((90 - daysLeft) / 90) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Next Eligible Donation</h2>
      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blood h-4 rounded-full transition-all duration-500" 
            style={{ width: `${eligibilityPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Last donation</span>
          <span>Eligible to donate</span>
        </div>
        <div className="bg-gray-50 rounded-md p-4 text-center">
          {calculateDaysLeft() > 0 ? (
            <p className="font-medium">
              You will be eligible to donate in <span className="text-blood">{calculateDaysLeft()} days</span>
            </p>
          ) : (
            <p className="font-medium text-green-600">
              You are eligible to donate blood now!
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            You can still approve donation requests at any time
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorEligibility;
