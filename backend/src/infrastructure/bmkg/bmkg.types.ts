export type BmkgRawSlot = {
  utc_datetime?: unknown;
  local_datetime?: unknown;
  analysis_date?: unknown;
  t?: unknown;
  hu?: unknown;
  weather_desc?: unknown;
  weather_desc_en?: unknown;
  ws?: unknown;
  wd?: unknown;
  tcc?: unknown;
  vs_text?: unknown;
  [key: string]: unknown;
};

export type BmkgRawResponse = {
  lokasi?: {
    adm1?: unknown;
    adm2?: unknown;
    adm3?: unknown;
    adm4?: unknown;
    provinsi?: unknown;
    kotkab?: unknown;
    kecamatan?: unknown;
    desa?: unknown;
    lat?: unknown;
    lon?: unknown;
    timezone?: unknown;
    [key: string]: unknown;
  };
  data?: Array<{
    lokasi?: { adm4?: unknown; timezone?: unknown };
    cuaca?: unknown;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export type BmkgDelivery = 'live' | 'cached';

export type BmkgCanonicalEvidence = {
  evidence_id: string;
  evidence_type: 'climate_external';
  land_ref: { land_id: string };
  decision_case_ref: { decision_case_id: string };
  source: {
    category: 'official' | 'official_mock';
    name: 'BMKG';
    attribution_required: true;
    documentation_url: string;
  };
  provenance: {
    collection_mode: 'external_api' | 'fixture';
    is_mock: boolean;
    fetched_at: string;
    request: { uri: string };
    raw_payload_ref: string;
  };
  location: {
    administrative: {
      adm1: string;
      adm2: string;
      adm3: string;
      adm4: string;
      province: string;
      regency: string;
      district: string;
      village: string;
    };
    source_point: { lat: number; lon: number };
    timezone: string;
  };
  temporal: {
    analysis_time: string;
    first_target_time: string;
    last_target_time: string;
  };
  quality: { level: 'unknown'; basis: string };
  payload: {
    analysis_time: string;
    forecast_slots: Array<{
      target_time_utc: string;
      target_time_local: string;
      t: number | null;
      hu: number | null;
      weather_desc: string;
      weather_desc_en: string | null;
      ws: number | null;
      wd: string | null;
      tcc: number | null;
      vs_text: string | null;
    }>;
  };
};

export type BmkgFetchResult = {
  evidence: BmkgCanonicalEvidence;
  rawPayload: BmkgRawResponse;
  delivery: BmkgDelivery;
  fetchedAt: string;
  normalizationWarnings: string[];
};
