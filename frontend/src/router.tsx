import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getContext } from "./integrations/tanstack-query/root-provider";
import { ErrorFallback } from "./components/layout/ErrorFallback";
import { PageLoader } from "./components/layout/PageLoader.tsx";

export function getRouter() {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context: {
      ...context,
      auth: {
        isLoaded: false,
        isSignedIn: false,
        getToken: async () => null,
      },
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorFallback,
    defaultPendingComponent: PageLoader,
    defaultPendingMs: 500,
    defaultStructuralSharing: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
