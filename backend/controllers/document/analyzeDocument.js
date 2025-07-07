// backend/controllers/document/analyzeDocument.js
const DocumentAnalysisService = require('../../services/documentAnalysisService');

const analyzeDocument = async (req, res) => {
  try {
    // Validate base64 string
    const { base64String, scanType } = req.body;
    
    if (!base64String) {
      return res.status(400).json({
        message: {
          key: "ERROR_NO_BASE64_PROVIDED",
          description: "No base64 string provided"
        }
      });
    }

    // Validate scan type
    if (!scanType) {
      return res.status(400).json({
        message: {
          key: "ERROR_SCAN_TYPE_REQUIRED", 
          description: req.t ? req.t("ERROR_SCAN_TYPE_REQUIRED") : "Scan type is required"
        }
      });
    }

    // Initialize service and validate scan type
    const documentService = new DocumentAnalysisService();
    if (!documentService.isValidScanType(scanType)) {
      return res.status(400).json({
        message: {
          key: "ERROR_INVALID_SCAN_TYPE",
          description: req.t ? req.t("ERROR_INVALID_SCAN_TYPE") : "Invalid scan type provided"
        }
      });
    }

    console.log(`🚀 Processing base64 document, Length: ${base64String.length}, Type: ${scanType}`);

    // Convert base64 to buffer
    let buffer;
    try {
      // Remove data URL prefix if present (data:image/jpeg;base64,)
      const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
      buffer = Buffer.from(base64Data, 'base64');
      
      console.log(`📁 Converted to buffer, size: ${buffer.length} bytes`);
    } catch (error) {
      return res.status(400).json({
        message: {
          key: "ERROR_INVALID_BASE64",
          description: "Invalid base64 string format"
        }
      });
    }

    // Validate buffer size
    if (buffer.length === 0) {
      return res.status(400).json({
        message: {
          key: "ERROR_EMPTY_FILE",
          description: "File appears to be empty"
        }
      });
    }

    if (buffer.length < 1024) {
      return res.status(400).json({
        message: {
          key: "ERROR_FILE_TOO_SMALL",
          description: "File is too small (minimum 1KB required)"
        }
      });
    }

    // Analyze the document
    const result = await documentService.analyzeDocument(buffer, scanType);

    // Return success response
    res.status(200).json({
      success: true,
      data: result,
      metadata: {
        bufferSize: buffer.length,
        scanType: scanType,
        processedAt: new Date().toISOString()
      },
      message: {
        key: "SUCCESS_DOCUMENT_ANALYZED",
        description: req.t ? req.t("SUCCESS_DOCUMENT_ANALYZED") : "Document analyzed successfully"
      }
    });

  } catch (error) {
    console.error('❌ Document analysis controller error:', error);
    
    // Handle specific Azure errors
    if (error.message.includes('InvalidContent') || error.message.includes('corrupted or format is unsupported')) {
      return res.status(400).json({
        success: false,
        message: {
          key: "ERROR_INVALID_FILE_FORMAT",
          description: "File format is not supported or file is corrupted. Please try with a PDF, JPEG, PNG, or other supported format."
        }
      });
    }

    if (error.message.includes('Unsupported media type')) {
      return res.status(400).json({
        success: false,
        message: {
          key: "ERROR_UNSUPPORTED_FILE_TYPE",
          description: req.t ? req.t("ERROR_UNSUPPORTED_FILE_TYPE") : "Unsupported file type"
        }
      });
    }

    if (error.message.includes('credentials')) {
      return res.status(500).json({
        success: false,
        message: {
          key: "ERROR_AZURE_CONFIGURATION",
          description: req.t ? req.t("ERROR_AZURE_CONFIGURATION") : "Azure service configuration error"
        }
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: {
        key: "ERROR_DOCUMENT_ANALYSIS_FAILED",
        description: req.t ? req.t("ERROR_DOCUMENT_ANALYSIS_FAILED") : "Document analysis failed"
      },
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = analyzeDocument;