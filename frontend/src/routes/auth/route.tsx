import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});
