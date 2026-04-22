import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ThemeProvider } from "./providers/theme-provider";
import { ToastProvider } from "./providers/toast-provider";
import { LanguageProvider } from "./providers/language-provider";
import { getRouter } from "./router";
import * as TanStackQueryIntegration from "./integrations/tanstack-query/root-provider";
import { setAuthTokenGetter } from "./lib/tokenRegistry";
import { env } from "./env";
import "./styles/index.css";

const router = getRouter();

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryIntegration.Provider>
        <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
          <LanguageProvider>
            <ThemeProvider>
              <AppRouter />
              <ToastProvider />
            </ThemeProvider>
          </LanguageProvider>
        </ClerkProvider>
      </TanStackQueryIntegration.Provider>
    </StrictMode>,
  );
}

function AppRouter() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    setAuthTokenGetter(getToken);
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isLoaded,
          getToken,
          isSignedIn: Boolean(isSignedIn),
          userId: userId ?? undefined,
        },
      }}
    />
  );
}
