import { useState } from "react";
import {
  Bell, Check, ChevronDown, CloudSun, FileSearch, Leaf, Menu, Pencil,
  Phone, Settings, Sprout, UserCircle2, Warehouse, X, History, Plus
} from "lucide-react";

const profileImage = "https://www.figma.com/api/mcp/asset/b98aac0d-7251-4b74-8333-81011252265f.png";
const faqs = [
  "Mengapa RembukTani tidak memberi skor risiko 0–100?",
  "Dari mana informasi cuaca dan stasiun BMKG diambil?",
  "Apakah aplikasi tetap berfungsi saat sinyal sawah hilang?",
  "Bagaimana jika Penyuluh belum membalas musyawarah?"
];

function NavItem({ icon: Icon, label, active = false }: { icon: typeof Warehouse; label: string; active?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${active ? "bg-[#213014] text-white" : "text-[#44483f] hover:bg-[#edf4dc]"}`}>
      <Icon size={18} strokeWidth={1.8} />
      <span className={active ? "font-display text-sm font-bold" : "text-sm font-semibold"}>{label}</span>
    </button>
  );
}

export function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [sync, setSync] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a]">
      {/* Overlay for Mobile Sidebar */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-transform duration-300 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-xs font-bold tracking-[0.16em] text-white">
              <Leaf size={15} className="text-[#85c254]" /> REMBUKTANI
            </div>
            <button className="md:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu">
              <X size={20} />
            </button>
          </div>
          <button className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a] shadow-sm transition-colors hover:bg-[#98cf6a]">
            <Plus size={16} /> Tambah Lahan
          </button>
          <nav className="space-y-1">
            <a href="/farmer/dashboard" className="block"><NavItem icon={Warehouse} label="Beranda" /></a>
            <a href="/farmer/lands" className="block"><NavItem icon={Sprout} label="Lahan" /></a>
            <a href="/farmer/history" className="block"><NavItem icon={History} label="Riwayat" /></a>
            <a href="/farmer/profile" className="block"><NavItem active icon={UserCircle2} label="Profil" /></a>
          </nav>
        </div>
        
        <div className="space-y-4 px-1">
          <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3">
            <span className="size-2.5 rounded-full bg-[#85c254]" />
            <div>
              <p className="text-sm font-bold">Sinkronisasi BMKG</p>
              <p className="text-xs text-[#44483f]">Data cuaca aktif</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white">
                <UserCircle2 size={15} />
              </div>
              <div>
                <p className="text-sm font-bold">Pak Slamet</p>
                <p className="text-xs text-[#44483f]">Ketua Poktan</p>
              </div>
            </div>
            <Settings size={18} className="cursor-pointer text-[#44483f] hover:text-[#15240a]" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#deded4]/60 bg-[#fafaf6]/90 px-4 shadow-sm backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Buka menu">
              <Menu size={22} />
            </button>
            <span className="truncate rounded bg-[#e4f6b0] px-2 py-1 text-xs font-semibold max-w-[120px] sm:max-w-none">
              Wilayah: Subak Jatiluwih
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden items-center gap-2 text-sm font-semibold text-[#44483f] sm:flex">
              <CloudSun size={18} /> Cerah Berawan 28°C
            </span>
            <Bell size={17} className="cursor-pointer text-[#44483f]" />
            <div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white">
              <UserCircle2 size={15} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:space-y-8 sm:px-8 lg:py-10">
          
          {/* Title Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[.14em] text-[#56652e]">
                ◉ AKUN MANDOR & KEDAULATAN TANI
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
                Profil & Tata Kelola Poktan
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center rounded-full bg-[#213014] px-3 py-2 text-xs font-semibold text-[#d9f59b]">
                ● Sensor BMKG: Tersinkron
              </span>
              <button 
                onClick={() => setEditing(!editing)} 
                className="flex items-center rounded-full bg-[#213014] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2d421b]"
              >
                <Pencil size={14} className="mr-1.5" /> 
                {editing ? "Simpan Data" : "Sunting Data"}
              </button>
            </div>
          </div>

          {/* Top Grid: Profile & Config */}
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
            
            {/* Profile Card */}
            <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-4 xl:col-span-3">
              <img src={profileImage} alt="Pak Slamet Riyadi" className="mx-auto size-24 rounded-full object-cover sm:size-28" />
              <h2 className="mt-4 text-center text-base font-bold sm:text-lg">Pak Slamet Riyadi</h2>
              <p className="text-center text-xs text-[#666a60] sm:text-sm">ID Anggota: PKT-MLG-0842</p>
              <span className="mx-auto mt-3 block w-fit rounded-full bg-[#def0ab] px-4 py-1.5 text-xs font-semibold sm:text-sm">
                Mandor Lapangan & Ketua Poktan
              </span>
              
              <div className="mt-5 space-y-4 rounded-xl bg-[#fafaf6] p-4 text-xs sm:text-sm">
                <div>
                  <span className="font-bold">⌖ Domisili Wilayah</span>
                  <p className="mt-1 pl-4 text-[#44483f]">Desa Sukoraharjo, Kec. Kepanjen, Kab. Malang</p>
                </div>
                <div>
                  <span className="font-bold">☎ WhatsApp Petani</span>
                  <p className="mt-1 pl-4 text-[#44483f]">0812–3456–7890</p>
                </div>
                <div>
                  <span className="font-bold">⌘ Jejaring Telemetri</span>
                  <p className="mt-1 pl-4 text-[#44483f]">Karangkates & Subak Tirto Mulyo</p>
                </div>
              </div>
            </section>

            {/* Configuration Card */}
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-8 xl:col-span-9">
              <p className="text-xs font-bold tracking-[.14em] text-[#56652e]">↔ KONFIGURASI LAPANGAN</p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">Pengaturan Data & Sambungan</h2>
              <p className="mt-2 text-sm text-[#666a60] md:text-base">Optimalisasi kuota internet dan integrasi telemetri cuaca.</p>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button onClick={() => setSync(!sync)} className="flex flex-col rounded-xl bg-[#fafaf6] p-4 text-left transition hover:bg-[#edf4dc]">
                  <div className="flex w-full items-start justify-between text-sm font-semibold md:text-base">
                    <span>☼ Sinkronisasi BMKG</span>
                    <span className="ml-2 rounded-full bg-[#d9f59b] px-2.5 py-1 text-xs">{sync ? "Aktif" : "Jeda"}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#666a60] sm:text-sm">Pembaruan radar dan angin tiap 60 menit</p>
                  <span className="mt-auto pt-3 text-xs font-medium text-[#44483f]">Stasiun Karangkates (8.4 km)</span>
                </button>

                <button onClick={() => setNotice("Mode hemat kuota diperbarui.")} className="flex flex-col rounded-xl bg-[#fafaf6] p-4 text-left transition hover:bg-[#edf4dc]">
                  <p className="text-sm font-semibold md:text-base">⊕ Hemat Kuota Sawah</p>
                  <p className="mt-2 text-xs text-[#666a60] sm:text-sm">Kompresi paket citra satelit ≤25 KB</p>
                  <span className="mt-auto pt-3 text-xs font-medium text-[#44483f]">Rendah latensi di pematang</span>
                </button>

                <button onClick={() => setNotice("Saluran berbagi siap digunakan.")} className="flex flex-col rounded-xl bg-[#fafaf6] p-4 text-left transition hover:bg-[#edf4dc]">
                  <p className="text-sm font-semibold md:text-base">⌯ Saluran Berbagi</p>
                  <p className="mt-2 text-xs text-[#666a60] sm:text-sm">Kirim ringkasan keputusan musyawarah</p>
                </button>

                <button onClick={() => setNotice("Cadangan terakhir tersedia.")} className="flex flex-col rounded-xl bg-[#fafaf6] p-4 text-left transition hover:bg-[#edf4dc]">
                  <p className="text-sm font-semibold md:text-base">⌂ Penyimpanan Cadangan</p>
                  <p className="mt-2 text-xs text-[#666a60] sm:text-sm">Riwayat semprot & catatan pemupukan</p>
                </button>
              </div>
            </section>
          </div>

          {/* Bottom Grid: Poktan Info & Help Center */}
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
            
            {/* Poktan Info */}
            <section className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm lg:col-span-4 xl:col-span-3">
              <div>
                <h2 className="text-base font-bold sm:text-lg">♣ Poktan Tirto Mulyo</h2>
                <p className="text-xs text-[#666a60] sm:text-sm">Kelompok Tani Wilayah Tirto</p>
                
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-xs sm:text-sm">
                    <span className="text-[#666a60]">Luas Hamparan</span>
                    <strong className="mt-1 block text-lg sm:text-xl">14.8 Ha</strong>
                  </div>
                  <div className="rounded-xl bg-[#fafaf6] p-3 text-xs sm:text-sm">
                    <span className="text-[#666a60]">Fase Rata-rata</span>
                    <strong className="mt-1 block text-lg sm:text-xl">Vegetatif II</strong>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full rounded-xl bg-[#213014] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#2d421b] sm:text-sm">
                ⇩ Unduh Laporan Kegiatan
              </button>
            </section>

            {/* Help & Guidelines */}
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-8 xl:col-span-9">
              <p className="text-xs font-bold tracking-[.14em] text-[#56652e]">▣ PANDUAN & KEDAULATAN DATA</p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">Pusat Bantuan & Prinsip RembukTani</h2>
              
              <div className="mt-6 space-y-3">
                {faqs.map((faq, index) => (
                  <button 
                    key={faq} 
                    onClick={() => setExpanded(expanded === index ? null : index)} 
                    className="flex w-full flex-col rounded-xl bg-[#fafaf6] p-4 text-left transition hover:bg-[#edf4dc]"
                  >
                    <div className="flex w-full items-center gap-3">
                      <span className="shrink-0 rounded bg-[#d9f59b] px-2.5 py-1 text-xs font-bold">0{index + 1}</span>
                      <span className="flex-1 text-sm font-semibold sm:text-base">{faq}</span>
                      <ChevronDown size={18} className={`transition-transform ${expanded === index ? "rotate-180" : ""}`} />
                    </div>
                    {expanded === index && (
                      <div className="ml-11 mt-3 text-xs text-[#666a60] sm:text-sm">
                        RembukTani menjaga keputusan berbasis bukti dan tetap berada di tangan petani. Informasi ditampilkan secara transparan tanpa mengesampingkan kearifan lokal.
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#d9f59b] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <b className="text-base sm:text-lg">Butuh Pendampingan Teknis Langsung?</b>
                  <p className="mt-1 text-xs text-[#44483f] sm:text-sm">Hubungi Posko BPP Kepanjen atau Tim Lapangan RembukTani</p>
                </div>
                <button 
                  onClick={() => setNotice("Tim bantuan akan menghubungi Anda.")} 
                  className="shrink-0 rounded-xl bg-[#85c254] px-5 py-3 text-sm font-bold text-[#15240a] transition hover:bg-[#98cf6a]"
                >
                  <Phone size={16} className="mr-2 inline" /> Bantuan
                </button>
              </div>
            </section>
          </div>

          {/* Toast Notice */}
          {notice && (
            <div role="status" className="fixed bottom-5 right-5 z-50 flex animate-bounce items-center gap-3 rounded-xl bg-[#213014] px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-8 sm:right-8">
              <Check size={18} className="text-[#85c254]" /> 
              {notice}
              <button onClick={() => setNotice("")} aria-label="Tutup" className="ml-2 opacity-80 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}