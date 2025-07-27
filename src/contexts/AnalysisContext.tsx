import { createContext } from "react";
import { AnalysisContextType } from "../types/analysis";

export const AnalysisContext = createContext<AnalysisContextType | null>(null);
