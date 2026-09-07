import { useState, useEffect } from "react";
import {
  ArrowRight, Bell, CloudSun, Leaf, Menu, 
  Settings, Sprout, UserCircle2, Warehouse, History, 
  ClipboardCheck, AlertTriangle, CloudRain, Check, X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Komponen Navigasi Sidebar (Standar)
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

export function ReviewListPage() {  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("semua");

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
            <Link to={`/reviewer/dashboard`}><NavItem icon={Warehouse} label="Beranda" /></Link>
            <Link to={`/reviewer/review`}><NavItem active icon={ClipboardCheck} label="Review Masuk" /></Link>
            <Link to={`/reviewer/history`}><NavItem icon={History} label="Riwayat" /></Link>
            <Link to={`/reviewer/profile`}><NavItem icon={UserCircle2} label="Profil" /></Link>
          </nav>
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3 text-xs">
            <span className="size-2.5 rounded-full bg-[#85c254] shrink-0" />
            <div>
              <p className="font-bold text-[#15240a]">Sinkronisasi BMKG</p>
              <p className="text-[10px] text-[#56652e]">Data cuaca aktif</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0d1b03] text-white">
                <UserCircle2 size={15} />
              </div>
              <div>
                <p className="max-w-[100px] truncate text-xs font-bold text-[#15240a]">Pak Slamet</p>
                <p className="text-[10px] text-[#666a60]">Ketua Poktan</p>
              </div>
            </div>
            <Settings size={16} className="text-[#666a60] cursor-pointer hover:text-[#15240a]" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-[260px]">        
        
        {/* TOPBAR STANDAR */}
<header className="fixed top-0 left-0 right-0 md:left-[260px] z-30 flex h-14 shrink-0 items-center justify-between bg-[#f3f3ec]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 border-b border-[#deded4]/40">          <div className="flex items-center gap-3">
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl pt-14">
            
            {/* Header Section */}
            <div className={`mb-6 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold leading-tight text-[#15240a]">
                Review Masuk
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#44483f] leading-relaxed max-w-2xl">
                Tinjau kondisi lahan dan berikan pertimbangan sebelum petani mengambil keputusan.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className={`mb-8 flex flex-wrap items-center gap-2 sm:gap-3 transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button 
                onClick={() => setActiveFilter("semua")}
                className={`rounded-full px-4 py-2 text-[10px] sm:text-xs font-bold transition-all ${activeFilter === "semua" ? "bg-[#15240a] text-white shadow-md" : "bg-white border border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]"}`}
              >
                Semua (3)
              </button>
              <button 
                onClick={() => setActiveFilter("menunggu")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] sm:text-xs font-bold transition-all ${activeFilter === "menunggu" ? "bg-[#15240a] text-white shadow-md" : "bg-white border border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]"}`}
              >
                <div className={`size-1.5 rounded-full ${activeFilter === "menunggu" ? "bg-white" : "bg-[#ca8a04]"}`}></div> 
                Menunggu Pertimbangan (3)
              </button>
              <button 
                onClick={() => setActiveFilter("selesai")}
                className={`rounded-full px-4 py-2 text-[10px] sm:text-xs font-bold transition-all ${activeFilter === "selesai" ? "bg-[#15240a] text-white shadow-md" : "bg-white border border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]"}`}
              >
                Sudah Diberi Masukan (0)
              </button>
            </div>

            {/* List Review Masuk */}
            <div className="space-y-4 sm:space-y-5">
              
              {/* Card 1 */}
              <div className={`group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/50 hover:shadow-md delay-200 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs mb-3">
                      <span className="rounded bg-[#e9fcb5] px-2 py-1 font-bold text-[#213014]">Blok Tirto A3 • Padi Inpari 32</span>
                      <span className="text-[#666a60]">Fase Berbunga - HST 58</span>
                    </div>
                    
                    <p className="text-[10px] sm:text-xs text-[#a4a99d] mb-1.5">Pemilik: <span className="font-semibold text-[#666a60]">Pak Budi (Kepanjen, Malang)</span></p>
                    <h3 className="text-sm sm:text-base font-bold text-[#15240a] mb-4 leading-snug">
                      Kondisi perlu ditinjau — Indikasi defisit air & pintu irigasi tersumbat di hilir
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fafaf6] border border-[#deded4]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#44483f]">
                        <CloudSun size={12} className="text-[#666a60]" /> BMKG: Cerah Berawan 28°C
                      </span>
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fff1f2] border border-[#fecdd3]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#9f1239]">
                        <AlertTriangle size={12} className="text-[#e11d48]" /> Field Pulse: "Air berkurang drastis"
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#a4a99d]">
                        • Diajukan 35 menit lalu
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 border-[#deded4]/50 pt-4 md:pt-0 shrink-0">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-[#a16207]">
                      <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Menunggu Pertimbangan
                    </div>
                    <Link to={`/reviewer/review/test`} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#85c254] px-5 py-2.5 text-xs font-bold text-[#15240a] transition-colors hover:bg-[#98cf6a]">
                      Lihat Review <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/50 hover:shadow-md delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs mb-3">
                      <span className="rounded bg-[#e9fcb5] px-2 py-1 font-bold text-[#213014]">Petak Bawah Timur #04 • Padi Ciherang</span>
                      <span className="text-[#666a60]">Fase Pembentukan Malai - HST 46</span>
                    </div>
                    
                    <p className="text-[10px] sm:text-xs text-[#a4a99d] mb-1.5">Pemilik: <span className="font-semibold text-[#666a60]">Bu Ani (Kepanjen, Malang)</span></p>
                    <h3 className="text-sm sm:text-base font-bold text-[#15240a] mb-4 leading-snug">
                      Perlu informasi tambahan — Evaluasi dosis pemupukan susulan saat cuaca mendung
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fafaf6] border border-[#deded4]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#44483f]">
                        <CloudRain size={12} className="text-[#666a60]" /> BMKG: Potensi Hujan Ringan (16:00)
                      </span>
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fffbeb] border border-[#fde68a]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#92400e]">
                        <AlertTriangle size={12} className="text-[#d97706]" /> Field Pulse: "Warna daun sedikit menguning"
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#a4a99d]">
                        • Diajukan 1 jam lalu
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 border-[#deded4]/50 pt-4 md:pt-0 shrink-0">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-[#a16207]">
                      <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Menunggu Pertimbangan
                    </div>
                    <Link to={`/reviewer/review/test`} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#85c254] px-5 py-2.5 text-xs font-bold text-[#15240a] transition-colors hover:bg-[#98cf6a]">
                      Lihat Review <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className={`group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/60 transition-all hover:border-[#85c254]/50 hover:shadow-md delay-400 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs mb-3">
                      <span className="rounded bg-[#e9fcb5] px-2 py-1 font-bold text-[#213014]">Subak Sari A2 • Padi Pandan Wangi</span>
                      <span className="text-[#666a60]">Fase Vegetatif Akhir - HST 34</span>
                    </div>
                    
                    <p className="text-[10px] sm:text-xs text-[#a4a99d] mb-1.5">Pemilik: <span className="font-semibold text-[#666a60]">Pak Slamet Riyadi (Kepanjen, Malang)</span></p>
                    <h3 className="text-sm sm:text-base font-bold text-[#15240a] mb-4 leading-snug">
                      Pemeriksaan drainase sawah sebelum jadwal pemupukan kedua
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#fafaf6] border border-[#deded4]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#44483f]">
                        <CloudSun size={12} className="text-[#666a60]" /> BMKG: Cerah Berawan
                      </span>
                      <span className="flex items-center gap-1.5 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]/50 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-[#166534]">
                        <Check size={12} className="text-[#22c55e]" /> Field Pulse: "Genangan stabil & cukup"
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#a4a99d]">
                        • Diajukan 3 jam lalu
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 border-[#deded4]/50 pt-4 md:pt-0 shrink-0">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef08a]/40 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-[#a16207]">
                      <div className="size-1.5 rounded-full bg-[#ca8a04]"></div> Menunggu Pertimbangan
                    </div>
                    <Link to={`/reviewer/review/test`} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#85c254] px-5 py-2.5 text-xs font-bold text-[#15240a] transition-colors hover:bg-[#98cf6a]">
                      Lihat Review <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="h-10"></div>
          </div>
        </main>
      </div>
    </div>
  );
}