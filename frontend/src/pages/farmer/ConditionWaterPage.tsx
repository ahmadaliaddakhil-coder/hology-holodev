import { useState } from "react";
import {
  ArrowLeft, Bell, Check, CheckCircle2, ChevronRight, CloudSun,
  HelpCircle, Leaf, MapPin, Menu, Plus, Search, Settings, 
  Sprout, SunDim, UserCircle2, Warehouse, Waves, History, Circle
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";


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

export function ConditionWaterPage() {
  const { landId } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("tetap");
  const navigate = useNavigate();

  // Data Opsi Jawaban
  const options = [
    {
      id: "kering",
      title: "Lebih Kering",
      desc: "Air berkurang dibanding sebelumnya. Ketinggian permukaan air surut dan rekahan tanah mulai terlihat disela rumpun padi.",
      icon: SunDim
    },
    {
      id: "tetap",
      title: "Tidak Banyak Berubah",
      desc: "Kondisi air masih relatif sama seperti hari-hari sebelumnya. Ketinggian genangan serta kebasahan lumpur tetap stabil terjaga.",
      icon: CheckCircle2
    },
    {
      id: "basah",
      title: "Lebih Basah",
      desc: "Air bertambah dibanding sebelumnya. Terjadi limpasan baru, volume genangan meningkat, atau saluran irigasi baru dibuka.",
      icon: Waves
    },
    {
      id: "gatau",
      title: "Tidak Tahu",
      desc: "Saya belum mengetahui perubahan ketinggian air karena belum sempat turun langsung mengamati petak dalam beberapa hari ini.",
      icon: HelpCircle
    }
  ];

  const submit = () => {
    navigate(`/farmer/lands/${landId}/summary`);
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
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-[#f3f3ec]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
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

        {/* Form Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-2xl">
            
            {/* Top Navigation & Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
              <Link to={`/farmer/lands/${landId}/irrigation`} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#44483f] transition hover:text-[#15240a] w-fit">
                <ArrowLeft size={14} /> Kembali
              </Link>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-[#56652e]">
                <div className="size-1.5 rounded-full bg-[#85c254]"></div>
                Pertanyaan 3 dari 3 Pertanyaan
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 h-2 w-full rounded-full bg-[#deded4] overflow-hidden">
                <motion.div initial={{ width: "66%" }} animate={{ width: "100%" }} className="h-full bg-[#85c254]" />
            </div>

            {/* Title Section */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9fcb5] px-2.5 py-1 text-[10px] font-bold text-[#213014] mb-4">
                <MapPin size={12} className="text-[#85c254]" /> Blok Tirto A3 • Padi Inpari 32
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold leading-tight text-[#15240a]">
                Bagaimana perubahan kondisi air dibanding beberapa hari sebelumnya?
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#666a60] leading-relaxed">
                Pilih kondisi yang paling menggambarkan keadaan genangan atau kelembapan di petak sawah Anda selama beberapa hari terakhir.
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {options.map((option) => {
                const isActive = selectedOption === option.id;
                
                return (
                  <label 
                    key={option.id}
                    className={`group flex cursor-pointer items-start gap-3 sm:gap-4 rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 ${
                      isActive 
                        ? "border-[#85c254] bg-[#e9fcb5] shadow-sm" 
                        : "border-transparent bg-white hover:border-[#deded4] hover:shadow-sm"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="water_condition" 
                      value={option.id} 
                      checked={isActive}
                      onChange={() => setSelectedOption(option.id)}
                      className="peer sr-only"
                    />
                    
                    {/* Checkbox Indicator */}
                    <div className="mt-0.5 shrink-0">
                      {isActive ? (
                        <div className="flex size-5 sm:size-6 items-center justify-center rounded-full bg-[#1c2a13] text-white">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="size-5 sm:size-6 rounded-full bg-[#deded4]/50 transition-colors group-hover:bg-[#deded4]"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`text-sm sm:text-base font-bold ${isActive ? 'text-[#15240a]' : 'text-[#15240a]'}`}>
                        {option.title}
                      </h3>
                      <p className={`mt-1 text-[11px] sm:text-xs leading-relaxed ${isActive ? 'text-[#44483f]' : 'text-[#666a60]'}`}>
                        {option.desc}
                      </p>
                    </div>

                    {/* Decorative Icon */}
                    <div className="shrink-0 pl-2">
                      <option.icon size={20} className={isActive ? "text-[#1c2a13]" : "text-[#a4a99d]"} />
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pb-10">
              <button className="text-xs sm:text-sm font-bold text-[#666a60] transition hover:text-[#15240a] text-center sm:text-left">
                Lewati Pertanyaan Ini
              </button>
              <button onClick={submit} className="flex items-center justify-center gap-2 rounded-xl bg-[#1c2a13] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:bg-[#2d421b] hover:shadow-xl w-full sm:w-auto">
                Analisis <Search size={16} />
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}