import { Box, Button, SelectChangeEvent, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/types";
import { UsersTable } from "./components/UsersTable";
import UserInviteModal from "./components/UserInviteModal";
import useSnackbar from "../../hooks/useSnackbar";
import ToastMessage from "../../components/ToastMessage";

const availableRoles = ["admin", "users"];

export const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoles, setInviteRoles] = useState<string[]>([]);
  const { state } = useAuth();
  const { user } = state;
  const { open, message, type, showSnackbar, hideSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (user?.orgId) {
          const res = await adminService.getUsers();
          console.log(res);
          setUsers(
            res.map((user) => ({ ...user, status: user.status ?? false }))
          );
        } else {
          console.warn("User orgId is undefined — cannot fetch users.");
          // Optionally show fallback UI or message
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, [user]); // Add `user` as dependency if it's async-loaded

  const handleInvite = async () => {
    try {
      const newUser: User = await adminService.createUser(
        inviteEmail,
        inviteName,
        inviteRoles
      );

      console.log(newUser);
      if (!newUser || !newUser._id) {
        console.error("User creation failed or missing data.");
        return;
      }

      // Ensure the state updates with a complete user object
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setOpenModal(false);
      showSnackbar("User invited successfully!", "success");
      console.log("User invited successfully:", newUser);
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };
  const handleDelete = (id: string) => {
    const userToDelete = users.find((u) => u._id === id);
    console.log(userToDelete);
    showSnackbar("User was deleted", "error");

    if (!userToDelete?._id) {
      console.error("Error: MIssing user ID or orgId. Cannot delete");
      return;
    }

    setUsers((prev) => prev.filter((user) => user._id !== id));

    adminService
      .deleteUser(userToDelete._id)
      .then(() => console.log("User deleted successfully"))
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleRoleChange = async (
    id: string,
    event: SelectChangeEvent<string[]>
  ) => {
    const {
      target: { value },
    } = event;
    const newRoles = typeof value === "string" ? value.split(",") : value;

    // Update UI immediately
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, roles: newRoles } : user
      )
    );

    try {
      // Update backend
      const result = await adminService.updateUserById(id, {
        roles: newRoles,
        _id: "",
        orgId: "",
        email: "",
        name: "",
        eulaAccepted: false,
      });

      // Check if result exists and handle accordingly
      if (!result) {
        console.error("Failed to update roles: No response from server");
        showSnackbar("Failed to update user roles", "error");
        return;
      }

      if (!result.success) {
        console.error("Failed to update roles:");
        showSnackbar("Failed to update user roles", "error");
        // Optionally revert the UI change here
        // You might want to refetch users or revert the local state
      } else {
        showSnackbar("User roles updated successfully", "success");
      }
    } catch (error) {
      console.error("Error updating user roles:", error);
      showSnackbar("Failed to update user roles", "error");
      // Optionally revert the UI change here
    }
  };
  return (
    <Box display="flex">
      <Box flex={1} p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <ToastMessage
            type={type}
            message={message}
            open={open}
            onClose={hideSnackbar}
          />
          <Typography variant="h5">Users</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
          >
            Invite User
          </Button>
        </Box>

        <UsersTable
          users={users}
          availableRoles={availableRoles}
          handleRoleChange={handleRoleChange}
          handleDelete={handleDelete}
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
    </Box>
  );
};
