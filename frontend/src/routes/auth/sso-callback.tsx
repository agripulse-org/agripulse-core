import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sso-callback")({
  component: AuthenticateWithRedirectCallback,
});
