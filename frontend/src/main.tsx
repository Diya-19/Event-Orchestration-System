import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// TypeScript may not have a declaration for CSS imports in this project setup.
// Suppress the module-not-found type error for this side-effect import.
// @ts-ignore
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);