import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./providers/theme-provider";
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
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </TanStackQueryIntegration.Provider>
    </StrictMode>,
  );
}
