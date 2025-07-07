import { Box, Card, CardContent, TextField, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useState } from "react";

interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
  pageNumber: number;
  color: string;
  keyBoundingRegions?: any[];
  valueBoundingRegions?: any[];
}

interface FormResultsCardProps {
  data: KeyValuePair;
}

const FormResultsCard: React.FC<FormResultsCardProps> = ({ data }) => {
  const [value, setValue] = useState(data.value || '');
  const [copied, setCopied] = useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <Card
      sx={{
        borderRadius: "4px",
        minWidth: "100%",
        display: "flex",
        border: `1px solid #e1e1e1`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        mb: 1,
      }}
    >
      <Box 
        sx={{ 
          background: data.color || '#2979ff', 
          width: "6px",
          minHeight: "100%"
        }}
      />
      <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 } }}>
        <Box>
          {/* Key */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              mb: 1, 
              color: 'text.primary',
              fontSize: '0.875rem'
            }}
          >
            {data.key}
          </Typography>
          
          {/* Value Input */}
          <Box sx={{ position: 'relative', mb: 1 }}>
            <TextField
              value={value}
              onChange={handleValueChange}
              variant="outlined"
              size="small"
              fullWidth
              multiline
              minRows={1}
              maxRows={3}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  pr: 5, // Make room for copy button
                }
              }}
            />
            <Tooltip title={copied ? "Copied!" : "Copy value"}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  p: 0.5,
                }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Metadata */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={`${Math.round(data.confidence * 100)}% (${getConfidenceLabel(data.confidence)})`}
              color={getConfidenceColor(data.confidence)}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Page ${data.pageNumber}`}
              size="small"
              variant="outlined"
              color="default"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormResultsCard;