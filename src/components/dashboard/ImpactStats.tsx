
import React from "react";

interface ImpactStatsProps {
  donationCount: number;
}

const ImpactStats = ({ donationCount }: ImpactStatsProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Your Impact</h2>
      <div className="flex items-center justify-center py-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-blood mb-2">{donationCount}</div>
          <p className="text-gray-600">Lives Saved</p>
          <p className="text-sm text-gray-500 mt-4 max-w-md">
            Each donation can save up to 3 lives. Thank you for your contributions!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactStats;
