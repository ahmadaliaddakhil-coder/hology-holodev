import { farmerApi, type ApiAssessmentResult, type ApiCropContext, type ApiDecisionCase, type ApiEvidence, type ApiLand } from "../services/farmer-api";

export type WorkflowData = { land: ApiLand; crop: ApiCropContext; decisionCase: ApiDecisionCase; evidence: ApiEvidence[]; result: ApiAssessmentResult };
export const workflowKey = (landId: string) => `rembuktani.workflow:${landId}`;
export const saveWorkflow = (landId: string, patch: Record<string, unknown>) => { const key=workflowKey(landId); const current=JSON.parse(sessionStorage.getItem(key)||"{}"); sessionStorage.setItem(key,JSON.stringify({...current,...patch})); };
export const readWorkflow = (landId: string): Record<string, unknown> => { try{return JSON.parse(sessionStorage.getItem(workflowKey(landId))||"{}")}catch{return {}} };

export async function ensureAssessment(landId:string):Promise<WorkflowData>{
  const [land,crop,cases]=await Promise.all([farmerApi.getLand(landId),farmerApi.getActiveCrop(landId),farmerApi.listDecisionCases()]);
  const rememberedCaseId=String(readWorkflow(landId).case_id||"");
  let decisionCase=cases.find(x=>x.id===rememberedCaseId&&x.land_id===landId&&x.status!=="decided")||cases.filter(x=>x.land_id===landId&&x.status!=="decided").sort((a,b)=>b.updated_at.localeCompare(a.updated_at))[0];
  if(!decisionCase) decisionCase=await farmerApi.createDecisionCase({land_id:landId,crop_context_id:crop.id,decision_type:"water_management"});
  let evidence=await farmerApi.listEvidence(decisionCase.id); const pulse=readWorkflow(landId);
  if(!evidence.some(x=>x.type==="bmkg_forecast")&&land.adm4_code) await farmerApi.refreshBmkg(decisionCase.id);
  if(!evidence.some(x=>x.type==="field_pulse")){const profile=await farmerApi.getProfile();await farmerApi.createFieldPulse(decisionCase.id,{water_presence:String(pulse.water_presence||"unknown"),irrigation_flow:String(pulse.irrigation_flow||"unknown"),reported_by:profile.display_name,observed_at:new Date().toISOString(),is_mock:false});}
  evidence=await farmerApi.listEvidence(decisionCase.id); let result:ApiAssessmentResult;
  try{result=await farmerApi.getAssessment(decisionCase.id)}catch{result=await farmerApi.assess(decisionCase.id)}
  saveWorkflow(landId,{case_id:decisionCase.id,assessment_id:result.assessment.id}); return {land,crop,decisionCase,evidence,result};
}
