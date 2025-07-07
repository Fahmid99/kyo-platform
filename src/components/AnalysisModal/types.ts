export interface Connector {
  id: string;
  name: string;
  location: string;
  type: "kcim" | "sharepoint" | "local";
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  base64?: string;
}

export interface AnalysisModalProps {
  open: boolean;
  onClose: () => void;
  file: DocumentFile | null;
  onAnalysisComplete?: () => void;
}

export interface AnalysisFormData {
  connector: Connector | null;
  model: Model | null;
}