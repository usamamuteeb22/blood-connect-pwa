
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
  // Validate value exists
  if (!value) {
    console.error('DashboardProvider: value prop is required');
    throw new Error('DashboardProvider: value prop is required');
  }

  // Validate required functions
  if (typeof value.onDonorSelect !== 'function') {
    console.error('DashboardProvider: onDonorSelect must be a function');
    throw new Error('DashboardProvider: onDonorSelect must be a function');
  }

  if (typeof value.onApproveRequest !== 'function') {
    console.error('DashboardProvider: onApproveRequest must be a function');
    throw new Error('DashboardProvider: onApproveRequest must be a function');
  }

  if (typeof value.onRejectRequest !== 'function') {
    console.error('DashboardProvider: onRejectRequest must be a function');
    throw new Error('DashboardProvider: onRejectRequest must be a function');
  }

  // Ensure arrays are defined with safe defaults
  const contextValue: DashboardContextProps = {
    userDonor: value.userDonor || null,
    userRequests: Array.isArray(value.userRequests) ? value.userRequests : [],
    userDonations: Array.isArray(value.userDonations) ? value.userDonations : [],
    donorRequests: Array.isArray(value.donorRequests) ? value.donorRequests : [],
    donationCount: typeof value.donationCount === 'number' ? value.donationCount : 0,
    nextEligibleDate: value.nextEligibleDate || null,
    onDonorSelect: value.onDonorSelect,
    onApproveRequest: value.onApproveRequest,
    onRejectRequest: value.onRejectRequest,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
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
