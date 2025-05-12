
import React from "react";

const Partners = () => {
  return (
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
  );
};

export default Partners;
