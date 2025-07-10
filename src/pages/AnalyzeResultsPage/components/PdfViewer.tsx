import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import PdfPage from "./PdfPage";
import { Box, Card } from "@mui/material";
import PdfControls from "./PdfControls";
import { useAnalysisResults, useIndexingMode } from "../AnalyzeResultsPage";

// Set up the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  // Remove isIndexingMode prop since we'll get it from context
}

const PdfViewer: React.FC<PdfViewerProps> = () => {
  const [scale, setScale] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  
  const { base64String } = useAnalysisResults();
  const { isIndexingMode } = useIndexingMode();

  // Listen for indexing mode changes
  useEffect(() => {
    console.log("📋 PdfViewer: Indexing mode changed to:", isIndexingMode);
  }, [isIndexingMode]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    console.log("📄 PdfViewer: Document loaded with", numPages, "pages");
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min zoom 0.5x
  };

  const handlePageNumber = (action: string): void => {
    if (action === "back") {
      setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    } else if (action === "forward") {
      setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    }
  };

  if (!base64String) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        backgroundColor: '#f5f5f5',
        borderRadius: 1
      }}>
        No PDF data available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "#525659",
        position: "relative",
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      <PdfControls
        pageNumber={pageNumber}
        handlePageNumber={handlePageNumber}
        numPages={numPages}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        scale={scale}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
          padding: "10px",
          flex: 1,
        }}
      >
        <Card
          elevation={3}
          style={{
            overflow: "visible",
            transform: `scale(${scale})`,
            transformOrigin: "center",
            margin: "auto",
          }}
        >
          <PdfPage
            pageNumber={pageNumber}
            scale={scale}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            isIndexingMode={isIndexingMode}
          />
        </Card>
      </Box>
    </Box>
  );
};

export default PdfViewer;