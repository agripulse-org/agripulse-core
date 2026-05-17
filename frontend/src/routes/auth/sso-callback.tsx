import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { PageLoader } from "@/components/layout/PageLoader";

export const Route = createFileRoute("/auth/sso-callback")({
  component: SsoCallback,
});

function SsoCallback() {
  return (
    <>
      <PageLoader className="min-h-50" />
      <AuthenticateWithRedirectCallback />
    </>
  );
}
