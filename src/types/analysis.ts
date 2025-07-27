import { DocumentAnalysisResult } from "../services/documentService";

export interface ConnectorConfig {
  id: string;
  name: string;
  location: string;
  type: "kcim" | "sharepoint" | "local";
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
}
export interface DocumentData {
  id: string;
  name: string;
  type: string;
  size: number;
}
export interface AnalysisState {
  documentData: DocumentData | null;

  base64: string | null;
  connectorName: string | null;
  connectorLocation: string | null;
  connectorId: string | null;
  model: string | null;
  isProcessing: boolean;
  error: string | null;
  analysisResults: unknown | null;
}

export type AnalysisAction =
  | { type: "SET_DOCUMENT_DATA"; payload: unknown }
  | { type: "SET_BASE64"; payload: string }
  | {
      type: "SET_CONNECTOR";
      payload: { name: string; location: string; id: string };
    }
  | { type: "SET_MODEL"; payload: string }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RESULTS"; payload: unknown }
  | { type: "CLEAR_ANALYSIS" };

export interface AnalysisContextType {
  state: AnalysisState;
  actions: {
    setAnalysisResult(data: DocumentAnalysisResult): unknown;
    setLoading(arg0: boolean): unknown;
    setDocumentData: (data: unknown) => void;
    setBase64: (base64: string) => void;
    setConnector: (name: string, location: string, id: string) => void;
    setModel: (model: string) => void;
    setProcessing: (processing: boolean) => void;
    setError: (error: string | null) => void;
    setResults: (results: unknown) => void;
    clearAnalysis: () => void;
  };
}
