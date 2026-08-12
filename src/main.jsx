import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App";
import { AdminProvider } from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <Toaster position="top-right" />
      <App />
    </AdminProvider>
  </StrictMode>
);