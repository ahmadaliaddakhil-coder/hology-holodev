import { useMemo, useState } from "react";
import HistoryStats from "../../components/farmer/history/HistoryStats";
import HistoryFilters from "../../components/farmer/history/HistoryFilters";
import HistoryCard from "../../components/farmer/history/HistoryCard";
import HistoryPagination from "../../components/farmer/history/HistoryPagination";
import { Bell, CloudSun, History, Leaf, Menu, Plus, Settings, Sprout, UserCircle2, Warehouse, X } from "lucide-react";

export type HistoryStatus =
  | "Sah Dicatat"
  | "Terealisasi di Lapangan"
  | "Selesai";

export interface HistoryItem {
  id: string;
  date: string;
  time: string;

  plot: string;
  area: string;
  variety: string;
  phase: string;

  decision: string;
  detail: string;

  evidence: string;
  reviewer: string;

  status: HistoryStatus;
  reference?: string;
  active?: boolean;
}

const historyData: HistoryItem[] = [
  {
    id: "RT-2026-0842",
    date: "Hari ini, 3 Sep 2026",
    time: "13:45 WIB",
    plot: "Blok Tirto A3",
    area: "0.85",
    variety: "Inpari 32",
    phase: "Fase Bunting (55 HST)",
    decision:
      "Tunda pemupukan urea susulan sampai air subak masuk jam 16:00 WIB",
    detail: "Eksekusi sore hari ini",
    evidence: "BMKG Karangkates + Pematang",
    reviewer: "PPL Bu Sari",
    status: "Sah Dicatat",
    reference: "#RT-2026-0842",
    active: true,
  },
  {
    id: "RT-2026-0828",
    date: "28 Agu 2026",
    time: "15:40 WIB",
    plot: "Blok Tirto A3",
    area: "0.85",
    variety: "Inpari 32",
    phase: "Fase Anakan (49 HST)",
    decision:
      "Buka pintu pembuangan 2 jari setelah hujan lebat untuk hindari genangan berlebih",
    detail: "Mengatur tinggi muka air ideal 3–5 cm",
    evidence: "BMKG Curah Hujan 45mm",
    reviewer: "Mandiri Petani",
    status: "Terealisasi di Lapangan",
  },
  {
    id: "RT-2026-0824",
    date: "24 Agu 2026",
    time: "09:15 WIB",
    plot: "Petak Bawah Timur #04",
    area: "1.2",
    variety: "Ciherang",
    phase: "Anakan Awal (28 HST)",
    decision:
      "Lakukan penyiangan gulma mekanis manual sebelum tabur pupuk dasar kedua",
    detail: "Pembersihan teki & eceng padi liar",
    evidence: "Pengamatan Lapangan",
    reviewer: "PPL Ir. Bambang",
    status: "Selesai",
  },
  {
    id: "RT-2026-0818",
    date: "18 Agu 2026",
    time: "08:30 WIB",
    plot: "Petak Sawah Barat",
    area: "0.65",
    variety: "Inpari 32",
    phase: "Pengisian Bulir (65 HST)",
    decision:
      "Keringkan parit pematusan petak (intermittent drying) selama 4 hari",
    detail: "Pencegahan rebah batang & sirkulasi oksigen perakaran",
    evidence: "Giliran Air Subak + BMKG",
    reviewer: "Mandiri Petani",
    status: "Selesai",
  },
  {
    id: "RT-2026-0812",
    date: "12 Agu 2026",
    time: "16:00 WIB",
    plot: "Blok Timur Rawa 02",
    area: "0.9",
    variety: "Ciherang",
    phase: "Pembentukan Malai (42 HST)",
    decision:
      "Semprot pencegahan blast leher dengan takaran organik saat cuaca teduh",
    detail: "Ekstrak daun mimba + agen hayati Trichoderma",
    evidence: "Ronda Hama Poktan",
    reviewer: "PPL Bu Sari",
    status: "Selesai",
  },
];

function NavItem({ icon: Icon, label, active = false }: { icon: typeof Warehouse; label: string; active?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${active ? "bg-[#213014] text-white" : "text-[#44483f] hover:bg-[#edf4dc]"}`}>
      <Icon size={18} strokeWidth={1.8} />
      <span className={active ? "font-display text-sm font-bold" : "text-sm font-semibold"}>{label}</span>
    </button>
  );
}

export default function HistoryPage() {
  const [selectedPlot, setSelectedPlot] = useState("Semua Petak (14)");
  const [selectedSeason, setSelectedSeason] = useState("Gadu 2026");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return historyData.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.id.toLowerCase().includes(keyword) ||
        item.plot.toLowerCase().includes(keyword) ||
        item.decision.toLowerCase().includes(keyword) ||
        item.variety.toLowerCase().includes(keyword);

      const matchesPlot =
        selectedPlot === "Semua Petak (14)" ||
        item.plot.toLowerCase().includes(
          selectedPlot
            .replace(/\(\d+\)/, "")
            .trim()
            .toLowerCase(),
        );

      return matchesSearch && matchesPlot;
    });
  }, [search, selectedPlot]);

  return (
    <div className="min-h-screen bg-[#f3f3ec] text-[#15240a]">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#c5c8bc]/30 bg-[#fafaf6]/90 px-4 backdrop-blur-xl lg:hidden">
        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-base font-extrabold">
            RembukTani
          </p>
          <p className="text-[10px] font-medium text-[#364c23]">
            Sistem Presisi Tani
          </p>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#15240a] text-xs font-bold text-[#85c254]"
        >
          PS
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white"><Leaf size={15} className="text-[#85c254]" /> REMBUKTANI</div>
            <button className="md:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu"><X size={20} /></button>
          </div>
          <button className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a] shadow-sm transition-colors hover:bg-[#98cf6a]"><Plus size={16} /> Tambah Lahan</button>
          <nav className="space-y-1">
            <a href="/farmer/dashboard" className="block"><NavItem icon={Warehouse} label="Beranda" /></a>
            <a href="/farmer/lands" className="block"><NavItem icon={Sprout} label="Lahan" /></a>
            <a href="/farmer/history" className="block"><NavItem active icon={History} label="Riwayat" /></a>
            <a href="/farmer/profile" className="block"><NavItem icon={UserCircle2} label="Profil" /></a>
          </nav>
        </div>
        <div className="space-y-4 px-1">
          <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3"><span className="size-2.5 rounded-full bg-[#85c254]" /><div><p className="text-xs font-bold">Sinkronisasi BMKG</p><p className="text-xs text-[#44483f]">Data cuaca aktif</p></div></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div><div><p className="text-xs font-bold">Pak Slamet</p><p className="text-xs text-[#44483f]">Ketua Poktan</p></div></div><Settings size={18} className="text-[#44483f]" /></div>
        </div>
      </aside>

      {/* Main */}
      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#deded4]/60 bg-[#fafaf6]/90 px-4 shadow-sm backdrop-blur-xl sm:px-8">
          <button className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Buka menu"><Menu size={22} /></button>
          <span className="rounded bg-[#e4f6b0] px-2 py-1 text-xs font-semibold">Wilayah: Subak Jatiluwih</span>
          <div className="flex items-center gap-3 sm:gap-4"><span className="hidden items-center gap-2 text-xs font-semibold text-[#44483f] sm:flex"><CloudSun size={18} /> Cerah Berawan 28°C</span><Bell size={17} className="text-[#44483f]" /><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div></div>
        </header>

        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-16">
          {/* Heading */}
          <section className="animate-[fadeUp_.45s_ease-out]">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#364c23]">
                  <span>▰</span>
                  Arsip Resmi Musyawarah Tani
                </div>

                <h2 className="max-w-3xl font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-tight tracking-[-0.6px] sm:text-4xl">
                  Riwayat Keputusan & Arsip Buku Petak
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-[22px] text-[#44483f]">
                  Rekam jejak seluruh musyawarah dan ketetapan mandor untuk
                  seluruh petak sawah aktif di Subak Tirto Mulyo. Terintegrasi
                  dengan telemetry cuaca dan catatan PPL.
                </p>
              </div>

              <button
                type="button"
                className="flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold shadow-[0_2px_4px_rgba(21,36,10,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
              >
                ↓
                <span>
                  Unduh Rekap Buku Petak
                  <br />
                  (PDF/Excel)
                </span>
              </button>
            </div>
          </section>

          <div className="mt-6 space-y-8">
            <HistoryStats />

            <HistoryFilters
              selectedPlot={selectedPlot}
              selectedSeason={selectedSeason}
              search={search}
              onPlotChange={setSelectedPlot}
              onSeasonChange={setSelectedSeason}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />

            {/* Column heading */}
            <div className="hidden grid-cols-12 gap-4 px-6 text-[10px] font-bold uppercase tracking-[0.6px] text-[#364c23] md:grid">
              <div className="col-span-2">Tanggal & Waktu</div>
              <div className="col-span-2">Petak Lahan</div>
              <div className="col-span-4">Keputusan Sah Mandor</div>
              <div className="col-span-2">
                Pilar Bukti & Reviewer
              </div>
              <div className="col-span-2 text-right">
                Status & Tindakan
              </div>
            </div>

            {/* History */}
            <section className="space-y-3">
              {filteredData.map((item, index) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}

              {filteredData.length === 0 && (
                <div className="rounded-2xl bg-white p-10 text-center shadow-[0_2px_10px_rgba(21,36,10,0.06)]">
                  <p className="font-semibold">Data tidak ditemukan</p>
                  <p className="mt-1 text-sm text-[#75786e]">
                    Coba ubah kata kunci pencarian atau filter petak.
                  </p>
                </div>
              )}
            </section>

            <HistoryPagination
              page={page}
              total={14}
              shown={filteredData.length}
              onPageChange={setPage}
            />

            {/* Data sovereignty */}
            <div className="flex items-start gap-3 rounded-2xl bg-[#213014] p-4 text-[#f3ffcc]/90 shadow-sm">
              <span className="mt-0.5 text-lg text-[#85c254]">♧</span>

              <p className="text-[11px] font-semibold leading-[19px]">
                <strong>Kedaulatan Data Tani:</strong>{" "}
                Seluruh catatan tersimpan permanen di perangkat lokal mandor
                dan pangkalan data kelompok tani Subak Tirto Mulyo secara
                terdesentralisasi, aman dari manipulasi sepihak.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global lightweight animation */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}