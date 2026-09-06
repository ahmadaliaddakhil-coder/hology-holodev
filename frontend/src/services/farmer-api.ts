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

export type ApiDecisionCase = {
  id: string;
  land_id: string;
  crop_context_id: string;
  decision_type: string;
  status: "draft" | "collecting_evidence" | "assessed" | "review_pending" | "ready_for_decision" | "decided";
  created_at: string;
  updated_at: string;
  closed_at?: string;
  land?: ApiLand;
};

export type ApiEvidence = {
  id: string;
  decision_case_id: string;
  type: "bmkg_forecast" | "field_pulse" | "crop_context" | "external" | "user_input";
  source?: string;
  payload: Record<string, unknown>;
  observed_at?: string;
  collected_at: string;
  freshness_status?: "fresh" | "stale" | "expired";
  quality_status?: "high" | "medium" | "low" | "uncertain";
  is_mock: boolean;
};

export type ApiDecisionRecord = {
  id: string;
  decision_case_id: string;
  decision_text: string;
  reason?: string;
  authority?: "human";
  is_mock?: boolean;
  created_at: string;
};
export type ApiDecisionRecordContext = ApiDecisionRecord & {
  decision_case?: ApiDecisionCase;
  assessment?: { summary?: string; basis_strength?: string; factors?: string[]; limitations?: string[] };
  evidence?: { evidence?: ApiEvidence }[];
  brief?: { id: string; content: string } | { id: string; content: string }[];
};

export type ApiAssessment = {
  id: string;
  decision_case_id: string;
  summary: string;
  basis_strength?: string;
  factors?: string[];
  missing_evidence?: string[];
  limitations?: string[];
  rule_version?: string;
};

export type ApiActionOption = { id: string; title: string; description?: string; rationale?: string; display_order: number };
export type ApiAssessmentResult = { assessment: ApiAssessment; options: ApiActionOption[]; reasoning?: Record<string, unknown> };

export type ApiProfile = {
  id: string;
  user_id: string;
  display_name: string;
  role: "farmer" | "reviewer";
  avatar_url?: string;
  email?: string;
  phone?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
};

export const farmerApi = {
  getProfile: () => apiFetch<ApiProfile>("/profile"),
  listLands: () => apiFetch<ApiLand[]>("/lands"),
  getLand: (landId: string) => apiFetch<ApiLand>(`/lands/${landId}`),
  createLand: (payload: CreateLandPayload) => apiFetch<ApiLand>("/lands", { method: "POST", body: JSON.stringify(payload) }),
  archiveLand: (landId: string) => apiFetch<ApiLand>(`/lands/${landId}`, { method: "DELETE" }),
  getActiveCrop: (landId: string) => apiFetch<ApiCropContext>(`/lands/${landId}/crop-context`),
  createCrop: (landId: string, payload: { crop_name: string; variety_name?: string; growth_stage: ApiCropContext["growth_stage"]; planting_date?: string }) =>
    apiFetch<ApiCropContext>(`/lands/${landId}/crops`, { method: "POST", body: JSON.stringify(payload) }),
  listDecisionCases: () => apiFetch<ApiDecisionCase[]>("/decision-cases"),
  createDecisionCase: (payload: { land_id: string; crop_context_id: string; decision_type: string }) =>
    apiFetch<ApiDecisionCase>("/decision-cases", { method: "POST", body: JSON.stringify(payload) }),
  refreshBmkg: (caseId: string) => apiFetch<{ evidence: ApiEvidence; delivery: "live" | "cached" }>(`/decision-cases/${caseId}/bmkg/refresh`, { method: "POST" }),
  createFieldPulse: (caseId: string, payload: { water_presence: string; irrigation_flow: string; reported_by?: string; observed_at?: string; is_mock?: boolean }) =>
    apiFetch<ApiEvidence>(`/decision-cases/${caseId}/field-pulse`, { method: "POST", body: JSON.stringify(payload) }),
  assess: (caseId: string) => apiFetch<ApiAssessmentResult>(`/decision-cases/${caseId}/assess`, { method: "POST" }),
  getAssessment: (caseId: string) => apiFetch<ApiAssessmentResult>(`/decision-cases/${caseId}/assessment`),
  listDecisionRecords: () => apiFetch<ApiDecisionRecord[]>("/decision-records"),
  getDecisionRecord: (recordId: string) => apiFetch<ApiDecisionRecordContext>(`/decision-records/${recordId}`),
  listEvidence: (decisionCaseId: string) => apiFetch<ApiEvidence[]>(`/decision-cases/${decisionCaseId}/evidence`),
};
