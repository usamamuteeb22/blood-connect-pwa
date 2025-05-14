
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
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export function DashboardProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DashboardContextProps;
}) {
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
