import assert from 'node:assert/strict';
import test from 'node:test';
import { BmkgAdapter } from '../../src/infrastructure/bmkg/bmkg-adapter.js';
import { BmkgClient } from '../../src/infrastructure/bmkg/bmkg-client.js';
import { normalizeBmkgResponse } from '../../src/infrastructure/bmkg/bmkg-normalizer.js';
import type { BmkgRawResponse } from '../../src/infrastructure/bmkg/bmkg.types.js';
import { BmkgCache } from '../../src/infrastructure/cache/bmkg-cache.js';

const adm4 = '35.07.13.1010';

const response = (payload: BmkgRawResponse, ok = true, status = 200): Response => ({
  ok,
  status,
  json: async () => payload,
} as Response);

const payload = (): BmkgRawResponse => ({
  lokasi: {
    adm1: '35',
    adm2: '35.07',
    adm3: '35.07.13',
    adm4,
    provinsi: 'Jawa Timur',
    kotkab: 'Malang',
    kecamatan: 'Kepanjen',
    desa: 'Kepanjen',
    lat: -8.1311244268,
    lon: 112.567944687,
    timezone: 'Asia/Jakarta',
  },
  data: [{
    cuaca: [[{
      analysis_date: '2026-09-04T00:00:00',
      utc_datetime: '2026-09-04 03:00:00',
      local_datetime: '2026-09-04 10:00:00',
      weather_desc: 'Cerah',
      weather_desc_en: 'Sunny',
      t: 30,
      hu: 70,
      ws: 5,
      wd: 'E',
      tcc: 20,
      vs_text: '> 10 km',
    }]],
  }],
});

test('normalizes documented BMKG fields and flattens forecast groups', async () => {
  const evidence = normalizeBmkgResponse(payload(), {
    adm4,
    landId: 'LAND-001',
    decisionCaseId: 'CASE-001',
    fetchedAt: '2026-09-04T08:05:00Z',
    requestUri: `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`,
  });

  assert.equal(evidence.evidence_type, 'climate_external');
  assert.equal(evidence.provenance.is_mock, false);
  assert.equal(evidence.location.administrative.adm4, adm4);
  assert.equal(evidence.payload.forecast_slots.length, 1);
  assert.equal(evidence.payload.forecast_slots[0].weather_desc, 'Cerah');
});

test('uses cached raw response when live BMKG is unavailable', async () => {
  const cache = new BmkgCache();
  const liveClient = new BmkgClient(async () => response(payload()), undefined, 100, 1);
  const liveAdapter = new BmkgAdapter(liveClient, cache, () => new Date('2026-09-04T08:05:00Z'));
  const liveResult = await liveAdapter.getEvidence(adm4, 'LAND-001', 'CASE-001');
  assert.equal(liveResult.delivery, 'live');

  const unavailableClient = new BmkgClient(async () => {
    throw new Error('network unavailable');
  }, undefined, 100, 1);
  const cachedAdapter = new BmkgAdapter(unavailableClient, cache);
  const cachedResult = await cachedAdapter.getEvidence(adm4, 'LAND-001', 'CASE-001');

  assert.equal(cachedResult.delivery, 'cached');
  assert.equal(cachedResult.evidence.provenance.fetched_at, '2026-09-04T08:05:00.000Z');
  assert.equal(cachedResult.evidence.provenance.is_mock, false);
});

test('fails when BMKG is unavailable and no cache exists', async () => {
  const client = new BmkgClient(async () => {
    throw new Error('network unavailable');
  }, undefined, 100, 1);
  const adapter = new BmkgAdapter(client, new BmkgCache());

  await assert.rejects(
    adapter.getEvidence(adm4, 'LAND-001', 'CASE-001'),
    /BMKG unavailable and no cache exists/,
  );
});

test('rejects mixed analysis dates instead of silently combining them', () => {
  const mixed = payload();
  const firstGroup = mixed.data?.[0]?.cuaca?.[0];
  firstGroup?.push({
    analysis_date: '2026-09-04T12:00:00',
    utc_datetime: '2026-09-04 06:00:00',
    local_datetime: '2026-09-04 13:00:00',
    weather_desc: 'Hujan Ringan',
  });

  assert.throws(
    () => normalizeBmkgResponse(mixed, {
      adm4,
      landId: 'LAND-001',
      decisionCaseId: 'CASE-001',
      fetchedAt: '2026-09-04T08:05:00Z',
      requestUri: 'https://example.test/bmkg',
    }),
    /mixed analysis_date/,
  );
});

test('records malformed forecast slots without inventing values', () => {
  const malformed = payload();
  malformed.data?.[0]?.cuaca?.[0]?.push({ weather_desc: 'slot tanpa waktu' });
  const warnings: string[] = [];

  const evidence = normalizeBmkgResponse(malformed, {
    adm4,
    landId: 'LAND-001',
    decisionCaseId: 'CASE-001',
    fetchedAt: '2026-09-04T08:05:00Z',
    requestUri: 'https://example.test/bmkg',
    onNormalizationWarning: (warning) => warnings.push(warning),
  });

  assert.equal(evidence.payload.forecast_slots.length, 1);
  assert.deepEqual(warnings, ['1 BMKG forecast slot(s) skipped during normalization']);
});
