
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Find Donors",
      description: "Connect with compatible donors in your area",
      icon: "🔍",
      link: "/donate",
    },
    {
      title: "Request Blood",
      description: "Submit requests for specific blood types",
      icon: "🩸",
      link: "/donate",
      state: { activeTab: "request" }
    },
    {
      title: "Real-time Tracking",
      description: "Track the status of blood donations and requests",
      icon: "🔔",
      link: "/dashboard",
    },
    {
      title: "Hospital Integration",
      description: "Connect with verified hospitals and blood banks",
      icon: "🏥",
      link: "/about",
    },
  ];

  const stats = [
    { number: "100K+", label: "Register Donors" },
    { number: "50K+", label: "Lives Saved" },
    { number: "500+", label: "Partner Hospitals" },
    { number: "98%", label: "Request Success Rate" },
  ];

  const handleFeatureClick = (link: string, state?: any) => {
    navigate(link, { state });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-red-50"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOGI0YjQiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Donate Blood, <span className="text-blood">Save Lives</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                OneDrop connects blood donors with recipients in real-time. Join our community and help save lives with just one drop.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-blood hover:bg-blood-600 text-white px-8 py-6 text-lg"
                  onClick={() => navigate('/donate')}
                >
                  Donate Blood
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blood text-blood hover:bg-blood-50 px-8 py-6 text-lg"
                  onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
                >
                  Request Blood
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How OneDrop Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform makes blood donation and requests simple, efficient, and secure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                  onClick={() => handleFeatureClick(feature.link, feature.state)}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-6">
                  <p className="text-4xl font-bold text-blood mb-2">{stat.number}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 blood-gradient text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Join thousands of donors who are saving lives every day. Register now to become a part of our life-saving community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button className="bg-white text-blood hover:bg-gray-100 px-8 py-6 text-lg">
                  Register as Donor
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="bg-white text-blood hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
              >
                I Need Blood
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials (simplified) */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real stories from donors and recipients who connected through OneDrop
              </p>
            </div>

            <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-sm bg-white">
              <p className="text-lg italic text-gray-600 mb-4">
                "When my father needed an urgent blood transfusion, OneDrop connected us with a donor within 30 minutes. The platform literally saved his life. I'm forever grateful for this amazing service."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Blood Recipient Family</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
