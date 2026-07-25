import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ─── Global Styles ────────────────────────────────────────────────────

const style = document.createElement("style");
style.textContent = `
  :root {
    --bg-primary: #0f0f11;
    --bg-secondary: #1a1a1e;
    --bg-tertiary: #242428;
    --bg-hover: #2d2d32;
    --border-color: #2e2e34;
    --border-focus: #6366f1;
    --text-primary: #e4e4e7;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    --accent: #6366f1;
    --accent-hover: #818cf8;
    --accent-bg: rgba(99, 102, 241, 0.12);
    --success: #22c55e;
    --error: #ef4444;
    --warning: #f59e0b;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.5);
    --transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--bg-tertiary) transparent;
  }

  input, button, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
