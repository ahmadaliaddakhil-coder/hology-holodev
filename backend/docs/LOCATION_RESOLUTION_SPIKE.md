# Location Resolution Spike

**Task:** Full-stack Task 5 — Location -> BMKG `adm4`
**Status:** Spike implementation, not production resolver

## Decision

The spike uses two explicit steps:

```text
lat/lon
  -> BIG boundary query
  -> boundary candidate (village/district labels + provider attributes)

explicit adm4 candidate
  -> BMKG Public Forecast API
  -> response identity verification + usable forecast slots
```

The BIG response is **not** treated as a BMKG `adm4` mapping. The output keeps
`mappingVerified: false` until a verified crosswalk is available. This prevents a
boundary-service field or village name from being silently guessed as `adm4`.

## Sources

- BIG boundary service:
  `https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0/query`
- BMKG forecast API:
  `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={adm4}`

## Run

From `backend/`:

```text
npm run spike:location
```

Default spike input:

```text
lat=-6.1647214778
lon=106.8453837867
adm4=31.71.03.1001
```

Custom coordinates and an explicitly supplied BMKG code:

```text
npm run spike:location -- --lat -8.1283 --lon 112.5721 --adm4 35.73.05.1001
```

The command prints:

- BIG boundary attributes and best-effort administrative labels;
- the BMKG location response for the supplied `adm4`;
- number of usable flattened forecast slots;
- analysis times found in those slots;
- `mappingVerified: false`.

## Acceptance evidence

A successful run proves that:

1. the coordinate is accepted and queried against BIG;
2. the supplied `adm4` is accepted by BMKG;
3. BMKG returns the same `lokasi.adm4` that was requested;
4. nested `data[].cuaca[][]` groups can be flattened without assuming a fixed
   number of inner arrays;
5. at least one forecast slot is usable.

It does **not** prove that BIG's returned feature is the BMKG administrative
record. That requires a separate verified crosswalk and should be tested with
multiple known locations before this becomes a production resolver.

## Limitations and fallback

- BIG may return no feature, multiple candidates, incomplete attributes, or a
  boundary that does not represent the exact land point.
- The current spike accepts coordinates only. Name/geocoding input remains a
  later adapter and must preserve the same explicit verification step.
- BMKG availability is checked, but caching and retry policy belong to Task 6.
- No `adm4` is inferred from BIG attributes, labels, or string similarity.
- If resolution or BMKG verification fails, the case should remain without live
  external evidence. Task 6 may select valid cache or demo fixture according to
  environment policy; it must not fabricate a live response.

## Files

- `src/infrastructure/location/location.types.ts`
- `src/infrastructure/location/big-boundary-client.ts`
- `src/infrastructure/location/bmkg-adm4-verifier.ts`
- `src/infrastructure/location/location-resolution-spike.ts`
