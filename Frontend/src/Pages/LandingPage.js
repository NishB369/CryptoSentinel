import React from "react";
import Hero from "../Components/HeroSection";
import Navbar from "../Components/Navbar";
import ComparisonTable from "../Components/ComparisonTable";
import FeaturesGrid from "../Components/FeaturesGrid";

export const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ComparisonTable />
      <FeaturesGrid />
    </>
  );
};
