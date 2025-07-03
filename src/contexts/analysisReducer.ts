import { initialAnalysisState } from "./analysisReducer";
import { AnalysisState, AnalysisAction } from "../types/analysis";

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
        documentData: action.payload,
        error: null,
      };

    case "SET_BASE64":
      return {
        ...state,
        base64: action.payload,
        error: null,
      };

    case "SET_CONNECTOR":
      return {
        ...state,
        connectorName: action.payload,
        connectorLocation: action.payload,
        connectorId: action.payload,
        error: null,
      };

    case "SET_MODEL":
      return {
        ...state,
        model: action.payload,
        error: null,
      };

    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isProcessing: false,
      };

    case "SET_RESULTS":
      return {
        ...state,
        analysisResults: action.payload,
        isProcessing: false,
        error: null,
      };

    case "CLEAR_ANALYSIS":
      return initialAnalysisState;
    default:
      return state;
  }
} 
