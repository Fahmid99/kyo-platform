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
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";
import { User } from "../../../types/types";
import { useState } from "react";

interface UsersTableProps {
  users: User[];
  availableRoles: string[];
  onUserUpdate: (userId: string, updatedUser: Partial<User>) => Promise<void>;
  onUserDelete: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  availableRoles,
  onUserUpdate,
  onUserDelete,
}) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const startEdit = (user: User) => {
    setEditingUserId(user._id);
    setEditData({
      name: user.name,
      email: user.email,
      roles: user.roles,
      status: user.status,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditData({});
  };

  const saveEdit = async (userId: string) => {
    setLoading(userId);
    try {
      await onUserUpdate(userId, editData);
      setEditingUserId(null);
      setEditData({});
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleFieldChange = (field: keyof User, value: unknown) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isEditing = (userId: string) => editingUserId === userId;
  const isLoading = (userId: string) => loading === userId;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    return `${day} ${month} ${year}, ${time}`;
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2, 
        boxShadow: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              Full name
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              Email
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              Role
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              Status
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              Joined date
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              2F Auth
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '13px',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              py: 2
            }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow 
              key={user._id}
              sx={{ 
                "&:hover": { backgroundColor: "#f9fafb" },
                backgroundColor: isEditing(user._id) ? "#fff7ed" : "inherit",
                borderBottom: index === users.length - 1 ? 'none' : '1px solid #f3f4f6'
              }}
            >
              {/* Full Name Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                {isEditing(user._id) ? (
                  <TextField
                    value={editData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: getAvatarColor(user.name || 'U'),
                        color: 'white'
                      }}
                    >
                      {getInitials(user.name || 'User')}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                      {user.name || "-"}
                    </Typography>
                  </Box>
                )}
              </TableCell>

              {/* Email Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                {isEditing(user._id) ? (
                  <TextField
                    value={editData.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                    type="email"
                  />
                ) : (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6366f1',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    {user.email}
                  </Typography>
                )}
              </TableCell>

              {/* Role Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                {isEditing(user._id) ? (
                  <Select
                    value={editData.roles?.[0] || ""}
                    onChange={(e) => handleFieldChange("roles", [e.target.value as string])}
                    size="small"
                    fullWidth
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    {user.roles?.[0] || "-"}
                  </Typography>
                )}
              </TableCell>

              {/* Status Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                {isEditing(user._id) ? (
                  <Select
                    value={editData.status ? "Active" : "Inactive"}
                    onChange={(e) => handleFieldChange("status", e.target.value === "Active")}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                  </Select>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: user.status ? '#10b981' : '#10b981',
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: user.status ? '#10b981' : '#10b981',
                        fontWeight: 500
                      }}
                    >
                      {user.status ? "Active" : "Active"}
                    </Typography>
                  </Box>
                )}
              </TableCell>

              {/* Joined Date Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {/* You can add a createdAt field to your User type and use it here */}
                  {formatDate(new Date().toISOString())}
                </Typography>
              </TableCell>

              {/* 2F Auth Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                <Chip
                  label="Enabled"
                  size="small"
                  sx={{
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    fontWeight: 500,
                    fontSize: '11px',
                    height: '24px'
                  }}
                />
              </TableCell>

              {/* Actions Cell */}
              <TableCell sx={{ py: 2, borderBottom: 'none' }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {isEditing(user._id) ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                        onClick={() => saveEdit(user._id)}
                        disabled={isLoading(user._id)}
                        sx={{ minWidth: '80px', fontSize: '11px' }}
                      >
                        {isLoading(user._id) ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={cancelEdit}
                        disabled={isLoading(user._id)}
                        sx={{ minWidth: '80px', fontSize: '11px' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<Edit sx={{ fontSize: '16px' }} />}
                        onClick={() => startEdit(user)}
                        disabled={editingUserId !== null}
                        sx={{ 
                          color: '#6b7280',
                          fontSize: '11px',
                          minWidth: '60px',
                          '&:hover': {
                            backgroundColor: '#f3f4f6'
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<Delete sx={{ fontSize: '16px' }} />}
                        onClick={() => onUserDelete(user._id)}
                        disabled={editingUserId !== null}
                        sx={{ 
                          color: '#ef4444',
                          fontSize: '11px',
                          minWidth: '70px',
                          '&:hover': {
                            backgroundColor: '#fef2f2'
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};