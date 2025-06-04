import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";

function NewDashboardPage() {
  const { state } = useAuth();
  const { user } = state;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar stays on the left */}


      {/* Main content container (Centered) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography variant="h4">Dashboard Loaded</Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Welcome, {user?.name || "Guest"}!
        </Typography>

        <TableContainer component={Paper} sx={{ width: "60%", mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Attribute</strong>
                </TableCell>
                <TableCell>
                  <strong>Value</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>{user?.email || "Not available"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Organization ID</TableCell>
                <TableCell>{user?.orgId || "Not available"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Roles</TableCell>
                <TableCell>
                  {user?.roles?.join(", ") || "No roles assigned"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default NewDashboardPage;
