import { useState, useEffect } from "react";
import {
  ArrowRight, Bell, ChevronRight, CloudSun, Leaf, Menu, 
  Plus, Settings, Sprout, UserCircle2, Warehouse, History, 
  MapPin, HelpCircle, UserCog
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ensureAssessment, saveWorkflow } from "../../lib/decision-workflow";

// Komponen Navigasi Sidebar (Konsisten dengan halaman sebelumnya)
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

export function ActionAlternativesPage() {
  const { landId } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiAlternatives, setApiAlternatives] = useState<Array<{id:string;tag:string;title:string;desc:string;reasons:string[]}>>([]);
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    if (landId) ensureAssessment(landId).then((data) => setApiAlternatives(data.result.options.map((option, index) => ({ id: option.id, tag: `Opsi ${index + 1} · Ruleset`, title: option.title, desc: option.description || "Tanpa deskripsi tambahan", reasons: option.rationale ? [option.rationale] : ["Assessment aktif"] })))).catch(() => undefined);
    return () => clearTimeout(timer);
  }, [landId]);

  // Data Mockup untuk Kartu Opsi Tindakan (disesuaikan dengan gambar)
  const fallbackAlternatives = [
    {
      id: "A",
      tag: "Opsi A • Respons Cepat",
      title: "Lakukan Pemupukan Segera dengan Takaran Ringan",
      desc: "Tabur pupuk tipis pada kondisi tanah macak-macak saat ini sebelum terik siang.",
      reasons: ["Kondisi Air", "Perkiraan hujan", "Cuaca BMKG"]
    },
    {
      id: "B",
      tag: "Opsi B • Efisiensi Tenaga",
      title: "Lakukan Pemupukan Segera dengan Takaran Ringan",
      desc: "Tabur pupuk tipis pada kondisi tanah macak-macak saat ini sebelum terik siang.",
      reasons: ["Kondisi Air", "Perkiraan hujan", "Cuaca BMKG"]
    },
    {
      id: "C",
      tag: "Opsi C • Keseimbangan",
      title: "Lakukan Pemupukan Segera dengan Takaran Ringan",
      desc: "Tabur pupuk tipis pada kondisi tanah macak-macak saat ini sebelum terik siang.",
      reasons: ["Kondisi Air", "Perkiraan hujan", "Cuaca BMKG"]
    }
  ];
  const alternatives = apiAlternatives.length ? apiAlternatives : fallbackAlternatives;

  const submit = () => {
    const option = alternatives[0];
    if (landId && option) saveWorkflow(landId, { option_id: apiAlternatives.length ? option.id : "", option_title: option.title, option_description: option.desc, option_rationale: option.reasons.join("; ") });
    nav(`/farmer/lands/${landId}/optional-review`)
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
          <div className="mx-auto max-w-6xl">
            
            {/* Breadcrumbs */}
            <div className={`mb-6 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium text-[#666a60] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="hover:text-[#15240a] cursor-pointer">Lahan</span>
              <ChevronRight size={12} />
              <span className="hover:text-[#15240a] cursor-pointer">Blok Tirto A3</span>
              <ChevronRight size={12} />
              <span className="text-[#15240a] font-bold">Alternatif Tindakan</span>
            </div>

            {/* Header Section */}
            <div className={`mb-8 flex flex-col lg:flex-row lg:items-start justify-between gap-5 transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="max-w-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight text-[#15240a]">
                  Apa yang ingin Anda lakukan?
                </h1>
                <p className="mt-3 text-xs sm:text-sm text-[#666a60] leading-relaxed">
                  Pilih opsi yang paling sesuai dengan tenaga kerja dan ketersediaan sarana di sawah Anda saat ini.
                </p>
              </div>
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e9fcb5] px-3 py-1.5 text-[10px] sm:text-xs font-bold text-[#213014]">
                <MapPin size={12} className="text-[#85c254]" /> Blok Tirto A3 • Padi Inpari 32
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {alternatives.map((alt, index) => (
                <div 
                  key={alt.id} 
                  className={`flex flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#85c254]/50 group`}
                  style={{ transitionDelay: `${200 + index * 100}ms`, opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(24px)' }}
                >
                  
                  {/* Card Header (Tag & Icon) */}
                  <div className="flex items-start justify-between mb-5">
                    <span className="inline-flex items-center rounded bg-[#e9fcb5] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-[#213014]">
                      {alt.tag}
                    </span>
                    <UserCog size={18} className="text-[#666a60] group-hover:text-[#15240a] transition-colors" />
                  </div>

                  {/* Card Content */}
                  <h2 className="text-base sm:text-lg font-bold text-[#15240a] mb-3 leading-snug">
                    {alt.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#666a60] leading-relaxed mb-6">
                    {alt.desc}
                  </p>

                  {/* Reasons List */}
                  <div className="mt-auto pt-5 border-t border-[#deded4]/50">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#44483f] mb-3">
                      <HelpCircle size={14} className="text-[#a4a99d]" /> Berdasarkan
                    </div>
                    <ul className="space-y-1.5 pl-5 mb-5 text-[11px] sm:text-xs text-[#666a60]">
                      {alt.reasons.map((reason, idx) => (
                        <li key={idx} className="relative before:absolute before:-left-3 before:top-1.5 before:size-1 before:rounded-full before:bg-[#85c254]">
                          {reason}
                        </li>
                      ))}
                    </ul>
                    <button className="text-[10px] sm:text-xs font-semibold text-[#85c254] hover:text-[#56652e] transition-colors underline underline-offset-4 decoration-[#85c254]/30 hover:decoration-[#56652e]">
                      Lebih rinci
                    </button>
                  </div>

                  {/* Action Button */}
                  <button onClick={submit} className="mt-6 w-full flex items-center justify-between rounded-xl bg-[#15240a] px-4 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#2d421b]">
                    Pilih Alternatif Ini
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>

                </div>
              ))}
            </div>

            {/* Custom Action (Bottom) */}
            <div className={`mt-10 flex flex-col items-center text-center transition-all delay-700 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#15240a] transition hover:text-[#56652e] group mb-3">
                Atau tulis rencana tindakan khusus Anda sendiri 
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-[10px] sm:text-xs text-[#666a60] max-w-md">
                Keputusan akhir selalu berada di tangan petani dan pengurus kelompok tani berdasarkan kondisi riil di lapangan.
              </p>
            </div>

            {/* Spacer */}
            <div className="h-10"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
