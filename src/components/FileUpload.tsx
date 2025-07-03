import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 3,
  borderWidth: 2,
  borderRadius: 1,
  borderColor: "grey.300",
  borderStyle: "dashed",
  backgroundColor: "grey.50",
  color: "text.secondary",
  outline: "none",
  transition: "border 0.24s ease-in-out",
  cursor: "pointer",
  minHeight: 200,
};

const focusedStyle = {
  borderColor: "primary.main",
};

const acceptStyle = {
  borderColor: "success.main",
};

const rejectStyle = {
  borderColor: "error.main",
};

function FileUpload() {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone();

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const files = acceptedFiles.map((file) => (
    <ListItem key={file.path}>
      <ListItemText
        primary={file.path}
        secondary={`${file.size} bytes`}
      />
    </ListItem>
  ));

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Paper
        {...getRootProps()}
        sx={style}
        elevation={0}
        variant="outlined"
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, mb: 2, color: "inherit" }} />
        <Typography variant="body1" color="inherit" textAlign="center">
         Click to upload or drop you files here 
        </Typography>
      </Paper>
      
      {acceptedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Files
          </Typography>
          <Paper variant="outlined">
            <List>
              {files}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default FileUpload;