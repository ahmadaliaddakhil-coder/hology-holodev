import { useState, useEffect } from "react";
import {
  ArrowRight, Bell, ChevronRight, CloudSun, Leaf, Menu, 
  Plus, Settings, Sprout, UserCircle2, Warehouse, History, 
  MapPin, CheckCircle2, AlertTriangle, Check
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

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

export function SelectReviewerPage() {
  const { landId } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<"slamet" | "sari">("slamet");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="mx-auto max-w-5xl">
            
            {/* Breadcrumbs */}
            <div className={`mb-5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium text-[#666a60] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="hover:text-[#15240a] cursor-pointer">Lahan</span>
              <ChevronRight size={12} />
              <span className="hover:text-[#15240a] cursor-pointer">Blok Tirto A3</span>
              <ChevronRight size={12} />
              <span className="hover:text-[#15240a] cursor-pointer">Rembuk & Konsultasi Pilihan</span>
            </div>

            {/* Header Section */}
            <div className={`mb-8 transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e9fcb5] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold tracking-wider text-[#56652e] uppercase mb-4">
                <div className="size-1.5 rounded-full bg-[#85c254]"></div> KOLABORASI PENGAMBILAN KEPUTUSAN
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight text-[#15240a] max-w-3xl">
                Siapa yang ingin Anda minta Pertimbangan?
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-[#666a60] leading-relaxed max-w-2xl">
                Pilih orang yang dapat membantu memberikan masukan sebelum Anda membuat keputusan akhir.
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 transition-all delay-200 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <h2 className="text-sm sm:text-base font-bold text-[#15240a]">Daftar Pendamping Terpercaya di Wilayah Anda</h2>
              <span className="text-[10px] sm:text-xs text-[#666a60]">Wilayah Kecamatan Kepanjen</span>
            </div>

            {/* Context Card */}
            <div className={`mb-6 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/40 transition-all delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#deded4]/50 pb-5 mb-5">
                <div>
                  <h3 className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#666a60] uppercase mb-1">Konteks Lahan Anda</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-[#15240a]">Blok Tirto A3</span>
                    <span className="text-xs text-[#a4a99d]">• Kepanjen, Malang</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/50 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-[#a16207]">
                  <AlertTriangle size={14} className="text-[#ca8a04]" /> Kondisi: Perlu Ditinjau
                </div>
              </div>

              <div>
                <h3 className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#666a60] uppercase mb-3">Informasi Lengkap Yang Akan Diteruskan Secara Otomatis:</h3>
                <div className="flex flex-wrap gap-2.5">
                  <div className="flex items-center gap-1.5 rounded-full bg-[#f3f3ec] px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-[#44483f]">
                    <CheckCircle2 size={14} className="text-[#85c254]" /> Analisis kondisi lahan tersedia
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#f3f3ec] px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-[#44483f]">
                    <CheckCircle2 size={14} className="text-[#85c254]" /> Data cuaca BMKG terkini
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#f3f3ec] px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-[#44483f]">
                    <CheckCircle2 size={14} className="text-[#85c254]" /> Catatan air & fase lapangan
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewers Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8 transition-all delay-400 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              {/* Reviewer 1: Pak Slamet */}
              <div 
                onClick={() => setSelectedReviewer("slamet")}
                className={`flex flex-col cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                  selectedReviewer === "slamet" 
                    ? "bg-[#fafaf6] border-[#85c254] ring-1 ring-[#85c254] shadow-md" 
                    : "bg-white border-[#deded4]/50 border hover:border-[#85c254]/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src="https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=100&h=100" alt="Pak Slamet" className="size-12 sm:size-14 rounded-full object-cover border border-[#deded4]" />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#15240a]">Pak Slamet</h3>
                      <p className="text-[10px] sm:text-[11px] text-[#666a60] mt-0.5">Penyuluh Pertanian (PPL)</p>
                      <p className="text-[10px] sm:text-[11px] text-[#a4a99d] mt-0.5">• Kepanjen</p>
                    </div>
                  </div>
                  {selectedReviewer === "slamet" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1c2a13] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-white shrink-0">
                      <Check size={12} strokeWidth={3} /> Dipilih
                    </span>
                  )}
                </div>
                
                <p className="text-[11px] sm:text-xs text-[#666a60] italic leading-relaxed mb-6 mt-2">
                  "Membantu memberikan pertimbangan teknis terkait manajemen air, pupuk, dan kondisi budidaya padi."
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-[#deded4]/50 pt-4">
                  <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#666a60]">
                    <div className="size-1.5 rounded-full bg-[#85c254]"></div> Siap memberikan tanggapan
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-bold ${selectedReviewer === "slamet" ? "text-[#15240a]" : "text-[#85c254]"}`}>
                    {selectedReviewer === "slamet" ? "Terpilih" : "Pilih"}
                  </span>
                </div>
              </div>

              {/* Reviewer 2: Bu Sari */}
              <div 
                onClick={() => setSelectedReviewer("sari")}
                className={`flex flex-col cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                  selectedReviewer === "sari" 
                    ? "bg-[#fafaf6] border-[#85c254] ring-1 ring-[#85c254] shadow-md" 
                    : "bg-white border-[#deded4]/50 border hover:border-[#85c254]/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Bu Sari" className="size-12 sm:size-14 rounded-full object-cover border border-[#deded4]" />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#15240a]">Bu Sari</h3>
                      <p className="text-[10px] sm:text-[11px] text-[#666a60] mt-0.5">Pendamping Lapangan</p>
                      <p className="text-[10px] sm:text-[11px] text-[#a4a99d] mt-0.5">• Kepanjen</p>
                    </div>
                  </div>
                  {selectedReviewer === "sari" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1c2a13] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-white shrink-0">
                      <Check size={12} strokeWidth={3} /> Dipilih
                    </span>
                  )}
                </div>
                
                <p className="text-[11px] sm:text-xs text-[#666a60] italic leading-relaxed mb-6 mt-2">
                  "Membantu evaluasi kesesuaian tindakan lapangan dengan kalender tanam kelompok tani."
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-[#deded4]/50 pt-4">
                  <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#666a60]">
                    <div className="size-1.5 rounded-full bg-[#85c254]"></div> Aktif mendampingi kelompok
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-bold ${selectedReviewer === "sari" ? "text-[#15240a]" : "text-[#85c254]"}`}>
                    {selectedReviewer === "sari" ? "Terpilih" : "Pilih"}
                  </span>
                </div>
              </div>

            </div>

            {/* Floating Bottom Action Bar */}
            <div className={`sticky bottom-6 mt-8 rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#deded4]/50 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all delay-500 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#44483f] order-2 sm:order-1">
                <div className="size-1.5 rounded-full bg-[#85c254]"></div>
                Pemberi pertimbangan terpilih: <span className="font-bold text-[#15240a] ml-1">{selectedReviewer === "slamet" ? "Pak Slamet (PPL)" : "Bu Sari (Pendamping)"}</span>
              </div>

              <div className="flex w-full sm:w-auto flex-row items-center gap-3 order-1 sm:order-2">
                <Link to={`/farmer/lands/${landId}/optional-review`} className="flex-1 sm:flex-none flex items-center justify-center text-xs sm:text-sm font-bold text-[#666a60] hover:text-[#15240a] px-2 py-3 transition-colors">
                  Kembali
                </Link>
                <button className="flex-1 sm:flex-none group flex items-center justify-center gap-2 rounded-xl bg-[#1c2a13] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#2d421b] shadow-md hover:shadow-lg">
                  Kirim Permintaan Review 
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>
            
            <div className="h-6"></div>
          </div>
        </main>
      </div>
    </div>
  );
}