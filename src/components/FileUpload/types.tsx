export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified?: number;
  base64?: string;
}

export interface FileUploadProps {
  onFileSelect?: (file: DocumentFile) => void;
  onAnalyzeFile?: (file: DocumentFile) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}