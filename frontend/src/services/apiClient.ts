import ky from "ky";
import { env } from "@/env";
import { getAuthToken } from "@/lib/tokenRegistry";

const apiClient = ky.create({
  baseUrl: env.VITE_API_BASE_URL,
  retry: 0,
  headers: {
    Accept: "application/json",
  },
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        const token = await getAuthToken();

        if (token && !request.headers.has("Authorization")) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ response }) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok && contentType === "application/problem+json") {
          const problem: ProblemDetails = await response.json();

          throw new APIError(
            problem.title || "Error",
            problem.detail || "An error occurred",
            problem.status || response.status,
            problem.type,
            problem.instance,
          );
        }

        return response;
      },
    ],
  },
});

export default apiClient;

export class APIError extends Error {
  public statusCode: number;
  public type?: string;
  public instance?: string;

  constructor(title: string, detail: string, statusCode: number, type?: string, instance?: string) {
    super(`${title}: ${detail}`);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.type = type;
    this.instance = instance;
  }
}

export interface ProblemDetails {
  type?: string; // URI reference to problem type
  title: string; // Short, human-readable summary of the problem
  status: number; // HTTP status code
  detail: string; // Human-readable explanation specific to this occurrence
  instance?: string; // URI reference to the specific occurrence
  [key: string]: any; // Extension members (optional)
}

export type PaginatedResponse<T> = { count: number; items: T[] };
