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
  Divider,
  Tooltip,
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
  const { state, hasRole } = useAuth();
  const { user } = state;

  const toggleSidebar = () => setOpen((prev) => !prev);

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
      : []),
  ];

  return (
    <Box
      sx={{
        width: open ? 240 : 64,
        height: "100vh",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fafafa",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 12,
          right: open ? 8 : 8,
          bgcolor: "white",
          width: 32,
          height: 32,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 10,
          "&:hover": { 
            bgcolor: "#f5f5f5", 
            transform: "scale(1.1)",
            transition: "all 0.2s ease"
          },
        }}
      >
        {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
      </IconButton>

      {/* Header/Logo Area */}
      <Box sx={{ p: open ? 3 : 2, pt: open ? 3 : 4 }}>
        {open ? (
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#1976d2", 
              fontWeight: 600,
              textAlign: "left"
            }}
          >
            Dashboard
          </Typography>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar 
              sx={{ 
                bgcolor: "#1976d2", 
                width: 32, 
                height: 32,
                fontSize: "14px",
                fontWeight: 600
              }}
            >
              D
            </Avatar>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 1 }} />

      {/* Main Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 1 }}>
        <List disablePadding>
          {menuSections.map((section) => (
            <React.Fragment key={section.title}>
              {open && (
                <Typography
                  variant="caption"
                  sx={{ 
                    color: "#666", 
                    px: 3, 
                    py: 1,
                    display: "block",
                    textTransform: "uppercase",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.5px"
                  }}
                >
                  {section.title}
                </Typography>
              )}
              {section.items.map((item) => (
                <ListItem disablePadding key={item.label} sx={{ px: 1 }}>
                  <Tooltip 
                    title={!open ? item.label : ""} 
                    placement="right"
                    arrow
                  >
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 44,
                        justifyContent: open ? "initial" : "center",
                        borderRadius: 1,
                        mx: 1,
                        mb: 0.5,
                        "&:hover": {
                          bgcolor: "#e3f2fd",
                          "& .MuiListItemIcon-root": {
                            color: "#1565c0",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : "auto",
                          justifyContent: "center",
                          color: "#1976d2",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <ListItemText 
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
              {open && section !== menuSections[menuSections.length - 1] && (
                <Box sx={{ py: 1 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Divider sx={{ mx: 1 }} />

      {/* Bottom Profile & Logout Section */}
      <Box sx={{ p: 1 }}>
        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: open ? 2 : 1,
            borderRadius: 2,
            bgcolor: "#f5f5f5",
            mb: 1,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#eeeeee",
            },
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: "#1976d2", 
              width: open ? 40 : 36, 
              height: open ? 40 : 36,
              fontSize: open ? "16px" : "14px",
              fontWeight: 600,
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </Avatar>

          {open && (
            <Box sx={{ ml: 2, minWidth: 0 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: "#333",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "User"}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "#666",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Logout Button */}
        <Tooltip title={!open ? "Log out" : ""} placement="right" arrow>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 2,
              minHeight: 44,
              justifyContent: open ? "initial" : "center",
              color: "#666",
              "&:hover": {
                bgcolor: "#e3f2fd",
                "& .MuiListItemIcon-root": {
                  color: "#1565c0",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : "auto",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary="Log out"
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;