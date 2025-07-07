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

const PdfPage: React.FC<PdfPageProps> = ({
  pageNumber,
  scale,
  onDocumentLoadSuccess,
}) => {
  const { base64String, analysisData } = useAnalysisResults();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const region = analysisData?.keyValuePairs || [];
  const pageWidth = analysisData?.pageWidth || 8.5; // Default to 8.5 inches (letter size)
  const pageHeight = analysisData?.pageHeight || 11; // Default to 11 inches (letter size)

  // Convert the base64 to a data URL for react-pdf
  const pdfDataUrl = base64String ? `data:application/pdf;base64,${base64String}` : null;

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

  // Draw all bounding regions on the canvas
  const drawBoundingRegions = useCallback(() => {
    if (!canvasRef.current || !region || region.length === 0) {
      console.log("❌ Cannot draw bounding regions:", {
        hasCanvas: !!canvasRef.current,
        hasRegion: !!region,
        regionLength: region?.length || 0
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log("🎨 Drawing bounding regions for page", pageNumber, "with", region.length, "regions");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let drawnCount = 0;

    // Draw each bounding region
    region.forEach((pair, index) => {
      console.log(`Processing pair ${index}:`, {
        key: pair.key,
        pageNumber: pair.pageNumber,
        currentPage: pageNumber,
        hasKeyBounds: !!pair.keyBoundingRegions,
        hasValueBounds: !!pair.valueBoundingRegions,
        keyBoundsLength: pair.keyBoundingRegions?.length || 0,
        valueBoundsLength: pair.valueBoundingRegions?.length || 0
      });

      // Skip if not on current page
      if (pair.pageNumber !== pageNumber) {
        console.log(`Skipping pair ${index} - wrong page (${pair.pageNumber} vs ${pageNumber})`);
        return;
      }

      // Draw key bounding regions
      if (pair.keyBoundingRegions && Array.isArray(pair.keyBoundingRegions)) {
        pair.keyBoundingRegions.forEach((bound, boundIndex) => {
          console.log(`Key bound ${boundIndex}:`, bound);
          
          // Azure Document Intelligence uses different structure
          // Check for polygon in the bound object
          let polygon = bound.polygon;
          
          // If no direct polygon, check if it's in a different structure
          if (!polygon && bound.boundingBox) {
            // Convert boundingBox to polygon if available
            const box = bound.boundingBox;
            polygon = [
              { x: box.x, y: box.y },
              { x: box.x + box.width, y: box.y },
              { x: box.x + box.width, y: box.y + box.height },
              { x: box.x, y: box.y + box.height }
            ];
          }
          
          if (polygon && Array.isArray(polygon)) {
            console.log(`Drawing key polygon with ${polygon.length} points`);
            const pixelPolygon = convertPolygon(polygon, 96);
            drawPolygon(ctx, pixelPolygon, "#ffa726", "rgba(255, 183, 77, 0.3)");
            drawnCount++;
          } else {
            console.log("No valid polygon found for key bound:", bound);
          }
        });
      }

      // Draw value bounding regions
      if (pair.valueBoundingRegions && Array.isArray(pair.valueBoundingRegions)) {
        pair.valueBoundingRegions.forEach((bound, boundIndex) => {
          console.log(`Value bound ${boundIndex}:`, bound);
          
          let polygon = bound.polygon;
          
          if (!polygon && bound.boundingBox) {
            const box = bound.boundingBox;
            polygon = [
              { x: box.x, y: box.y },
              { x: box.x + box.width, y: box.y },
              { x: box.x + box.width, y: box.y + box.height },
              { x: box.x, y: box.y + box.height }
            ];
          }
          
          if (polygon && Array.isArray(polygon)) {
            console.log(`Drawing value polygon with ${polygon.length} points`);
            const pixelPolygon = convertPolygon(polygon, 96);
            drawPolygon(ctx, pixelPolygon, pair.color || "#2979ff", `${pair.color || "#2979ff"}30`);
            drawnCount++;
          } else {
            console.log("No valid polygon found for value bound:", bound);
          }
        });
      }
    });

    console.log(`✅ Drew ${drawnCount} bounding regions on page ${pageNumber}`);
  }, [region, pageNumber, convertPolygon, drawPolygon]);

  // Handle canvas clicks
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !region) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if the click is inside any bounding region
      region.forEach((pair) => {
        if (pair.pageNumber !== pageNumber) return;

        if (pair.valueBoundingRegions) {
          pair.valueBoundingRegions.forEach((bound) => {
            if (bound.pageNumber === pageNumber && bound.polygon) {
              const polygon = convertPolygon(bound.polygon, 96);
              if (isPointInPolygon({ x, y }, polygon)) {
                setSelectedKey(pair.key);
                setDialogContent(`Key: ${pair.key}\nValue: ${pair.value}\nConfidence: ${Math.round(pair.confidence * 100)}%`);
                setOpen(true);
              }
            }
          });
        }
      });
    },
    [region, pageNumber, convertPolygon, isPointInPolygon]
  );

  // Redraw bounding regions when dependencies change
  useEffect(() => {
    // Small delay to ensure PDF is rendered first
    const timer = setTimeout(() => {
      drawBoundingRegions();
    }, 100);

    return () => clearTimeout(timer);
  }, [drawBoundingRegions]);

  if (!pdfDataUrl) {
    return <div>No PDF data available</div>;
  }

  return (
    <div
      style={{
        position: "relative",
        width: `${convertInchesToPixels(pageWidth)}px`,
        height: `${convertInchesToPixels(pageHeight)}px`,
      }}
    >
      <Document file={pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          width={convertInchesToPixels(pageWidth)}
          height={convertInchesToPixels(pageHeight)}
          renderMode="canvas"
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