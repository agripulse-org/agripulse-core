import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient();

  return {
    queryClient,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  const context = getContext();
  return <QueryClientProvider client={context.queryClient}>{children}</QueryClientProvider>;
}
