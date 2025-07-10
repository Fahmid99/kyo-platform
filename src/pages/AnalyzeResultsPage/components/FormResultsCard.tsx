import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  TextField,
  Fade,
  alpha,
  useTheme,
} from "@mui/material";
import {
  ContentCopy,
  Edit,
  Check,
  Close,
  Visibility,
  VisibilityOff,
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

interface FormResultsCardProps {
  data: KeyValuePair;
  isSelected?: boolean;
  isIndexingMode?: boolean;
  onSelect?: (data: KeyValuePair) => void;
  onValueUpdate?: (key: string, newValue: string) => void;
}

const FormResultsCard: React.FC<FormResultsCardProps> = ({
  data,
  isSelected = false,
  isIndexingMode = false,
  onSelect,
  onValueUpdate,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.value);
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(data.value);
  };

  const handleSave = () => {
    if (onValueUpdate) {
      onValueUpdate(data.key, editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(data.value);
    setIsEditing(false);
  };

  const handleCardClick = () => {
    if (isIndexingMode && onSelect) {
      onSelect(data);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "error";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  const cardStyles = {
    position: "relative",
    mb: 2,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: isIndexingMode ? "pointer" : "default",
    border: isSelected ? `2px solid ${data.color}` : "1px solid",
    borderColor: isSelected 
      ? data.color 
      : theme.palette.mode === 'dark' 
        ? theme.palette.grey[700] 
        : theme.palette.grey[200],
    borderRadius: 2,
    backgroundColor: isSelected 
      ? alpha(data.color, 0.05) 
      : theme.palette.background.paper,
    boxShadow: isSelected 
      ? `0 4px 20px ${alpha(data.color, 0.25)}` 
      : theme.shadows[1],
    "&:hover": {
      boxShadow: isIndexingMode 
        ? `0 8px 25px ${alpha(data.color, 0.35)}` 
        : theme.shadows[3],
      transform: isIndexingMode ? "translateY(-2px)" : "none",
      borderColor: isIndexingMode ? data.color : undefined,
    },
  };

  return (
    <Card sx={cardStyles} onClick={handleCardClick}>
      {/* Selection Indicator */}
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: data.color,
            borderRadius: "8px 8px 0 0",
          }}
        />
      )}

      {/* Indexing Mode Indicator */}
      {isIndexingMode && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          <Chip
            size="small"
            label="Click to select"
            color={isSelected ? "primary" : "default"}
            variant={isSelected ? "filled" : "outlined"}
            sx={{
              fontSize: "0.7rem",
              height: 20,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>
      )}

      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
          {/* Color Indicator */}
          <Box
            sx={{
              width: 4,
              height: 48,
              backgroundColor: data.color,
              borderRadius: 2,
              flexShrink: 0,
              mt: 0.5,
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Key */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {data.key}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
                sx={{ p: 0.25 }}
              >
                {isCollapsed ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
              </IconButton>
            </Typography>

            {/* Metadata Chips */}
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              <Chip
                label={`${Math.round(data.confidence * 100)}% ${getConfidenceLabel(data.confidence)}`}
                color={getConfidenceColor(data.confidence)}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
              <Chip
                label={`Page ${data.pageNumber}`}
                size="small"
                variant="outlined"
                color="default"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Value Section */}
        <Fade in={!isCollapsed}>
          <Box sx={{ display: isCollapsed ? "none" : "block" }}>
            {isEditing ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={6}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.875rem",
                    },
                  }}
                  autoFocus
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    color="default"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    color="primary"
                  >
                    <Check fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  mt: 1,
                  p: 1.5,
                  backgroundColor: alpha(data.color, 0.05),
                  borderRadius: 1,
                  border: `1px solid ${alpha(data.color, 0.2)}`,
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    color: theme.palette.text.primary,
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    pr: 4,
                  }}
                >
                  {data.value || (
                    <em style={{ color: theme.palette.text.disabled }}>
                      No value detected
                    </em>
                  )}
                </Typography>

                {/* Action Buttons */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  <Tooltip title={copied ? "Copied!" : "Copy value"}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                      }}
                      sx={{
                        p: 0.5,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  {!isIndexingMode && (
                    <Tooltip title="Edit value">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit();
                        }}
                        sx={{
                          p: 0.5,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Fade>

        {/* Selection Status for Indexing Mode */}
        {isIndexingMode && isSelected && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              backgroundColor: alpha(data.color, 0.1),
              borderRadius: 1,
              border: `1px solid ${alpha(data.color, 0.3)}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: data.color,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Check fontSize="small" />
              Selected for indexing - Click a paragraph on the PDF to update this value
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FormResultsCard;