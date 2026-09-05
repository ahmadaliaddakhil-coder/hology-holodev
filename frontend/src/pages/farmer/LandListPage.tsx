import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  ChevronRight,
  CloudSun,
  Droplets,
  History,
  Leaf,
  MapPin,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  Sprout,
  Thermometer,
  UserCircle2,
  Warehouse,
  X,
} from "lucide-react";
import { farmerApi } from "../../services/farmer-api";

const heroImage = "https://www.figma.com/api/mcp/asset/1226818b-0095-468e-9cf7-37964df49075.png";
const fieldImage = "https://www.figma.com/api/mcp/asset/846a2f3b-dc7b-474b-91dd-5d4d5c1a5f1d.png";

type Filter = "Semua" | "Padi Ciherang" | "Padi Inpari 32" | "Perlu Ditinjau";

const filters: Filter[] = ["Semua", "Padi Ciherang", "Padi Inpari 32", "Perlu Ditinjau"];

type LandCardData = { id: string; name: string; crop: string; location: string; subak: string; stage: string; area: string; humidity: string; review: boolean };

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      <div>
        <div className="mb-6 flex items-center justify-between px-2"><div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white"><Leaf size={15} className="text-[#85c254]" /> REMBUKTANI</div><button className="md:hidden" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button></div>
        <a href="/farmer/lands/new" className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a] shadow-sm hover:bg-[#98cf6a]"><Plus size={16} /> Tambah Lahan</a>
        <nav className="space-y-1">
          <a href="/farmer/dashboard" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><Warehouse size={18} /> Beranda</a>
          <a href="/farmer/lands" className="flex w-full items-center gap-3 rounded-xl bg-[#213014] px-4 py-3 font-display text-sm font-bold text-white"><Sprout size={18} /> Lahan</a>
          <a href="/farmer/history" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><History size={18} /> Riwayat</a>
          <a href="/farmer/profile" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><UserCircle2 size={18} /> Profil</a>
        </nav>
      </div>
      <div className="space-y-4 px-1"><div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3"><span className="size-2.5 rounded-full bg-[#85c254]" /><div><p className="text-xs font-bold">Sinkronisasi BMKG</p><p className="text-xs text-[#44483f]">Data cuaca aktif</p></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div><div><p className="text-xs font-bold">Pak Slamet</p><p className="text-xs text-[#44483f]">Ketua Poktan</p></div></div><Settings size={18} className="text-[#44483f]" /></div></div>
    </aside>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Sprout; label: string; value: string; tone: string }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#fafaf6] p-4 shadow-sm sm:py-5"><div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon size={19} /></div><div className="min-w-0"><p className="text-[10px] font-bold tracking-[0.12em] text-[#44483f]">{label}</p><p className="font-display text-base font-semibold leading-6 text-[#15240a] sm:text-lg">{value}</p></div></div>;
}

function LandCard({ card, index }: { card: LandCardData; index: number }) {
  return <motion.article role="link" tabIndex={0} onClick={() => { window.location.href = `/farmer/lands/${card.id}`; }} onKeyDown={(event) => { if (event.key === "Enter") window.location.href = `/farmer/lands/${card.id}`; }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.4 }} className="cursor-pointer overflow-hidden rounded-2xl bg-[#fafaf6] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="relative h-44 overflow-hidden bg-[#364c23]"><img src={fieldImage} alt={`Foto ${card.name}`} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#15240a]/80 via-transparent to-transparent" /><span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#15240a]/85 px-3 py-1 text-[11px] font-semibold text-[#85c254]"><span className="size-2 rounded-full bg-[#85c254]" /> Siap Tinjau</span><span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-[#15240a]"><Droplets size={12} /> Lengas {card.humidity}</span><div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2 text-white"><div><p className="text-[11px] text-[#bacda5]">Petak Terdaftar</p><h3 className="font-display text-2xl font-bold">{card.name}</h3></div><span className="rounded-md bg-[#85c254] px-2 py-1 text-xs font-semibold text-[#15240a]">{card.area}</span></div></div>
    <div className="space-y-3 p-4"><div className="grid grid-cols-2 gap-3 text-xs"><div className="flex gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /><span>{card.location}</span></div><span className="text-[#666a60]">{card.subak}</span></div><div className="flex items-center justify-between gap-2 rounded-lg bg-[#e9fcb5] p-3 text-[11px] font-semibold"><div className="flex items-center gap-2"><Sprout size={15} /> Varietas Tanaman <strong className="block">{card.crop}</strong></div><span className="rounded-full bg-[#bfe57d] px-2 py-1 text-center text-[10px]">{card.stage}</span></div><div className="flex items-center justify-between gap-2 rounded-lg bg-[#f3f3ec] p-2.5 text-[11px]"><span className="flex items-center gap-1.5"><CloudSun size={15} className="text-[#b98532]" /><strong>24°C, Cerah Berawan</strong></span><span className="rounded bg-white px-2 py-1 text-[#327eaa]">BMKG Real-time</span></div><div className="flex gap-2"><button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#213014] px-2 py-2 text-[11px] font-semibold text-[#85c254] hover:bg-[#364c23]"><ChevronRight size={13} /> Tinjau Kondisi</button><button className="flex-1 rounded-lg bg-[#f3f3ec] px-2 py-2 text-[11px] font-semibold text-[#15240a] hover:bg-[#e4f6b0]">Detail Lahan</button></div></div>
  </motion.article>;
}

export function LandListPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Semua");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [landCards, setLandCards] = useState<LandCardData[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    farmerApi.listLands().then(async (lands) => {
      const cards = await Promise.all(lands.map(async (land): Promise<LandCardData> => {
        const crop = await farmerApi.getActiveCrop(land.id).catch(() => null);
        const stageLabels = { vegetative: "Fase Vegetatif", flowering: "Fase Berbunga", ripening: "Fase Pematangan", unknown: "Fase belum diketahui" };
        return {
          id: land.id,
          name: land.name,
          crop: crop ? [crop.crop_name, crop.variety_name].filter(Boolean).join(" ") : "Konteks belum diisi",
          location: [land.village || land.district, land.regency].filter(Boolean).join(", ") || `${land.latitude.toFixed(4)}, ${land.longitude.toFixed(4)}`,
          subak: land.location_source === "bmkg_verified" ? "Lokasi BMKG terverifikasi" : "Lokasi tersimpan",
          stage: crop ? stageLabels[crop.growth_stage] : "Belum ada fase",
          area: land.description?.match(/Perkiraan luas:\s*([^|]+)/i)?.[1]?.trim() || "Belum diisi",
          humidity: "--",
          review: !crop,
        };
      }));
      if (active) { setLandCards(cards); setLoadState("ready"); }
    }).catch((error: unknown) => {
      if (active) { setLoadError(error instanceof Error ? error.message : "Data lahan gagal dimuat"); setLoadState("error"); }
    });
    return () => { active = false; };
  }, []);
  const visibleCards = loadState === "ready" ? (activeFilter === "Semua" ? landCards : landCards.filter((card) => activeFilter === card.crop || (activeFilter === "Perlu Ditinjau" && card.review))) : [];

  return <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a]"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="md:pl-[260px]"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#deded4]/60 bg-[#fafaf6]/90 px-4 shadow-sm backdrop-blur-xl sm:px-8"><button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={22} /></button><span className="rounded bg-[#e4f6b0] px-2 py-1 text-xs font-semibold">Wilayah: Subak Jatiluwih</span><div className="flex items-center gap-3 sm:gap-4"><span className="hidden items-center gap-2 text-xs font-semibold text-[#44483f] sm:flex"><CloudSun size={18} /> Cerah Berawan 28°C</span><Bell size={17} className="text-[#44483f]" /><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div></div></header>
    <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:px-8 lg:py-8"><motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-[208px] overflow-hidden rounded-2xl bg-[#15240a] shadow-md"><img src={heroImage} alt="Terasering lahan Subak Jatiluwih" className="absolute inset-0 h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-r from-[#15240a]/95 via-[#15240a]/65 to-transparent" /><div className="relative flex min-h-[208px] max-w-2xl flex-col justify-center p-6 sm:p-8"><div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#85c254]"><span className="rounded-full bg-[#85c254]/20 px-3 py-1.5">● Satelit Aktif: Sentinel-2</span><span className="text-[#879974]">· Subak & Poktan Terhubung</span></div><h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Daftar Seluruh Lahan Terdaftar</h1><p className="mt-2 max-w-xl text-sm leading-5 text-[#bacda5]">Kelola petak sawah aktif, pantau kondisi telemetri cuaca, dan lihat riwayat peninjauan secara berkala.</p></div></motion.section>
      <div className="flex flex-col gap-4 pb-1 xl:flex-row xl:items-center xl:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${activeFilter === filter ? "bg-[#15240a] text-[#85c254]" : filter === "Perlu Ditinjau" ? "bg-[#fafaf6] text-[#b98532]" : "bg-[#fafaf6] text-[#44483f] hover:bg-[#e4f6b0]"}`}>{filter === "Semua" && <Check size={13} />}{filter}</button>)}</div><a href="/farmer/lands/new" className="flex w-fit items-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a] shadow-sm hover:bg-[#98cf6a]"><Plus size={16} /> Tambah Lahan Baru</a></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Warehouse} label="TOTAL LAHAN" value="3.59 Ha" tone="bg-[#def0ab]" /><Metric icon={Sprout} label="STATUS VEGETASI" value="Prima (NDVI 0.78)" tone="bg-[#e4f6b0]" /><Metric icon={Thermometer} label="RATA-RATA SUHU" value="24.8°C" tone="bg-[#e9fcb5] text-[#327eaa]" /><Metric icon={ShieldCheck} label="STASIUN BMKG" value="Karangkates" tone="bg-[#d8eaa5]" /></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleCards.map((card, index) => <LandCard key={card.id} card={card} index={index} />)}<a href="/farmer/lands/new" className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-[#e9fcb5] p-6 text-center transition-colors hover:bg-[#def0ab]"><div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#d8eaa5] text-[#213014]"><Plus size={23} /></div><h3 className="font-display font-bold">Daftarkan Petak Baru</h3><p className="mt-2 max-w-[190px] text-xs leading-5 text-[#666a60]">Petakan koordinat sawah baru lewat satelit atau masukkan data manual kelompok tani Anda.</p><span className="mt-4 rounded-lg bg-[#213014] px-3 py-2 text-xs font-semibold text-[#85c254]">Mulai Pemetaan</span></a></div>
      <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-[300px] overflow-hidden rounded-2xl bg-[#102606] p-5 text-white shadow-md"><span className="rounded-full bg-[#85c254] px-2 py-1 text-[10px] font-semibold text-[#15240a]">Rekomendasi Poktan</span><Leaf className="float-right text-[#85c254]" size={20} /><h2 className="mt-4 font-display text-lg font-semibold">Musim Tanam Gadu 2025</h2><p className="mt-2 text-xs leading-5 text-[#bacda5]">Berdasarkan tren curah hujan BMKG Karangkates, penaburan pupuk susulan kedua optimal dilakukan sebelum jam 11:00 WIB di seluruh blok Kepanjen.</p><div className="mt-10 flex items-center justify-between text-[10px] text-[#bacda5]"><span className="flex items-center gap-2"><UserCircle2 size={16} className="text-[#85c254]" /> Penyuluh: Ir. Bambang</span><span className="text-[#85c254]">Konsultasi →</span></div></motion.aside>
      <div className="flex flex-col gap-3 rounded-xl bg-[#e9fcb5] p-4 text-xs text-[#44483f] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#213014]" /> Seluruh petak terhubung dengan Stasiun BMKG Karangkates dan pangkalan data kelompok tani Tirto Mulyo.</span><span className="flex shrink-0 items-center gap-3 font-semibold"><span className="text-[#4f8a45]">● Status Jaringan: Normal</span><button className="hover:text-[#15240a]">⟳ Sinkron Ulang</button></span></div>
    </main></div>{showToast && <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-[#213014] px-4 py-3 text-sm text-white shadow-xl"><Check size={17} className="text-[#85c254]" /> Pemetaan lahan baru siap dimulai.<button onClick={() => setShowToast(false)} aria-label="Tutup notifikasi"><X size={16} /></button></div>}</div>;
}
