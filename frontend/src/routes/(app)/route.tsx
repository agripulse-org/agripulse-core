import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app/AppLayout";

export const Route = createFileRoute("/(app)")({
  component: AppLayout,
});
