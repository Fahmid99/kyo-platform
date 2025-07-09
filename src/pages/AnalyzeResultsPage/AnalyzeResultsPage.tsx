// Debug version of AnalyzeResultsPage.tsx with comprehensive logging
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  ExpandMore,
  Download,
  ArrowBack,
  Visibility,
  PictureAsPdf,
} from "@mui/icons-material";
import { useAnalysis } from "../../hooks/useAnalysis";
import PdfViewer from "./components/PdfViewer";
import FormResults from "./components/FormResults";

interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
  pageNumber: number;
  color: string;
  keyBoundingRegions?: unknown[];
  valueBoundingRegions?: unknown[];
}

interface AnalysisData {
  title: string;
  keyValuePairs: KeyValuePair[];
  documents: unknown[];
  pages: unknown[];
  paragraphs: unknown[];
  pageWidth: number;
  pageHeight: number;
}

// Create a context provider for the PDF viewer components
const AnalysisResultsContext = React.createContext<{
  analysisData: AnalysisData | null;
  base64String: string | null;
}>({
  analysisData: null,
  base64String: null,
});

export const useAnalysisResults = () => {
  const context = React.useContext(AnalysisResultsContext);
  if (!context) {
    throw new Error(
      "useAnalysisResults must be used within AnalysisResultsContext"
    );
  }
  return context;
};

const AnalysisResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: analysisState } = useAnalysis();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);

  // Debug: Log all state changes
  useEffect(() => {
    console.log("🔍 AnalyzeResultsPage: Component mounted/updated", {
      locationState: location.state,
      analysisState: {
        hasBase64: !!analysisState.base64,
        base64Length: analysisState.base64?.length || 0,
        base64Preview: analysisState.base64?.substring(0, 50) || "null",
        hasResults: !!analysisState.analysisResults,
        hasDocumentData: !!analysisState.documentData,
        documentName: analysisState.documentData?.name || "null",
        model: analysisState.model || "null",
      },
      currentBase64String: base64String,
      currentAnalysisData: !!analysisData,
    });
  });

  useEffect(() => {
    console.log("🚀 AnalyzeResultsPage: Main useEffect triggered");

    // Get data from navigation state or context
    const navState = location.state as {
      analysisData?: AnalysisData;
      fileName?: string;
      model?: string;
    };

    console.log("📄 Navigation state:", navState);
    console.log("📄 Analysis context state:", {
      base64: analysisState.base64
        ? `${analysisState.base64.length} chars`
        : "null",
      hasResults: !!analysisState.analysisResults,
      hasDocumentData: !!analysisState.documentData,
    });

    if (navState?.analysisData) {
      console.log("✅ Using navigation state data");
      setAnalysisData(navState.analysisData);
      setFileName(navState.fileName || "Unknown Document");
      setModel(navState.model || "Unknown Model");

      // Get base64 from context
      const contextBase64 = analysisState.base64;
      console.log("📄 Base64 from context:", {
        hasBase64: !!contextBase64,
        length: contextBase64?.length || 0,
        preview: contextBase64?.substring(0, 50) || "null",
      });

      setBase64String(contextBase64);
      setLoading(false);
    } else if (analysisState.analysisResults) {
      console.log("✅ Using analysis state data");
      setAnalysisData(analysisState.analysisResults as AnalysisData);
      setFileName(analysisState.documentData?.name || "Unknown Document");
      setModel(analysisState.model || "Unknown Model");

      const contextBase64 = analysisState.base64;
      console.log("📄 Base64 from analysis state:", {
        hasBase64: !!contextBase64,
        length: contextBase64?.length || 0,
        preview: contextBase64?.substring(0, 50) || "null",
      });

      setBase64String(contextBase64);
      setLoading(false);
    } else {
      console.log("❌ No data found, redirecting to analyze page");
      console.log("❌ Debug info:", {
        navStateExists: !!navState,
        navStateHasData: !!navState?.analysisData,
        contextHasResults: !!analysisState.analysisResults,
        contextHasBase64: !!analysisState.base64,
      });

      // Give it a moment to see if data arrives
      setTimeout(() => {
        if (!analysisData && !analysisState.analysisResults) {
          navigate("/analyze");
        }
      }, 1000);
    }
  }, [location.state, analysisState, navigate, analysisData]);

  // Monitor context changes separately
  useEffect(() => {
    console.log("🔄 Analysis context changed:", {
      hasBase64: !!analysisState.base64,
      base64Length: analysisState.base64?.length || 0,
      hasResults: !!analysisState.analysisResults,
      hasDocumentData: !!analysisState.documentData,
      isProcessing: analysisState.isProcessing,
      error: analysisState.error,
    });

    // If base64 becomes available later, update it
    if (analysisState.base64 && !base64String) {
      console.log(
        "📄 Late base64 update:",
        analysisState.base64.length,
        "characters"
      );
      setBase64String(analysisState.base64);
    }
  }, [analysisState, base64String]);

  const handleDownloadResults = () => {
    if (!analysisData) return;

    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(
      /\.[^/.]+$/,
      ""
    )}_analysis_results.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    if (!analysisData || !analysisData.keyValuePairs) {
      console.error("No document data available to generate CSV.");
      return;
    }

    const keyValuePairs = analysisData.keyValuePairs;

    // CSV Header
    let csvContent = "Key,Value,Confidence,Page Number\n";

    // Convert key-value pairs to CSV format
    keyValuePairs.forEach(({ key, value, confidence, pageNumber }) => {
      csvContent += `"${key}","${value}","${confidence}","${pageNumber}"\n`;
    });

    // Convert to Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document_analysis_results.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatModelName = (modelValue: string) => {
    const modelMap: { [key: string]: string } = {
      "prebuilt-invoice": "Invoice Analysis",
      "prebuilt-receipt": "Receipt Analysis",
      "prebuilt-businessCard": "Business Card Analysis",
      "prebuilt-idDocument": "ID Document Analysis",
      "prebuilt-layout": "Layout Analysis",
      "prebuilt-document": "General Document Analysis",
    };
    return modelMap[modelValue] || modelValue;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading analysis results...</Typography>
      </Box>
    );
  }

  console.log("🎨 Rendering AnalyzeResultsPage with:", {
    hasAnalysisData: !!analysisData,
    hasBase64String: !!base64String,
    base64Length: base64String?.length || 0,
  });

  return (
    <AnalysisResultsContext.Provider value={{ analysisData, base64String }}>
      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="/analyze"
            onClick={(e) => {
              e.preventDefault();
              navigate("/analyze");
            }}
            sx={{ cursor: "pointer" }}
          >
            Document Analysis
          </Link>
          <Typography color="text.primary">Results</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#111827", mb: 1 }}
            >
              Analysis Results
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Document: {fileName} • Model: {formatModelName(model)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={generateCSV}
              disabled={!analysisData}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadResults}
              disabled={!analysisData}
            >
              Download JSON
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/analyze")}
            >
              Back to Analysis
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData?.keyValuePairs?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Key-Value Pairs
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData?.pages?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pages Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData?.paragraphs?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paragraphs Detected
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData?.documents?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Structured Documents
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="analysis results tabs"
          >
            <Tab
              label="PDF Viewer & Form"
              icon={<PictureAsPdf />}
              iconPosition="start"
            />
            <Tab
              label="Detailed Results"
              icon={<Visibility />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              // PDF Viewer and Form Results
              <Box sx={{ display: "flex", gap: 2, height: "80vh" }}>
                <Box sx={{ flex: 1 }}>
                  {base64String ? (
                    <PdfViewer />
                  ) : (
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h6" color="error" gutterBottom>
                          PDF Not Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          The PDF data is not available. This might be due to:
                        </Typography>
                        <Box component="ul" sx={{ textAlign: "left", mt: 1 }}>
                          <li>Navigation state was cleared</li>
                          <li>Context was reset during page transition</li>
                          <li>The original file data was lost</li>
                        </Box>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/analyze")}
                          sx={{ mt: 2 }}
                        >
                          Go Back to Upload New File
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </Box>
                <Box
                  sx={{
                    width: "500px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    overflow: "auto",
                  }}
                >
                  <FormResults />
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              // Detailed Results View
              <Box>
                {analysisData?.keyValuePairs &&
                analysisData.keyValuePairs.length > 0 ? (
                  analysisData.keyValuePairs.map((pair, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", flex: 1 }}
                          >
                            {pair.key}
                          </Typography>
                          <Chip
                            label={`${Math.round(pair.confidence * 100)}%`}
                            color={
                              pair.confidence > 0.8
                                ? "success"
                                : pair.confidence > 0.6
                                ? "warning"
                                : "error"
                            }
                            size="small"
                          />
                          <Chip
                            label={`Page ${pair.pageNumber}`}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1">
                          <strong>Value:</strong> {pair.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          <strong>Confidence:</strong>{" "}
                          {Math.round(pair.confidence * 100)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Page:</strong> {pair.pageNumber}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Alert severity="info">
                    No key-value pairs were extracted from this document.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </AnalysisResultsContext.Provider>
  );
};

export default AnalysisResultsPage;
