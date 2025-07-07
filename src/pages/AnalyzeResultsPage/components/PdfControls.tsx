import { Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ZoomInIcon from "@mui/icons-material/Add";
import ZoomOutIcon from "@mui/icons-material/Remove";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";

interface PdfControlProps {
  pageNumber: number;
  handlePageNumber: (action: string) => void;
  numPages: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  scale?: number;
}

const PdfControls: React.FC<PdfControlProps> = ({
  pageNumber,
  handlePageNumber,
  numPages,
  handleZoomIn,
  handleZoomOut,
  scale = 1,
}) => {
  return (
    <Box
      sx={{
        background: "#323639",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        borderBottom: "1px solid #555",
      }}
    >
      {/* Zoom Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
          <ZoomOutIcon style={{ color: "white" }} />
        </IconButton>
        <Typography variant="body2" sx={{ color: "white", minWidth: "60px", textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </Typography>
        <IconButton onClick={handleZoomIn} disabled={scale >= 3}>
          <ZoomInIcon style={{ color: "white" }} />
        </IconButton>
      </Box>

      {/* Page Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          disabled={pageNumber <= 1}
          onClick={() => handlePageNumber("back")}
          sx={{ 
            color: "white", 
            borderColor: "#616161",
            minWidth: "auto",
            padding: "4px 8px"
          }}
        >
          <NavigateBefore />
        </Button>
        
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            padding: "4px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            minWidth: "80px",
            textAlign: "center"
          }}
        >
          Page {pageNumber} of {numPages}
        </Typography>
        
        <Button
          variant="outlined"
          disabled={pageNumber >= numPages}
          onClick={() => handlePageNumber("forward")}
          sx={{ 
            color: "white", 
            borderColor: "#616161",
            minWidth: "auto",
            padding: "4px 8px"
          }}
        >
          <NavigateNext />
        </Button>
      </Box>
    </Box>
  );
};

export default PdfControls;