import type { Adm4Verification } from './location.types.js';

const BMKG_ENDPOINT = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';

type BmkgSlot = {
  analysis_date?: string;
  utc_datetime?: string;
};

type BmkgResponse = {
  lokasi?: Record<string, unknown> & { adm4?: unknown };
  data?: Array<{ cuaca?: BmkgSlot[][] }>;
};

export class BmkgAdm4Verifier {
  public constructor(
    private readonly fetcher: typeof fetch = fetch,
    private readonly endpoint = BMKG_ENDPOINT,
  ) {}

  public async verify(adm4: string): Promise<Adm4Verification> {
    if (!/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm4)) {
      throw new Error('adm4 must use the BMKG format AA.BB.CC.DDDD');
    }

    const url = `${this.endpoint}?${new URLSearchParams({ adm4 })}`;
    let response: Response;
    try {
      response = await this.fetcher(url, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      });
    } catch (error: unknown) {
      throw new Error(
        `BMKG request failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (!response.ok) {
      throw new Error(`BMKG request failed with HTTP ${response.status}`);
    }

    const body = (await response.json()) as BmkgResponse;
    if (body.lokasi?.adm4 !== adm4) {
      throw new Error('BMKG response adm4 does not match the requested adm4');
    }

    const slots = (body.data ?? []).flatMap((group) =>
      (group.cuaca ?? []).flat(),
    );
    const validSlots = slots.filter(
      (slot) => typeof slot.utc_datetime === 'string' && slot.utc_datetime.trim(),
    );

    if (validSlots.length === 0) {
      throw new Error('BMKG response contains no usable forecast slots');
    }

    return {
      adm4,
      location: body.lokasi,
      forecastSlotCount: validSlots.length,
      analysisTimes: [
        ...new Set(
          validSlots
            .map((slot) => slot.analysis_date)
            .filter((value): value is string => Boolean(value)),
        ),
      ],
    };
  }
}
