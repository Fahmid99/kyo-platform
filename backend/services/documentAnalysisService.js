// backend/services/documentAnalysisService.js
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer"); // Changed from import to require

// Helper function to generate random colors
const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  return colors[Math.floor(Math.random() * colors.length)];
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

      // Process key-value pairs with safer access
      const keyValuePairsArray = keyValuePairs
        ? keyValuePairs.map(({ key, value, confidence, boundingRegions }) => ({
          key: key?.content || "Unknown key",
          value: value?.content ?? "<undefined>",
          confidence: confidence || 0,
          valueBoundingRegions: value?.boundingRegions || [],
          keyBoundingRegions: key?.boundingRegions || [],
          color: getRandomColor(),
          pageNumber: key?.boundingRegions?.[0]?.pageNumber || 1
        }))
        : [];

      // Process documents with safer access
      const documentsArray = documents
        ? documents.map((document) => ({
          docType: document.docType,
          confidence: document.confidence,
          boundingRegions: document.boundingRegions || [],
          fields: Object.entries(document.fields || {}).map(
            ([fieldKey, fieldData]) => ({
              key: fieldKey,
              kind: fieldData.kind || "unknown",
              value: fieldData.content || fieldData.values || "N/A",
              confidence: fieldData.confidence || 0,
              boundingRegions: fieldData.boundingRegions || [],
              color: getRandomColor(),
              pageNumber: fieldData.boundingRegions?.[0]?.pageNumber || 1
            })
          ),
        }))
        : [];

      const pageWidth = pages?.[0]?.width || 0;
      const pageHeight = pages?.[0]?.height || 0;

      console.log(`Document analysis completed. Found ${keyValuePairsArray.length} key-value pairs and ${documentsArray.length} structured documents`);

      return {
        title,
        keyValuePairs: keyValuePairsArray,
        pageWidth,
        pageHeight,
        pages: pages || [],
        paragraphs: paragraphs || [],
        words: words || [],
        documentsInitial: documents,
        documents: documentsArray,
        keyValuePairsInitial: keyValuePairs,
      };
    } catch (error) {
      console.error("Document analysis error:", error);
      throw new Error(`Document analysis failed: ${error.message}`);
    }
  }

  // ADD THIS METHOD - Your controller needs it!
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