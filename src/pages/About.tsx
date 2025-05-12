
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      bio: "Hematologist with 15+ years experience in blood banking and transfusion medicine.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "Michael Chen",
      role: "Chief Operations Officer",
      bio: "Former hospital administrator with expertise in healthcare logistics and supply chain management.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "Aisha Patel",
      role: "Head of Technology",
      bio: "Software engineer specializing in healthcare technology solutions and data security.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-red-50">
          <div className="container mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-blood">OneDrop</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Our mission is to connect blood donors with recipients seamlessly, ensuring that no life is lost due to blood shortage.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-6">
                  At OneDrop, we believe that access to safe blood is a fundamental right. Our platform leverages technology to bridge the gap between donors and recipients, making the donation process efficient and accessible to all.
                </p>
                <p className="text-gray-700">
                  Since our founding in 2018, we've facilitated over 50,000 successful donations and have partnered with more than 500 hospitals nationwide to ensure a steady supply of life-saving blood.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Blood donation" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-5xl font-bold text-blood mb-4">100K+</div>
                  <p className="text-lg">Registered Donors</p>
                  <p className="text-gray-600 mt-2">Active community ready to donate</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-5xl font-bold text-blood mb-4">50K+</div>
                  <p className="text-lg">Lives Saved</p>
                  <p className="text-gray-600 mt-2">Through successful blood donations</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-5xl font-bold text-blood mb-4">98%</div>
                  <p className="text-lg">Request Success Rate</p>
                  <p className="text-gray-600 mt-2">Matching donors to recipients</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-blood mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-gray-300">Hospital {i}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
