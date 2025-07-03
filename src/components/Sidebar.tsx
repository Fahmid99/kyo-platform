import React, { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import InsightsIcon from "@mui/icons-material/Insights";
import BillingIcon from "@mui/icons-material/AttachMoney";
import OrgIcon from "@mui/icons-material/Business";
import UsersIcon from "@mui/icons-material/Group";
import ActivityIcon from "@mui/icons-material/SsidChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../hooks/useAuth";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { state, hasRole } = useAuth(); // Fixed: Get user from state
  const { user } = state; // Extract user from state

  const toggleSidebar = () => setOpen((prev) => !prev);

  // You'll need to implement logout functionality or get it from your auth context
  const logout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
  };

  // Menu Items
  const menuSections = [
    {
      title: "Home",
      items: [
        { icon: <HomeIcon />, label: "Dashboard", path: "/dashboard" },
        { icon: <ActivityIcon />, label: "Activity", path: "/activity" },
        { icon: <BillingIcon />, label: "Billing", path: "/billing" },
      ],
    },
    {
      title: "Services",
      items: [
        { icon: <InsightsIcon />, label: "Analyze", path: "/analyze" },
        { icon: <SettingsIcon />, label: "Settings", path: "/settings" },
      ],
    },
    ...(hasRole("organisation-admin")
      ? [
          {
            title: "Management",
            items: [
              { icon: <UsersIcon />, label: "Users", path: "/users" },
              {
                icon: <OrgIcon />,
                label: "Organization",
                path: "/organization",
              },
            ],
          },
        ]
      : []), // ✅ Conditionally spread the management section
  ];

  return (
    <Box
      sx={{
        width: open ? 200 : 60,
        height: "100vh",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#f9fafa",
        p: 2,
        transition: "width 0.3s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // ✅ Push profile section to bottom
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 8,
          right: open ? -15 : "auto",
          bgcolor: "white",
          width: 30,
          height: 30,
          border: "1px solid #ccc",
          boxShadow: 1,
          "&:hover": { bgcolor: "#f0f0f0", color: "#1976d2" },
          zIndex: 10,
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      {/* Sidebar Menu Items */}
      <List disablePadding sx={{ flexGrow: 1, mt: open ? 0 : 3 }}>
        {menuSections.map((section) => (
          <React.Fragment key={section.title}>
            {open && (
              <Typography
                variant="overline"
                sx={{ color: "#1976d2", px: 2, mt: 3, mb: 1 }}
              >
                {section.title}
              </Typography>
            )}
            {section.items.map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                  }}
                  sx={{ justifyContent: open ? "initial" : "center", px: 2 }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: { color: "#1976d2" },
                    })}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}>
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </Avatar>

          {open && (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2">{user?.name || "User"}</Typography>
            </Box>
          )}
        </Box>
        {/* Logout Button - Separate from Profile */}
        <ListItemButton
          onClick={logout}
          sx={{
            width: "100%",
            borderRadius: 1,
          }}
        >
          <LogoutIcon sx={{ mr: 1, color: "#757575" }} />
          {open && <Typography>Log out</Typography>}
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
