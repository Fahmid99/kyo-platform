import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ToastMessageProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  open: boolean;
  onClose: () => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  type,
  message,
  open,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;
