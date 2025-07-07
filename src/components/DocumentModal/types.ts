export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  base64?: string;
}

export interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  file: DocumentFile | null;
}