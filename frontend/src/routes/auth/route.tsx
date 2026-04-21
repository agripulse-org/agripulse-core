import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";
import { getSafeRedirect } from "@/lib/auth";
import { z } from "zod";

const authSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: authSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (!context.auth.isLoaded) return;

    if (context.auth.isSignedIn) {
      throw redirect({ to: getSafeRedirect(search.redirect), replace: true });
    }
  },
  component: AuthLayout,
});
