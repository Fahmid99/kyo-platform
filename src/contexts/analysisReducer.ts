import { AnalysisState, AnalysisAction, DocumentData } from "../types/analysis";

export const initialAnalysisState: AnalysisState = {
  documentData: null,
  base64: null,
  connectorName: null,
  connectorLocation: null,
  connectorId: null,
  model: null,
  isProcessing: false,
  error: null,
  analysisResults: null,
};

export function analysisReducer(
  state: AnalysisState,
  action: AnalysisAction
): AnalysisState {
  switch (action.type) {
    case "SET_DOCUMENT_DATA":
      return {
        ...state,
        documentData: action.payload as DocumentData | null,
        error: null,
      };

    case "SET_BASE64":
      return {
        ...state,
        base64: action.payload as string | null,
        error: null,
      };

    case "SET_CONNECTOR":
      return {
        ...state,
        connectorName: action.payload as unknown as string | null,
        connectorLocation: action.payload as unknown as string | null,
        connectorId: action.payload as unknown as string | null,
        error: null,
      };

    case "SET_MODEL":
      return {
        ...state,
        model: action.payload as string | null,
        error: null,
      };

    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload as boolean,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload as string | null,
        isProcessing: false,
      };

    case "SET_RESULTS":
      return {
        ...state,
        analysisResults: action.payload as unknown,
        isProcessing: false,
        error: null,
      };

    case "CLEAR_ANALYSIS":
      return initialAnalysisState;
    default:
      return state;
  }
}