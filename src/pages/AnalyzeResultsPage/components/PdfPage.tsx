import React, { useRef, useEffect, useState, useCallback } from "react";
import { Document, Page } from "react-pdf";
import { useAnalysisResults } from "../AnalyzeResultsPage";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface PdfPageProps {
  pageNumber: number;
  scale: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

interface BoundingRegion {
  polygon?: Array<{ x: number; y: number }>;
}

const PdfPage: React.FC<PdfPageProps> = ({
  pageNumber,
  //scale,
  onDocumentLoadSuccess,
}) => {
  const { base64String, analysisData } = useAnalysisResults();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  const region = analysisData?.keyValuePairs || [];
  const pageWidth = analysisData?.pageWidth || 8.5; // Default to 8.5 inches (letter size)
  const pageHeight = analysisData?.pageHeight || 11; // Default to 11 inches (letter size)

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
      // Clean the base64 string - remove unknown data URL prefix if present
      let cleanBase64 = base64String;
      if (base64String.includes(',')) {
        console.log("🔄 PdfPage: Removing data URL prefix");
        cleanBase64 = base64String.split(',')[1];
      }

      // Validate base64 format
      if (!cleanBase64 || cleanBase64.length === 0) {
        console.error("❌ PdfPage: Invalid base64 string after cleaning");
        setPdfDataUrl(null);
        return;
      }

      // Create the data URL
      const dataUrl = `data:application/pdf;base64,${cleanBase64}`;
      console.log("✅ PdfPage: Created PDF data URL:", {
        originalLength: base64String.length,
        cleanedLength: cleanBase64.length,
        dataUrlLength: dataUrl.length,
        dataUrlPreview: dataUrl.substring(0, 100) + "..."
      });

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
        const xi = polygon[i].x,
          yi = polygon[i].y;
        const xj = polygon[j].x,
          yj = polygon[j].y;

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

  // Handle canvas click for field selection
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !region || region.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const clickPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      // Check if click is within unknown field region
      for (const pair of region) {
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
    },
    [region, pageNumber, convertPolygon, isPointInPolygon, hasBoundingRegion]
  );

  // Draw all bounding regions on the canvas
  const drawBoundingRegions = useCallback(() => {
    if (!canvasRef.current || !region || region.length === 0) {
      console.log("❌ PdfPage: Cannot draw bounding regions:", {
        hasCanvas: !!canvasRef.current,
        hasRegion: !!region,
        regionLength: region?.length || 0
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log("🎨 PdfPage: Drawing bounding regions for page", pageNumber, "with", region.length, "regions");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let drawnCount = 0;

    // Draw each bounding region
    region.forEach((pair, index) => {
      console.log(`PdfPage: Processing pair ${index}:`, {
        key: pair.key,
        pageNumber: pair.pageNumber,
        currentPage: pageNumber,
        hasKeyBounds: !!pair.keyBoundingRegions,
        hasValueBounds: !!pair.valueBoundingRegions
      });

      // Only draw regions for the current page
      if (pair.pageNumber !== pageNumber) return;

      const color = pair.color || "#3498db";
      const fillColor = color + "33"; // Add transparency
      const strokeColor = color;

      // Draw key bounding regions
      if (pair.keyBoundingRegions) {
        pair.keyBoundingRegions.forEach((regionItem: unknown) => {
          if (hasBoundingRegion(regionItem) && regionItem.polygon) {
            const pixelPolygon = convertPolygon(regionItem.polygon, 96);
            drawPolygon(ctx, pixelPolygon, strokeColor, fillColor);
            drawnCount++;
          }
        });
      }

      // Draw value bounding regions
      if (pair.valueBoundingRegions) {
        pair.valueBoundingRegions.forEach((regionItem: unknown) => {
          if (hasBoundingRegion(regionItem) && regionItem.polygon) {
            const pixelPolygon = convertPolygon(regionItem.polygon, 96);
            drawPolygon(ctx, pixelPolygon, strokeColor, fillColor);
            drawnCount++;
          }
        });
      }
    });

    console.log(`✅ PdfPage: Drew ${drawnCount} bounding regions on page ${pageNumber}`);
  }, [region, pageNumber, convertPolygon, drawPolygon, hasBoundingRegion]);

  // Redraw bounding regions when dependencies change
  useEffect(() => {
    // Small delay to ensure PDF is rendered first
    const timer = setTimeout(() => {
      drawBoundingRegions();
    }, 100);

    return () => clearTimeout(timer);
  }, [drawBoundingRegions]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 PdfPage: Component state", {
      hasBase64: !!base64String,
      base64Length: base64String?.length || 0,
      hasPdfDataUrl: !!pdfDataUrl,
      pageNumber,
      regionsCount: region.length,
      pdfDataUrlPreview: pdfDataUrl?.substring(0, 100) || 'null'
    });
  }, [base64String, pdfDataUrl, pageNumber, region.length]);

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
              <br />
              <small style={{ color: '#999' }}>
                Preview: {base64String.substring(0, 50)}...
              </small>
            </div>
          )}
          <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
            Check browser console for details
          </p>
        </div>
      </div>
    );
  }

  console.log("✅ PdfPage: Rendering PDF with data URL");

  return (
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
            fingerprint: pdf.fingerprints
          });
          onDocumentLoadSuccess(pdf);
        }}
        onLoadError={(error) => {
          console.error("❌ PdfPage: PDF load error:", error);
          console.error("❌ PdfPage: Failed data URL preview:", pdfDataUrl?.substring(0, 200));
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
          renderMode="canvas"
          onRenderSuccess={() => {
            console.log("✅ PdfPage: Page rendered successfully", { pageNumber });
          }}
          onRenderError={(error) => {
            console.error("❌ PdfPage: Page render error:", error);
          }}
        />
      </Document>
      <canvas
        ref={canvasRef}
        width={convertInchesToPixels(pageWidth)}
        height={convertInchesToPixels(pageHeight)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          cursor: "pointer",
        }}
        onClick={handleCanvasClick}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="field-dialog-title"
        aria-describedby="field-dialog-description"
      >
        <DialogTitle id="field-dialog-title">
          Extracted Field: {selectedKey}
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="field-dialog-description" 
            component="pre"
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PdfPage;