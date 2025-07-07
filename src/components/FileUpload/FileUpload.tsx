import React, { useState } from "react";
import { Box } from "@mui/material";
import { useAnalysis } from "../../hooks/useAnalysis";
import FileUploadZone from "./FileUploadZone";
import FileList from "./FileList";
import AnalysisStatus from "./AnalysisStatus";
import { DocumentFile, FileUploadProps } from "./types";
import documentService from "../../services/documentService"; // Add this import

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onAnalyzeFile }) => {
  const [uploadedFiles, setUploadedFiles] = useState<DocumentFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Get analysis context
  const { state, actions } = useAnalysis();

  const handleFilesUploaded = (newFiles: DocumentFile[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleAnalyzeFile = async (file: DocumentFile) => { // Make this async
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
      actions.setError(null);
    }
// 🚀 NEW: Call the document analysis service
    try {
      console.log("🔍 Starting document analysis for:", file.name);
      console.log("📋 File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        base64Length: file.base64?.length || 0
      });
      
      // Validate that base64 exists before proceeding
      if (!file.base64) {
        throw new Error("No base64 data available for this file");
      }
      
      // Set loading state (if your analysis context has this)
      actions.setLoading?.(true);
      
      // You can make this configurable or get from UI
      const scanType = "prebuilt-document"; // or get this from your UI/props
      
      // Call the document service with base64 directly - now TypeScript knows it's defined
      const analysisResult = await documentService.analyzeDocument(file.base64, scanType);
      
      // 📊 LOG ALL THE DATA (this is what you wanted!)
      console.log("✅ Document Analysis Complete!");
      console.log("📄 Full Result:", analysisResult);
      console.log("📊 Key-Value Pairs:", analysisResult.data.keyValuePairs);
      console.log("📋 Structured Documents:", analysisResult.data.documents);
      console.log("📝 Document Title:", analysisResult.data.title);
      console.log("📏 Page Dimensions:", {
        width: analysisResult.data.pageWidth,
        height: analysisResult.data.pageHeight
      });
      
      // Store the analysis result in your context if needed
      actions.setAnalysisResult?.(analysisResult.data);
      
      console.log("🎉 Analysis data logged to console!");
      
    } catch (error) {
      console.error("❌ Document analysis failed:", error);
      actions.setError?.(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      actions.setLoading?.(false);
    }
    
    // Still trigger the analysis modal if needed
    onAnalyzeFile?.(file);
  };

  // Helper function to convert base64 back to File - IMPROVED VERSION
  // const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
  //   try {
  //     // Remove data URL prefix if present (data:image/jpeg;base64,)
  //     const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      
  //     // Convert base64 to binary
  //     const binaryString = atob(base64Data);
  //     const bytes = new Uint8Array(binaryString.length);
      
  //     for (let i = 0; i < binaryString.length; i++) {
  //       bytes[i] = binaryString.charCodeAt(i);
  //     }
      
  //     // Create blob and file
  //     const blob = new Blob([bytes], { type: mimeType });
  //     return new File([blob], fileName, { type: mimeType });
      
  //   } catch (error) {
  //     console.error("Error converting base64 to file:", error);
  //     throw new Error("Failed to convert file data");
  //   }
  // };

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