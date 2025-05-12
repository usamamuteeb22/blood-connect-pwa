
import React from "react";

const AboutHero = () => {
  return (
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
  );
};

export default AboutHero;
