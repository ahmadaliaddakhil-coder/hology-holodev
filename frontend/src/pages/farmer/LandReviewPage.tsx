import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Droplets } from "lucide-react";
import { farmerApi, type ApiCropContext, type ApiLand } from "../../services/farmer-api";

const options = [
  ["none", "Kering / Tidak Ada", "Tidak tampak genangan air pada permukaan petak."],
  ["limited", "Terbatas / Macak-macak", "Air tersedia tipis atau tidak merata di petak."],
  ["present", "Air Tersedia", "Air terlihat tersedia pada petak."],
  ["unknown", "Belum Diperiksa", "Kondisi air belum dapat dipastikan oleh pengamat."],
] as const;

export function LandReviewPage() {
  const { landId = "" } = useParams(); const navigate = useNavigate();
  const [land, setLand] = useState<ApiLand | null>(null); const [crop, setCrop] = useState<ApiCropContext | null>(null);
  const [selected, setSelected] = useState<(typeof options)[number][0]>("unknown"); const [error, setError] = useState("");
  useEffect(() => { let active = true; Promise.all([farmerApi.getLand(landId), farmerApi.getActiveCrop(landId).catch(() => null)]).then(([nextLand,nextCrop]) => { if(active){setLand(nextLand);setCrop(nextCrop);} }).catch((reason:unknown)=>active&&setError(reason instanceof Error?reason.message:"Data lahan gagal dimuat")); return()=>{active=false}; },[landId]);
  const proceed=()=>{sessionStorage.setItem(`field-pulse:${landId}`,JSON.stringify({water_presence:selected}));navigate(`/farmer/lands/${landId}/irrigation`);};
  return <div className="min-h-screen bg-[#f3f3ec] px-4 py-6 text-[#15240a] sm:px-8"><main className="mx-auto max-w-[720px] space-y-5">
    <div className="flex items-center justify-between"><Link to={`/farmer/lands/${landId}`} className="flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={15}/>Kembali</Link><span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold">Langkah 1 dari 2 · Field Pulse</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-[#deded4]"><motion.div initial={{width:0}} animate={{width:"50%"}} className="h-full bg-[#85c254]"/></div>
    {error?<div className="rounded-2xl bg-[#fff3df] p-4 text-sm">{error}</div>:!land?<div className="h-40 animate-pulse rounded-2xl bg-white"/>:<>
      <section><span className="rounded-lg bg-[#def0ab] px-3 py-1 text-xs font-semibold">{land.name}{crop?` · ${crop.crop_name}${crop.variety_name?` ${crop.variety_name}`:""}`:""}</span><h1 className="mt-4 font-display text-2xl font-bold">Bagaimana kondisi air di petak saat ini?</h1><p className="mt-1 text-sm text-[#44483f]">Isi berdasarkan pengamatan langsung. Sistem tidak menganggap sensor tersedia bila belum ada perangkat yang terhubung.</p></section>
      <div className="flex gap-3 rounded-xl bg-white p-4"><Droplets className="text-[#4f8a45]"/><div><p className="text-xs font-bold">Pengamatan manusia</p><p className="text-[11px]">{[land.village,land.district,land.regency].filter(Boolean).join(", ")||"Lokasi lahan tersimpan"}</p></div></div>
      <div className="space-y-2">{options.map(([id,title,description],index)=><motion.button key={id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:index*.04}} onClick={()=>setSelected(id)} className={`flex w-full gap-3 rounded-2xl p-5 text-left ${selected===id?"bg-[#e2f9a9] ring-1 ring-[#85c254]":"bg-white"}`}><span className={`mt-0.5 flex size-5 items-center justify-center rounded-full ${selected===id?"bg-[#15240a] text-[#d9f59b]":"bg-[#e4f6b0]"}`}>{selected===id&&<Check size={12}/>}</span><span><b>{title}</b><span className="mt-1 block text-xs">{description}</span></span></motion.button>)}</div>
      <button onClick={proceed} className="ml-auto flex items-center gap-2 rounded-xl bg-[#85c254] px-5 py-3 text-sm font-bold">Lanjut ke Kondisi Irigasi <ArrowRight size={16}/></button>
    </>}
  </main></div>;
}
