import { queryOptions, useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

export const getDashboardQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboard(),
  });
};

export const useDashboard = () => {
  return useQuery(getDashboardQueryOptions());
};
