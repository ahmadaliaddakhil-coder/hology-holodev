import type {
  BmkgCanonicalEvidence,
  BmkgRawResponse,
  BmkgRawSlot,
} from './bmkg.types.js';

const DOCUMENTATION_URL = 'https://data.bmkg.go.id/prakiraan-cuaca/';

type NormalizeInput = {
  adm4: string;
  landId: string;
  decisionCaseId: string;
  fetchedAt: string;
  requestUri: string;
  rawPayloadRef?: string;
  isMock?: boolean;
  onNormalizationWarning?: (warning: string) => void;
};

const requiredString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`BMKG response missing valid ${field}`);
  }
  return value.trim();
};

const optionalNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const optionalString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const flattenSlots = (payload: BmkgRawResponse): BmkgRawSlot[] => {
  const slots: BmkgRawSlot[] = [];
  for (const group of payload.data ?? []) {
    if (!Array.isArray(group.cuaca)) continue;
    for (const slotGroup of group.cuaca) {
      if (!Array.isArray(slotGroup)) continue;
      for (const slot of slotGroup) {
        if (slot && typeof slot === 'object' && !Array.isArray(slot)) {
          slots.push(slot as BmkgRawSlot);
        }
      }
    }
  }
  return slots;
};

const toIsoUtc = (value: string, field: string): string => {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const withZone = /Z$|[+-]\d{2}:?\d{2}$/.test(normalized)
    ? normalized
    : `${normalized}Z`;
  const date = new Date(withZone);
  if (Number.isNaN(date.getTime())) throw new Error(`BMKG response has invalid ${field}`);
  return date.toISOString();
};

export const normalizeBmkgResponse = (
  payload: BmkgRawResponse,
  input: NormalizeInput,
): BmkgCanonicalEvidence => {
  const location = payload.lokasi;
  if (!location) throw new Error('BMKG response missing lokasi');

  const responseAdm4 = requiredString(location.adm4, 'lokasi.adm4');
  if (responseAdm4 !== input.adm4) {
    throw new Error('BMKG response adm4 does not match the requested adm4');
  }

  const rawSlots = flattenSlots(payload);
  const validSlots = rawSlots.filter(
    (slot) => typeof slot.utc_datetime === 'string'
      && typeof slot.local_datetime === 'string'
      && typeof slot.weather_desc === 'string'
      && slot.weather_desc.trim(),
  );
  const malformedSlotCount = rawSlots.length - validSlots.length;
  if (malformedSlotCount > 0) {
    input.onNormalizationWarning?.(
      `${malformedSlotCount} BMKG forecast slot(s) skipped during normalization`,
    );
  }
  if (validSlots.length === 0) throw new Error('BMKG response contains no usable forecast slots');

  const analysisTimes = [...new Set(validSlots.map((slot) =>
    toIsoUtc(requiredString(slot.analysis_date, 'analysis_date'), 'analysis_date')))];
  if (analysisTimes.length !== 1) {
    throw new Error('BMKG response contains mixed analysis_date values');
  }

  const slots = validSlots.map((slot) => ({
    target_time_utc: toIsoUtc(requiredString(slot.utc_datetime, 'utc_datetime'), 'utc_datetime'),
    target_time_local: requiredString(slot.local_datetime, 'local_datetime'),
    t: optionalNumber(slot.t),
    hu: optionalNumber(slot.hu),
    weather_desc: requiredString(slot.weather_desc, 'weather_desc'),
    weather_desc_en: optionalString(slot.weather_desc_en),
    ws: optionalNumber(slot.ws),
    wd: optionalString(slot.wd),
    tcc: optionalNumber(slot.tcc),
    vs_text: optionalString(slot.vs_text),
  })).sort((left, right) => left.target_time_utc.localeCompare(right.target_time_utc));

  const lat = typeof location.lat === 'number' ? location.lat : NaN;
  const lon = typeof location.lon === 'number' ? location.lon : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('BMKG response missing valid lokasi.lat/lon');
  }

  const analysisTime = analysisTimes[0];
  const evidenceId = `EVD-BMKG-${input.adm4}-${analysisTime.replace(/[-:]/g, '').replace('.000Z', 'Z')}`;
  const isMock = input.isMock ?? false;

  return {
    evidence_id: evidenceId,
    evidence_type: 'climate_external',
    land_ref: { land_id: input.landId },
    decision_case_ref: { decision_case_id: input.decisionCaseId },
    source: {
      category: isMock ? 'official_mock' : 'official',
      name: 'BMKG',
      attribution_required: true,
      documentation_url: DOCUMENTATION_URL,
    },
    provenance: {
      collection_mode: isMock ? 'fixture' : 'external_api',
      is_mock: isMock,
      fetched_at: toIsoUtc(input.fetchedAt, 'fetched_at'),
      request: { uri: input.requestUri },
      raw_payload_ref: input.rawPayloadRef ?? `bmkg://${input.adm4}/${analysisTime}`,
    },
    location: {
      administrative: {
        adm1: requiredString(location.adm1, 'lokasi.adm1'),
        adm2: requiredString(location.adm2, 'lokasi.adm2'),
        adm3: requiredString(location.adm3, 'lokasi.adm3'),
        adm4: responseAdm4,
        province: requiredString(location.provinsi, 'lokasi.provinsi'),
        regency: requiredString(location.kotkab, 'lokasi.kotkab'),
        district: requiredString(location.kecamatan, 'lokasi.kecamatan'),
        village: requiredString(location.desa, 'lokasi.desa'),
      },
      source_point: { lat, lon },
      timezone: requiredString(location.timezone, 'lokasi.timezone'),
    },
    temporal: {
      analysis_time: analysisTime,
      first_target_time: slots[0].target_time_utc,
      last_target_time: slots[slots.length - 1].target_time_utc,
    },
    quality: { level: 'unknown', basis: 'official_source_without_rembuktani_accuracy_calibration' },
    payload: { analysis_time: analysisTime, forecast_slots: slots },
  };
};
