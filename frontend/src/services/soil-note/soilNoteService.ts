import apiClient from "@/services/apiClient";
import type {
  CreateSoilNoteRequest,
  FilterSoilNotesParams,
  SoilNoteResponse,
  UpdateSoilNoteRequest,
} from "./models";

export const filter = async (params?: FilterSoilNotesParams) => {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.soilProfileId) searchParams.set("soilProfileId", params.soilProfileId);

  return await apiClient.get<SoilNoteResponse[]>(`api/soil-notes`, { searchParams }).json();
};

export const findById = async (noteId: string) => {
  return await apiClient.get<SoilNoteResponse>(`api/soil-notes/${noteId}`).json();
};

export const create = async (data: CreateSoilNoteRequest) => {
  return await apiClient.post<SoilNoteResponse>(`api/soil-notes`, { json: data }).json();
};

export const update = async (data: UpdateSoilNoteRequest) => {
  const { soilProfileId, noteId, ...body } = data;
  return await apiClient.patch<SoilNoteResponse>(`api/soil-notes/${noteId}`, { json: body }).json();
};

export const deleteById = async (noteId: string) => {
  await apiClient.delete(`api/soil-notes/${noteId}`);
};
