import React from "react";
import Hero from "../Components/HeroSection";
import Navbar from "../Components/Navbar";
import ComparisonTable from "../Components/ComparisonTable";
import FeaturesGrid from "../Components/FeaturesGrid";
import HowItWorks from "../Components/HowItWorks";
import SocialProof from "../Components/SocialProof";

export const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ComparisonTable />
      <FeaturesGrid />
      <HowItWorks />
      <SocialProof />
    </>
  );
};
