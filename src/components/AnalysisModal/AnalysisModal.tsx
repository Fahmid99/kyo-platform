import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Step,
  StepLabel,
  Alert,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Stepper,
} from "@mui/material";
import {
  Close,
  Analytics,

  Receipt,
  Business,
  Assignment,
  DocumentScanner,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../../hooks/useAnalysis";
import documentService from "../../services/documentService";
import { DocumentFile } from "../FileUpload/types";

interface AnalysisModalProps {
  open: boolean;
  onClose: () => void;
  file: DocumentFile | null;
  onAnalysisComplete?: (results: unknown) => void;
}

interface AzureModel {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const azureModels: AzureModel[] = [
  {
    value: "prebuilt-invoice",
    label: "Invoice",
    description: "Extract data from invoices",
    icon: <Receipt />,
  },
  {
    value: "prebuilt-receipt",
    label: "Receipt",
    description: "Extract data from receipts",
    icon: <Receipt />,
  },
  {
    value: "prebuilt-businessCard",
    label: "Business Card",
    description: "Extract contact information from business cards",
    icon: <Business />,
  },
  {
    value: "prebuilt-idDocument",
    label: "ID Document",
    description: "Extract data from identity documents",
    icon: <Assignment />,
  },
  {
    value: "prebuilt-layout",
    label: "Layout Analysis",
    description: "Analyze document layout and structure",
    icon: <Business />,
  },
  {
    value: "prebuilt-document",
    label: "General Document",
    description: "General document analysis",
    icon: <DocumentScanner />,
  },
];

const steps = ["Select Analysis Type", "Review & Analyze"];

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  open,
  onClose,
  file,
  onAnalysisComplete,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { actions } = useAnalysis();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setSelectedModel("");
      setError(null);
      setIsAnalyzing(false);
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitAnalysis();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedModel("");
    setIsAnalyzing(false);
    setError(null);
    onClose();
  };

  const handleSubmitAnalysis = async () => {
    // Validation checks
    if (!file) {
      setError("No file selected for analysis");
      return;
    }

    if (!selectedModel) {
      setError("Please select an analysis model");
      return;
    }

    if (!file.base64) {
      setError("File data is not available. Please re-upload the file.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("🔍 Starting analysis with:", {
        fileName: file.name,
        model: selectedModel,
        hasBase64: !!file.base64,
        base64Length: file.base64?.length || 0,
        base64Preview: file.base64?.substring(0, 50) + "...",
      });

      // Store file info and base64 in context
      actions.setBase64(file.base64);
      actions.setDocumentData({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
      });
      actions.setModel(selectedModel);
      actions.setProcessing(true);

      // Call the analysis API using the base64 data that's already available
      console.log("📤 Calling documentService.analyzeDocument with:", {
        scanType: selectedModel,
        base64Length: file.base64.length,
      });

      const analysisResult = await documentService.analyzeDocument(
        file.base64,
        selectedModel
      );

      console.log("✅ Analysis result:", analysisResult);

      if (analysisResult.success && analysisResult.data) {
        // Store results in context
        actions.setResults(analysisResult.data);
        actions.setProcessing(false);

        // Close modal and navigate to results page
        handleClose();
        navigate("/analyze/results", {
          state: {
            analysisData: analysisResult.data,
            fileName: file.name,
            model: selectedModel,
            base64String: file.base64, // ADD THIS LINE!
          },
        });

        // Call completion callback if provided
        if (onAnalysisComplete) {
          onAnalysisComplete(analysisResult.data);
        }
      } else {
        // Handle API errors
        const errorMessage =
          analysisResult.message?.description ||
          "Analysis failed - no data returned";
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("❌ Analysis error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during analysis";
      setError(errorMessage);
      actions.setProcessing(false);
      actions.setError?.(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ minHeight: 300 }}>
            <Typography variant="h6" gutterBottom>
              Select Azure Document Intelligence Model
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the appropriate prebuilt model for your document type
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              }}
            >
              {azureModels.map((model) => (
                <Card
                  key={model.value}
                  sx={{
                    cursor: "pointer",
                    border: selectedModel === model.value ? 2 : 1,
                    borderColor:
                      selectedModel === model.value
                        ? "primary.main"
                        : "divider",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => setSelectedModel(model.value)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      {model.icon}
                      <Typography variant="h6">{model.label}</Typography>
                      {selectedModel === model.value && (
                        <Chip label="Selected" color="primary" size="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {model.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 1:
        { const selectedModelInfo = azureModels.find(
          (m) => m.value === selectedModel
        );
        return (
          <Box sx={{ minHeight: 200 }}>
            <Typography variant="h6" gutterBottom>
              Review Analysis Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Confirm your settings before starting the analysis
            </Typography>

            <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Analysis Configuration
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    File:
                  </Typography>
                  <Typography variant="body1">
                    {file?.name || "No file selected"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Size:
                  </Typography>
                  <Typography variant="body1">
                    {file
                      ? (file.size / 1024 / 1024).toFixed(2) + " MB"
                      : "Unknown"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    File Type:
                  </Typography>
                  <Typography variant="body1">
                    {file?.type || "Unknown"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Analysis Model:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    {selectedModelInfo?.icon}
                    <Typography variant="body1">
                      {selectedModelInfo?.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {selectedModelInfo?.description}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Data Status:
                  </Typography>
                  <Chip
                    label={file?.base64 ? "File data ready" : "No file data"}
                    color={file?.base64 ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </Box>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        ); }

      default:
        return "Unknown step";
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return selectedModel !== "";
      case 1:
        return selectedModel !== "" && file !== null && !!file.base64;
      default:
        return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 500 },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Analytics color="primary" />
            <Typography variant="h6">Document Analysis</Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={isAnalyzing}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={isAnalyzing}>
          Cancel
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={isAnalyzing}>
              Back
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid(activeStep) || isAnalyzing}
            startIcon={isAnalyzing ? <CircularProgress size={16} /> : undefined}
          >
            {isAnalyzing
              ? "Analyzing..."
              : activeStep === steps.length - 1
              ? "Analyze Document"
              : "Next"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;
