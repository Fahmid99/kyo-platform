// src/pages/AnalysisResultsPage/AnalysisResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
} from '@mui/material';
import {
  ExpandMore,
  Download,
  ArrowBack,
  Visibility,
  TableChart,
  PictureAsPdf,
} from '@mui/icons-material';
import { useAnalysis } from '../../hooks/useAnalysis';
import PdfViewer from './components/PdfViewer';
import FormResults from './components/FormResults';

interface AnalysisResultsPageProps {}

interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
  pageNumber: number;
  color: string;
  keyBoundingRegions?: any[];
  valueBoundingRegions?: any[];
}

interface AnalysisData {
  title: string;
  keyValuePairs: KeyValuePair[];
  documents: any[];
  pages: any[];
  paragraphs: any[];
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
    throw new Error('useAnalysisResults must be used within AnalysisResultsContext');
  }
  return context;
};

const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: analysisState } = useAnalysis();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Get data from navigation state or context
    const navState = location.state as {
      analysisData?: AnalysisData;
      fileName?: string;
      model?: string;
    };

    if (navState?.analysisData) {
      setAnalysisData(navState.analysisData);
      setFileName(navState.fileName || 'Unknown Document');
      setModel(navState.model || 'Unknown Model');
      // Get base64 from context
      setBase64String(analysisState.base64);
      setLoading(false);
    } else if (analysisState.analysisResults) {
      setAnalysisData(analysisState.analysisResults as AnalysisData);
      setFileName(analysisState.documentData?.name || 'Unknown Document');
      setModel(analysisState.model || 'Unknown Model');
      setBase64String(analysisState.base64);
      setLoading(false);
    } else {
      // No data found, redirect back to analyze page
      navigate('/analyze');
    }
  }, [location.state, analysisState, navigate]);

  const handleDownloadResults = () => {
    if (!analysisData) return;
    
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}_analysis_results.json`;
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
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document_analysis_results.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatModelName = (modelValue: string) => {
    const modelMap: { [key: string]: string } = {
      'prebuilt-invoice': 'Invoice Analysis',
      'prebuilt-receipt': 'Receipt Analysis',
      'prebuilt-businessCard': 'Business Card Analysis',
      'prebuilt-idDocument': 'ID Document Analysis',
      'prebuilt-layout': 'Layout Analysis',
      'prebuilt-document': 'General Document Analysis',
    };
    return modelMap[modelValue] || modelValue;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }
  console.log(analysisData)

  console.log(analysisData)
  return (
    <AnalysisResultsContext.Provider value={{ analysisData, base64String }}>
      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            color="inherit" 
            href="/analyze" 
            onClick={(e) => { e.preventDefault(); navigate('/analyze'); }}
            sx={{ cursor: 'pointer' }}
          >
            Document Analysis
          </Link>
          <Typography color="text.primary">Results</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Analysis Results
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {fileName}
            </Typography>
            <Chip 
              label={formatModelName(model)} 
              color="primary" 
              variant="outlined" 
              sx={{ mb: 2 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/analyze')}
            >
              Back to Analyze
            </Button>
            <Button
              variant="outlined"
              startIcon={<TableChart />}
              onClick={generateCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownloadResults}
            >
              Download Results
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData.keyValuePairs?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Key-Value Pairs Extracted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData.pages?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pages Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData.paragraphs?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paragraphs Detected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {analysisData.documents?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Structured Documents
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analysis results tabs">
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
              <Box sx={{ display: 'flex', gap: 2, height: '80vh' }}>
                <Box sx={{ flex: 1 }}>
                  <PdfViewer />
                </Box>
                <Box sx={{ 
                  width: '500px', 
                  border: "1px solid #e1e1e1",
                  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Box sx={{
                    border: "1px solid #e1e1e1",
                    mb: 1,
                    p: 2,
                    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: 'background.paper'
                  }}>
                    <Typography variant="h6" gutterBottom>
                      Extracted Data
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={generateCSV}>
                        Export CSV
                      </Button>
                      <Button size="small" variant="outlined" onClick={handleDownloadResults}>
                        Export JSON
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <FormResults />
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              // Detailed Results View
              <Box>
                {/* Document Title */}
                {analysisData.title && analysisData.title !== "Title not found" && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Document Title
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {analysisData.title}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Detailed analysis results */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">
                      Analysis Summary
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Analysis Model:
                        </Typography>
                        <Typography variant="body1">{formatModelName(model)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          File Name:
                        </Typography>
                        <Typography variant="body1">{fileName}</Typography>
                      </Grid>
                      {analysisData.pageWidth && analysisData.pageHeight && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Page Dimensions:
                          </Typography>
                          <Typography variant="body1">
                            {analysisData.pageWidth} × {analysisData.pageHeight}
                          </Typography>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Analysis Date:
                        </Typography>
                        <Typography variant="body1">
                          {new Date().toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </AnalysisResultsContext.Provider>
  );
};

export default AnalysisResultsPage;