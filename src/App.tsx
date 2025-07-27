import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage.tsx";
import NewDashboardPage from "./pages/NewDashboardPage";
import theme from "../theme.ts";
import { ThemeProvider } from "@mui/material";
import { UserManagementPage } from "./pages/UserManagementPage/UserManagementPage.tsx";

import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Layout from "./components/Layout.tsx";
import AnalyzeHomePage from "./pages/AnalyzeHomePage/AnalyzeHomePage.tsx";
import AnalysisResultsPage from "./pages/AnalyzeResultsPage/AnalyzeResultsPage.tsx";
import { AnalysisProvider } from "./providers/AnalysisProvider.tsx";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AnalysisProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/unauthorised" element={<ErrorPage />} />

          {/* Protected Routes for Authenticated Users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Layout>
                  <AnalyzeHomePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analyze/results"
            element={
              <ProtectedRoute>
                <Layout>
                  <AnalysisResultsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for Managers Only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["organisation-admin"]}>
                <Layout>
                  <UserManagementPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnalysisProvider>
    </ThemeProvider>
  );
};

export default App;