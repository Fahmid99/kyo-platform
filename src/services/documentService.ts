// src/services/documentService.ts
import axios from "axios";

// Define types for the document analysis
export interface DocumentAnalysisResult {
  title: string;
  keyValuePairs: Array<{
    key: string;
    value: string;
    confidence: number;
    valueBoundingRegions: unknown[];
    keyBoundingRegions: unknown[];
    color: string;
    pageNumber: number;
  }>;
  pageWidth: number;
  pageHeight: number;
  pages: unknown[];
  paragraphs: unknown[];
  words: unknown[];
  documents: Array<{
    docType: string;
    confidence: number;
    boundingRegions: unknown[];
    fields: Array<{
      key: string;
      kind: string;
      value: unknown;
      confidence: number;
      boundingRegions: unknown[];
      color: string;
      pageNumber: number;
    }>;
  }>;
  raw: {
    keyValuePairs: unknown[];
    documents: unknown[];
  };
}

export interface DocumentAnalysisResponse {
  success: boolean;
  data: DocumentAnalysisResult;
  metadata: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    scanType: string;
    processedAt: string;
  };
  message: {
    key: string;
    description: string;
  };
}

export interface ScanType {
  value: string;
  label: string;
  description: string;
}

const analyzeDocument = async (
  base64String: string, 
  scanType: string
): Promise<DocumentAnalysisResponse> => {
  try {
    const requestData = {
      base64String: base64String,
      scanType: scanType,
    };

    console.log(`Starting document analysis:`, {
      scanType: scanType,
      base64Length: base64String.length,
    });

    const response = await axios.post("/api/document/analyze", requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Document analysis completed:", response.data);
    return response.data;

  } catch (error) {
    console.error("Document analysis failed:", error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message?.description || "Analysis failed";
      throw new Error(errorMessage);
    }
    
    throw new Error("Network error occurred");
  }
};

const getScanTypes = async (): Promise<ScanType[]> => {
  try {
    const response = await axios.get("/api/document/scan-types");
    console.log("Available scan types:", response.data.scanTypes);
    return response.data.scanTypes;
  } catch (error) {
    console.error("Failed to get scan types:", error);
    
    // Return default scan types if API fails
    return [
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
    ];
  }
};

const checkServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get("/api/document/health");
    console.log("Document service health:", response.data);
    return response.data.status === 'OK';
  } catch (error) {
    console.error("Document service health check failed:", error);
    return false;
  }
};

export default {
  analyzeDocument,
  getScanTypes,
  checkServiceHealth,
};