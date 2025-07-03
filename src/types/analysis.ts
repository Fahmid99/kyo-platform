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

export interface AnalysisState {
  documentData: any | null;
  base64: string | null;
  connectorName: string | null;
  connectorLocation: string | null;
  connectorId: string | null;
  model: string | null;
  isProcessing: boolean;
  error: string | null;
  analysisResults: any | null;
}

export type AnalysisAction = 
  | { type: 'SET_DOCUMENT_DATA'; payload: any }
  | { type: 'SET_BASE64'; payload: string }
  | { type: 'SET_CONNECTOR'; payload: { name: string; location: string; id: string } }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESULTS'; payload: any }
  | { type: 'CLEAR_ANALYSIS' };

export interface AnalysisContextType {
  state: AnalysisState;
  actions: {
    setDocumentData: (data: any) => void;
    setBase64: (base64: string) => void;
    setConnector: (name: string, location: string, id: string) => void;
    setModel: (model: string) => void;
    setProcessing: (processing: boolean) => void;
    setError: (error: string | null) => void;
    setResults: (results: any) => void;
    clearAnalysis: () => void;
  };
}