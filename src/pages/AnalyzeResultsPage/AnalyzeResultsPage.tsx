import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
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
  isIndexingMode: boolean;
  setIsIndexingMode: (mode: boolean) => void;
}>({
  analysisData: null,
  base64String: null,
  isIndexingMode: false,
  setIsIndexingMode: () => {},
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

// Global state management for indexing mode
export const useIndexingMode = () => {
  const { isIndexingMode, setIsIndexingMode } = useAnalysisResults();
  return { isIndexingMode, setIsIndexingMode };
};

const AnalyzeResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: analysisState } = useAnalysis();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [isIndexingMode, setIsIndexingMode] = useState(false);

  // Debug: Log all state changes
  useEffect(() => {
    console.log("🔍 AnalyzeResultsPage: Component mounted/updated", {
      locationState: location.state,
      analysisState: {
        hasBase64: !!analysisState.base64,
        base64Length: analysisState.base64?.length || 0,
        hasResults: !!analysisState.analysisResults,
        hasDocumentData: !!analysisState.documentData,
        documentName: analysisState.documentData?.name || "null",
        model: analysisState.model || "null",
      },
      currentBase64String: !!base64String,
      currentAnalysisData: !!analysisData,
      isIndexingMode,
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

    let dataToUse: AnalysisData | null = null;
    let base64ToUse: string | null = null;
    let fileNameToUse = "";
    let modelToUse = "";

    // Priority: navigation state, then analysis context
    if (navState?.analysisData) {
      console.log("📄 Using data from navigation state");
      dataToUse = navState.analysisData;
      fileNameToUse = navState.fileName || "";
      modelToUse = navState.model || "";
      base64ToUse = analysisState.base64;
    } else if (analysisState.analysisResults) {
      console.log("📄 Using data from analysis context");
      dataToUse = analysisState.analysisResults;
      base64ToUse = analysisState.base64;
      fileNameToUse = analysisState.documentData?.name || "";
      modelToUse = analysisState.model || "";
    }

    console.log("📊 Final data summary:", {
      hasAnalysisData: !!dataToUse,
      hasBase64: !!base64ToUse,
      fileName: fileNameToUse,
      model: modelToUse,
      keyValuePairsCount: dataToUse?.keyValuePairs?.length || 0,
      paragraphsCount: dataToUse?.paragraphs?.length || 0,
    });

    setAnalysisData(dataToUse);
    setBase64String(base64ToUse);
    setFileName(fileNameToUse);
    setModel(modelToUse);
    setLoading(false);
  }, [location.state, analysisState]);

  const handleDownloadResults = () => {
    if (!analysisData) {
      console.error("No analysis data available to download.");
      return;
    }

    const dataToDownload = {
      fileName,
      model: formatModelName(model),
      analysisTimestamp: new Date().toISOString(),
      ...analysisData,
    };

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}_analysis_results.json`;
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

  if (!analysisData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            No Analysis Data Available
          </Typography>
          <Typography variant="body2">
            The analysis results could not be loaded. This might be due to:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 2 }}>
            <li>Navigation state was cleared</li>
            <li>Context was reset during page transition</li>
            <li>The analysis process was interrupted</li>
          </Box>
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/analyze")}
        >
          Go Back to Analysis
        </Button>
      </Box>
    );
  }

  return (
    <AnalysisResultsContext.Provider 
      value={{ 
        analysisData, 
        base64String, 
        isIndexingMode, 
        setIsIndexingMode 
      }}
    >
      <Box sx={{ p: 3, maxWidth: "1400px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Analysis Results
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
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

          {/* Document Info */}
          {fileName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Document: <strong>{fileName}</strong> • Model: <strong>{formatModelName(model)}</strong>
            </Typography>
          )}
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
              label="PDF Viewer & Interactive Form"
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
              // PDF Viewer and Form Results with Indexing
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
              // Detailed Results View (existing implementation)
              <Box>
                <Typography variant="h6" gutterBottom>
                  Detailed Analysis Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This section shows the raw analysis data in a detailed format.
                  You can expand each item to see more information.
                </Typography>
                {/* Add detailed results view here */}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </AnalysisResultsContext.Provider>
  );
};

export default AnalyzeResultsPage;