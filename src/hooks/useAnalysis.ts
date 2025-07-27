import { useContext } from "react";
import { AnalysisContext } from "../contexts/AnalysisContext";
import { AnalysisContextType } from "../types/analysis";

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  
  return context;
};

// Helper function to validate Azure Document Intelligence scan types
export const isValidScanType = (scanType: string): boolean => {
  const validScanTypes = [
    'prebuilt-invoice',
    'prebuilt-receipt', 
    'prebuilt-businessCard',
    'prebuilt-idDocument',
    'prebuilt-layout',
    'prebuilt-document'
  ];
  return validScanTypes.includes(scanType);
};

// Helper function to format model names for display
export const formatModelName = (modelValue: string): string => {
  const modelMap: { [key: string]: string } = {
    'prebuilt-invoice': 'Invoice Analysis',
    'prebuilt-receipt': 'Receipt Analysis', 
    'prebuilt-businessCard': 'Business Card Analysis',
    'prebuilt-idDocument': 'ID Document Analysis',
    'prebuilt-layout': 'Layout Analysis',
    'prebuilt-document': 'General Document Analysis',
  };
  return modelMap[modelValue] || modelValue;
};

// Helper function to get confidence level styling
export const getConfidenceLevel = (confidence: number) => {
  if (confidence >= 0.8) {
    return { color: 'success', label: 'High' };
  } else if (confidence >= 0.6) {
    return { color: 'warning', label: 'Medium' };
  } else {
    return { color: 'error', label: 'Low' };
  }
};