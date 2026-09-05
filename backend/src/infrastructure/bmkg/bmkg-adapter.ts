import { BmkgCache } from '../cache/bmkg-cache.js';
import { BmkgClient } from './bmkg-client.js';
import { normalizeBmkgResponse } from './bmkg-normalizer.js';
import type { BmkgFetchResult } from './bmkg.types.js';

type BmkgCachePort = {
  get(adm4: string): CachedBmkgResponse | undefined | Promise<CachedBmkgResponse | undefined>;
  set(entry: CachedBmkgResponse): void | Promise<void>;
};

type CachedBmkgResponse = {
  adm4: string;
  rawPayload: import('./bmkg.types.js').BmkgRawResponse;
  fetchedAt: string;
  requestUri: string;
};

export class BmkgAdapter {
  public constructor(
    private readonly client = new BmkgClient(),
    private readonly cache: BmkgCachePort = new BmkgCache(),
    private readonly clock: () => Date = () => new Date(),
  ) {}

  public async getEvidence(
    adm4: string,
    landId: string,
    decisionCaseId: string,
  ): Promise<BmkgFetchResult> {
    const fetchedAt = this.clock().toISOString();
    const liveWarnings: string[] = [];

    try {
      const live = await this.client.fetchForecast(adm4);
      const evidence = normalizeBmkgResponse(live.payload, {
        adm4,
        landId,
        decisionCaseId,
        fetchedAt,
        requestUri: live.requestUri,
        onNormalizationWarning: (warning) => liveWarnings.push(warning),
      });

      await this.cache.set({
        adm4,
        rawPayload: live.payload,
        fetchedAt,
        requestUri: live.requestUri,
      });

      return {
        evidence,
        rawPayload: live.payload,
        delivery: 'live',
        fetchedAt,
        normalizationWarnings: liveWarnings,
      };
    } catch (liveError: unknown) {
      const cached = await this.cache.get(adm4);
      if (!cached) {
        throw new Error(
          `BMKG unavailable and no cache exists: ${liveError instanceof Error ? liveError.message : String(liveError)}`,
        );
      }

      const cachedWarnings: string[] = [];
      const evidence = normalizeBmkgResponse(cached.rawPayload, {
        adm4,
        landId,
        decisionCaseId,
        fetchedAt: cached.fetchedAt,
        requestUri: cached.requestUri,
        onNormalizationWarning: (warning) => cachedWarnings.push(warning),
      });

      return {
        evidence,
        rawPayload: cached.rawPayload,
        delivery: 'cached',
        fetchedAt: cached.fetchedAt,
        normalizationWarnings: cachedWarnings,
      };
    }
  }
}
