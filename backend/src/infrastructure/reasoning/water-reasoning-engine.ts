import type {
  FieldPulseEvidence,
  ReasoningAssessment,
  ReasoningInput,
} from './reasoning.types.js';

const validObservedAt = (value: string | undefined, evaluatedAt: string): boolean => {
  if (!value) return false;
  const observed = Date.parse(value);
  const evaluated = Date.parse(evaluatedAt);
  return Number.isFinite(observed) && Number.isFinite(evaluated) && observed <= evaluated;
};

const isCompletePulse = (pulse: FieldPulseEvidence | undefined, evaluatedAt: string): boolean =>
  Boolean(
    pulse
      && pulse.waterPresence
      && pulse.irrigationFlow
      && pulse.waterPresence !== 'unknown'
      && pulse.irrigationFlow !== 'unknown'
      && validObservedAt(pulse.observedAt, evaluatedAt),
  );

const isPartialPulse = (pulse: FieldPulseEvidence | undefined, evaluatedAt: string): boolean => {
  if (!pulse || !validObservedAt(pulse.observedAt, evaluatedAt)) return false;
  const knownWater = pulse.waterPresence !== undefined && pulse.waterPresence !== 'unknown';
  const knownFlow = pulse.irrigationFlow !== undefined && pulse.irrigationFlow !== 'unknown';
  return knownWater !== knownFlow;
};

const forecastDescription = (input: ReasoningInput): string | undefined =>
  input.bmkg?.evidence.payload.forecast_slots[0]?.weather_desc;

export class WaterReasoningEngine {
  public evaluate(input: ReasoningInput): ReasoningAssessment {
    if (!Date.parse(input.evaluatedAt)) {
      throw new Error('evaluatedAt must be an ISO timestamp');
    }

    const hasBmkg = Boolean(input.bmkg);
    const completePulse = isCompletePulse(input.fieldPulse, input.evaluatedAt);
    const partialPulse = isPartialPulse(input.fieldPulse, input.evaluatedAt);
    const factorItems: Array<{ code: string; evidenceId: string }> = [];
    const factors: string[] = [];
    const missingEvidence: string[] = [];
    const limitations = ['weather_not_local_water_state', 'no_agronomic_thresholds'];
    const limitationCodes = [...limitations];
    const unknownItems: Array<{ code: string; required: boolean }> = [];

    if (input.bmkg) {
      factorItems.push({ code: 'bmkg_forecast_available', evidenceId: input.bmkg.evidenceId });
      factors.push(`BMKG forecast: ${forecastDescription(input) ?? 'description unavailable'}`);
    } else {
      missingEvidence.push('bmkg_forecast');
    }

    if (input.fieldPulse) {
      if (input.fieldPulse.waterPresence && input.fieldPulse.waterPresence !== 'unknown') {
        factorItems.push({ code: 'field_water_observed', evidenceId: input.fieldPulse.evidenceId });
        factors.push(`Field Pulse water presence: ${input.fieldPulse.waterPresence}`);
      } else {
        unknownItems.push({ code: 'water_presence_unknown', required: true });
      }
      if (input.fieldPulse.irrigationFlow && input.fieldPulse.irrigationFlow !== 'unknown') {
        factorItems.push({ code: 'irrigation_flow_observed', evidenceId: input.fieldPulse.evidenceId });
        factors.push(`Field Pulse irrigation flow: ${input.fieldPulse.irrigationFlow}`);
      } else {
        unknownItems.push({ code: 'irrigation_flow_unknown', required: true });
      }
      if (!validObservedAt(input.fieldPulse.observedAt, input.evaluatedAt)) {
        missingEvidence.push('current_field_pulse');
      }
    } else {
      missingEvidence.push('field_pulse');
    }

    let contextState: ReasoningAssessment['contextState'];
    let confidence: ReasoningAssessment['confidence'];
    let basisCodes: string[];
    let optionSet: ReasoningAssessment['actionOptions'];

    if (!hasBmkg || !input.fieldPulse || !validObservedAt(input.fieldPulse.observedAt, input.evaluatedAt)) {
      contextState = 'insufficient_evidence';
      confidence = 'low';
      basisCodes = hasBmkg ? ['bmkg_current'] : [];
      optionSet = [
        {
          optionId: 'OPT-COLLECT-EVIDENCE',
          title: 'Lengkapi observasi lapangan',
          description: 'Periksa kondisi air di petak dan aliran irigasi sebelum mengambil keputusan.',
          rationale: 'Bukti lapangan atau prakiraan BMKG belum lengkap untuk penilaian konteks.',
        },
      ];
    } else if (!completePulse || partialPulse) {
      contextState = 'needs_verification';
      confidence = 'low';
      basisCodes = hasBmkg ? ['bmkg_current', 'field_partial'] : ['field_partial'];
      optionSet = [
        {
          optionId: 'OPT-VERIFY-WATER',
          title: 'Verifikasi kondisi air',
          description: 'Lakukan pengecekan langsung pada informasi Field Pulse yang belum pasti.',
          rationale: 'Sebagian observasi lapangan masih unknown atau belum lengkap.',
        },
        {
          optionId: 'OPT-CONSULT-TRUSTED-REVIEWER',
          title: 'Minta tinjauan pihak tepercaya',
          description: 'Bagikan konteks dan bukti yang tersedia untuk ditinjau.',
          rationale: 'Tinjauan tambahan dapat membantu ketika bukti lapangan belum lengkap.',
        },
      ];
    } else {
      contextState = 'context_available';
      confidence = 'medium';
      basisCodes = ['bmkg_current', 'field_complete'];
      optionSet = [
        {
          optionId: 'OPT-CHECK-WATER',
          title: 'Cek kondisi air di petak',
          description: 'Lakukan pengecekan kondisi air sebelum tindakan lanjutan.',
          rationale: 'Bukti lapangan lengkap dan prakiraan BMKG tersedia sebagai konteks.',
        },
        {
          optionId: 'OPT-CHECK-IRRIGATION',
          title: 'Cek aliran irigasi',
          description: 'Periksa aliran irigasi dan catat perubahan yang terlihat.',
          rationale: 'Observasi aliran irigasi tersedia sebagai bagian dari Field Pulse.',
        },
      ];
    }

    return {
      status: 'available',
      contextState,
      confidence,
      factors,
      missingEvidence,
      limitations,
      actionOptions: optionSet,
      recommendation: { mode: 'alternatives_only', recommendedOptionId: null },
      evaluatedAt: input.evaluatedAt,
      rulesetVersion: 'water-v0.2',
      explanation: {
        summaryCode: contextState,
        factorItems,
        unknownItems,
        strength: { level: confidence, basisCodes },
        limitationCodes,
        sourceRefs: input.bmkg
          ? [{ evidenceId: input.bmkg.evidenceId, displayName: 'BMKG' }]
          : [],
      },
    };
  }
}
