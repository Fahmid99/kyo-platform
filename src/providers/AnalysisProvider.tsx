import React, { useReducer, useCallback, ReactNode, useEffect } from "react";
import { AnalysisContext } from "../contexts/AnalysisContext";
import {
  analysisReducer,
  initialAnalysisState,
} from "../contexts/analysisReducer";

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider = ({ children }: AnalysisProviderProps) => {
  const [state, dispatch] = useReducer(analysisReducer, initialAnalysisState);

  const actions = {
    setDocumentData: useCallback((data: any) => {
      dispatch({ type: "SET_DOCUMENT_DATA", payload: data });
    }, []),

    setBase64: useCallback((base64: string) => {
      dispatch({ type: "SET_BASE64", payload: base64 });
    }, []),

    setConnector: useCallback((name: string, location: string, id: string) => {
      dispatch({ type: "SET_CONNECTOR", payload: { name, location, id } });
    }, []),

    setModel: useCallback((model: string) => {
      dispatch({ type: "SET_MODEL", payload: model });
    }, []),

    setProcessing: useCallback((processing: boolean) => {
      dispatch({ type: "SET_PROCESSING", payload: processing });
    }, []),

    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: "SET_PROCESSING", payload: loading });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: "SET_ERROR", payload: error });
    }, []),

    setResults: useCallback((results: any) => {
      dispatch({ type: "SET_RESULTS", payload: results });
    }, []),

    setAnalysisResult: useCallback((data: any) => {
      dispatch({ type: "SET_RESULTS", payload: data });
    }, []),

    clearAnalysis: useCallback(() => {
      dispatch({ type: "CLEAR_ANALYSIS" });
    }, []),
  };

  useEffect(() => {
    return () => {
      if (state.base64 || state.documentData) {
        dispatch({ type: "CLEAR_ANALYSIS" });
      }
    };
  }, [state.base64, state.documentData]);

  const contextValue = {
    state,
    actions,
  };

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
};