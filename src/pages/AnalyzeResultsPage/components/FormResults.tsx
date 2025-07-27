import React, { useState, useCallback } from "react";
import { useAnalysisResults, useIndexingMode } from "../AnalyzeResultsPage";
import FormResultsCard from "./FormResultsCard";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
  Divider,
  Alert,
  Button,
  Collapse,
} from "@mui/material";
import {
  TouchApp
} from "@mui/icons-material";

interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
  pageNumber: number;
  color: string;
  keyBoundingRegions?: unknown[];
  valueBoundingRegions?: unknown[];
}

interface Paragraph {
  content: string;
  boundingRegions: Array<{
    pageNumber: number;
    polygon: Array<{ x: number; y: number }>;
  }>;
  spans: Array<{
    offset: number;
    length: number;
  }>;
}

const FormResults: React.FC = () => {
  const { analysisData } = useAnalysisResults();
  const { isIndexingMode, setIsIndexingMode } = useIndexingMode();
  const [selectedCard, setSelectedCard] = useState<KeyValuePair | null>(null);
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(() => 
    analysisData?.keyValuePairs || []
  );
  const [showInstructions, setShowInstructions] = useState(true);

  console.log("🔍 FormResults DEBUG:");
  console.log("analysisData:", analysisData);
  console.log("keyValuePairs:", keyValuePairs);
  console.log("paragraphs:", analysisData?.paragraphs);

  // Fix the TypeScript error here:
  const paragraphs: Paragraph[] = Array.isArray(analysisData?.paragraphs) 
    ? analysisData.paragraphs as Paragraph[] 
    : [];

  const handleIndexingToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setIsIndexingMode(enabled);
    if (!enabled) {
      setSelectedCard(null);
    }
    console.log("🔄 Indexing mode toggled:", enabled);
  }, [setIsIndexingMode]);

  const handleCardSelect = useCallback((data: KeyValuePair) => {
    if (!isIndexingMode) return;
    
    setSelectedCard(selectedCard?.key === data.key ? null : data);
    console.log("📋 Selected card for indexing:", data.key);
  }, [isIndexingMode, selectedCard]);

  const handleValueUpdate = useCallback((key: string, newValue: string) => {
    setKeyValuePairs(prev => 
      prev.map(pair => 
        pair.key === key 
          ? { ...pair, value: newValue }
          : pair
      )
    );
    console.log("✏️ Updated value for key:", key, "New value:", newValue);
  }, []);

  // This function would be called when a paragraph is clicked on the PDF
  const handleParagraphSelect = useCallback((paragraphContent: string) => {
    if (!selectedCard || !isIndexingMode) return;

    handleValueUpdate(selectedCard.key, paragraphContent);
    console.log("📄 Updated card value from paragraph:", paragraphContent);
    
    // Optionally deselect the card after update
    // setSelectedCard(null);
  }, [selectedCard, isIndexingMode, handleValueUpdate]);

  // Expose paragraph selection handler to global scope
  React.useEffect(() => {
    const handleParagraphClick = (paragraphContent: string) => {
      console.log("🔗 Global paragraph click handler called:", paragraphContent.substring(0, 50));
      handleParagraphSelect(paragraphContent);
    };

    if (typeof window !== 'undefined') {
      (window as any).handleParagraphSelect = handleParagraphClick;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).handleParagraphSelect;
      }
    };
  }, [handleParagraphSelect]);

  if (keyValuePairs.length === 0) {
    return (
      <Box sx={{ 
        height: "100%", 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3
      }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          No key-value pairs extracted from this document.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Debug: analysisData exists: {analysisData ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Debug: keyValuePairs array length: {analysisData?.keyValuePairs?.length || 0}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header with Controls */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.default'
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Extracted Data
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip 
              label={`${keyValuePairs.length} fields`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={`${paragraphs.length} paragraphs`} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </Box>

        {/* Indexing Mode Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isIndexingMode}
                onChange={handleIndexingToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TouchApp fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Enable Click Indexing
                </Typography>
              </Box>
            }
          />
          
          {isIndexingMode && selectedCard && (
            <Chip
              label={`Selected: ${selectedCard.key}`}
              color="primary"
              size="small"
              deleteIcon={<span>✓</span>}
              variant="filled"
            />
          )}
        </Box>

        {/* Instructions */}
        <Collapse in={isIndexingMode && showInstructions}>
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            action={
              <Button
                size="small"
                onClick={() => setShowInstructions(false)}
              >
                Got it
              </Button>
            }
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Indexing Mode Active
              </Typography>
              <Typography variant="caption" color="text.secondary">
                1. Click a card below to select it for editing<br/>
                2. Click any paragraph on the PDF to replace that card's value<br/>
                3. The highlights will switch to show paragraphs instead of key-value pairs
              </Typography>
            </Box>
          </Alert>
        </Collapse>

        <Divider sx={{ mt: 2 }} />
      </Paper>

      {/* Cards List */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {keyValuePairs.map((data, index) => {
          const isSelected = selectedCard?.key === data.key;
          
          return (
            <FormResultsCard
              key={`${data.key}-${index}`}
              data={data}
              isSelected={isSelected}
              isIndexingMode={isIndexingMode}
              onSelect={handleCardSelect}
              onValueUpdate={handleValueUpdate}
            />
          );
        })}

    
      </Box>
    </Box>
  );
};

export default FormResults;