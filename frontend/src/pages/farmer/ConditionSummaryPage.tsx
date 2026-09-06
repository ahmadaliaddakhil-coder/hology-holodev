import { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, Bell, ChevronRight, CloudSun, Clock,
  Leaf, Menu, Plus, Settings, Sprout, UserCircle2, Warehouse, History, 
  MapPin, CheckCircle2, AlertCircle, CloudRain, Droplets, Wind, Cloud, Info
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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

export function ConditionSummaryPage() {
  const { landId } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const submit = () => {
    nav(`/farmer/lands/${landId}/action-alternatives`);
  }

  return (
    <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a] font-sans overflow-hidden flex">
      
      {/* Overlay Mobile Sidebar */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col justify-between bg-[#fafaf6] border-r border-[#deded4]/60 p-5 transition-transform duration-500 ease-in-out ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:relative lg:translate-x-0"
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
            <button className="rounded-md p-1.5 transition-colors hover:bg-black/5 lg:hidden" onClick={() => setMobileNavOpen(true)}>
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
            
            {/* Breadcrumb & Meta */}
            <div className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium text-[#666a60] mb-4">
                <span className="hover:text-[#15240a] cursor-pointer">Lahan</span>
                <ChevronRight size={12} />
                <span className="hover:text-[#15240a] cursor-pointer">Blok Tirto A3</span>
                <ChevronRight size={12} />
                <span className="text-[#15240a] font-bold">Analisis Kondisi</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e9fcb5] px-3 py-1.5 text-[10px] sm:text-xs font-bold text-[#213014] w-fit">
                  <MapPin size={12} className="text-[#85c254]" /> Blok Tirto A3 • Padi Inpari 32
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#666a60]">
                  <Clock size={12} /> Analisis Terakhir: Hari ini, 10:45 WIB
                </div>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
              
              {/* LEFT COLUMN: Hasil Analisis & Faktor */}
              <div className="lg:col-span-5 xl:col-span-6 space-y-5 sm:space-y-6">
                
                {/* Hero Card: Kondisi Perlu Ditinjau */}
                <div className={`rounded-2xl bg-[#263518] p-5 sm:p-7 text-white shadow-lg transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#394d25] px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-[#d9f59b] uppercase mb-4">
                    <Leaf size={12} /> Hasil Analisis Kondisi Lapangan
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold leading-tight mb-4">
                    Kondisi Perlu Ditinjau
                  </h1>
                  <p className="text-sm sm:text-base text-[#d1d5c9] leading-relaxed max-w-lg">
                    RembukTani menemukan beberapa hal yang perlu diperhatikan berdasarkan informasi cuaca, kondisi lapangan, dan tanaman. <strong className="text-white">Ketersediaan air di petak saat ini mulai terbatas</strong> sementara tanaman memasuki fase pembungaan yang memerlukan kelembapan stabil.
                  </p>
                </div>

                {/* Card: Faktor Pendukung */}
                <div className={`rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/40 transition-all delay-200 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#f3f3ec]">
                      <CheckCircle2 size={16} className="text-[#44483f]" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-[#15240a]">Faktor Pendukung yang Menguatkan</h2>
                  </div>

                  <div className="space-y-5">
                    {/* Faktor 1 */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 flex size-8 items-center justify-center rounded-full bg-[#e9fcb5] text-[#56652e]">
                        <Sprout size={16} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#15240a]">Fase Pembungaan Padi (55 HST)</h3>
                        <p className="mt-1 text-[12px] sm:text-sm text-[#666a60] leading-relaxed">
                          Membutuhkan kelembapan tanah stabil tanpa genangan tinggi agar serbukan malai padi tidak rusak terendam.
                        </p>
                      </div>
                    </div>
                    {/* Faktor 2 */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 flex size-8 items-center justify-center rounded-full bg-[#e9fcb5] text-[#56652e]">
                        <CloudSun size={16} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#15240a]">Prakiraan BMKG Lokal Teruji</h3>
                        <p className="mt-1 text-[12px] sm:text-sm text-[#666a60] leading-relaxed">
                          Cuaca diprediksi cerah berawan hingga sore hari, sangat aman dari risiko hujan lebat mendadak yang dapat menghanyutkan pupuk.
                        </p>
                      </div>
                    </div>
                    {/* Faktor 3 */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 flex size-8 items-center justify-center rounded-full bg-[#e9fcb5] text-[#56652e]">
                        <Droplets size={16} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#15240a]">Jadwal Saluran Primer Subak</h3>
                        <p className="mt-1 text-[12px] sm:text-sm text-[#666a60] leading-relaxed">
                          Pintu air subak dijadwalkan mengalir pukul 16:00 WIB sesuai musyawarah sedahan minggu lalu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Variables & BMKG */}
              <div className="lg:col-span-5 xl:col-span-6 space-y-5 sm:space-y-6">
                
                {/* Card: Unknown Variables */}
                <div className={`rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#deded4]/40 transition-all delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex size-7 items-center justify-center rounded-full bg-[#fef08a] text-[#a16207]">
                      <AlertCircle size={14} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#15240a]">Yang Masih Belum Diketahui</h2>
                      <p className="text-xs sm:text-sm text-[#666a60]">Variabel tak terukur di luar sistem</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 pl-1">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[#44483f] leading-relaxed">
                      <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ef4444]"></div>
                      Debit pasti air subak saat pintu dibuka sore nanti (sangat bergantung pada ketinggian waduk hulu dan bagi air blok hulu).
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[#44483f] leading-relaxed">
                      <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#f59e0b]"></div>
                      Keberadaan hama wereng coklat di petak tetangga sebelah timur yang belum memasukkan laporan ronda mingguan.
                    </li>
                  </ul>
                </div>

                {/* Card: BMKG Terperinci */}
                <div className={`rounded-2xl bg-[#1c2a13] p-5 sm:p-6 text-white shadow-lg transition-all delay-400 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2d421b] px-2.5 py-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-[#85c254] uppercase mb-1.5">
                        <CloudRain size={10} /> Data Satelit Cuaca
                      </div>
                      <h2 className="text-sm sm:text-base font-bold">Informasi BMKG Terperinci</h2>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-[#a4a99d] text-right mt-1">Stasiun Karangkates<br/>(4.2 km)</span>
                  </div>

                  {/* Highlight Weather */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-5">
                    <div className="flex items-center gap-3">
                      <CloudSun size={32} className="text-[#d9f59b]" strokeWidth={1.5} />
                      <div>
                        <div className="text-2xl sm:text-3xl font-display font-bold">24°C</div>
                        <div className="text-[11px] sm:text-xs text-[#d1d5c9]">Cerah Berawan</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-[#85c254]/20 px-2.5 py-0.5 text-[9px] font-bold text-[#85c254] mb-1">Aktif</span>
                      <div className="text-[9px] sm:text-[10px] text-[#a4a99d]">Stasiun Otomatis</div>
                    </div>
                  </div>

                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#a4a99d] mb-1">
                        <Droplets size={12} className="text-[#85c254]" /> Kelembapan
                      </div>
                      <div className="text-sm font-bold">85% RH</div>
                      <div className="text-[9px] text-[#a4a99d]">Kategori lembap basah</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#a4a99d] mb-1">
                        <Wind size={12} className="text-[#85c254]" /> Kecepatan Angin
                      </div>
                      <div className="text-sm font-bold">13 km/jam</div>
                      <div className="text-[9px] text-[#a4a99d]">Arah Tenggara</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#a4a99d] mb-1">
                        <CloudRain size={12} className="text-[#85c254]" /> Potensi Hujan 24J
                      </div>
                      <div className="text-sm font-bold">12-18 mm</div>
                      <div className="text-[9px] text-[#a4a99d]">Probabilitas 65%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#a4a99d] mb-1">
                        <Cloud size={12} className="text-[#85c254]" /> Tutupan Awan
                      </div>
                      <div className="text-sm font-bold">45% Area</div>
                      <div className="text-[9px] text-[#a4a99d]">Awan Rendah & Menengah</div>
                    </div>
                  </div>

                  {/* Chart Section */}
                  <div className="rounded-xl bg-[#263518] p-3 sm:p-4 relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] sm:text-[10px] text-[#d1d5c9]">Pola Estimasi Curah Hujan Hari Ini</span>
                      <span className="text-[9px] sm:text-[10px] text-[#85c254]">Puncak: 14:00 - 17:00</span>
                    </div>
                    
                    {/* Minimalist SVG Chart */}
                    <div className="h-16 sm:h-20 w-full relative">
                      <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#85c254" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#85c254" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,70 C50,68 100,65 150,60 C180,50 200,20 230,15 C260,10 280,25 320,35 C360,45 380,65 400,70 L400,80 L0,80 Z" 
                          fill="url(#rainGradient)"
                        />
                        <path 
                          d="M0,70 C50,68 100,65 150,60 C180,50 200,20 230,15 C260,10 280,25 320,35 C360,45 380,65 400,70" 
                          fill="none" stroke="#85c254" strokeWidth="2.5" strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[8px] sm:text-[9px] text-[#a4a99d] mt-2">
                      <span>09:00</span>
                      <span>12:00</span>
                      <span className="text-[#d9f59b]">15:00 (Hujan)</span>
                      <span>18:00</span>
                      <span>21:00</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 text-[8px] sm:text-[9px] text-[#a4a99d] leading-relaxed">
                    <Info size={12} className="shrink-0 mt-0.5" />
                    Prakiraan BMKG berbasis probabilitas kecamatan; kondisi mikro di petak sawah Blok Tirto dapat bervariasi mengikuti kontur bukit sekitar.
                  </div>
                </div>

                {/* Contact Card */}
                <div className={`rounded-2xl bg-white p-4 sm:p-5 flex items-center justify-between shadow-sm border border-[#deded4]/40 transition-all delay-500 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#56652e] text-xs font-bold text-white">WP</div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#15240a]">Wayan Pande <span className="text-[#666a60] font-normal">(Penyuluh)</span></h3>
                      <p className="text-[10px] sm:text-[11px] text-[#44483f] mt-0.5">"Pupuk urea sudah tersedia di lumbung"</p>
                    </div>
                  </div>
                  <button className="text-[10px] sm:text-xs font-bold text-[#15240a] transition hover:text-[#85c254]">Kontak</button>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`mt-8 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pb-8 transition-all delay-700 duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#deded4] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#44483f] transition hover:bg-[#fafaf6] hover:text-[#15240a] w-full sm:w-auto">
                <ArrowLeft size={16} /> Kembali ke Field Pulse
              </button>
              <button onClick={submit} className="flex items-center justify-center gap-2 rounded-xl bg-[#85c254] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#15240a] shadow-lg transition hover:bg-[#98cf6a] hover:shadow-xl w-full sm:w-auto">
                Lanjutkan ke Opsi Tindakan <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}