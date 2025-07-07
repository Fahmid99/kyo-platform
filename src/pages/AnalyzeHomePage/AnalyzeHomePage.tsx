import React, { useState } from "react";
import { Box } from "@mui/material";
import FileUpload from "../../components/FileUpload";
import DocumentModal from "../../components/DocumentModal";
import AnalysisModal from "../../components/AnalysisModal";
import { DocumentFile } from "../../components/FileUpload/types";

const AnalyzeHomePage = () => {
  // Document view modal state
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  
  // Analysis modal state
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [fileToAnalyze, setFileToAnalyze] = useState<DocumentFile | null>(null);

  const handleFileSelect = (file: DocumentFile) => {
    setSelectedFile(file);
    setDocumentModalOpen(true);
  };

  const handleCloseDocumentModal = () => {
    setDocumentModalOpen(false);
    setSelectedFile(null);
  };

  const handleAnalyzeFile = (file: DocumentFile) => {
    setFileToAnalyze(file);
    setAnalysisModalOpen(true);
  };

  const handleCloseAnalysisModal = () => {
    setAnalysisModalOpen(false);
    setFileToAnalyze(null);
  };

  const handleAnalysisComplete = () => {
    console.log("Analysis completed successfully!");
    // You can add additional logic here, like refreshing data or navigating
  };

  return (
    <Box sx={{ p: 3 }}>
      <FileUpload 
        onFileSelect={handleFileSelect}
        onAnalyzeFile={handleAnalyzeFile}
      />
      
      {/* Document View Modal */}
      <DocumentModal
        open={documentModalOpen}
        onClose={handleCloseDocumentModal}
        file={selectedFile} 
      />

      {/* Analysis Configuration Modal */}
      <AnalysisModal
        open={analysisModalOpen}
        onClose={handleCloseAnalysisModal}
        file={fileToAnalyze}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </Box>
  );
};

export default AnalyzeHomePage;