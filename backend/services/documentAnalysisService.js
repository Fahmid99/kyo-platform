// Enhanced backend/services/documentAnalysisService.js with consistent color scheme
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");

// Professional color palette optimized for document highlighting
const COLOR_PALETTE = [
  {
    name: "Ocean Blue",
    primary: "#2563EB",
    light: "#DBEAFE", 
    dark: "#1D4ED8",
    fill: "#2563EB20",
    fillHover: "#2563EB35",
    stroke: "#2563EB",
    strokeHover: "#1D4ED8",
    text: "#1E40AF"
  },
  {
    name: "Emerald Green",
    primary: "#059669",
    light: "#D1FAE5",
    dark: "#047857",
    fill: "#05966920",
    fillHover: "#05966935",
    stroke: "#059669",
    strokeHover: "#047857",
    text: "#065F46"
  },
  {
    name: "Amber Orange",
    primary: "#F59E0B",
    light: "#FEF3C7",
    dark: "#D97706",
    fill: "#F59E0B20",
    fillHover: "#F59E0B35",
    stroke: "#F59E0B",
    strokeHover: "#D97706",
    text: "#92400E"
  },
  {
    name: "Rose Pink",
    primary: "#E11D48",
    light: "#FCE7F3",
    dark: "#BE185D",
    fill: "#E11D4820",
    fillHover: "#E11D4835",
    stroke: "#E11D48",
    strokeHover: "#BE185D",
    text: "#9F1239"
  },
  {
    name: "Violet Purple",
    primary: "#7C3AED",
    light: "#EDE9FE",
    dark: "#6D28D9",
    fill: "#7C3AED20",
    fillHover: "#7C3AED35",
    stroke: "#7C3AED",
    strokeHover: "#6D28D9",
    text: "#5B21B6"
  },
  {
    name: "Cyan Teal",
    primary: "#0891B2",
    light: "#CFFAFE",
    dark: "#0E7490",
    fill: "#0891B220",
    fillHover: "#0891B235",
    stroke: "#0891B2",
    strokeHover: "#0E7490",
    text: "#155E75"
  },
  {
    name: "Indigo Blue",
    primary: "#4F46E5",
    light: "#E0E7FF",
    dark: "#4338CA",
    fill: "#4F46E520",
    fillHover: "#4F46E535",
    stroke: "#4F46E5",
    strokeHover: "#4338CA",
    text: "#3730A3"
  },
  {
    name: "Red Crimson",
    primary: "#DC2626",
    light: "#FEE2E2",
    dark: "#B91C1C",
    fill: "#DC262620",
    fillHover: "#DC262635",
    stroke: "#DC2626",
    strokeHover: "#B91C1C",
    text: "#991B1B"
  },
  {
    name: "Lime Green",
    primary: "#65A30D",
    light: "#ECFCCB",
    dark: "#4D7C0F",
    fill: "#65A30D20",
    fillHover: "#65A30D35",
    stroke: "#65A30D",
    strokeHover: "#4D7C0F",
    text: "#365314"
  },
  {
    name: "Pink Magenta",
    primary: "#C2410C",
    light: "#FED7AA",
    dark: "#9A3412",
    fill: "#C2410C20",
    fillHover: "#C2410C35",
    stroke: "#C2410C",
    strokeHover: "#9A3412",
    text: "#7C2D12"
  }
];

// Generate consistent colors for key-value pairs
const generateKeyValueColor = (index) => {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
};

// Get confidence-based styling
const getConfidenceBasedStyling = (baseColor, confidence) => {
  if (confidence >= 0.9) {
    return {
      ...baseColor,
      opacity: 1.0,
      strokeWidth: 2.5
    };
  } else if (confidence >= 0.7) {
    return {
      ...baseColor,
      opacity: 0.8,
      strokeWidth: 2.0
    };
  } else {
    return {
      ...baseColor,
      opacity: 0.6,
      strokeWidth: 1.5
    };
  }
};

class DocumentAnalysisService {
  constructor() {
    this.key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;
    this.endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;

    if (!this.key || !this.endpoint) {
      throw new Error('Azure Document Intelligence credentials not configured');
    }

    this.client = new DocumentAnalysisClient(
      this.endpoint,
      new AzureKeyCredential(this.key)
    );
  }

  async analyzeDocument(buffer, scanType) {
    try {
      console.log(`Starting document analysis with scan type: ${scanType}`);

      const poller = await this.client.beginAnalyzeDocument(scanType, buffer, {
        includeTextDetails: true,
      });

      const result = await poller.pollUntilDone();

      const {
        keyValuePairs,
        paragraphs,
        documentType,
        pages,
        words,
        CustomerName,
        documents,
      } = result;

      let title = "Title not found";
      if (paragraphs && paragraphs.length > 0) {
        for (let i = 0; i < paragraphs.length; i++) {
          if (paragraphs[i].role === "title") {
            title = paragraphs[i].content;
            break;
          }
        }
      }

      // Process key-value pairs with consistent color scheme
      const keyValuePairsArray = keyValuePairs
        ? keyValuePairs.map(({ key, value, confidence, boundingRegions }, index) => {
            const baseColor = generateKeyValueColor(index);
            const colorWithConfidence = getConfidenceBasedStyling(baseColor, confidence || 0);
            
            return {
              key: key?.content || "Unknown key",
              value: value?.content ?? "<undefined>",
              confidence: confidence || 0,
              valueBoundingRegions: value?.boundingRegions || [],
              keyBoundingRegions: key?.boundingRegions || [],
              color: colorWithConfidence.primary,
              colorScheme: colorWithConfidence,
              pageNumber: key?.boundingRegions?.[0]?.pageNumber || 1,
              index // For consistent color assignment
            };
          })
        : [];

      // Process documents with consistent color scheme
      const documentsArray = documents
        ? documents.map((document, docIndex) => ({
          docType: document.docType,
          confidence: document.confidence,
          boundingRegions: document.boundingRegions || [],
          fields: Object.entries(document.fields || {}).map(
            ([fieldKey, fieldData], fieldIndex) => {
              const colorIndex = (docIndex * 10 + fieldIndex) % COLOR_PALETTE.length;
              const baseColor = generateKeyValueColor(colorIndex);
              const colorWithConfidence = getConfidenceBasedStyling(baseColor, fieldData.confidence || 0);
              
              return {
                key: fieldKey,
                kind: fieldData.kind || "unknown",
                value: fieldData.content || fieldData.values || "N/A",
                confidence: fieldData.confidence || 0,
                boundingRegions: fieldData.boundingRegions || [],
                color: colorWithConfidence.primary,
                colorScheme: colorWithConfidence,
                pageNumber: fieldData.boundingRegions?.[0]?.pageNumber || 1,
                index: colorIndex
              };
            }
          ),
        }))
        : [];

      const pageWidth = pages?.[0]?.width || 0;
      const pageHeight = pages?.[0]?.height || 0;

      console.log(`Document analysis completed. Found ${keyValuePairsArray.length} key-value pairs and ${documentsArray.length} structured documents`);
      console.log(`Color scheme applied: ${keyValuePairsArray.length} items with consistent colors`);

      return {
        title,
        keyValuePairs: keyValuePairsArray,
        keyValuePairsInitial: keyValuePairs,
        pageWidth,
        pageHeight,
        pages: pages || [],
        paragraphs: paragraphs || [],
        words: words || [],
        documentsInitial: documents,
        documents: documentsArray,
        colorPalette: COLOR_PALETTE, // Include color palette in response
      };
    } catch (error) {
      console.error("Document analysis error:", error);
      throw new Error(`Document analysis failed: ${error.message}`);
    }
  }

  // Validate scan type
  isValidScanType(scanType) {
    const validScanTypes = [
      'prebuilt-invoice',
      'prebuilt-receipt',
      'prebuilt-businessCard',
      'prebuilt-idDocument',
      'prebuilt-layout',
      'prebuilt-document'
    ];
    return validScanTypes.includes(scanType);
  }
}

module.exports = DocumentAnalysisService;