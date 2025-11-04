"use client";
import { useState, useEffect } from "react";
import BrandsCarousel from "./components/BrandsCarousel";
import HeroSection from "./components/Hero";
import Navbar from "./components/Navbar";
import ProductsSection from "./components/ProductSection";

// ============================================
// MAIN APP
// ============================================
export default function App() {
  return (
    <div className="font-sans">
      <Navbar />
      <HeroSection />
      <BrandsCarousel />
      <ProductsSection />
    </div>
  );
}