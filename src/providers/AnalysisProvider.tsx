// Fixed AnalysisProvider.tsx - Remove problematic cleanup
import { useReducer, useCallback, ReactNode, useEffect } from "react";
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
    setDocumentData: useCallback((data: unknown) => {
      console.log("🔄 AnalysisProvider: setDocumentData called", data);
      dispatch({ type: "SET_DOCUMENT_DATA", payload: data });
    }, []),

    setBase64: useCallback((base64: string) => {
      console.log("🔄 AnalysisProvider: setBase64 called", {
        length: base64?.length || 0,
        preview: base64?.substring(0, 50) + "..."
      });
      dispatch({ type: "SET_BASE64", payload: base64 });
    }, []),

    setConnector: useCallback((name: string, location: string, id: string) => {
      dispatch({ type: "SET_CONNECTOR", payload: { name, location, id } });
    }, []),

    setModel: useCallback((model: string) => {
      console.log("🔄 AnalysisProvider: setModel called", model);
      dispatch({ type: "SET_MODEL", payload: model });
    }, []),

    setProcessing: useCallback((processing: boolean) => {
      console.log("🔄 AnalysisProvider: setProcessing called", processing);
      dispatch({ type: "SET_PROCESSING", payload: processing });
    }, []),

    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: "SET_PROCESSING", payload: loading });
    }, []),

    setError: useCallback((error: string | null) => {
      console.log("🔄 AnalysisProvider: setError called", error);
      dispatch({ type: "SET_ERROR", payload: error });
    }, []),

    setResults: useCallback((results: unknown) => {
      console.log("🔄 AnalysisProvider: setResults called", {
        hasResults: !!results,
        resultType: typeof results
      });
      dispatch({ type: "SET_RESULTS", payload: results });
    }, []),

    setAnalysisResult: useCallback((data: unknown) => {
      console.log("🔄 AnalysisProvider: setAnalysisResult called", {
        hasData: !!data,
        dataType: typeof data
      });
      dispatch({ type: "SET_RESULTS", payload: data });
    }, []),

    clearAnalysis: useCallback(() => {
      console.log("🔄 AnalysisProvider: clearAnalysis called - MANUAL CLEAR");
      dispatch({ type: "CLEAR_ANALYSIS" });
    }, []),
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log("🔄 AnalysisProvider: State changed", {
      hasBase64: !!state.base64,
      base64Length: state.base64?.length || 0,
      hasResults: !!state.analysisResults,
      hasDocumentData: !!state.documentData,
      isProcessing: state.isProcessing,
      error: state.error
    });
  }, [state]);

  // REMOVED THE PROBLEMATIC CLEANUP EFFECT
  // This was causing the base64 to be cleared when navigating
  // useEffect(() => {
  //   return () => {
  //     if (state.base64 || state.documentData) {
  //       dispatch({ type: "CLEAR_ANALYSIS" });
  //     }
  //   };
  // }, [state.base64, state.documentData]);

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