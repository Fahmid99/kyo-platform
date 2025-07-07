import { useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import Sidebar from "./Sidebar";

const LoadingSpinner = () => {
  const theme = useTheme();
  const [showSpinner] = useState(false); // Control visibility

 
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
