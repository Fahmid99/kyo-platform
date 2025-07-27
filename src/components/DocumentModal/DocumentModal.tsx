import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  base64?: string;
}

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  file: DocumentFile | null;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  open,
  onClose,
  file,
}) => {
  if (!file || !file.base64) return null;

  const isPDF = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">{file.name}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ height: "80vh", p: 0 }}>
        {isPDF && (
          <iframe
            src={`data:application/pdf;base64,${file.base64}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title={file.name}
          />
        )}
        {isImage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 2,
            }}
          >
            <img
              src={`data:${file.type};base64,${file.base64}`}
              alt={file.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
        {!isPDF && !isImage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              File type not supported for preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {file.type || "Unknown file type"}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentModal;