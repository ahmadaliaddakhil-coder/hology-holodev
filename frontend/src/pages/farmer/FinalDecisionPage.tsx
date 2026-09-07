import { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, Bell, CloudSun, Leaf, Menu,
  Plus, Settings, Sprout, UserCircle2, Warehouse, History, 
  CheckCircle2, Pencil, AlertCircle, ShieldCheck, Droplets, 
  Waves, Check, ChevronDown, Info
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { farmerApi, type ApiAssessmentResult, type ApiEvidence, type ApiLand } from "../../services/farmer-api";
import { ensureAssessment, readWorkflow } from "../../lib/decision-workflow";

// Komponen Navigasi Sidebar
function NavItem({ icon: Icon, label, active = false }: { icon: typeof Warehouse; label: string; active?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 ${
      active ? "bg-[#1c2a13] text-white shadow-md" : "text-[#44483f] hover:bg-[#edf4dc]"
    }`}>
      <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
      <span className={active ? "font-display text-sm font-bold" : "text-sm font-semibold"}>
        {label}
      </span>
    </button>
  );
}

export function FinalDecisionPage() {
  const { landId } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useSaran, setUseSaran] = useState<boolean | null>(null);
  const [workflowData, setWorkflowData] = useState<{result:ApiAssessmentResult;evidence:ApiEvidence[];land:ApiLand;caseId:string}|null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    if (landId) ensureAssessment(landId).then((data) => setWorkflowData({ result: data.result, evidence: data.evidence, land: data.land, caseId: data.decisionCase.id })).catch((error: unknown) => setSubmitError(error instanceof Error ? error.message : "Data keputusan gagal dimuat"));
    return () => clearTimeout(timer);
  }, [landId]);

  const submit = async () => {
    if (!workflowData || !landId) { setSubmitError("Assessment belum siap."); return; }
    const workflow = readWorkflow(landId); const optionId = String(workflow.option_id || "") || undefined;
    const decisionText = useSaran === false ? "Keputusan ditunda untuk pemeriksaan lapangan lanjutan" : String(workflow.option_title || workflowData.result.options[0]?.title || "Keputusan lapangan ditetapkan oleh petani");
    setSubmitting(true); setSubmitError("");
    try { const record = await farmerApi.createDecision(workflowData.caseId, { assessment_id: workflowData.result.assessment.id, selected_action_option_id: optionId, decision_type: useSaran === false ? "deferred" : optionId ? "selected_option" : "custom", decision_text: decisionText, reason: String(workflow.option_rationale || "Ditetapkan setelah meninjau bukti dan keterbatasan."), assessment_snapshot: workflowData.result.assessment as unknown as Record<string, unknown>, evidence_snapshot: { count: workflowData.evidence.length }, evidence_ids: workflowData.evidence.map((item) => item.id), is_mock: workflowData.evidence.some((item) => item.is_mock) || /demo|uji/i.test(workflowData.land.name) }); await farmerApi.createBrief(record.id).catch(() => undefined); sessionStorage.removeItem(`rembuktani.workflow:${landId}`); nav(`/farmer/history/${record.id}`); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Keputusan gagal dicatat"); } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a] font-sans overflow-hidden flex">
      
      {/* Overlay Mobile Sidebar */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col justify-between bg-[#fafaf6] border-r border-[#deded4]/60 p-5 transition-transform duration-500 ease-in-out ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full xl:relative xl:translate-x-0"
        }`}>
        <div>
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-[#85c254]/20 px-3 py-2 text-xs font-bold tracking-widest text-[#213014] w-fit">
            <Leaf size={14} className="text-[#56652e]" /> REMBUKTANI
          </div>
          
          <button className="mb-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-xs font-bold text-[#15240a] shadow-sm transition hover:bg-[#98cf6a] hover:scale-[1.02]">
            <Plus size={16} /> Tambah Lahan
          </button>

          <nav className="space-y-1">
            <NavItem icon={Warehouse} label="Beranda" />
            <NavItem active icon={Sprout} label="Lahan" />
            <NavItem icon={History} label="Riwayat" />
            <NavItem icon={UserCircle2} label="Profil" />
          </nav>
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3 text-xs">
            <div className="size-2.5 rounded-full bg-[#85c254] animate-pulse"></div> 
            <div>
              <p className="font-bold text-[#15240a]">Sinkronisasi BMKG</p>
              <p className="text-[10px] text-[#56652e]">Data cuaca aktif</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white">
                <UserCircle2 size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#15240a]">Pak Slamet</p>
                <p className="text-[10px] text-[#666a60]">Ketua Poktan</p>
              </div>
            </div>
            <Settings size={16} className="text-[#666a60] cursor-pointer hover:text-[#15240a]" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-[#f3f3ec]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 border-b border-[#deded4]/40">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-1.5 transition-colors hover:bg-black/5 xl:hidden" onClick={() => setMobileNavOpen(true)}>
              <Menu size={20} />
            </button>
            <span className="truncate rounded bg-[#e9fcb5] px-2.5 py-1 text-[10px] font-bold text-[#213014] sm:text-xs">
              Wilayah: Subak Jatiluwih
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden items-center gap-1.5 text-xs font-medium text-[#44483f] sm:flex">
              <CloudSun size={16} /> Cerah Berawan 28°C
            </span>
            <Bell size={18} className="cursor-pointer text-[#44483f] transition hover:text-[#15240a]" />
            <div className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#0d1b03] text-white">
              <UserCircle2 size={14} />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            
            {/* Header Section */}
            <div className={`mb-6 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <Link to={`/farmer/lands/${landId}/optional-review`} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#666a60] transition hover:text-[#15240a] mb-5">
                <ArrowLeft size={14} /> Kembali ke Pilihan Aksi
              </Link>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight text-[#15240a]">
                    Keputusan Akhir Dibuat Oleh Anda
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-[#666a60] leading-relaxed max-w-2xl">
                    Tegaskan tindakan resmi yang akan dijalankan oleh regu kerja di petak Blok Tirto A3 hari ini.
                  </p>
                </div>
                <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white border border-[#deded4] px-3 py-1.5 text-[10px] sm:text-xs font-bold text-[#15240a]">
                  <div className="size-2 rounded-full bg-[#85c254] animate-pulse"></div> Status: Siap Disahkan
                </div>
              </div>
            </div>

            {/* Content Stack */}
            <div className="space-y-6">
              
              {/* Card 1: Tindakan yang Dipilih */}
              <div 
                className={`relative overflow-hidden rounded-2xl bg-white border-2 border-[#1c2a13] p-5 sm:p-7 shadow-sm transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                {/* Top Right Badge */}
                <div className="absolute right-0 top-0 rounded-bl-xl bg-[#1c2a13] px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-[#d9f59b] uppercase flex items-center gap-1.5">
                  <Pencil size={12} /> TINDAKAN YANG ANDA PILIH
                </div>

                <div className="flex items-start gap-3 sm:gap-4 mt-2 sm:mt-0 mb-6">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e9fcb5] text-[#56652e]">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="pr-12 sm:pr-0">
                    <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#666a60] uppercase mb-1">Pilihan Tindakan Final:</p>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#15240a] leading-snug">
                      Verifikasi Pintu Air Bersama Poktan & Siapkan Pompa Cadangan
                    </h2>
                  </div>
                </div>

                <div className="rounded-xl bg-[#fafaf6] p-4 border border-[#deded4]/50 mb-5">
                  <div className="flex justify-between items-center border-b border-[#deded4]/50 pb-2 mb-3">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#666a60] uppercase">Rincian Rencana Lapangan:</span>
                    <span className="text-[9px] sm:text-[10px] text-[#44483f]">Tindakan Siap Dijalankan</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44483f] leading-relaxed">
                    Memeriksa debit saluran tersier bersama ketua blok air pada pukul 07.00 pagi ini untuk memastikan jadwal gilir giring. Jika pasokan tidak mencukupi dalam 12 jam, segera lakukan penyedotan air cadangan menggunakan pompa sumur pantek.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#deded4]/50 pt-4">
                  <p className="text-[10px] sm:text-[11px] text-[#666a60] flex items-center gap-1.5">
                    <Info size={14} className="text-[#a4a99d]" /> Tindakan ini sudah Anda tentukan sebelumnya. Tidak perlu mengetik ulang dari awal.
                  </p>
                  <button className="text-[10px] sm:text-xs font-bold text-[#15240a] flex items-center justify-center gap-1.5 transition hover:text-[#85c254]">
                    <Pencil size={12} /> Ubah Rencana
                  </button>
                </div>
              </div>

              {/* Card 2: Saran PPL */}
              <div 
                className={`rounded-2xl bg-white border border-[#deded4]/60 p-5 sm:p-7 shadow-sm transition-all delay-200 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-[#ca8a04]"></div>
                    <h2 className="text-sm sm:text-base font-bold text-[#15240a]">Pertimbangan dari Pendamping Terpercaya</h2>
                    <span className="hidden sm:inline-flex rounded-full bg-[#fef08a]/40 px-2 py-0.5 text-[9px] font-bold text-[#a16207]">
                      Masukan Baru Masuk
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a4a99d]">Diterima Hari ini • 11:15 WIB</span>
                </div>

                {/* Reviewer Profile */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=100&h=100" alt="Pak Slamet" className="size-10 sm:size-12 rounded-full object-cover border border-[#deded4]" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#15240a]">Pak Slamet <span className="ml-1 text-[9px] sm:text-[10px] font-normal text-[#666a60]">PPL Kepanjen</span></h3>
                      <p className="text-[9px] sm:text-[10px] text-[#666a60] mt-0.5">Penyuluh Pertanian Lapangan Wilayah Kerja Kepanjen, Malang</p>
                    </div>
                  </div>
                  <span className="hidden sm:flex items-center gap-1 rounded-full bg-[#f3f3ec] px-2.5 py-1 text-[10px] font-semibold text-[#44483f]">
                    <ShieldCheck size={14} className="text-[#85c254]" /> Ahli Terverifikasi
                  </span>
                </div>

                {/* Advice Box */}
                <div className="rounded-xl bg-[#fffcf3] border border-[#fde68a]/60 p-4 sm:p-5 mb-6 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#facc15] rounded-l-xl"></div>
                  <h4 className="text-[9px] font-bold tracking-widest text-[#ca8a04] uppercase mb-2 ml-1">Saran Teknis Lapangan:</h4>
                  <p className="text-[11px] sm:text-xs text-[#44483f] italic leading-relaxed ml-1">
                    "Pak Tirto, sebaiknya periksa kondisi pintu air dan pasokan tersier terlebih dahulu bersama ketua blok sebelum memutuskan pengairan pompa mandiri. Saluran primer masih ada debit giliran nanti siang, koordinasi poktan lebih diutamakan agar debit air merata dan menghemat biaya BBM solar."
                  </p>
                </div>

                {/* Decision Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#deded4]/50 pt-5">
                  <p className="text-[10px] sm:text-[11px] text-[#666a60] flex items-center gap-1.5 font-medium">
                    <AlertCircle size={14} className="text-[#a4a99d]" /> Terdapat perbedaan sudut pandang. Tentukan sikap Anda.
                  </p>
                  <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">
                    <button 
                      onClick={() => setUseSaran(false)}
                      className={`flex-1 sm:flex-none flex items-center justify-center rounded-xl border px-3 sm:px-4 py-2.5 text-[10px] sm:text-xs font-bold transition-all ${useSaran === false ? 'bg-[#f3f3ec] border-[#44483f] text-[#15240a]' : 'bg-white border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]'}`}
                    >
                      Tetap Keputusan Saya
                    </button>
                    <button 
                      onClick={() => setUseSaran(true)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border px-3 sm:px-4 py-2.5 text-[10px] sm:text-xs font-bold transition-all ${useSaran === true ? 'bg-[#85c254] border-[#85c254] text-[#15240a]' : 'bg-[#e9fcb5] border-[#d9f59b] text-[#56652e] hover:bg-[#d9f59b]'}`}
                    >
                      {useSaran === true && <Check size={14} />} Gunakan Saran Ini
                    </button>
                  </div>
                </div>

                <p className="mt-5 text-center text-[9px] text-[#a4a99d]">
                  *RembukTani menghargai pertimbangan manusia. Masukan pendamping tidak akan pernah mengganti keputusan Anda secara otomatis.
                </p>
              </div>

              {/* Card 3: Ringkasan Kondisi */}
              <div 
                className={`rounded-2xl bg-white border border-[#deded4]/60 p-5 sm:p-7 shadow-sm transition-all delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 border-b border-[#deded4]/50 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded bg-[#f3f3ec] text-[#44483f]">
                      <Pencil size={12} />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[#15240a]">Ringkasan Kondisi Terkini Lahan</h2>
                      <p className="text-[10px] sm:text-[11px] text-[#666a60] mt-0.5">Sintesis faktor utama penentu pertimbangan di petak sawah Anda</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-3 py-1 text-[9px] sm:text-[10px] font-bold text-[#a16207]">
                    <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Kondisi Perlu Ditinjau
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-xl bg-[#fafaf6] p-3 sm:p-4 border border-[#deded4]/40">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-[#666a60] mb-2">
                      <Droplets size={12} className="text-[#85c254]" /> Kondisi Air Petak
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#15240a]">1-2 cm (Sedikit)</p>
                    <p className="text-[9px] sm:text-[10px] text-[#666a60] mt-1 leading-tight">Air mulai mengering di permukaan tanah</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 sm:p-4 border border-[#deded4]/40">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-[#666a60] mb-2">
                      <Waves size={12} className="text-[#f59e0b]" /> Aliran Irigasi
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#15240a]">Tersier Terhambat</p>
                    <p className="text-[9px] sm:text-[10px] text-[#666a60] mt-1 leading-tight">Menunggu jadwal buka pintu air poktan</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 sm:p-4 border border-[#deded4]/40">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-[#666a60] mb-2">
                      <Sprout size={12} className="text-[#85c254]" /> Fase Tanaman
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#15240a]">Berbunga (62 HST)</p>
                    <p className="text-[9px] sm:text-[10px] text-[#ef4444] mt-1 leading-tight font-medium">Fase rentan terhadap kekeringan</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 sm:p-4 border border-[#deded4]/40">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-[#666a60] mb-2">
                      <CloudSun size={12} className="text-[#85c254]" /> Cuaca BMKG (48 Jam)
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#15240a]">Cerah Berawan</p>
                    <p className="text-[9px] sm:text-[10px] text-[#666a60] mt-1 leading-tight">Suhu 24-31°C, nihil hujan lebat</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Dasar Informasi yang Digunakan */}
              <div 
                className={`rounded-2xl bg-white border border-[#deded4]/60 p-5 sm:p-7 shadow-sm transition-all delay-400 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#15240a]">Dasar Informasi yang Digunakan</h2>
                    <p className="text-[10px] sm:text-[11px] text-[#666a60] mt-0.5">Klik setiap kartu untuk melihat rincian verifikasi data</p>
                  </div>
                  <span className="inline-flex rounded-full bg-[#f3f3ec] px-3 py-1 text-[9px] sm:text-[10px] font-bold text-[#44483f]">
                    4 Data Terverifikasi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { title: "Informasi Cuaca BMKG Terkini", sub: "Stasiun Karangkates • 24-31°C, cerah berawan" },
                    { title: "Kondisi Lapangan (Field Pulse)", sub: "Air petakan 1-2 cm • Saluran tersier macet" },
                    { title: "Konteks Kalender Tanam Padi", sub: "Padi Inpari 32 • Hari ke-62 (Fase Berbunga/Bunting)" },
                    { title: "Pertimbangan PPL (Pak Slamet)", sub: "Rekomendasi koordinasi pintu air sebelum pompa" },
                  ].map((item, i) => (
                    <div key={i} className="group flex cursor-pointer items-center justify-between rounded-xl bg-[#fafaf6] p-3 sm:p-4 border border-[#deded4]/50 transition-colors hover:border-[#85c254]/50 hover:bg-white">
                      <div className="flex items-center gap-3">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#213014] text-white">
                          <Check size={12} strokeWidth={3} className="text-[#85c254]" />
                        </div>
                        <div>
                          <h4 className="text-[11px] sm:text-xs font-bold text-[#15240a]">{item.title}</h4>
                          <p className="text-[9px] sm:text-[10px] text-[#666a60] mt-0.5 leading-tight">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronDown size={14} className="text-[#a4a99d] transition-transform group-hover:text-[#15240a]" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="h-28"></div> {/* Spacer for sticky footer */}
          </div>
        </main>

        {/* Sticky Bottom Bar */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-[#deded4] p-4 sm:p-5 xl:left-[240px] transition-all delay-500 duration-700 ease-out shadow-[0_-4px_20px_rgba(0,0,0,0.05)] ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5">
            <Link to={`/farmer/lands/${landId}/optional-review`} className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white border border-[#deded4] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#15240a] transition hover:bg-[#fafaf6]">
              <ArrowLeft size={16} /> Kembali / Ubah Alternatif
            </Link>
            {submitError && <p role="alert" className="text-xs font-semibold text-[#9f2d2d]">{submitError}</p>}
            <button disabled={submitting || !workflowData} onClick={submit} className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#85c254] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#15240a] shadow-lg transition-all hover:bg-[#98cf6a] hover:shadow-xl disabled:opacity-50">
              <CheckCircle2 size={18} /> {submitting ? "Menyimpan keputusan…" : "Sahkan & Simpan ke Buku Petak"} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
