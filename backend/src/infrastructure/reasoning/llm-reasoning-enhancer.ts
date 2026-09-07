import { config } from '../../config.js';
import type { CropContext } from '../../domain/types.js';
import type { ReasoningAssessment, ReasoningInput } from './reasoning.types.js';

type LlmOutput = { summary: string; options: Array<{ title: string; description: string; rationale: string }> };
export type EnhancedAssessment = ReasoningAssessment & { generatedSummary?: string };

const schema = {
  type: 'object', required: ['summary', 'options'],
  properties: {
    summary: { type: 'string', description: 'Ringkasan kondisi dalam Bahasa Indonesia sederhana, maksimal 3 kalimat.' },
    options: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'object', required: ['title','description','rationale'], properties: { title: { type: 'string' }, description: { type: 'string' }, rationale: { type: 'string' } } } },
  },
};

const forbidden = /\b(\d+(?:[.,]\d+)?\s*(?:liter|l\/s|mm|kg|gram|jam|menit|hari|ml|ton|cm)|pasti|dijamin|harus memompa|semprot|dosis)\b/i;
const clean = (value: unknown, max: number): string => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
function validate(value: unknown): LlmOutput {
  if (!value || typeof value !== 'object') throw new Error('LLM output is not an object');
  const candidate=value as Partial<LlmOutput>; const summary=clean(candidate.summary,600);
  if (!summary || forbidden.test(summary)) throw new Error('LLM summary failed safety validation');
  if (!Array.isArray(candidate.options) || candidate.options.length<2 || candidate.options.length>4) throw new Error('LLM option count is invalid');
  const options=candidate.options.map(item=>({title:clean(item?.title,120),description:clean(item?.description,360),rationale:clean(item?.rationale,360)}));
  if(options.some(item=>!item.title||!item.description||!item.rationale||forbidden.test(`${item.title} ${item.description} ${item.rationale}`))) throw new Error('LLM option failed safety validation');
  return {summary,options};
}

export class LlmReasoningEnhancer {
  private retryAfter = 0;
  constructor(private readonly apiKey=config.llmApiKey, private readonly model=config.llmModel, private readonly enabled=config.llmEnabled) {}
  async enhance(input:ReasoningInput, baseline:ReasoningAssessment, crop:CropContext|null):Promise<EnhancedAssessment>{
    if(!this.enabled||!this.apiKey)return {...baseline,generation:{mode:'deterministic_fallback',fallbackReason:'LLM belum dikonfigurasi'}};
    if(Date.now()<this.retryAfter)return {...baseline,generation:{mode:'deterministic_fallback',provider:'google-gemini',model:this.model,fallbackReason:'LLM cooldown setelah kegagalan sebelumnya'}};
    try{
      const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12_000);
      const safeInput={crop:crop?{crop_name:crop.crop_name,variety_name:crop.variety_name,growth_stage:crop.growth_stage,planting_date:crop.planting_date}:null,bmkg:input.bmkg?{source:'BMKG',delivery:input.bmkg.delivery,analysis_time:input.bmkg.evidence.temporal.analysis_time,forecast_slots:input.bmkg.evidence.payload.forecast_slots.slice(0,8)}:null,field_pulse:input.fieldPulse?{water_presence:input.fieldPulse.waterPresence,irrigation_flow:input.fieldPulse.irrigationFlow,observed_at:input.fieldPulse.observedAt}:null,guardrail:{context_state:baseline.contextState,confidence:baseline.confidence,missing_evidence:baseline.missingEvidence,limitations:baseline.limitations}};
      const prompt=`Anda adalah lapisan decision-support RembukTani, bukan pengambil keputusan dan bukan agronom otonom. Analisis HANYA JSON evidence berikut. Buat ringkasan transparan dan 2-4 alternatif TANPA ranking. Jangan menciptakan data, prediksi hasil, dosis, volume, durasi, jadwal presisi, diagnosis hama, atau klaim kepastian. Jika evidence kurang, opsi harus berfokus pada verifikasi, pengumpulan informasi, review manusia, atau menunda perubahan. Sebutkan keterbatasan secara jujur. Keputusan akhir milik petani.\nDATA=${JSON.stringify(safeInput)}`;
      const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`,{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':this.apiKey},signal:controller.signal,body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0.2,maxOutputTokens:3000,responseMimeType:'application/json',responseSchema:schema}})}).finally(()=>clearTimeout(timeout));
      if(!response.ok)throw new Error(`Gemini HTTP ${response.status}`);const body=await response.json() as {candidates?:Array<{content?:{parts?:Array<{text?:string}>}}>};const text=body.candidates?.[0]?.content?.parts?.[0]?.text;if(!text)throw new Error('Gemini returned no structured text');const generated=validate(JSON.parse(text));
      return {...baseline,generatedSummary:generated.summary,actionOptions:generated.options.map((option,index)=>({optionId:`LLM-${index+1}`, ...option})),rulesetVersion:`${baseline.rulesetVersion}+${this.model}`,generation:{mode:'llm_enhanced',provider:'google-gemini',model:this.model}};
    }catch(error){this.retryAfter=Date.now()+60_000;return {...baseline,generation:{mode:'deterministic_fallback',provider:'google-gemini',model:this.model,fallbackReason:error instanceof Error?error.message:'LLM gagal'}};}
  }
}
