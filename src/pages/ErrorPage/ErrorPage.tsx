import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import KyoceraTextLogo from "../../components/KyoceraTextLogo";

interface NotFoundPageProps {
  errorCode?: number | null; // ✅ Allow null values
}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  const errorCode = location.state?.errorCode ?? null;
  console.log(location);
  console.log(location.state);
  console.log(errorCode);
  console.log("Received errorCode:", errorCode);
  // Determine the title based on error code
  const errorTitle = errorCode ? `${errorCode} Error` : "Authorization Error";
  console.log(errorCode);
  // Dynamic error message
  const errorMessage =
    errorCode === 404
      ? "Contact your organization admin to sign up for our platform."
      : errorCode === 401
      ? "Contact your organization platform admin to add you to the system."
      : "Unauthorized access detected.";

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        <KyoceraTextLogo />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={6}
        bgcolor="#fff"
        height="80vh"
        m="10"
      >
        {/* Text Section */}
        <Box>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            {errorTitle} {/* ✅ Displays Authorization Error if code is null */}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {errorMessage}
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              mt: 2,
              bgcolor: "black",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: "#222",
              },
            }}
          >
            Back to Login
          </Button>
        </Box>

        {/* Half Circle Shape */}
        <Box
          width={300}
          height={150}
          borderRadius="0 0 150px 150px"
          mt={10}
          ml={10}
          sx={{ background: theme.palette.primary.main }}
        />
      </Box>
    </Box>
  );
};

export default NotFoundPage;
