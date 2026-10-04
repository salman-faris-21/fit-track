import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./components/Signup";
import CallPage from "./pages/callPage";
import GenerateProgramPage from "./pages/Generate-program";
import RagBotPage from "./pages/RagBot";
import TestVapiSDKCall from "./pages/button";
import DashboardPage from "./pages/Dashboard.jsx";

import ProtectedRoute from "./Routes/protect.jsx";
import "./index.css";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#020617",
            color: "#e5e7eb",
            border: "1px solid #1e293b",
          },
        }}
      />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/callpage"
            element={
              <ProtectedRoute>
                <CallPage />
              </ProtectedRoute>
            }
          />

          <Route path="/button" element={<TestVapiSDKCall />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rag"
            element={
              <ProtectedRoute>
                <RagBotPage />
              </ProtectedRoute>
            }
          />

          <Route path="/generate-program" element={<GenerateProgramPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
