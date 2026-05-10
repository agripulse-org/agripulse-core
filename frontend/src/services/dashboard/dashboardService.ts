import apiClient from "@/services/apiClient";
import type { DashboardResponse } from "./models";

export const getDashboard = async () => {
  return await apiClient.get<DashboardResponse>("api/dashboard").json();
};
