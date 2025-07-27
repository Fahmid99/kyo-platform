import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Paper,
  Typography,
  Stack,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import { 
  CloudUpload, 
  Description, 
  Image, 
  PictureAsPdf,
  InsertDriveFile,
  Close,
  Download,
  Visibility,
  Analytics
} from "@mui/icons-material";
import { DocumentFile } from "./types";

interface FileUploadZoneProps {
  onFilesUploaded: (files: DocumentFile[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  files?: DocumentFile[];
  selectedFileId?: string | null;
  loadedFileId?: string | null;
  onViewFile?: (file: DocumentFile) => void;
  onAnalyzeFile?: (file: DocumentFile) => void;
  onRemoveFile?: (file: DocumentFile) => void;
}

const ModernFileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFilesUploaded, 
  acceptedFileTypes,
  maxFiles = 10,
  files = [],
  selectedFileId,
  loadedFileId,
  onViewFile,
  onAnalyzeFile,
  onRemoveFile
}) => {
  const theme = useTheme();

  // Function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const filesWithBase64 = await Promise.all(
      acceptedFiles.map(async (file) => {
        try {
          const base64 = await convertToBase64(file);
          const documentFile: DocumentFile = {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            base64,
          };
          return documentFile;
        } catch (error) {
          console.error("Error converting file to base64:", error);
          const documentFile: DocumentFile = {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          };
          return documentFile;
        }
      })
    );

    onFilesUploaded(filesWithBase64);
  }, [onFilesUploaded]);

  const acceptConfig = acceptedFileTypes ? 
    acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>) :
    {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/*": [".txt"],
      "text/csv": [".csv"],
    };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxFiles,
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
    if (fileType.includes('image')) return <Image sx={{ color: '#1976d2' }} />;
    if (fileType.includes('word') || fileType.includes('document')) return <Description sx={{ color: '#1976d2' }} />;
    if (fileType.includes('csv') || fileType.includes('excel')) return <InsertDriveFile sx={{ color: '#388e3c' }} />;
    return <InsertDriveFile sx={{ color: '#757575' }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Upload Zone */}
      <Paper
        {...getRootProps()}
        elevation={0}
        sx={{
          border: '2px dashed #e0e0e0',
          borderRadius: 2,
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : '#fafafa',
          borderColor: isDragActive ? theme.palette.primary.main : '#e0e0e0',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
      >
        <input {...getInputProps()} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <CloudUpload sx={{ fontSize: 28, color: 'white' }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 500, color: '#333' }}>
            Create or import a custom classification
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Maximum file size: 50 MB
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Supported format: .CSV
          </Typography>
        </Box>
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Template file to download
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
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'white',
                    borderColor: isSelected ? theme.palette.primary.main : '#e0e0e0',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.grey[500], 0.02),
                    },
                  }}
                >
                  {/* File Icon */}
                  <Box sx={{ flexShrink: 0 }}>
                    {getFileIcon(file.type || '')}
                  </Box>

                  {/* File Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: '#333',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                     {formatFileSize(file.size)} • {new Date(file.lastModified || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Status Indicators */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isLoaded && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4caf50',
                        }}
                      />
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    {onViewFile && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewFile(file);
                        }}
                        sx={{ 
                          color: '#666',
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    )}
                    
                    {onAnalyzeFile && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeFile(file);
                        }}
                        sx={{ 
                          color: theme.palette.primary.main,
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                        }}
                      >
                        <Analytics fontSize="small" />
                      </IconButton>
                    )}

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download
                      }}
                      sx={{ 
                        color: '#666',
                        '&:hover': { backgroundColor: alpha(theme.palette.success.main, 0.1) }
                      }}
                    >
                      <Download fontSize="small" />
                    </IconButton>

                    {onRemoveFile && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFile(file);
                        }}
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
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Stack>

          {/* Template Classification Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Template Classification
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'white',
              }}
            >
              <Box sx={{ flexShrink: 0 }}>
                <InsertDriveFile sx={{ color: '#388e3c' }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                  Template Classification
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  XLSX • 4.49 KB
                </Typography>
              </Box>

              <IconButton
                size="small"
                sx={{ 
                  color: '#666',
                  '&:hover': { backgroundColor: alpha(theme.palette.success.main, 0.1) }
                }}
              >
                <Download fontSize="small" />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ModernFileUploadZone;