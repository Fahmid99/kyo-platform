import React from "react";

import HeroSection from "./components/HeroSection";
import { Box } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f7f6",
      }}
    >
      <HeroSection
        title="Transform PDFs into real data"
        highlightedText="AI-powered"
        lines={[
          "Built for when performance, security, and reliability matter,",
          "wrapped with a delightful developer experience.",
        ]}
      />
    </Box>
  );
};

export default HomePage;
