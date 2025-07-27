import axios from "axios";
import { AxiosError } from 'axios';

export interface DocumentAnalysisResult {
  success: boolean;
  data?: {
    title: string;
    keyValuePairs: Array<{
      key: string;
      value: string;
      confidence: number;
      pageNumber: number;
      color: string;
      valueBoundingRegions?: unknown[];
      keyBoundingRegions?: unknown[];
    }>;
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
    pages: unknown[];
    paragraphs: unknown[];
    words: unknown[];
    pageWidth: number;
    pageHeight: number;
    documentsInitial?: unknown;
    keyValuePairsInitial?: unknown;
  };
  message?: {
    key: string;
    description: string;
  };
  error?: unknown;
}

export interface ScanType {
  value: string;
  label: string;
  description: string;
}

export interface ServiceHealthResponse {
  status: string;
  service: string;
  timestamp: string;
  version: string;
}

class DocumentService {
  private baseURL = "/api/document";

  /**
   * Analyze a document using Azure Document Intelligence
   */
  async analyzeDocument(
    base64Data: string, 
    scanType: string
  ): Promise<DocumentAnalysisResult> {
    try {
      console.log("🔍 Starting document analysis...", { 
        scanType, 
        base64Length: base64Data.length 
      });
      
      // The backend expects 'base64String' and 'scanType' in the request body
      const requestData = {
        base64String: base64Data,  // Changed from base64Data to base64String
        scanType: scanType,
      };

      console.log("📤 Sending request with:", {
        scanType: requestData.scanType,
        base64Length: requestData.base64String.length,
        requestKeys: Object.keys(requestData)
      });

      const response = await axios.post<DocumentAnalysisResult>(
        `${this.baseURL}/analyze`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000, // 2 minute timeout for analysis
        }
      );

      console.log("✅ Document analysis completed successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Document analysis failed:", error);
      
      // Check if it's an axios error
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          return {
            success: false,
            message: error.response.data.message,
            error: error.response.data.error
          };
        }
        
        // Handle network/timeout errors
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            message: {
              key: "ERROR_TIMEOUT",
              description: "The analysis request timed out. Please try again with a smaller file or contact support."
            }
          };
        }
      }
      
      // Fallback for other errors
      return {
        success: false,
        message: {
          key: "ERROR_UNKNOWN",
          description: "An unexpected error occurred during analysis."
        },
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get available Azure Document Intelligence scan types
   */
  async getScanTypes(): Promise<ScanType[]> {
    try {
      const response = await axios.get<{ scanTypes: ScanType[] }>(`${this.baseURL}/scan-types`);
      return response.data.scanTypes;
    } catch (error) {
      console.error("Failed to fetch scan types:", error);
      // Return default scan types as fallback
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
  }

  /**
   * Check if the document service is healthy
   */
  async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await axios.get<ServiceHealthResponse>(`${this.baseURL}/health`);
      console.log("Document service health:", response.data);
      return response.data.status === 'OK';
    } catch (error) {
      console.error("Document service health check failed:", error);
      return false;
    }
  }

  /**
   * Validate if a scan type is supported
   */
  isValidScanType(scanType: string): boolean {
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

  /**
   * Convert file to base64 string
   */
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Validate file before analysis
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSizeInMB = 50;
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/bmp',
      'image/tiff'
    ];

    if (file.size > maxSizeInMB * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeInMB}MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please use PDF, JPEG, PNG, BMP, or TIFF files.'
      };
    }

    return { isValid: true };
  }
}

const documentService = new DocumentService();

export default documentService;