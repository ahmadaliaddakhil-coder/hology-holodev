import { apiFetch } from "../lib/auth";

export type ApiLand = {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
  adm4_code?: string;
  location_source?: string;
  created_at: string;
  updated_at: string;
  crop_contexts?: ApiCropContext[];
  active_crop?: ApiCropContext[] | ApiCropContext;
};

export type ApiCropContext = {
  id: string;
  land_id: string;
  crop_name: string;
  variety_name?: string;
  growth_stage: "vegetative" | "flowering" | "ripening" | "unknown";
  planting_date?: string;
  is_active: boolean;
  created_at: string;
};

export type CreateLandPayload = Pick<ApiLand, "name" | "latitude" | "longitude"> &
  Partial<Pick<ApiLand, "description" | "province" | "regency" | "district" | "village" | "adm4_code" | "location_source">>;

export const farmerApi = {
  listLands: () => apiFetch<ApiLand[]>("/lands"),
  getLand: (landId: string) => apiFetch<ApiLand>(`/lands/${landId}`),
  createLand: (payload: CreateLandPayload) => apiFetch<ApiLand>("/lands", { method: "POST", body: JSON.stringify(payload) }),
  archiveLand: (landId: string) => apiFetch<ApiLand>(`/lands/${landId}`, { method: "DELETE" }),
  getActiveCrop: (landId: string) => apiFetch<ApiCropContext>(`/lands/${landId}/crop-context`),
  createCrop: (landId: string, payload: { crop_name: string; variety_name?: string; growth_stage: ApiCropContext["growth_stage"]; planting_date?: string }) =>
    apiFetch<ApiCropContext>(`/lands/${landId}/crops`, { method: "POST", body: JSON.stringify(payload) }),
};
