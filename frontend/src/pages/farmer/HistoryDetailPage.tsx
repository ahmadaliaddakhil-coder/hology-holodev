import { useState, useEffect } from "react";
import {
  Bell, UserCircle2, ChevronRight, Share2, Printer, 
  FileText, CheckCircle2, ShieldCheck, Map, Activity, MessageSquare, 
  Clock, MapPin, Eye, BrainCircuit, Droplets, Thermometer, Wind,
  Check, Leaf, History, Sprout, Warehouse, Plus,
  Menu
} from "lucide-react";

// Komponen Navigasi Sidebar
function NavItem({ icon: Icon, label, active = false }: { icon: typeof Warehouse; label: string; active?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${active ? "bg-[#213014] text-white" : "text-[#44483f] hover:bg-[#edf4dc]"}`}>
      <Icon size={18} strokeWidth={1.8} />
      <span className={active ? "font-display text-sm font-bold" : "text-sm font-semibold"}>{label}</span>
    </button>
  );
}

export function HistoryDetailPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a] font-sans overflow-hidden">
      
      {/* Overlay Mobile Sidebar */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-white border-r border-[#deded4]/60 p-5 transition-transform duration-500 ease-in-out ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }`}>
        <div>
          <div className="mb-6 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#15240a] text-white">
              <Leaf size={18} className="text-[#85c254]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">RembukTani</h2>
              <p className="text-[10px] text-[#666a60]">Sistem Cerdas Tani</p>
            </div>
          </div>
          
          <button className="mb-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-2.5 text-xs font-bold text-[#15240a] transition hover:bg-[#98cf6a] hover:scale-[1.02]">
            <Plus size={16} /> Tambah Lahan
          </button>

          <nav className="space-y-1">
            <a href="/farmer/dashboard" className="block"><NavItem icon={Warehouse} label="Beranda" /></a>
            <a href="/farmer/lands" className="block"><NavItem icon={Sprout} label="Lahan" /></a>
            <a href="/farmer/history" className="block"><NavItem active icon={History} label="Riwayat" /></a>
            <a href="/farmer/profile" className="block"><NavItem icon={UserCircle2} label="Profil" /></a>
          </nav>
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-2 rounded-xl bg-[#fafaf6] p-3 text-xs font-semibold">
            <div className="size-2 rounded-full bg-[#85c254] animate-pulse"></div> BMKG Sync <span className="ml-auto text-[10px] text-[#666a60]">Aktif</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white">
              <UserCircle2 size={15} />
            </div>
            <div>
              <p className="text-xs font-bold">Pak Slamet</p>
              <p className="text-[10px] text-[#666a60]">Ketua Poktan Jatiluwih</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="xl:pl-[240px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#deded4]/60 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-1.5 transition-colors hover:bg-black/5 xl:hidden" onClick={() => setMobileNavOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-3 text-xs font-medium text-[#44483f] sm:flex">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> Wilayah: Subak Jatiluwih / Blok Tirto A3</span>
              <span className="h-3 w-px bg-[#deded4]"></span>
              <span className="flex items-center gap-1.5"><Thermometer size={14} /> Cerah Berawan 28°C</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={18} className="cursor-pointer text-[#44483f] transition hover:text-[#15240a]" />
            <div className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#0d1b03] text-white">
              <UserCircle2 size={14} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] p-4 sm:p-6 lg:p-8">
          
          {/* Breadcrumb */}
          <div className={`flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-medium text-[#666a60] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <a href="#" className="hover:text-[#15240a]">Riwayat</a>
            <ChevronRight size={12} className="mx-1" />
            <a href="#" className="hover:text-[#15240a]">Risalah PRT-2026-0842</a>
            <ChevronRight size={12} className="mx-1" />
            <span className="text-[#15240a] font-semibold">Detail Penanganan Langsung</span>
          </div>

          {/* Header Section */}
          <div className={`mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#15240a] font-display">Risalah Penetapan Subak #RT-2026-0842</h1>
                <span className="flex items-center gap-1 rounded-full bg-[#e9fcb5] px-2 py-0.5 text-[10px] font-bold text-[#213014]">
                  <div className="size-1.5 rounded-full bg-[#85c254]"></div> Arsip Resmi
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-xl border border-[#deded4] bg-white px-3 py-2 text-xs font-semibold text-[#44483f] transition hover:bg-[#fafaf6]">
                <Share2 size={14} /> Salin Tautan
              </button>
              <button className="flex items-center gap-1.5 rounded-xl border border-[#deded4] bg-white px-3 py-2 text-xs font-semibold text-[#44483f] transition hover:bg-[#fafaf6]">
                <Printer size={14} /> Cetak Risalah
              </button>
              <button className="flex items-center gap-1.5 rounded-xl bg-[#213014] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2d421b]">
                <FileText size={14} /> Buka Format Bagian
              </button>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* LEFT COLUMN (Main Content) */}
            <div className="space-y-6 lg:col-span-8">
              
              {/* Hero Card: Instruksi Lapangan */}
              <div className={`relative overflow-hidden rounded-2xl bg-[#1a2315] p-5 sm:p-6 text-white shadow-lg transition-all delay-200 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {/* Background Pattern */}
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#85c254]/10 blur-3xl"></div>
                <div className="absolute right-10 top-10 opacity-[0.03]">
                  <ShieldCheck size={180} />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2a3a22] px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-[#d9f59b]">
                    <CheckCircle2 size={14} className="text-[#85c254]" /> Keputusan Mandor Terverifikasi
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-[#a4a99d]">
                    <Clock size={12} /> Selasa Wage, 3 November 2026 • 13:45 WIB
                  </div>
                  
                  <h3 className="mt-5 text-[10px] font-bold tracking-widest text-[#85c254] uppercase">Instruksi Lapangan Mutlak</h3>
                  <p className="mt-2 text-lg sm:text-2xl font-bold leading-snug font-display text-white max-w-[90%]">
                    Tunda pemupukan urea susulan sampai air irigasi masuk jam 16:00 WIB
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-[10px] text-[#a4a99d]">Estimasi Biaya</p>
                      <p className="mt-1 text-sm font-bold text-[#d9f59b]">+Rp 240.000</p>
                      <p className="text-[9px] text-[#a4a99d]">Penghematan 40 kg urea tercuci</p>
                    </div>
                    <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-3">
                      <p className="text-[10px] text-[#a4a99d]">Risiko Gagal</p>
                      <p className="mt-1 text-sm font-bold text-white">0% Risiko</p>
                      <p className="text-[9px] text-[#a4a99d]">Nihil volatilitas pemupukan siang hari</p>
                    </div>
                    <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-3">
                      <p className="text-[10px] text-[#a4a99d]">Rekomendasi Subak</p>
                      <p className="mt-1 text-sm font-bold text-white">100% Selaras</p>
                      <p className="text-[9px] text-[#a4a99d]">Sesuai jadwal giliran irigasi A3</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Observasi Empiris */}
              <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-all delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex items-start justify-between border-b border-[#deded4]/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#f3f3ec]">
                      <Eye size={14} className="text-[#44483f]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#666a60] uppercase tracking-wider">Observasi Empiris</p>
                      <h2 className="text-sm font-bold text-[#15240a]">Alasan Mandor & Realitas Petak Sawah</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#f3f3ec] px-2.5 py-1 text-[9px] font-semibold text-[#44483f] hidden sm:block">
                    Pengamatan Visual Langsung
                  </span>
                </div>
                
                <div className="mt-4 rounded-xl bg-[#fafaf6] p-4 relative">
                  <span className="absolute left-3 top-3 text-4xl text-[#deded4]/60 font-serif leading-none">"</span>
                  <p className="relative z-10 text-xs leading-relaxed text-[#44483f] pl-4 sm:pl-6">
                    Kondisi parit kuarter jam 13:00 WIB masih surut kering, dan tanah sawah cuma macak-macak tipis ke air. Jika dipaksa urea disebar sekarang di bawah terik matahari 31°C tanpa air penggenang aktif, amonia pasti menguap bebas (volatilisasi), pupuk jadi kristal keras sebelum diserap akar. Jadwal bukaan pintu air Subak Tirto masuk jam 16:00 WIB dengan debit 120 L/dtk. Menunggu 2 jam jauh lebih menguntungkan dan menjamin pupuk langsung larut terserap sempurna.
                  </p>
                  <div className="mt-3 flex items-center gap-2 pl-4 sm:pl-6 text-[10px]">
                    <span className="font-bold text-[#15240a]">— Pak Slamet Riyadi</span>
                    <span className="text-[#666a60]">(Ketua Poktan, Tinjauan di Pematang)</span>
                  </div>
                </div>

                <div className="mt-5">
                  <h4 className="text-[10px] font-bold text-[#15240a] flex items-center justify-between mb-3">
                    Dokumentasi Lapangan Kamera Mandor
                    <span className="text-[#666a60] font-normal">Tercatat GPS Lapangan Tirto A3</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="aspect-[4/3] rounded-xl bg-[#deded4] overflow-hidden relative">
                        {/* Placeholder image representation */}
                        <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400" alt="Irigasi" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm rounded text-[8px] text-white px-1.5 py-0.5">13:10 WIB</div>
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-[#15240a]">Pintu Air Kuarter Primer</p>
                      <p className="mt-0.5 text-[9px] text-[#666a60] leading-tight">Masih nampak surut, nihil debit air terjun pendorong material pupuk masuk ke petak.</p>
                    </div>
                    <div>
                      <div className="aspect-[4/3] rounded-xl bg-[#deded4] overflow-hidden relative">
                        {/* Placeholder image representation */}
                        <img src="https://images.unsplash.com/photo-1599824675712-16781223e742?auto=format&fit=crop&q=80&w=400" alt="Sawah" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm rounded text-[8px] text-white px-1.5 py-0.5">13:12 WIB</div>
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-[#15240a]">Permukaan Tanah Macak-macak</p>
                      <p className="mt-0.5 text-[9px] text-[#666a60] leading-tight">Kondisi rentan menguapkan amonia, basah tipis bukan genangan pelarut nitrogen.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Kalkulasi Algoritma */}
              <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-all delay-400 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex items-start justify-between border-b border-[#deded4]/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#213014] text-white">
                      <BrainCircuit size={14} className="text-[#85c254]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#666a60] uppercase tracking-wider">Kalkulasi Algoritmik</p>
                      <h2 className="text-sm font-bold text-[#15240a]">Hasil Analisis Agronomi RembukTani</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-[#666a60]">Indeks Rasionalitas</p>
                    <p className="text-sm font-bold text-[#15240a]">98.4%</p>
                  </div>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-[#44483f]">
                  Sistem mensintesis telemetri tanah dan jadwal iklim mikroklimat BMKG. Varietas Inpari 32 pada HST 55 (Fase Primordia/Bunting) mutlak membutuhkan serapan nitrogen instan tanpa stres suhu. Akar merespon penyerapan optimal tergenang mengalir ({'>'} 10 L/dtk). Memasukkan urea di suhu permukaan 24°C lebih efisien dibanding penaburan pada kondisi macak-macak terik siang.
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <Thermometer size={16} className="mx-auto mb-1 text-[#85c254]" />
                    <p className="text-[9px] font-bold uppercase text-[#666a60]">Suhu Tanah Sore</p>
                    <p className="text-lg font-bold text-[#15240a] mt-0.5">24°C</p>
                    <p className="mt-1 text-[9px] text-[#666a60] leading-tight">Meredam penguapan amonia (NH3) hingga 84% dibanding siang hari (31°C).</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <Wind size={16} className="mx-auto mb-1 text-[#85c254]" />
                    <p className="text-[9px] font-bold uppercase text-[#666a60]">Kondisi Atmosfer</p>
                    <p className="text-lg font-bold text-[#15240a] mt-0.5">Nihil Cb</p>
                    <p className="mt-1 text-[9px] text-[#666a60] leading-tight">Radar BMKG mengonfirmasi ketiadaan awan Cumulonimbus (aman dari badai).</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <Droplets size={16} className="mx-auto mb-1 text-[#85c254]" />
                    <p className="text-[9px] font-bold uppercase text-[#666a60]">Pasokan Air Tersier</p>
                    <p className="text-lg font-bold text-[#15240a] mt-0.5">120 L/dtk</p>
                    <p className="mt-1 text-[9px] text-[#666a60] leading-tight">Debit cukup melarutkan urea ke perakaran, tercapai di formasi giliran sore (Tirto A3).</p>
                  </div>
                </div>

                {/* Chart Graphic Area */}
                <div className="mt-5 overflow-hidden rounded-xl bg-[#1c2a13] p-4 relative h-32 sm:h-40 flex flex-col justify-between">
                  <div>
                    <h5 className="text-[10px] font-bold text-white">Model Efektivitas Serapan Nitrogen Padi</h5>
                    <p className="text-[9px] text-[#a4a99d]">Inpari 32</p>
                  </div>
                  
                  {/* Fake SVG Chart */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32">
                     <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#85c254" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#85c254" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,90 C100,85 200,80 250,75 C280,70 300,20 330,15 C360,10 380,20 400,25 L400,100 L0,100 Z" 
                          fill="url(#chartGradient)"
                        />
                        <path 
                          d="M0,90 C100,85 200,80 250,75 C280,70 300,20 330,15 C360,10 380,20 400,25" 
                          fill="none" stroke="#85c254" strokeWidth="2"
                        />
                        <circle cx="330" cy="15" r="4" fill="#d9f59b" />
                     </svg>
                  </div>

                  <div className="relative z-10 flex justify-between text-[8px] sm:text-[9px] text-[#a4a99d] mt-auto pb-1">
                    <span>13:00 WIB (Siang Terik 31°C, Air Macak) - <br className="sm:hidden"/>Risiko Volatilitas</span>
                    <span className="text-right">16:00 WIB (Puncak Serapan, Air Masuk) - <br className="sm:hidden"/><strong className="text-white">Efisiensi Maksimal</strong></span>
                  </div>
                </div>
              </div>

              {/* Card 4: Komentar PPL */}
              <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-all delay-500 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex items-center justify-between border-b border-[#deded4]/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#f3f3ec]">
                      <MessageSquare size={14} className="text-[#44483f]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#666a60] uppercase tracking-wider">Konsensus Lapangan</p>
                      <h2 className="text-sm font-bold text-[#15240a]">Catatan Musyawarah & Komentar PPL</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#e9fcb5] px-2.5 py-1 text-[9px] font-bold text-[#213014]">
                    2 Catatan Tercatat
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#213014] text-[10px] font-bold text-white">SR</div>
                    <div className="flex-1 rounded-xl rounded-tl-none bg-[#fafaf6] p-3 border border-[#deded4]/40">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-[#15240a]">Bu Seri Rahayu, S.P. <span className="text-[#85c254] font-normal">• PPL (Penyuluh Lapangan)</span></p>
                        <span className="text-[9px] text-[#666a60]">14:02 WIB</span>
                      </div>
                      <p className="text-xs text-[#44483f]">
                        "Sepakat! Mengingat primordia urgen dijaga, tunggu Poktan Tirto Mulyo cukupi air dulu. Kondisi sore tak berisiko bagi daun, urea justru larut turun perlahan ke tengah. Jangan sampai over-dosis di sebelah bawah tangkai. Silakan eksekusi pantau debit air terbuang."
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#56652e] text-[10px] font-bold text-white">PS</div>
                    <div className="flex-1 rounded-xl rounded-tl-none bg-[#fafaf6] p-3 border border-[#deded4]/40">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-[#15240a]">Pak Slamet Riyadi <span className="text-[#666a60] font-normal">• Mandor / Penulis</span></p>
                        <span className="text-[9px] text-[#666a60]">14:15 WIB</span>
                      </div>
                      <p className="text-xs text-[#44483f]">
                        "Sudah diinstruksikan ke regu. Dua pejuang tani nambah <i>stanby</i> di saung pintu A3 lepas jam 16:15 WIB begitu arus lintasan lancar masuk menutupi pelataran genangan."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (Sidebar Details) */}
            <div className="space-y-6 lg:col-span-4">
              
              {/* Identitas Lahan Card */}
              <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-all delay-300 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold tracking-widest text-[#666a60] uppercase">Identitas Lahan</h3>
                  <Map size={14} className="text-[#85c254]" />
                </div>
                
                <div className="aspect-video w-full rounded-xl bg-[#2a3a22] relative overflow-hidden flex items-end p-2 sm:p-3">
                   {/* Fake Map Grid Pattern */}
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#85c254 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                   <div className="relative z-10 flex items-center gap-1.5 rounded-lg bg-black/50 backdrop-blur-md px-2 py-1 text-[9px] text-white">
                      <MapPin size={10} className="text-[#d9f59b]" /> Blok Tirto A3 • -8.1394, 112.5...
                   </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <p className="text-[9px] text-[#666a60]">Luas Hamparan</p>
                    <p className="mt-1 text-sm font-bold text-[#15240a]">0.85 Hektar</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <p className="text-[9px] text-[#666a60]">Varietas</p>
                    <p className="mt-1 text-sm font-bold text-[#15240a]">Inpari 32</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <p className="text-[9px] text-[#666a60]">Umur Tanam</p>
                    <p className="mt-1 text-sm font-bold text-[#15240a]">HST 55</p>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-center border border-[#deded4]/40">
                    <p className="text-[9px] text-[#666a60]">Fase Tumbuh</p>
                    <p className="mt-1 text-sm font-bold text-[#15240a]">Bunting Muda</p>
                  </div>
                </div>
              </div>

              {/* Progres Penugasan Card */}
              <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-all delay-400 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold tracking-widest text-[#666a60] uppercase">Progres Penugasan</h3>
                  <Activity size={14} className="text-[#d97706]" />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#fffbeb] p-3 border border-[#fcd34d]/40 mb-4">
                  <div className="size-2 rounded-full bg-[#d97706] animate-pulse"></div>
                  <div>
                    <p className="text-[9px] text-[#92400e]">Status</p>
                    <p className="text-xs font-bold text-[#b45309]">Sedang Dilaksanakan</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between border-b border-[#deded4]/40 pb-2">
                    <span className="text-[10px] text-[#666a60]">Regu Eksekusi</span>
                    <span className="text-[10px] font-bold text-[#15240a] text-right">2 Orang Regu Siaga Puput</span>
                  </div>
                  <div className="flex justify-between border-b border-[#deded4]/40 pb-2">
                    <span className="text-[10px] text-[#666a60]">Waktu Eksekusi</span>
                    <span className="text-[10px] font-bold text-[#15240a]">Jam 16:00 WIB</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-[#666a60]">
                    <div className="flex size-4 items-center justify-center rounded-full border border-[#deded4]">
                       <div className="size-1.5 rounded-full bg-[#deded4]"></div>
                    </div>
                    Menunggu debit air terisi penuh
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-xs font-bold text-[#15240a] transition hover:bg-[#98cf6a]">
                  <Check size={16} /> Tandai Selesai Dikerjakan
                </button>
              </div>

              {/* Jejak Audit Otentik */}
              <div className={`rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-all delay-500 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[10px] font-bold tracking-widest text-[#666a60] uppercase">Jejak Audit Otentik</h3>
                  <History size={14} className="text-[#666a60]" />
                </div>

                <div className="relative border-l border-[#deded4] ml-2 space-y-5">
                  {/* Timeline 1 */}
                  <div className="relative pl-4">
                    <div className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-[#85c254] shadow-[0_0_0_3px_#fff]"></div>
                    <p className="text-[9px] text-[#666a60]">13:45 WIB</p>
                    <p className="text-[10px] font-bold text-[#15240a] mt-0.5">Keputusan Disahkan</p>
                    <p className="text-[9px] text-[#44483f] mt-0.5">Oleh Pak Slamet Riyadi melalui Bukti Lapangan.</p>
                  </div>
                  
                  {/* Timeline 2 */}
                  <div className="relative pl-4">
                    <div className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_0_3px_#fff]"></div>
                    <p className="text-[9px] text-[#666a60]">13:48 WIB</p>
                    <p className="text-[10px] font-bold text-[#15240a] mt-0.5">Saluran WhatsApp Otomatis</p>
                    <p className="text-[9px] text-[#44483f] mt-0.5">Terkirim ke 24 anggota Grup Subak Tirto A3.</p>
                  </div>

                  {/* Timeline 3 */}
                  <div className="relative pl-4">
                    <div className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-[#85c254] shadow-[0_0_0_3px_#fff]"></div>
                    <p className="text-[9px] text-[#666a60]">14:02 WIB</p>
                    <p className="text-[10px] font-bold text-[#15240a] mt-0.5">Konfirmasi PPL Tersimpan</p>
                    <p className="text-[9px] text-[#44483f] mt-0.5">Verifikasi teknis Bu Seri Rahayu S.P. dicatat.</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between border-t border-[#deded4]/50 pt-4 text-[9px] text-[#666a60]">
                  <div>
                    <p>ID Hash (SHA-256)</p>
                    <p className="font-mono mt-0.5">a2f4c-b93d</p>
                  </div>
                  <div className="text-right">
                    <p>Tervalidasi</p>
                    <p className="font-bold text-[#15240a] mt-0.5">RembukNet</p>
                  </div>
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