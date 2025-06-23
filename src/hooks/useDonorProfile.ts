
import { useDonorProfileData } from "./useDonorProfileData";
import { useDonationOperations } from "./useDonationOperations";

export const useDonorProfile = (id: string | undefined) => {
  const {
    donor,
    donations,
    loading,
    fetchProfile
  } = useDonorProfileData(id);

  const {
    addLoading,
    addDonation,
    resetDonations
  } = useDonationOperations(donor, fetchProfile);

  return {
    donor,
    donations,
    loading,
    addLoading,
    addDonation,
    resetDonations,
    fetchProfile
  };
};
