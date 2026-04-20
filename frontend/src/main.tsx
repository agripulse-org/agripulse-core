import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./providers/theme-provider";
import { ToastProvider } from "./providers/toast-provider";
import { LanguageProvider } from "./providers/language-provider";
import { getRouter } from "./router";
import * as TanStackQueryIntegration from "./integrations/tanstack-query/root-provider";
import "./styles/index.css";

const router = getRouter();

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryIntegration.Provider>
        <LanguageProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
            <ToastProvider />
          </ThemeProvider>
        </LanguageProvider>
      </TanStackQueryIntegration.Provider>
    </StrictMode>,
  );
}
