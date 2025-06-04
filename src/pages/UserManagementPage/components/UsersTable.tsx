import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  Box,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { User } from "../../../types/types";

interface UsersTableProps {
  users: User[];
  availableRoles: string[];
  handleRoleChange: (
    userId: string,
    event: SelectChangeEvent<string[]>
  ) => void;
  handleDelete: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  availableRoles,
  handleRoleChange,
  handleDelete,
}) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%", tableLayout: "auto" }}>
          {" "}
          {/* Auto-adjust width */}
          <TableHead>
            <TableRow sx={{ borderBottom: "1px solid #ccc" }}>
              <TableCell
                sx={{
                  width: "auto",
                  padding: "8px",
                  borderRight: "1px solid #ccc",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  width: "auto",
                  padding: "8px",
                  borderRight: "1px solid #ccc",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  width: "auto",
                  padding: "8px",
                  borderRight: "1px solid #ccc",
                }}
              >
                Roles
              </TableCell>
              <TableCell
                sx={{
                  width: "200px",
                  padding: "8px",
                  borderRight: "1px solid #ccc",
                }}
              >
                Status
              </TableCell>
              <TableCell sx={{ width: "auto", padding: "8px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ height: "36px", minHeight: "36px" }}
              >
                {" "}
                {/* Reduced height */}
                <TableCell sx={{ padding: "4px", border: "1px solid #ddd" }}>
                  {user.name || "-"}
                </TableCell>
                <TableCell sx={{ padding: "4px", border: "1px solid #ddd" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ padding: "4px", border: "1px solid #ddd" }}>
                  <Select
                    multiple
                    size="small"
                    value={user.roles || []}
                    onChange={(e) => handleRoleChange(user._id, e)}
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ padding: "4px", border: "1px solid #ddd" }}>
                  <Chip
                    sx={{
                      background: "white",
                      border: "1px solid #e1e1e1",
                      p: 0.5,
                    }}
                    label={user.status ? "Active" : "Inactive"}
                    size="small"
                    icon={
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: user.status ? "#0277bd" : "red",
                          marginRight: 1,
                        }}
                      />
                    }
                  />
                </TableCell>
                <TableCell sx={{ padding: "4px", border: "1px solid #ddd" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDelete(user._id)}
                    sx={{ m: 1 }}
                  >
                    {" "}
                    <Delete />
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDelete(user._id)}
                  >
                    {" "}
                    <Delete />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
