
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is now globally rendered */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-md mx-auto">
            <AuthForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
