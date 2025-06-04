import { useState, useEffect } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import Sidebar from "./Sidebar";

const LoadingSpinner = () => {
  const theme = useTheme();
  const [showSpinner, setShowSpinner] = useState(false); // Control visibility

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 500); // Delay by 500ms
    return () => clearTimeout(timer); // Cleanup timer when unmounting
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      {/* Content Wrapper */}
      <Box sx={{
        flexGrow: 1, 
        display: "flex",
        justifyContent: "center", 
        alignItems: "center"
      }}>
        {showSpinner && <ClimbingBoxLoader color={theme.palette.primary.main} />}
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
