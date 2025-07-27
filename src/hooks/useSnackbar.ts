import { useState } from "react";

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "warning" | "info">(
    "info"
  );

  const showSnackbar = (
    msg: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setMessage(msg);
    setType(severity);
    setOpen(true);
  };

  const hideSnackbar = () => {
    setOpen(false);
  };

  return { open, message, type, showSnackbar, hideSnackbar };
};

export default useSnackbar;
