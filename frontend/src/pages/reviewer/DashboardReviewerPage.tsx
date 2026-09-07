import { useState, useEffect } from "react";
import {
  ArrowRight, Bell, ChevronRight, CloudSun, Leaf, Menu, 
  Settings, UserCircle2, Warehouse, History,
  CheckCircle2, ClipboardCheck, ChevronDown, AlertTriangle,
  Clock, CloudRain, Check, X
} from "lucide-react";
import { Link } from "react-router-dom";

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

export function DashboardReviewerPage() {  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    // MASTER WRAPPER
    <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a] font-sans overflow-hidden flex">
      
      {/* Overlay Mobile Sidebar */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* SIDEBAR STANDAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-sm transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white">
              <Leaf size={15} className="text-[#85c254]" /> REMBUKTANI
            </div>
            <button className="xl:hidden text-[#44483f] hover:text-[#15240a] transition-colors" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu">
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-1">
            <Link to={`/reviewer/dashboard`}><NavItem active icon={Warehouse} label="Beranda" /></Link>
            <Link to={`/reviewer/review`}><NavItem icon={ClipboardCheck} label="Review Masuk" /></Link>
            <Link to={`/reviewer/history`}><NavItem icon={History} label="Riwayat" /></Link>
            <Link to={`/reviewer/profile`}><NavItem icon={UserCircle2} label="Profil" /></Link>
          </nav>
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3 text-xs">
            <span className="size-2.5 rounded-full bg-[#b98532] shrink-0" />
            <div>
              <p className="font-bold text-[#15240a]">Sinkronisasi BMKG</p>
              <p className="text-[10px] text-[#44483f]">Belum ada bukti cuaca</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0d1b03] text-white">
                <UserCircle2 size={15} />
              </div>
              <div>
                <p className="max-w-[100px] truncate text-xs font-bold text-[#15240a]">Areal</p>
                <p className="text-[10px] text-[#666a60]">Reviewer</p>
              </div>
            </div>
            <Settings size={16} className="text-[#666a60] cursor-pointer hover:text-[#15240a]" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-[260px]">        
        {/* TOPBAR STANDAR */}
        <header className="fixed top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-[#f3f3ec]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 border-b border-[#deded4]/40">
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

        {/* CONTENT BODY */}
        <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:px-8 lg:py-8">
            <div className="pt-14">
            {/* Hero Section */}
            <div className={`mb-8 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold leading-tight text-[#15240a]">
                Selamat datang, Pak Slamet
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#44483f] leading-relaxed max-w-2xl">
                Ada beberapa permintaan pertimbangan yang membutuhkan perhatian Anda sebelum petani mengambil keputusan penanganan air dan pemupukan.
              </p>
            </div>

            {/* Summary Highlight Card */}
            <div className={`mb-10 rounded-3xl bg-[#f5f8ea] p-5 sm:p-7 shadow-sm border border-[#e2e8d3] transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#e9fcb5] text-[#56652e] border border-[#d9f59b]">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/60 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-[#a16207] mb-2">
                      <div className="size-1.5 rounded-full bg-[#ca8a04] animate-pulse"></div> Menunggu Tinjauan
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#15240a] mb-1.5">
                      3 Permintaan Pertimbangan Menunggu
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#666a60] leading-relaxed max-w-xl">
                      Periksa data lapangan, bukti BMKG, dan isian Field Pulse untuk memberikan saran objektif bagi petani sebelum keputusan akhir ditetapkan.
                    </p>
                  </div>
                </div>
                <button className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-[#1c2a13] px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#2d421b] shadow-md hover:shadow-lg shrink-0">
                  Mulai Tinjau Sekarang <ChevronDown size={16} />
                </button>
              </div>

              {/* Filters / Pills */}
              <div className="mt-6 flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar border-t border-[#deded4]/50 pt-5">
                <span className="text-[10px] sm:text-xs font-semibold text-[#666a60] shrink-0 mr-1">Filter Cepat:</span>
                <button className="shrink-0 rounded-full bg-[#15240a] px-4 py-1.5 text-[10px] sm:text-xs font-bold text-white transition-colors">
                  Semua (3)
                </button>
                <button className="shrink-0 rounded-full bg-white border border-[#deded4] px-4 py-1.5 text-[10px] sm:text-xs font-bold text-[#44483f] transition-colors hover:bg-[#fafaf6]">
                  Prioritas Perlu Ditinjau (2)
                </button>
                <button className="shrink-0 rounded-full bg-white border border-[#deded4] px-4 py-1.5 text-[10px] sm:text-xs font-bold text-[#44483f] transition-colors hover:bg-[#fafaf6]">
                  Kondisi Air & Irigasi (1)
                </button>
              </div>
            </div>

            {/* Section 1: Permintaan Review Masuk */}
            <div className={`mb-10 transition-all delay-200 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#15240a]">Permintaan Review Masuk</h3>
                  <p className="text-[10px] sm:text-xs text-[#666a60] mt-1">Tinjau laporan berkala & rekomendasi yang diajukan petani</p>
                </div>
                <button className="text-[10px] sm:text-xs font-bold text-[#15240a] hover:text-[#85c254] flex items-center gap-1 transition-colors">
                  Lihat Semua di Review Masuk <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Request Card 1 */}
                <div className="group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/50 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#666a60]">
                      <span className="text-[#15240a]">Blok Tirto A3 • Padi Inpari 32</span>
                      <span className="hidden sm:inline text-[#deded4]">|</span>
                      <span>Fase Berbunga (HST 58)</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-2.5 py-1 text-[9px] font-bold text-[#a16207]">
                      <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Menunggu Pertimbangan
                    </div>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-[#666a60] mb-2">Pemilik: Pak Budi (Kepanjen, Malang)</p>
                  <h4 className="text-sm sm:text-base font-bold text-[#15240a] mb-4 leading-snug">
                    Kondisi perlu ditinjau — Indikasi defisit air & pintu irigasi tersumbat di hilir
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fafaf6] border border-[#deded4]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#44483f]">
                        <CloudSun size={12} className="text-[#85c254]" /> BMKG: Cerah Berawan 28°C
                      </span>
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fff1f2] border border-[#fecdd3]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#9f1239]">
                        <AlertTriangle size={12} className="text-[#e11d48]" /> Field Pulse: "Air berkurang drastis"
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#a4a99d] w-full sm:w-auto mt-1 sm:mt-0">
                        • Diajukan 35 menit lalu
                      </span>
                    </div>
                    <button className="flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#85c254] px-4 py-2.5 text-[10px] sm:text-xs font-bold text-[#15240a] transition-colors hover:bg-[#98cf6a]">
                      Lihat & Beri Pertimbangan <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Request Card 2 */}
                <div className="group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/50 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#666a60]">
                      <span className="text-[#15240a]">Petak Sawah Timur B1 • Padi Ciherang</span>
                      <span className="hidden sm:inline text-[#deded4]">|</span>
                      <span>Fase Pengisian Bulir (HST 72)</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-2.5 py-1 text-[9px] font-bold text-[#a16207]">
                      <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Menunggu Pertimbangan
                    </div>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-[#666a60] mb-2">Pemilik: Pak Slamet Riyadi (Kepanjen, Malang)</p>
                  <h4 className="text-sm sm:text-base font-bold text-[#15240a] mb-4 leading-snug">
                    Evaluasi Jadwal Pemupukan Susulan saat Cuaca Lembap dan Rintik Sore
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fafaf6] border border-[#deded4]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#44483f]">
                        <CloudRain size={12} className="text-[#3b82f6]" /> BMKG: Potensi Hujan Ringan (16:00)
                      </span>
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#166534]">
                        <Check size={12} className="text-[#22c55e]" /> Field Pulse: "Genangan stabil & cukup"
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#a4a99d] w-full sm:w-auto mt-1 sm:mt-0">
                        • Diajukan 2 jam lalu
                      </span>
                    </div>
                    <button className="flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#85c254] px-4 py-2.5 text-[10px] sm:text-xs font-bold text-[#15240a] transition-colors hover:bg-[#98cf6a]">
                      Tinjau Permintaan <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Request Card 3 */}
                <div className="group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/50 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#666a60]">
                      <span className="text-[#15240a]">Subak Sari A2 • Padi Pandan Wangi</span>
                      <span className="hidden sm:inline text-[#deded4]">|</span>
                      <span>Fase Vegetatif Akhir (HST 34)</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-2.5 py-1 text-[9px] font-bold text-[#a16207]">
                      <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Menunggu Pertimbangan
                    </div>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-[#666a60] mb-2">Pemilik: Ibu Nyoman (Jatiluwih)</p>
                  <h4 className="text-sm sm:text-base font-bold text-[#15240a] mb-4 leading-snug">
                    Pertimbangan Rotasi Gilir Air Antar Petak Terowongan Hulu
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fffbeb] border border-[#fde68a]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#92400e]">
                        <Clock size={12} className="text-[#d97706]" /> Laporan: Debit saluran sekunder menurun
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#a4a99d] w-full sm:w-auto mt-1 sm:mt-0">
                        • Diajukan kemarin sore
                      </span>
                    </div>
                    <button className="flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#85c254] px-4 py-2.5 text-[10px] sm:text-xs font-bold text-[#15240a] transition-colors hover:bg-[#98cf6a]">
                      Tinjau Permintaan <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: Review Terbaru yang Diselesaikan */}
            <div className={`mb-10 transition-all delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#15240a]">Review Terbaru yang Diselesaikan</h3>
                  <p className="text-[10px] sm:text-xs text-[#666a60] mt-1">Pertimbangan yang telah dikirimkan ke petani dan masuk catatan subak</p>
                </div>
                <button className="text-[10px] sm:text-xs font-bold text-[#15240a] hover:text-[#85c254] flex items-center gap-1 transition-colors">
                  Lihat Riwayat Review <ChevronRight size={14} />
                </button>
              </div>

              {/* Completed Request Card */}
              <div className="group flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/30">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] sm:text-xs font-bold text-[#15240a] mb-1">
                    Blok Sawah Selatan • Pak Wayan <span className="font-normal text-[#666a60]">Subak Jatiluwih</span>
                    <span className="inline-flex items-center rounded bg-[#e9fcb5] px-2 py-0.5 text-[9px] font-bold text-[#3f6212]">
                      Selesai dipertimbangkan
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#44483f] italic leading-relaxed mt-2 bg-[#fafaf6] p-3 rounded-xl border border-[#deded4]/40">
                    "Disarankan verifikasi pintu intake primer sebelum pembagian air malam. Lakukan penundaan pupuk urea hingga genangan surut 2 cm."
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#deded4]/50">
                  <span className="text-[9px] sm:text-[10px] text-[#a4a99d] mb-1.5">7 September 2026</span>
                  <button className="text-[10px] sm:text-xs font-bold text-[#15240a] hover:text-[#85c254] flex items-center gap-1 transition-colors">
                    Detail Saran & Keputusan <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
</div>
            <div className="h-10"></div>
        </main>
      </div>
    </div>
  );
}
