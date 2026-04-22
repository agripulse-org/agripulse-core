import apiClient from "@/services/apiClient";
import type {
  CreateSoilProfileRequest,
  SoilProfileResponse,
  UpdateSoilProfileRequest,
} from "./models";

export const findAll = async () => {
  return await apiClient.get<SoilProfileResponse[]>("api/soil-profiles").json();
};

export const findById = async (id: string) => {
  return await apiClient.get<SoilProfileResponse>(`api/soil-profiles/${id}`).json();
};

export const create = async (data: CreateSoilProfileRequest) => {
  return await apiClient.post<SoilProfileResponse>("api/soil-profiles", { json: data }).json();
};

export const update = async (data: UpdateSoilProfileRequest) => {
  return await apiClient
    .patch<SoilProfileResponse>(`api/soil-profiles/${data.id}`, { json: data })
    .json();
};

export const deleteById = async (id: string) => {
  await apiClient.delete(`api/soil-profiles/${id}`);
};
