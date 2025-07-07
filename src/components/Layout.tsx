import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

// Define headers for each route - these render immediately
const pageConfigs = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Welcome to your dashboard overview'
  },
  '/users': {
    title: 'User management', 
    description: 'Manage your team members and their account permissions here.'
  },
  '/analyze': {
    title: 'Document Analysis Centre',
    description: 'Upload your documents to preconfigured zones or use general upload with custom models.'
  },
  '/analyze/results': {
    title: 'Analysis Results',
    description: 'View and download your document analysis results.'
  },
  '/activity': {
    title: 'Activity',
    description: 'View your recent activity and usage statistics.'
  },
  '/billing': {
    title: 'Billing',
    description: 'Manage your subscription and billing information.'
  },
  '/settings': {
    title: 'Settings',
    description: 'Configure your account and application preferences.'
  }
} as const;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/error", "/unauthorised"].includes(location.pathname);
  const currentPageConfig = pageConfigs[location.pathname as keyof typeof pageConfigs];
  
  // For results page, we'll let the component handle its own header
  const showDefaultHeader = !isAuthPage && currentPageConfig && location.pathname !== '/analyze/results';
  
  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "#f9fafb"
    }}>
      {!isAuthPage && <Sidebar />}
      <Box sx={{ 
        flexGrow: 1,
        backgroundColor: "#f9fafb",
        minHeight: "100vh"
      }}>
        {/* Header renders immediately for most pages - results page handles its own */}
        {showDefaultHeader && (
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
              {currentPageConfig.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
              {currentPageConfig.description}
            </Typography>
          </Box>
        )}
        
        {/* Page content loads here */}
        <Box sx={{ px: location.pathname === '/analyze/results' ? 0 : 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;