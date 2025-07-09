import React, { useState } from "react";
import { Box } from "@mui/material";
import { useAnalysis } from "../../hooks/useAnalysis";
import FileUploadZone from "./FileUploadZone";
import FileList from "./FileList";
import AnalysisStatus from "./AnalysisStatus";
import { DocumentFile, FileUploadProps } from "./types";
// import documentService from "../../services/documentService";

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onAnalyzeFile }) => {
  const [uploadedFiles, setUploadedFiles] = useState<DocumentFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Get analysis context
  const { state, actions } = useAnalysis();

  const handleFilesUploaded = (newFiles: DocumentFile[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleAnalyzeFile = async (file: DocumentFile) => {
    setSelectedFileId(file.id);
    
    // Set the file in the analysis context for reference
    if (file.base64) {
      actions.setBase64(file.base64);
      actions.setDocumentData({
        name: file.name,
        type: file.type,
        size: file.size,
        id: file.id,
      });
      
      // Clear any previous errors
      actions.setError?.(null);
    }

    // Only trigger the analysis modal - DO NOT run automatic analysis
    onAnalyzeFile?.(file);
  };

  const handleRemoveFile = (fileToRemove: DocumentFile) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileToRemove.id));
    
    if (selectedFileId === fileToRemove.id) {
      setSelectedFileId(null);
      actions.setBase64("");
      actions.setDocumentData(null);
    }
  };

  const handleViewFile = (file: DocumentFile) => {
    // This will trigger the document view modal
    onFileSelect?.(file);
  };

  // Determine which file is currently loaded in the analysis context
  const loadedFileId = state.documentData?.id || null;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <FileUploadZone onFilesUploaded={handleFilesUploaded} />
      
      <AnalysisStatus analysisState={state} />
      
      <FileList
        files={uploadedFiles}
        selectedFileId={selectedFileId}
        loadedFileId={loadedFileId}
        onViewFile={handleViewFile}
        onAnalyzeFile={handleAnalyzeFile}
        onRemoveFile={handleRemoveFile}
      />
    </Box>
  );
};

export default FileUpload;