import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MotionConfig
          reducedMotion="user"
          viewport={{ once: true, amount: 0.2 }}
        >
          <App />
        </MotionConfig>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);