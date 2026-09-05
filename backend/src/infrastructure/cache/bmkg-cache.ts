import type { BmkgRawResponse } from '../bmkg/bmkg.types.js';

type CachedBmkgResponse = {
  adm4: string;
  rawPayload: BmkgRawResponse;
  fetchedAt: string;
  requestUri: string;
};

export class BmkgCache {
  private readonly entries = new Map<string, CachedBmkgResponse>();

  public get(adm4: string): CachedBmkgResponse | undefined {
    return this.entries.get(adm4);
  }

  public set(entry: CachedBmkgResponse): void {
    this.entries.set(entry.adm4, entry);
  }
}
