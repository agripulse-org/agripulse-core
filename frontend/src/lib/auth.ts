export function getSafeRedirect(target?: string): string {
  if (!target) return "/";
  if (target.startsWith("/")) return target;
  return "/";
}

export function getClerkMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "errors" in error) {
    const first = (error as { errors?: { longMessage?: string; message?: string }[] }).errors?.[0];
    if (first) return first.longMessage ?? first.message ?? "Authentication failed";
  }
  if (error instanceof Error) return error.message;
  return "Authentication failed. Please try again.";
}
