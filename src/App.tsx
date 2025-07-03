import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage.tsx";
import NewDashboardPage from "./pages/NewDashboardPage";
import theme from "../theme.ts";
import { ThemeProvider } from "@mui/material";
import { UserManagementPage } from "./pages/UserManagementPage/UserManagementPage.tsx";

import ProtectedRoute from "./components/ProtectedRoute.tsx"; // ✅ Import ProtectedRoute
import Layout from "./components/Layout.tsx";
import AnalyzeHomePage from "./pages/AnalyzeHomePage/AnalyzeHomePage.tsx";
import { AnalysisProvider } from "./providers/AnalysisProvider.tsx";

const App: React.FC = () => {
  //update
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* Public Routes  e*/}
        <Route path="/" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/unauthorised" element={<ErrorPage />} />

        {/* Protected for Authenticated Users */}
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
                <AnalysisProvider>
                  <AnalyzeHomePage />
                </AnalysisProvider>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected for Managers Only */}
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
    </ThemeProvider>
  );
};

export default App;
