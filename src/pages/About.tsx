
import React from "react";
import Navbar from "@/components/layout/Navbar";
import AboutHero from "@/components/about/AboutHero";
import OurMission from "@/components/about/OurMission";
import KnowledgeSection from "@/components/about/KnowledgeSection";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <OurMission />
        <KnowledgeSection />
      </main>
    </div>
  );
};

export default About;
