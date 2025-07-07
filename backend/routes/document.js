// backend/routes/document.js
const express = require('express');
const router = express.Router();

// Import your existing middleware
const getToken = require("../middlewares/getters/getToken.js");
const getClaimsFromToken = require("../middlewares/getters/getClaimsFromToken.js");
const validateOrgId = require("../middlewares/validators/validateOrgId.js");
const validateUser = require("../middlewares/validators/validateUser.js");

// Import controller
const analyzeDocument = require('../controllers/document/analyzeDocument');

// Document analysis route with authentication (no multer needed for base64)
router.post(
  '/analyze',
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  analyzeDocument
);

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Document Analysis Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get supported scan types endpoint
router.get('/scan-types', (req, res) => {
  res.status(200).json({
    scanTypes: [
      {
        value: 'prebuilt-invoice',
        label: 'Invoice',
        description: 'Extract data from invoices'
      },
      {
        value: 'prebuilt-receipt',
        label: 'Receipt', 
        description: 'Extract data from receipts'
      },
      {
        value: 'prebuilt-businessCard',
        label: 'Business Card',
        description: 'Extract contact information from business cards'
      },
      {
        value: 'prebuilt-idDocument',
        label: 'ID Document',
        description: 'Extract data from identity documents'
      },
      {
        value: 'prebuilt-layout',
        label: 'Layout Analysis',
        description: 'Analyze document layout and structure'
      },
      {
        value: 'prebuilt-document',
        label: 'General Document',
        description: 'General document analysis'
      }
    ]
  });
});

module.exports = router;