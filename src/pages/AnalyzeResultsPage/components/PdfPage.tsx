import React, { useRef, useEffect, useState, useCallback } from "react";
import { Document, Page } from "react-pdf";
import { useAnalysisResults, useIndexingMode } from "../AnalyzeResultsPage";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";

interface PdfPageProps {
  pageNumber: number;
  scale: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

interface BoundingRegion {
  polygon?: Array<{ x: number; y: number }>;
  pageNumber?: number;
}

interface Paragraph {
  content: string;
  boundingRegions: BoundingRegion[];
  spans: Array<{
    offset: number;
    length: number;
  }>;
}

const PdfPage: React.FC<PdfPageProps> = ({
  pageNumber,
  onDocumentLoadSuccess,
}) => {
  const { base64String, analysisData } = useAnalysisResults();
  const { isIndexingMode } = useIndexingMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [hoveredParagraph, setHoveredParagraph] = useState<Paragraph | null>(null);

  const keyValuePairs = analysisData?.keyValuePairs || [];
  const paragraphs: Paragraph[] = analysisData?.paragraphs || [];
  const pageWidth = analysisData?.pageWidth || 8.5;
  const pageHeight = analysisData?.pageHeight || 11;

  // Debug: Log paragraphs structure
  useEffect(() => {
    console.log("🔍 PdfPage: Paragraphs debug", {
      paragraphsCount: paragraphs.length,
      pageNumber,
      isIndexingMode,
      sampleParagraph: paragraphs[0] ? {
        content: paragraphs[0].content?.substring(0, 50),
        hasContent: !!paragraphs[0].content,
        hasBoundingRegions: !!paragraphs[0].boundingRegions,
        boundingRegionsCount: paragraphs[0].boundingRegions?.length || 0,
        firstRegion: paragraphs[0].boundingRegions?.[0] ? {
          hasPageNumber: 'pageNumber' in paragraphs[0].boundingRegions[0],
          hasPolygon: 'polygon' in paragraphs[0].boundingRegions[0],
          pageNumber: paragraphs[0].boundingRegions[0].pageNumber,
          polygonLength: paragraphs[0].boundingRegions[0].polygon?.length || 0
        } : null
      } : null
    });
  }, [paragraphs, pageNumber, isIndexingMode]);

  // Create PDF data URL when base64String changes
  useEffect(() => {
    console.log("🔍 PdfPage: Creating pdfDataUrl", {
      hasBase64String: !!base64String,
      base64Length: base64String?.length || 0,
      base64Preview: base64String?.substring(0, 50) || 'null'
    });

    if (!base64String) {
      console.log("❌ PdfPage: No base64String available");
      setPdfDataUrl(null);
      return;
    }

    try {
      let cleanBase64 = base64String;
      if (base64String.includes(',')) {
        console.log("🔄 PdfPage: Removing data URL prefix");
        cleanBase64 = base64String.split(',')[1];
      }

      if (!cleanBase64 || cleanBase64.length === 0) {
        console.error("❌ PdfPage: Invalid base64 string after cleaning");
        setPdfDataUrl(null);
        return;
      }

      const dataUrl = `data:application/pdf;base64,${cleanBase64}`;
      console.log("✅ PdfPage: Created PDF data URL");
      setPdfDataUrl(dataUrl);
    } catch (error) {
      console.error("❌ PdfPage: Error creating PDF data URL:", error);
      setPdfDataUrl(null);
    }
  }, [base64String]);

  // Convert inches to pixels (assuming 96 DPI)
  const convertInchesToPixels = useCallback((inches: number, dpi = 96) => inches * dpi, []);

  // Convert polygon points from inches to pixels
  const convertPolygon = useCallback(
    (polygon: Array<{ x: number; y: number }>, dpi: number) =>
      polygon.map((point) => ({
        x: convertInchesToPixels(point.x, dpi),
        y: convertInchesToPixels(point.y, dpi),
      })),
    [convertInchesToPixels]
  );

  // Check if a point is inside a polygon
  const isPointInPolygon = useCallback(
    (point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>) => {
      let isInside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
        if (intersect) isInside = !isInside;
      }
      return isInside;
    },
    []
  );

  // Draw a polygon on the canvas
  const drawPolygon = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      polygon: Array<{ x: number; y: number }>,
      strokeStyle: string,
      fillStyle: string,
      lineWidth = 2
    ) => {
      ctx.beginPath();
      polygon.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = strokeStyle;
      ctx.fillStyle = fillStyle;
      ctx.lineWidth = lineWidth;
      ctx.fill();
      ctx.stroke();
    },
    []
  );

  // Type guard to check if object has polygon property
  const hasBoundingRegion = (obj: unknown): obj is BoundingRegion => {
    return typeof obj === 'object' && obj !== null && 'polygon' in obj;
  };

  // Handle canvas click for field/paragraph selection
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      if (isIndexingMode) {
        // In indexing mode, check for paragraph clicks
        console.log("🔍 Checking paragraph clicks...", { paragraphsCount: paragraphs.length });
        
        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i];
          console.log(`📄 Checking paragraph ${i}:`, {
            content: paragraph.content?.substring(0, 30),
            boundingRegionsCount: paragraph.boundingRegions?.length || 0
          });
          
          for (const region of paragraph.boundingRegions || []) {
            console.log("🔍 Checking region:", {
              hasPageNumber: 'pageNumber' in region,
              pageNumber: region.pageNumber,
              currentPage: pageNumber,
              hasPolygon: 'polygon' in region,
              polygonLength: region.polygon?.length || 0
            });
            
            if (region.pageNumber !== pageNumber) {
              console.log("⏭️ Skipping region - wrong page");
              continue;
            }
            
            if (hasBoundingRegion(region) && region.polygon) {
              const pixelPolygon = convertPolygon(region.polygon, 96);
              console.log("🔍 Converted polygon:", { pixelPolygonLength: pixelPolygon.length });
              
              if (isPointInPolygon(clickPoint, pixelPolygon)) {
                console.log("✅ Clicked paragraph:", paragraph.content?.substring(0, 100));
                
                // Call the global handler if available
                if (typeof window !== 'undefined' && (window as any).handleParagraphSelect) {
                  console.log("📞 Calling global paragraph handler");
                  (window as any).handleParagraphSelect(paragraph.content);
                } else {
                  console.log("❌ Global paragraph handler not found");
                }
                
                return;
              }
            }
          }
        }
        console.log("❌ No paragraph found at click point");
      } else {
        // Normal mode, check for key-value pair clicks
        for (const pair of keyValuePairs) {
          if (pair.pageNumber !== pageNumber) continue;

          const allRegions = [
            ...(pair.keyBoundingRegions || []),
            ...(pair.valueBoundingRegions || [])
          ];

          for (const regionItem of allRegions) {
            if (hasBoundingRegion(regionItem) && regionItem.polygon) {
              const pixelPolygon = convertPolygon(regionItem.polygon, 96);
              if (isPointInPolygon(clickPoint, pixelPolygon)) {
                setSelectedKey(pair.key);
                setDialogContent(pair.value);
                setOpen(true);
                return;
              }
            }
          }
        }
      }
    },
    [keyValuePairs, paragraphs, pageNumber, convertPolygon, isPointInPolygon, hasBoundingRegion, isIndexingMode]
  );

  // Handle canvas mouse move for hover effects
  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isIndexingMode) {
        setHoveredParagraph(null);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mousePoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      // Check if mouse is over a paragraph
      for (const paragraph of paragraphs) {
        for (const region of paragraph.boundingRegions || []) {
          if (region.pageNumber !== pageNumber) continue;
          
          if (hasBoundingRegion(region) && region.polygon) {
            const pixelPolygon = convertPolygon(region.polygon, 96);
            if (isPointInPolygon(mousePoint, pixelPolygon)) {
              setHoveredParagraph(paragraph);
              return;
            }
          }
        }
      }
      
      setHoveredParagraph(null);
    },
    [paragraphs, pageNumber, convertPolygon, isPointInPolygon, hasBoundingRegion, isIndexingMode]
  );

  // Draw bounding regions based on mode
  const drawBoundingRegions = useCallback(() => {
    if (!canvasRef.current) {
      console.log("❌ PdfPage: Cannot draw bounding regions - no canvas");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log(`🎨 PdfPage: Drawing bounding regions for page ${pageNumber} (${isIndexingMode ? 'paragraphs' : 'key-value pairs'} mode)`);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let drawnCount = 0;

    if (isIndexingMode) {
      // Enhanced paragraph highlighting in indexing mode
      console.log(`🎨 Drawing ${paragraphs.length} paragraphs for page ${pageNumber}`);
      
      paragraphs.forEach((paragraph, index) => {
        const regionsForThisPage = paragraph.boundingRegions?.filter(region => region.pageNumber === pageNumber) || [];
        console.log(`📄 Paragraph ${index} has ${regionsForThisPage.length} regions for page ${pageNumber}`);
        
        regionsForThisPage.forEach((region, regionIndex) => {
          console.log(`🔍 Processing region ${regionIndex}:`, {
            hasPolygon: 'polygon' in region && !!region.polygon,
            polygonLength: region.polygon?.length || 0
          });
          
          if (hasBoundingRegion(region) && region.polygon && region.polygon.length > 0) {
            const pixelPolygon = convertPolygon(region.polygon, 96);
            const isHovered = hoveredParagraph === paragraph;
            
            // Enhanced paragraph colors with gradient effects
            const baseColor = "#3B82F6"; // Professional blue for paragraphs
            const fillColor = isHovered 
              ? "rgba(59, 130, 246, 0.35)" 
              : "rgba(59, 130, 246, 0.15)";
            const strokeColor = isHovered 
              ? "#2563EB" 
              : "#3B82F6";
            const lineWidth = isHovered ? 3 : 2;
            
            // Add glow effect for hovered paragraphs
            if (isHovered) {
              ctx.shadowColor = baseColor;
              ctx.shadowBlur = 8;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }
            
            console.log(`✅ Drawing enhanced polygon for paragraph ${index}, region ${regionIndex}`);
            drawPolygon(ctx, pixelPolygon, strokeColor, fillColor, lineWidth);
            drawnCount++;
            
            // Reset shadow
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
          } else {
            console.log(`❌ Skipping invalid region for paragraph ${index}, region ${regionIndex}`);
          }
        });
      });
    } else {
      // Enhanced key-value pair regions with professional color scheme
      keyValuePairs.forEach((pair, index) => {
        if (pair.pageNumber !== pageNumber) return;

        // Use enhanced color scheme from the pair data
        const colorScheme = pair.colorScheme || {
          primary: pair.color || "#2563EB",
          stroke: pair.color || "#2563EB",
          fill: `${pair.color || "#2563EB"}20`,
          strokeWidth: 2
        };

        // Apply confidence-based styling
        const confidence = pair.confidence || 0;
        let strokeWidth = colorScheme.strokeWidth || 2;
        let opacity = 1;
        
        if (confidence >= 0.9) {
          strokeWidth = 2.5;
          opacity = 1.0;
        } else if (confidence >= 0.7) {
          strokeWidth = 2.0;
          opacity = 0.85;
        } else {
          strokeWidth = 1.5;
          opacity = 0.7;
        }

        const fillColor = confidence >= 0.8 
          ? `${colorScheme.primary}25` 
          : `${colorScheme.primary}15`;
        const strokeColor = colorScheme.stroke;

        // Add subtle glow for high confidence items
        if (confidence >= 0.9) {
          ctx.shadowColor = colorScheme.primary;
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Draw key bounding regions
        if (pair.keyBoundingRegions) {
          pair.keyBoundingRegions.forEach((regionItem: unknown) => {
            if (hasBoundingRegion(regionItem) && regionItem.polygon) {
              const pixelPolygon = convertPolygon(regionItem.polygon, 96);
              
              // Save context for opacity
              ctx.save();
              ctx.globalAlpha = opacity;
              
              drawPolygon(ctx, pixelPolygon, strokeColor, fillColor, strokeWidth);
              drawnCount++;
              
              // Restore context
              ctx.restore();
            }
          });
        }

        // Draw value bounding regions
        if (pair.valueBoundingRegions) {
          pair.valueBoundingRegions.forEach((regionItem: unknown) => {
            if (hasBoundingRegion(regionItem) && regionItem.polygon) {
              const pixelPolygon = convertPolygon(regionItem.polygon, 96);
              
              // Save context for opacity
              ctx.save();
              ctx.globalAlpha = opacity;
              
              // Slightly different styling for value regions
              const valueStrokeColor = colorScheme.primary;
              const valueFillColor = confidence >= 0.8 
                ? `${colorScheme.primary}20` 
                : `${colorScheme.primary}12`;
              
              drawPolygon(ctx, pixelPolygon, valueStrokeColor, valueFillColor, strokeWidth);
              drawnCount++;
              
              // Restore context
              ctx.restore();
            }
          });
        }
        
        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      });
    }

    console.log(`✅ PdfPage: Drew ${drawnCount} enhanced bounding regions on page ${pageNumber}`);
  }, [keyValuePairs, paragraphs, pageNumber, convertPolygon, drawPolygon, hasBoundingRegion, isIndexingMode, hoveredParagraph]);

  // Redraw bounding regions when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      drawBoundingRegions();
    }, 100);

    return () => clearTimeout(timer);
  }, [drawBoundingRegions]);

  if (!pdfDataUrl) {
    console.log("❌ PdfPage: Rendering 'No PDF data available' message");
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '18px' }}>
            No PDF data available
          </p>
          {base64String && (
            <div style={{ marginTop: '10px' }}>
              <small style={{ color: '#999' }}>
                Base64 available: {base64String.length} characters
              </small>
            </div>
          )}
        </div>
      </div>
    );
  }

  console.log("✅ PdfPage: Rendering PDF with data URL");

  return (
    <>
      <div
        style={{
          position: "relative",
          width: `${convertInchesToPixels(pageWidth)}px`,
          height: `${convertInchesToPixels(pageHeight)}px`,
        }}
      >
        <Document 
          file={pdfDataUrl} 
          onLoadSuccess={(pdf) => {
            console.log("✅ PdfPage: PDF loaded successfully", {
              numPages: pdf.numPages,
            });
            onDocumentLoadSuccess(pdf);
          }}
          onLoadError={(error) => {
            console.error("❌ PdfPage: PDF load error:", error);
          }}
          loading={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p>Loading PDF...</p>
                <small style={{ color: '#666' }}>
                  Data URL length: {pdfDataUrl?.length || 0}
                </small>
              </div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={convertInchesToPixels(pageWidth)}
            height={convertInchesToPixels(pageHeight)}
            onLoadSuccess={() => {
              console.log(`✅ PdfPage: Page ${pageNumber} loaded successfully`);
            }}
            onRenderSuccess={() => {
              console.log(`🎨 PdfPage: Page ${pageNumber} rendered successfully`);
              // Trigger redraw of bounding regions after page renders
              setTimeout(() => drawBoundingRegions(), 50);
            }}
          />
        </Document>

        {/* Canvas overlay for bounding regions and interactions */}
        <canvas
          ref={canvasRef}
          width={convertInchesToPixels(pageWidth)}
          height={convertInchesToPixels(pageHeight)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: isIndexingMode ? "pointer" : "default",
            pointerEvents: "auto",
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredParagraph(null)}
        />

        {/* Enhanced Mode indicator */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
          }}
        >
          <Chip
            label={isIndexingMode ? "📄 Paragraph Selection Mode" : "🔍 Field Analysis Mode"}
            color={isIndexingMode ? "primary" : "default"}
            variant="filled"
            size="small"
            sx={{
              backgroundColor: isIndexingMode 
                ? "rgba(59, 130, 246, 0.9)" 
                : "rgba(100, 116, 139, 0.9)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
              border: `1px solid ${isIndexingMode ? "#2563EB" : "#475569"}`,
              boxShadow: `0 4px 12px ${isIndexingMode ? "rgba(59, 130, 246, 0.3)" : "rgba(0, 0, 0, 0.2)"}`,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
        </Box>

        {/* Enhanced Hover tooltip for paragraphs */}
        {isIndexingMode && hoveredParagraph && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              color: "white",
              p: 2,
              borderRadius: 2,
              fontSize: "0.8rem",
              maxHeight: "120px",
              overflow: "auto",
              zIndex: 10,
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              animation: "slideUp 0.2s ease-out",
              "@keyframes slideUp": {
                from: {
                  opacity: 0,
                  transform: "translateY(10px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: "#3B82F6",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)",
                    },
                    "70%": {
                      boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)",
                    },
                    "100%": {
                      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
                    },
                  },
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 700, 
                  color: "#60A5FA",
                  fontSize: "0.75rem",
                }}
              >
                Click to select this paragraph:
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                display: "block", 
                lineHeight: 1.4,
                color: "#E2E8F0",
                fontSize: "0.8rem",
              }}
            >
              {hoveredParagraph.content.substring(0, 200)}
              {hoveredParagraph.content.length > 200 ? "..." : ""}
            </Typography>
          </Box>
        )}
      </div>

      {/* Dialog for key-value pair details (normal mode) */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Field Details: {selectedKey}
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="body1" sx={{ mb: 2 }}>
              {dialogContent}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PdfPage;