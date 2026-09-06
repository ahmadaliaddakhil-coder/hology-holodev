import { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, Bell, ChevronRight, CloudSun, Leaf, Menu, 
  Plus, Settings, Sprout, UserCircle2, Warehouse, History, 
  Users, ClipboardCheck, Check, ShieldCheck, Lightbulb
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

export function OptionalReviewPage() {
  const { landId } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
              <span className="text-[#15240a] font-bold">Rembuk & Konsultasi Pilihan</span>
            </div>

            {/* Header Section */}
            <div className={`mb-8 transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e9fcb5] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold tracking-wider text-[#56652e] uppercase mb-4">
                <div className="size-1.5 rounded-full bg-[#85c254]"></div> MUSYAWARAH & HAK MANDIRI
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight text-[#15240a] max-w-3xl">
                Apakah Anda Perlu Meminta Masukan Tambahan?
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-[#666a60] leading-relaxed max-w-3xl">
                Musyawarah adalah ikhtiar pendukung. Anda dapat meminta tinjauan cepat dari Penyuluh Pertanian Lapangan (PPL) atau langsung mengesahkan tindakan sawah secara mandiri.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
              
              {/* Card 1: Minta Pertimbangan */}
              <div 
                className={`flex flex-col rounded-2xl bg-white p-5 sm:p-7 shadow-sm border border-[#deded4]/40 transition-all duration-700 delay-200 ease-out hover:border-[#85c254]/40 hover:shadow-md ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-[#e9fcb5] text-[#56652e]">
                    <Users size={20} />
                  </div>
                  <span className="rounded-full bg-[#f3f3ec] px-3 py-1 text-[10px] sm:text-xs font-semibold text-[#666a60]">
                    Didiskusikan
                  </span>
                </div>
                
                <h2 className="text-lg sm:text-xl font-bold text-[#15240a] mb-2">
                  Minta Pertimbangan
                </h2>
                <p className="text-[11px] sm:text-xs text-[#666a60] leading-relaxed mb-6 flex-1">
                  Dapatkan masukan dari pihak terpercaya sebelum membuat keputusan.
                </p>

                <div className="rounded-xl bg-[#fafaf6] p-4 border border-[#deded4]/50 mb-6">
                  <h3 className="text-[9px] font-bold tracking-widest text-[#15240a] uppercase mb-3">
                    Yang Akan Diteruskan Ke Reviewer:
                  </h3>
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2 text-[10px] sm:text-xs text-[#44483f]">
                      <Check size={14} className="text-[#85c254] shrink-0" strokeWidth={3} /> Kondisi lahan aktual
                    </li>
                    <li className="flex items-center gap-2 text-[10px] sm:text-xs text-[#44483f]">
                      <Check size={14} className="text-[#85c254] shrink-0" strokeWidth={3} /> Informasi cuaca terkini (BMKG)
                    </li>
                    <li className="flex items-center gap-2 text-[10px] sm:text-xs text-[#44483f]">
                      <Check size={14} className="text-[#85c254] shrink-0" strokeWidth={3} /> Analisis RembukTani
                    </li>
                  </ul>
                </div>

                <Link to={`/farmer/lands/${landId}/select-reviewer`} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c2a13] px-4 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#2d421b]">
                  Minta Review 
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Card 2: Buat Keputusan Sendiri */}
              <div 
                className={`flex flex-col rounded-2xl bg-white p-5 sm:p-7 shadow-sm border border-[#deded4]/40 transition-all duration-700 delay-300 ease-out hover:border-[#85c254]/40 hover:shadow-md ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-[#e9fcb5] text-[#56652e]">
                    <ClipboardCheck size={20} />
                  </div>
                  <span className="rounded-full bg-[#f3f3ec] px-3 py-1 text-[10px] sm:text-xs font-semibold text-[#666a60]">
                    Mandiri
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#15240a] mb-2">
                  Buat Keputusan Sendiri
                </h2>
                <p className="text-[11px] sm:text-xs text-[#666a60] leading-relaxed mb-6 flex-1">
                  Tentukan langkah berdasarkan pengalaman dan kondisi lapangan Anda.
                </p>

                <div className="rounded-xl bg-[#fafaf6] p-4 border border-[#deded4]/50 mb-6 flex items-start gap-3">
                  <ShieldCheck size={16} className="text-[#666a60] shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-xs text-[#44483f] leading-relaxed">
                    <strong className="text-[#15240a]">Otoritas manusia penuh:</strong> Rekomendasi sistem hanyalah pertimbangan; petani tetap memiliki keputusan final yang disimpan dalam riwayat lahan.
                  </p>
                </div>

                {/* mt-auto memastikan tombol tetap di posisi terbawah jika isi konten berbeda tingginya */}
                <div className="mt-auto">
                  <Link to={`/farmer/lands/${landId}/final-decision`} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3.5 text-xs sm:text-sm font-bold text-[#15240a] shadow-md transition-all hover:bg-[#98cf6a] hover:shadow-lg">
                    Buat Keputusan 
                    <ClipboardCheck size={16} className="transition-transform group-hover:scale-110" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Bottom Actions & Info */}
            <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-5 border-t border-[#deded4]/50 pt-6 pb-10 transition-all delay-500 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              
              <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-[#666a60] max-w-md text-center sm:text-left order-2 sm:order-1">
                <Lightbulb size={16} className="text-[#85c254] shrink-0" />
                <p>Penyuluh lapangan dapat melihat log keputusan Anda sewaktu-waktu di dasbor kelompok tani.</p>
              </div>

              <Link to={`/farmer/lands/${landId}/action-alternatives`} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#666a60] transition hover:text-[#15240a] order-1 sm:order-2 shrink-0">
                <ArrowLeft size={16} /> Kembali ke Perbandingan Opsi
              </Link>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}