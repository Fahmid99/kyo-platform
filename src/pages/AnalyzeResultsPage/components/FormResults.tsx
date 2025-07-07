import React from "react";
import { useAnalysisResults } from "../AnalyzeResultsPage";
import FormResultsCard from "./FormResultsCard";
import { Box, Typography } from "@mui/material";

interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
  pageNumber: number;
  color: string;
  keyBoundingRegions?: any[];
  valueBoundingRegions?: any[];
}

const FormResults: React.FC = () => {
  const { analysisData } = useAnalysisResults();

  console.log("🔍 FormResults DEBUG:");
  console.log("analysisData:", analysisData);
  console.log("keyValuePairs:", analysisData?.keyValuePairs);
  console.log("keyValuePairs length:", analysisData?.keyValuePairs?.length);

  const keyValuePairs: KeyValuePair[] = analysisData?.keyValuePairs || [];

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
          Debug: analysisData exists: {!!analysisData ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Debug: keyValuePairs array length: {analysisData?.keyValuePairs?.length || 0}
        </Typography>
      </Box>
    );
  }

  console.log("✅ Rendering", keyValuePairs.length, "key-value pairs");

  return (
    <Box sx={{ height: "100%", overflow: "auto", p: 1 }}>
      {keyValuePairs.map((data, index) => {
        console.log(`Rendering card ${index}:`, data);
        return <FormResultsCard key={`${data.key}-${index}`} data={data} />;
      })}
    </Box>
  );
};

export default FormResults;