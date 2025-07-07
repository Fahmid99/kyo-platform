import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Close, Analytics } from "@mui/icons-material";
import { useAnalysis } from "../../hooks/useAnalysis";
import { AnalysisModalProps, Connector, Model, AnalysisFormData } from "./types";

// Mock data - replace with actual data from your API
const mockConnectors: Connector[] = [
  { id: "1", name: "Azure Blob Storage", location: "eastus", type: "sharepoint" },
  { id: "2", name: "Local Storage", location: "local", type: "local" },
  { id: "3", name: "KCIM Connector", location: "global", type: "kcim" },
];

const mockModels: Model[] = [
  { id: "1", name: "GPT-4", provider: "OpenAI", capabilities: ["text", "analysis"] },
  { id: "2", name: "Claude-3", provider: "Anthropic", capabilities: ["text", "analysis", "reasoning"] },
  { id: "3", name: "Gemini Pro", provider: "Google", capabilities: ["text", "multimodal"] },
];

const steps = ["Select Connector", "Choose Model", "Analyze Document"];

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  open,
  onClose,
  file,
  onAnalysisComplete,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AnalysisFormData>({
    connector: null,
    model: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const { state, actions } = useAnalysis();

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
    setFormData({ connector: null, model: null });
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    onClose();
  };

  const handleSubmitAnalysis = async () => {
    if (!formData.connector || !formData.model || !file) return;

    setIsAnalyzing(true);
    actions.setProcessing(true);

    // Update analysis context with connector and model
    actions.setConnector(
      formData.connector.name,
      formData.connector.location,
      formData.connector.id
    );
    actions.setModel(formData.model.id);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Mock successful analysis
      actions.setResults({
        analysisId: `analysis-${Date.now()}`,
        status: "completed",
        extractedData: {
          text: "Sample extracted text...",
          metadata: {
            pages: 5,
            words: 1200,
            confidence: 0.95,
          },
        },
        timestamp: new Date().toISOString(),
      });

      setAnalysisComplete(true);
      actions.setProcessing(false);
      
      // Show completion alert
      setTimeout(() => {
        alert("Analysis Complete! 🎉");
        onAnalysisComplete?.();
        handleClose();
      }, 1000);

    } catch (error) {
      actions.setError("Analysis failed. Please try again." + error);
      actions.setProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.connector !== null;
      case 1:
        return formData.model !== null;
      case 2:
        return analysisComplete;
      default:
        return false;
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return formData.connector !== null;
      case 1:
        return formData.model !== null;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ minHeight: 200 }}>
            <Typography variant="h6" gutterBottom>
              Select a Connector
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose where to process your document
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Connector</InputLabel>
              <Select
                value={formData.connector?.id || ""}
                onChange={(e) => {
                  const connector = mockConnectors.find(c => c.id === e.target.value);
                  setFormData(prev => ({ ...prev, connector: connector || null }));
                }}
                label="Connector"
              >
                {mockConnectors.map((connector) => (
                  <MenuItem key={connector.id} value={connector.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>{connector.name}</Typography>
                      <Chip 
                        label={connector.type.toUpperCase()} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.connector && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: "success.50" }}>
                <Typography variant="body2">
                  <strong>Selected:</strong> {formData.connector.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {formData.connector.location}
                </Typography>
              </Paper>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ minHeight: 200 }}>
            <Typography variant="h6" gutterBottom>
              Choose Analysis Model
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the AI model for document analysis
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                value={formData.model?.id || ""}
                onChange={(e) => {
                  const model = mockModels.find(m => m.id === e.target.value);
                  setFormData(prev => ({ ...prev, model: model || null }));
                }}
                label="Model"
              >
                {mockModels.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>{model.name}</Typography>
                      <Chip 
                        label={model.provider} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.model && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: "success.50" }}>
                <Typography variant="body2">
                  <strong>Selected:</strong> {formData.model.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provider: {formData.model.provider}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {formData.model.capabilities.map((capability) => (
                    <Chip
                      key={capability}
                      label={capability}
                      size="small"
                      sx={{ mr: 0.5, mt: 0.5 }}
                    />
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ minHeight: 200, textAlign: "center" }}>
            {!isAnalyzing && !analysisComplete && (
              <>
                <Analytics sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Ready to Analyze
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Document: {file?.name}
                </Typography>
                <Paper sx={{ p: 2, mt: 2, textAlign: "left" }}>
                  <Typography variant="body2">
                    <strong>Connector:</strong> {formData.connector?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Model:</strong> {formData.model?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>File:</strong> {file?.name} ({file ? (file.size / 1024).toFixed(1) : 0} KB)
                  </Typography>
                </Paper>
              </>
            )}

            {isAnalyzing && (
              <>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Analyzing Document...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a few moments
                </Typography>
              </>
            )}

            {analysisComplete && (
              <>
                <Analytics sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                <Typography variant="h6" color="success.main" gutterBottom>
                  Analysis Complete!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your document has been processed successfully
                </Typography>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (!file) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Analyze Document</Typography>
        <IconButton onClick={handleClose} disabled={isAnalyzing}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={isStepComplete(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {state.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleBack} 
          disabled={activeStep === 0 || isAnalyzing}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!canProceed() || isAnalyzing}
        >
          {activeStep === steps.length - 1 ? 
            (isAnalyzing ? "Analyzing..." : "Start Analysis") : 
            "Next"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;