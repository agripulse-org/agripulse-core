import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type { CreateSoilProfileRequest, UpdateSoilProfileRequest } from "@/services/soil-profile";
import { soilProfileService } from "@/services/soil-profile";

export const getSoilProfilesQueryOptions = () => {
  return queryOptions({
    queryKey: ["soil-profiles"],
    queryFn: () => soilProfileService.findAll(),
  });
};

export const getSoilProfileByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["soil-profiles", id],
    queryFn: () => soilProfileService.findById(id),
  });
};

type UseSoilProfileByIdOptions = {
  queryConfig?: QueryConfig<typeof getSoilProfileByIdQueryOptions>;
};

export const useSoilProfileById = (id: string, { queryConfig }: UseSoilProfileByIdOptions = {}) => {
  return useQuery({
    ...getSoilProfileByIdQueryOptions(id),
    ...queryConfig,
  });
};

export const useSoilProfiles = () => {
  return useQuery(getSoilProfilesQueryOptions());
};

export const useCreateSoilProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSoilProfileRequest) => soilProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-profiles"] });
    },
  });
};

export const useUpdateSoilProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSoilProfileRequest) => soilProfileService.update(data),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ["soil-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["soil-profiles", updatedProfile.id] });
    },
  });
};

export const useDeleteSoilProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => soilProfileService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-profiles"] });
    },
  });
};
