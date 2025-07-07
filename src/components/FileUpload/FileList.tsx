import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import { 
  Visibility, 
  Analytics, 
  Close,
  Download,
  PictureAsPdf,
  Image,
  Description,
  InsertDriveFile,
  CheckCircle
} from "@mui/icons-material";
import { DocumentFile } from "./types";

interface FileListProps {
  files: DocumentFile[];
  selectedFileId: string | null;
  loadedFileId: string | null;
  onViewFile: (file: DocumentFile) => void;
  onAnalyzeFile: (file: DocumentFile) => void;
  onRemoveFile: (file: DocumentFile) => void;
}

const ModernFileList: React.FC<FileListProps> = ({
  files,
  selectedFileId,
  loadedFileId,
  onViewFile,
  onAnalyzeFile,
  onRemoveFile,
}) => {
  const theme = useTheme();

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ color: '#d32f2f', fontSize: 24 }} />;
    if (fileType.includes('image')) return <Image sx={{ color: '#1976d2', fontSize: 24 }} />;
    if (fileType.includes('word') || fileType.includes('document')) return <Description sx={{ color: '#1976d2', fontSize: 24 }} />;
    if (fileType.includes('csv') || fileType.includes('excel')) return <InsertDriveFile sx={{ color: '#388e3c', fontSize: 24 }} />;
    return <InsertDriveFile sx={{ color: '#757575', fontSize: 24 }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontWeight: 500, 
          color: '#333',
          fontSize: '1.1rem'
        }}
      >
        Uploaded Files ({files.length})
      </Typography>
      
      <Stack spacing={1}>
        {files.map((file) => {
          const isSelected = selectedFileId === file.id;
          const isLoaded = loadedFileId === file.id;

          return (
            <Paper
              key={file.id}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: isSelected ? theme.palette.primary.main : '#e0e0e0',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: isSelected 
                  ? alpha(theme.palette.primary.main, 0.05) 
                  : 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isSelected 
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.grey[500], 0.02),
                  borderColor: isSelected 
                    ? theme.palette.primary.main 
                    : alpha(theme.palette.grey[500], 0.3),
                },
              }}
            >
              {/* File Icon */}
              <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {getFileIcon(file.type || '')}
              </Box>

              {/* File Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: '#333',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem'
                    }}
                  >
                    {file.name}
                  </Typography>
                  
                  {isSelected && (
                    <Chip
                      label="Selected"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                  
                  {isLoaded && (
                    <Chip
                      label="Ready"
                      size="small"
                      icon={<CheckCircle sx={{ fontSize: 14 }} />}
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        '& .MuiChip-label': { px: 1 },
                        '& .MuiChip-icon': { fontSize: 14, color: 'white' }
                      }}
                    />
                  )}
                </Box>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#666',
                    fontSize: '0.75rem'
                  }}
                >
                  {formatFileSize(file.size)} • {file.type || "Unknown type"}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => onViewFile(file)}
                  disabled={!file.base64}
                  sx={{ 
                    color: '#666',
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main
                    },
                    '&:disabled': {
                      color: '#ccc'
                    }
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
                
                <IconButton
                  size="small"
                  onClick={() => onAnalyzeFile(file)}
                  disabled={!file.base64}
                  sx={{ 
                    color: theme.palette.primary.main,
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    },
                    '&:disabled': {
                      color: '#ccc'
                    }
                  }}
                >
                  <Analytics fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => {
                    // Handle download functionality
                    if (file.base64) {
                      const link = document.createElement('a');
                      link.href = `data:${file.type};base64,${file.base64}`;
                      link.download = file.name;
                      link.click();
                    }
                  }}
                  disabled={!file.base64}
                  sx={{ 
                    color: '#666',
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main
                    },
                    '&:disabled': {
                      color: '#ccc'
                    }
                  }}
                >
                  <Download fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onRemoveFile(file)}
                  sx={{ 
                    color: '#666',
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main
                    }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ModernFileList;