import { useContext } from "react";
import { AnalysisContext } from "../contexts/AnalysisContext";

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }

  return context;
};
// Optional: Create specific selectors for better performance
export const useAnalysisState = () => {
  const { state } = useAnalysis();
  return state;
};

export const useAnalysisActions = () => {
  const { actions } = useAnalysis();
  return actions;
};
