
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
  // Simple validation without complex error handling that might interfere with rendering
  if (!value) {
    throw new Error('DashboardProvider: value prop is required');
  }

  // Ensure safe defaults for arrays and functions
  const safeValue: DashboardContextProps = {
    userDonor: value.userDonor || null,
    userRequests: Array.isArray(value.userRequests) ? value.userRequests : [],
    userDonations: Array.isArray(value.userDonations) ? value.userDonations : [],
    donorRequests: Array.isArray(value.donorRequests) ? value.donorRequests : [],
    donationCount: typeof value.donationCount === 'number' ? value.donationCount : 0,
    nextEligibleDate: value.nextEligibleDate || null,
    onDonorSelect: value.onDonorSelect || (() => {}),
    onApproveRequest: value.onApproveRequest || (() => Promise.resolve()),
    onRejectRequest: value.onRejectRequest || (() => Promise.resolve()),
  };

  return (
    <DashboardContext.Provider value={safeValue}>
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
