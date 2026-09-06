import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { farmerApi, type ApiCropContext, type ApiDecisionCase, type ApiLand, type ApiProfile } from "../../services/farmer-api";

const options = [
  ["flowing","Mengalir","Air sedang mengalir menuju petak."],
  ["limited","Terbatas","Aliran kecil, terjadwal, atau tidak merata."],
  ["not_flowing","Tidak Mengalir","Tidak ada aliran menuju petak saat diperiksa."],
  ["unknown","Belum Diperiksa","Status aliran belum dapat dipastikan."],
] as const;

export function IrrigationPulsePage(){
  const {landId=""}=useParams(); const navigate=useNavigate();
  const [land,setLand]=useState<ApiLand|null>(null); const [crop,setCrop]=useState<ApiCropContext|null>(null); const [profile,setProfile]=useState<ApiProfile|null>(null);
  const [selected,setSelected]=useState<(typeof options)[number][0]>("unknown"); const [note,setNote]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  useEffect(()=>{Promise.all([farmerApi.getLand(landId),farmerApi.getActiveCrop(landId),farmerApi.getProfile()]).then(([l,c,p])=>{setLand(l);setCrop(c);setProfile(p)}).catch((e:unknown)=>setError(e instanceof Error?e.message:"Data gagal dimuat"));},[landId]);
  const submit=async()=>{if(!crop)return;setBusy(true);setError("");try{
    const cases=await farmerApi.listDecisionCases(); let decisionCase:ApiDecisionCase|undefined=cases.filter(c=>c.land_id===landId&&c.status!=="decided").sort((a,b)=>b.created_at.localeCompare(a.created_at))[0];
    if(!decisionCase) decisionCase=await farmerApi.createDecisionCase({land_id:landId,crop_context_id:crop.id,decision_type:"water_management"});
    const saved=JSON.parse(sessionStorage.getItem(`field-pulse:${landId}`)||"{}") as {water_presence?:string};
    const existing=await farmerApi.listEvidence(decisionCase.id); if(!existing.some(e=>e.type==="bmkg_forecast")){await farmerApi.refreshBmkg(decisionCase.id);}
    await farmerApi.createFieldPulse(decisionCase.id,{water_presence:saved.water_presence||"unknown",irrigation_flow:selected,reported_by:profile?.display_name,observed_at:new Date().toISOString(),is_mock:false});
    if(note.trim()) sessionStorage.setItem(`field-note:${decisionCase.id}`,note.trim());
    await farmerApi.assess(decisionCase.id); sessionStorage.removeItem(`field-pulse:${landId}`); navigate(`/farmer/lands/${landId}/summary?case=${decisionCase.id}`);
  }catch(e){setError(e instanceof Error?e.message:"Field Pulse gagal disimpan");}finally{setBusy(false)}};
  return <div className="min-h-screen bg-[#f3f3ec] px-4 py-6 text-[#15240a] sm:px-8"><main className="mx-auto max-w-[720px] space-y-5">
    <div className="flex items-center justify-between"><Link to={`/farmer/lands/${landId}/review`} className="flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={15}/>Kembali</Link><span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold">Langkah 2 dari 2 · Field Pulse</span></div><div className="h-2 rounded-full bg-[#85c254]"/>
    {!land?<div className="h-40 animate-pulse rounded-2xl bg-white"/>:<section className="rounded-2xl bg-white p-5"><span className="rounded-full bg-[#e4f6b0] px-3 py-1 text-xs font-semibold">{land.name}</span><h1 className="mt-4 font-display text-2xl font-bold">Bagaimana kondisi aliran irigasi saat ini?</h1><p className="mt-1 text-sm text-[#44483f]">Laporkan hanya yang benar-benar diamati. Aplikasi tidak mengarang jadwal, debit, atau status pintu air.</p></section>}
    <div className="space-y-2">{options.map(([id,title,description])=><button key={id} onClick={()=>setSelected(id)} className={`flex w-full gap-3 rounded-2xl p-5 text-left ${selected===id?"bg-[#e2f9a9] ring-1 ring-[#85c254]":"bg-white"}`}><span className={`flex size-5 items-center justify-center rounded-full ${selected===id?"bg-[#15240a] text-[#d9f59b]":"bg-[#e4f6b0]"}`}>{selected===id&&<Check size={12}/>}</span><span><b>{title}</b><span className="mt-1 block text-xs">{description}</span></span></button>)}</div>
    <section className="rounded-2xl bg-white p-5"><label htmlFor="field-note" className="text-sm font-bold">Catatan pengamatan (opsional)</label><textarea id="field-note" maxLength={240} value={note} onChange={e=>setNote(e.target.value)} placeholder="Contoh: saluran tertutup endapan di sisi timur" className="mt-3 min-h-24 w-full rounded-xl bg-[#fafaf6] p-3 text-sm outline-none focus:ring-2 focus:ring-[#85c254]"/><p className="text-right text-[10px]">{note.length}/240</p></section>
    {error&&<p role="alert" className="rounded-xl bg-[#fff3df] p-4 text-sm">{error}</p>}<button disabled={busy||!crop} onClick={submit} className="ml-auto flex items-center gap-2 rounded-xl bg-[#85c254] px-5 py-3 text-sm font-bold disabled:opacity-50">{busy?"Menyimpan bukti dan menilai…":"Susun Rangkuman Bukti"}<ArrowRight size={16}/></button>
  </main></div>;
}
