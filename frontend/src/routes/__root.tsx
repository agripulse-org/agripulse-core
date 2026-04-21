import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { useDisableNumberInputScroll } from "@/hooks/use-disable-number-input-scroll";
import type { QueryClient } from "@tanstack/react-query";
import { PageLoader } from "@/components/layout/PageLoader";

interface MyRouterContext {
  queryClient: QueryClient;
  auth: {
    isLoaded: boolean;
    getToken: () => Promise<string | null>;
    isSignedIn: boolean;
    userId?: string;
  };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootDocument,
});

function RootDocument() {
  const { auth } = Route.useRouteContext();

  useDisableNumberInputScroll();

  return (
    <>
      <div className="h-screen font-sans antialiased wrap-anywhere">
        {auth.isLoaded ? <Outlet /> : <PageLoader />}
      </div>

      <TanStackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  );
}
