import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
interface UserInviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  inviteName: string;
  setInviteName: (name: string) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRoles: string[];
  setInviteRoles: Dispatch<SetStateAction<string[]>>;
  availableRoles: string[];
  handleInvite: () => void;
}

const UserInviteModal: React.FC<UserInviteModalProps> = ({
  open,
  setOpen,
  inviteName,
  setInviteName,
  inviteEmail,
  setInviteEmail,
  inviteRoles,
  setInviteRoles,
  availableRoles,
  handleInvite,
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Invite New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          value={inviteName}
          onChange={(e) => setInviteName(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Select
          multiple
          fullWidth
          value={inviteRoles}
          onChange={(e) =>
            setInviteRoles(
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          renderValue={(selected) => selected.join(", ")}
          sx={{ mt: 2 }}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleInvite}
          disabled={!inviteName || !inviteEmail || inviteRoles.length === 0}
        >
          Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInviteModal;
