import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Search,
  FilterList,
  FileDownload,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/types";
import { UsersTable } from "./components/UsersTable";
import UserInviteModal from "./components/UserInviteModal";
import useSnackbar from "../../hooks/useSnackbar";
import ToastMessage from "../../components/ToastMessage";

const availableRoles = ["admin", "users", "organisation-admin"];

export const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoles, setInviteRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [authFilter, setAuthFilter] = useState<string | null>(null);
  const [roleMenuAnchor, setRoleMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [authMenuAnchor, setAuthMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const { state } = useAuth();
  const { user } = state;
  const { open, message, type, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (user?.orgId) {
        const res = await adminService.getUsers();
        console.log("Fetched users:", res);
        setUsers(
          res.map((user) => ({
            ...user,
            status: user.status === true,
          }))
        );
      } else {
        console.warn("User orgId is undefined — cannot fetch users.");
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (
    userId: string,
    updatedData: Partial<User>
  ) => {
    try {
      const updatePayload: User = {
        _id: userId,
        orgId: user?.orgId || "",
        email: updatedData.email || "",
        name: updatedData.name || "",
        roles: updatedData.roles || [],
        eulaAccepted: false,
        status: updatedData.status,
      };

      const result = await adminService.updateUserById(userId, updatePayload);

      if (result && result.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, ...updatedData } : user
          )
        );
        showSnackbar("User updated successfully", "success");
      } else {
        throw new Error(result?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar("Failed to update user", "error");
      throw error;
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const userToDelete = users.find((u) => u._id === userId);
      if (!userToDelete?._id) {
        console.error("Error: Missing user ID. Cannot delete");
        showSnackbar("Cannot delete user: Invalid user data", "error");
        return;
      }

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      showSnackbar("User deleted successfully", "success");
      await adminService.deleteUser(userToDelete._id);
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Failed to delete user", "error");
      fetchUsers();
    }
  };

  const handleInvite = async () => {
    try {
      const newUser: User = await adminService.createUser(
        inviteEmail,
        inviteName,
        inviteRoles
      );

      if (!newUser || !newUser._id) {
        console.error("User creation failed or missing data.");
        showSnackbar("Failed to create user", "error");
        return;
      }

      setUsers((prevUsers) => [...prevUsers, newUser]);

      setOpenModal(false);
      setInviteName("");
      setInviteEmail("");
      setInviteRoles([]);

      showSnackbar("User invited successfully!", "success");
    } catch (error) {
      console.error("Error inviting user:", error);
      showSnackbar("Failed to invite user", "error");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "#e5e7eb", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                color: "#6b7280",
                "&.Mui-selected": {
                  color: "#111827",
                },
              },
            }}
          >
            <Tab label="Table" />
            <Tab label="Board" />
            <Tab label="List" />
          </Tabs>
        </Box>

        {/* Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <TextField
              placeholder="Search"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 20, color: "#6b7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                },
              }}
            />

            {/* Filters */}
            <Button
              variant="outlined"
              onClick={(e) => setRoleMenuAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDown />}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#d1d5db",
                backgroundColor: "white",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              Role{" "}
              {roleFilter && (
                <Chip label={roleFilter} size="small" sx={{ ml: 1 }} />
              )}
            </Button>

            <Button
              variant="outlined"
              onClick={(e) => setAuthMenuAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDown />}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#d1d5db",
                backgroundColor: "white",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              2F Auth{" "}
              {authFilter && (
                <Chip label={authFilter} size="small" sx={{ ml: 1 }} />
              )}
            </Button>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#d1d5db",
                backgroundColor: "white",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              Add filter
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#d1d5db",
                backgroundColor: "white",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }}
            >
              Export
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
              sx={{
                backgroundColor: "#6366f1",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#5855eb",
                },
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 4,
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <Typography>Loading users...</Typography>
        </Box>
      ) : (
        <UsersTable
          users={filteredUsers}
          availableRoles={availableRoles}
          onUserUpdate={handleUserUpdate}
          onUserDelete={handleUserDelete}
        />
      )}

      {/* Filter Menus */}
      <Menu
        anchorEl={roleMenuAnchor}
        open={Boolean(roleMenuAnchor)}
        onClose={() => setRoleMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setRoleFilter(null);
            setRoleMenuAnchor(null);
          }}
        >
          All Roles
        </MenuItem>
        {availableRoles.map((role) => (
          <MenuItem
            key={role}
            onClick={() => {
              setRoleFilter(role);
              setRoleMenuAnchor(null);
            }}
          >
            {role}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={authMenuAnchor}
        open={Boolean(authMenuAnchor)}
        onClose={() => setAuthMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAuthFilter(null);
            setAuthMenuAnchor(null);
          }}
        >
          All
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAuthFilter("Enabled");
            setAuthMenuAnchor(null);
          }}
        >
          Enabled
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAuthFilter("Disabled");
            setAuthMenuAnchor(null);
          }}
        >
          Disabled
        </MenuItem>
      </Menu>

      {/* Toast Messages */}
      <ToastMessage
        type={type}
        message={message}
        open={open}
        onClose={hideSnackbar}
      />

      {/* Invite User Modal */}
      <UserInviteModal
        open={openModal}
        setOpen={setOpenModal}
        inviteName={inviteName}
        setInviteName={setInviteName}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRoles={inviteRoles}
        setInviteRoles={setInviteRoles}
        availableRoles={availableRoles}
        handleInvite={handleInvite}
      />
    </Box>
  );
};
