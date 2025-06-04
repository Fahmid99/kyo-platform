import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation(); // Fixed: Added parentheses to call the hook
  const isAuthPage = ["/login", "/error"].includes(location.pathname);
  
  return (
    <Box sx={{ display: "flex" }}>
      {!isAuthPage && <Sidebar />}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};

export default Layout;