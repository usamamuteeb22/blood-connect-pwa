
import React from "react";

const OurMission = () => {
  return (
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
  );
};

export default OurMission;
