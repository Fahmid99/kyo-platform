import React from "react";
import { Alert, Typography } from "@mui/material";
import { AnalysisState } from "../../types/analysis";

interface AnalysisStatusProps {
  analysisState: AnalysisState;
}

const AnalysisStatus: React.FC<AnalysisStatusProps> = ({ analysisState }) => {
  const { error, base64, documentData, isProcessing, analysisResults } = analysisState;

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {base64 && documentData && !error && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            ✅ Document "{documentData.name}" is loaded and ready for analysis
          </Typography>
        </Alert>
      )}

      {isProcessing && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            🔄 Processing document...
          </Typography>
        </Alert>
      )}

      {analysisResults && !isProcessing && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            ✅ Analysis completed successfully
          </Typography>
        </Alert>
      )}
    </>
  );
};

export default AnalysisStatus;