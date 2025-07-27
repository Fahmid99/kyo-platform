import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MicrosoftLogo from "../assets/MicrosoftLogo.svg";

import KyoceraTextLogo from "../components/KyoceraTextLogo";

const LoginPage: React.FC = () => {
  const theme = useTheme();

  const handleLogin = () => {
    window.location.href = `/.auth/login/aad?post_login_redirect_uri=/dashboard`;
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Box
        sx={{
          border: "1px solid #e1e1e1",
          p: 10,
          borderRadius: 5,
          background: "white",
          boxShadow:
            " 0 0 0 1px #0000000a, 0 2px 4px #0000000f, 0 8px 12px #0000000a",
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5} sx={{ p: 3 }}>
          <GraphicEqIcon
            sx={{ color: theme.palette.primary.main, fontSize: 40 }}
          />
          <KyoceraTextLogo />
        </Box>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Login
        </Typography>
        <Typography gutterBottom>
          Use one of our authentication providers
        </Typography>
        <Button
          onClick={handleLogin}
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2, background: "#f8f7f6", border: "1px solid #e1e1e1" }}
          startIcon={
            <img
              src={MicrosoftLogo}
              alt="Microsoft"
              style={{ width: 20, height: 20 }}
            />
          }
        >
          Login with Microsoft
        </Button>
        <Typography mt="20px">
          You don’t have an account?{" "}
          <a
            href="https://example.com/register"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            Register
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
