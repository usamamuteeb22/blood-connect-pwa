
import React, { createContext, useContext } from "react";
import { Donor, BloodRequest, Donation } from "@/types/custom";

interface DashboardContextProps {
  userDonor: Donor | null;
  userRequests: BloodRequest[];
  userDonations: Donation[];
  donorRequests: BloodRequest[];
  donationCount: number;
  nextEligibleDate: Date | null;
  onDonorSelect: (donor: Donor) => void;
  onApproveRequest: (requestId: string) => Promise<any>;
  onRejectRequest: (requestId: string) => Promise<any>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export function DashboardProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DashboardContextProps;
}) {
  // Ensure value is properly defined before providing it
  if (!value) {
    console.error('DashboardProvider: value prop is required');
    return <div>Dashboard context error</div>;
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
