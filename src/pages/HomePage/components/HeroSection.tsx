// src/features/home/components/HeroSection.tsx
import { Box, Button, Typography } from "@mui/material";
import theme from "../../../../theme.js";

interface HeroSectionProps {
  title: string;
  //title2: string;
  highlightedText: string;
  //subtitle: string;
  lines: string[];
}

const HeroSection = ({ title, highlightedText, lines }: HeroSectionProps) => {
  return (
    <>
      <Box
        sx={{
          height: "98vh",
          mt: -10,
          p: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" fontWeight={900}>
            {title}{" "}
          </Typography>
          <Typography variant="h1" fontWeight={900}>
            with{" "}
            <span style={{ color: theme.palette.primary.main }}>
              {highlightedText}
            </span>{" "}
            engines
          </Typography>
        </Box>
        <Box sx={{ marginTop: "2em" }}>
          <Typography variant="h6" sx={{ fontWeight: "600", color: "#757575" }}>
            {lines}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: "2em",
          }}
        >
          <Button variant="contained" sx={{ borderRadius: 50, p: "16px 24px" }}>
            Get Started
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 50,
              p: "16px 24px",
              border: "1px solid #e1e1e1",
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default HeroSection;
