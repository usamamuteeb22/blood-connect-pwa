
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import OurMission from "@/components/about/OurMission";
import ImpactStats from "@/components/about/ImpactStats";
import TeamMembers from "@/components/about/TeamMembers";
import Partners from "@/components/about/Partners";
import { teamMembers } from "@/data/teamMembers";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <OurMission />
        <ImpactStats />
        <TeamMembers members={teamMembers} />
        <Partners />
      </main>
      <Footer />
    </div>
  );
};

export default About;
