import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app/AppLayout";

export const Route = createFileRoute("/(app)")({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isLoaded && !context.auth.isSignedIn) {
      throw redirect({
        to: "/auth/login",
        search: location.href === "/" ? undefined : { redirect: location.href },
      });
    }
  },
  component: AppLayout,
});
