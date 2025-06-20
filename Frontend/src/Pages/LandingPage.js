import React from "react";
import Hero from "../Components/HeroSection";
import Navbar from "../Components/Navbar";
import ComparisonTable from "../Components/ComparisonTable";

export const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ComparisonTable />
    </>
  );
};
