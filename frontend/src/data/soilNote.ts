import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import { soilNoteService } from "@/services/soil-note";
import type { FilterSoilNotesParams } from "@/services/soil-note";

export const getSoilNotesQueryOptions = (soilProfileId: string) => {
  return queryOptions({
    queryKey: ["soil-profiles", soilProfileId, "notes"],
    queryFn: () => soilNoteService.filter({ soilProfileId }),
  });
};

export const filterSoilNotesQueryOptions = (params?: FilterSoilNotesParams) => {
  return queryOptions({
    queryKey: ["soil-notes", params],
    queryFn: () => soilNoteService.filter(params),
  });
};

type UseSoilNotesOptions = {
  queryConfig?: QueryConfig<typeof getSoilNotesQueryOptions>;
};

type UseFilterSoilNotesOptions = {
  queryConfig?: QueryConfig<typeof filterSoilNotesQueryOptions>;
};

export const useSoilNotes = (soilProfileId: string, { queryConfig }: UseSoilNotesOptions = {}) => {
  return useQuery({
    ...getSoilNotesQueryOptions(soilProfileId),
    ...queryConfig,
  });
};

export const useFilterSoilNotes = (
  params?: FilterSoilNotesParams,
  { queryConfig }: UseFilterSoilNotesOptions = {},
) => {
  return useQuery({
    ...filterSoilNotesQueryOptions(params),
    ...queryConfig,
  });
};

export const useCreateSoilNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: soilNoteService.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["soil-profiles", res.soilProfile.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["soil-notes"] });
    },
  });
};

export const useUpdateSoilNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: soilNoteService.update,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["soil-profiles", res.soilProfile.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["soil-notes"] });
    },
  });
};

export const useDeleteSoilNote = (soilProfileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: soilNoteService.deleteById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-profiles", soilProfileId, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["soil-notes"] });
    },
  });
};
