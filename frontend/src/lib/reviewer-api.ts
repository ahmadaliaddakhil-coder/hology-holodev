import { apiFetch } from "./auth";

export interface ApiPendingReview {
  review_id: string;
  case_id: string;
  land_name: string;
  farmer_name: string;
  location: string;
  crop_name: string;
  growth_stage: string;
  decision_type: string;
  submitted_at: string;
  evidence: {
    bmkg: { condition: string; temp: number; text: string } | null;
    field_pulse: { condition: string; text: string } | null;
  };
}

export interface ApiCompletedReview {
  review_id: string;
  land_name: string;
  farmer_name: string;
  village: string;
  status: string;
  comment: string;
  responded_at: string;
}

export interface ApiReviewerDashboard {
  reviewer_name: string;
  region: string;
  weather: { condition: string; temp: number; text: string } | null;
  stats: {
    pending_count: number;
    urgent_count: number;
  };
  pending_reviews: ApiPendingReview[];
  completed_reviews: ApiCompletedReview[];
}

export const reviewerApi = {
  getDashboard: () => apiFetch<ApiReviewerDashboard>("/reviewer/dashboard"),
};