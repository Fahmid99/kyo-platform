import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Modal,
  Slide,
  Paper,
  Popper,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material";
import KyoCortexIcon from "../assets/KyoCortex.svg";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MicrosoftLogo from "../assets/MicrosoftLogo.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Twirl as Hamburger } from "hamburger-react";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { state, dispatch } = useAuth();
  const { isAuthenticated } = state;
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const theme = useTheme();

  const handleLogin = () => {
    window.location.href = `/.auth/login/aad?post_login_redirect_uri=/dashboard`;
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/.auth/logout?post_logout_redirect_uri=/";
  };

  const handleToggleServices = () => {
    setServicesOpen((prev) => !prev);
  };

  const handleCloseServices = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setServicesOpen(false);
  };

  const servicesList = [
    { title: "Analyze", desc: "Extract data from PDFs" },
    { title: "Summarize", desc: "AI summarization" },
    { title: "Translate", desc: "Multilingual translation" },
    { title: "Visualize", desc: "Turn data into charts" },
    { title: "Classify", desc: "Auto-tag content" },
    { title: "Audit", desc: "Compliance checks" },
  ];

  return (
    <>
      <AppBar position="static" sx={{ background: "#f8f7f6", boxShadow: "none", zIndex: 1300 }}>
        <Toolbar sx={{ position: "relative", m: 2 }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <GraphicEqIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
            <Box component="img" src={KyoCortexIcon} alt="KyoCortex Logo" sx={{ width: 150 }} />
          </Box>

          {/* Mobile hamburger */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
            }}
          >
            <Hamburger toggled={menuOpen} toggle={setMenuOpen} color="black" />
          </Box>

          {/* Center Nav Links */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Services with dropdown */}
            <Box>
              <Button
                ref={anchorRef}
                onClick={handleToggleServices}
                sx={{ my: 2, color: "black", fontSize: "16px" }}
                endIcon={<ArrowDropDownIcon />}
              >
                Services
              </Button>

              <Popper
                open={servicesOpen}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 1301 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps} style={{ transformOrigin: 'top left' }}>
                    <Paper
                      onMouseLeave={handleCloseServices}
                      sx={{
                        mt: 1,
                        p: 2,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        minWidth: 500,
                        boxShadow: 3,
                      }}
                    >
                      {servicesList.map((item) => (
                        <Button
                          key={item.title}
                          variant="text"
                          sx={{
                            textAlign: "left",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            px: 1,
                            py: 1,
                            color: "black",
                            textTransform: "none",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={500}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.desc}
                          </Typography>
                        </Button>
                      ))}
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>

            <Button sx={{ my: 2, color: "black", fontSize: "16px" }}>
              Pricing
            </Button>
            <Button sx={{ my: 2, color: "black", fontSize: "16px" }}>
              Blogs
            </Button>
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ marginLeft: "auto", display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {!isAuthenticated ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpen(true)}
                  sx={{ borderRadius: 50, p: "10px 16px" }}
                >
                  Sign In
                </Button>
                <Button variant="contained" sx={{ borderRadius: 50, p: "10px 16px" }}>
                  Get Started
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{ borderRadius: 50, p: "16px 24px" }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Slide-down Mobile Menu */}
      <Slide direction="down" in={menuOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            top: "64px",
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "#f8f7f6",
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            py: 4,
            zIndex: 1200,
          }}
        >
          <Button color="secondary" onClick={() => setMenuOpen(false)}>
            Services
          </Button>
          <Button color="secondary" onClick={() => setMenuOpen(false)}>
            Pricing
          </Button>
          <Button color="secondary" onClick={() => setMenuOpen(false)}>
            Blogs
          </Button>
          {!isAuthenticated ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setMenuOpen(false);
                setOpen(true);
              }}
              sx={{ borderRadius: 20 }}
            >
              Sign In
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              sx={{ borderRadius: 20 }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Slide>

      {/* Sign-In Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5} sx={{ p: 3 }}>
            <GraphicEqIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
            <Box
              component="img"
              src={KyoCortexIcon}
              alt="KyoCortex Logo"
              sx={{ width: 150 }}
            />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
            Login Now
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
              <img src={MicrosoftLogo} alt="Microsoft" style={{ width: 20, height: 20 }} />
            }
          >
            Login with Microsoft
          </Button>
          <Typography mt="20px">You don’t have an account? Register</Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
