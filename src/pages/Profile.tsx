
import { Suspense, lazy } from "react";
import Footer from "@/components/layout/Footer";

// Lazy load the ProfileCard component
const ProfileCard = lazy(() => import("@/components/profile/ProfileCard"));

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>
          <Suspense fallback={<div className="text-center py-8">Loading profile...</div>}>
            <ProfileCard />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
