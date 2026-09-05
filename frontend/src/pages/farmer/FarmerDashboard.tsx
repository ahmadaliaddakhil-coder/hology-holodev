import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  CloudSun,
  FileCheck2,
  History,
  Leaf,
  Menu,
  Plus,
  Settings,
  Sprout,
  UserCircle2,
  Warehouse,
  X,
} from "lucide-react";
import { getUser } from "../../lib/auth";
import { farmerApi } from "../../services/farmer-api";

const heroImage = "https://www.figma.com/api/mcp/asset/3b17483f-6278-487e-b29e-3726fe9fcd12.png";
const firstFieldImage = "https://www.figma.com/api/mcp/asset/864611c8-3b58-4444-8606-6186e6a5b233.png";
const secondFieldImage = "https://www.figma.com/api/mcp/asset/9b5fa1e3-c8f4-47b4-9d19-270f04e08bb6.png";

type Filter = "Semua Petak Aktif (4)" | "Perlu Tindakan (2)" | "Fase Bunting (1)" | "Fase Vegetatif (3)";

const filters: Filter[] = [
  "Semua Petak Aktif (4)",
  "Perlu Tindakan (2)",
  "Fase Bunting (1)",
  "Fase Vegetatif (3)",
];

type FieldData = { id: string; name: string; location: string; group: string; area: string; variety: string; stage: string; image: string; tone: string; status: string; insightTitle: string; insight: string };

function NavItem({ icon: Icon, label, active = false }: { icon: typeof Warehouse; label: string; active?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${active ? "bg-[#213014] text-white" : "text-[#44483f] hover:bg-[#edf4dc]"}`}>
      <Icon size={18} strokeWidth={1.8} />
      <span className={active ? "font-display text-sm font-bold" : "text-sm font-semibold"}>{label}</span>
    </button>
  );
}

function FieldCard({ field, index }: { field: FieldData; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="overflow-hidden rounded-2xl bg-[#fafaf6] shadow-[0_1px_2px_rgba(21,36,10,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(21,36,10,0.12)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={field.image} alt={`Hamparan sawah ${field.name}`} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15240a]/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-[#15240a]/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{field.location}</span>
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#98cf6a]">{field.group}</p>
            <h3 className="font-display text-2xl font-bold leading-tight">{field.name}</h3>
          </div>
          <span className="shrink-0 rounded bg-white/20 px-2 py-1 text-xs font-semibold backdrop-blur-sm">{field.area}</span>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-lg bg-[#def0ab] px-3 py-1.5 text-[#15240a]">{field.variety}</span>
          <span className={`rounded-lg px-3 py-1.5 ${field.tone === "amber" ? "bg-[#f3e6ca] text-[#6d4c16]" : "bg-[#e4f6b0] text-[#364c23]"}`}>{field.stage}</span>
        </div>
        <div className="flex gap-3 rounded-xl bg-[#e9fcb5] p-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#d7e9a1] text-[#4f8a45]"><CloudSun size={18} /></div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#15240a]">{field.insightTitle}</p>
            <p className="text-sm leading-5 text-[#44483f]">{field.insight}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className={`flex items-center gap-2 text-xs font-semibold ${field.tone === "amber" ? "text-[#b98532]" : "text-[#4f8a45]"}`}><span className={`size-2 rounded-full ${field.tone === "amber" ? "bg-[#b98532]" : "bg-[#4f8a45]"}`} />{field.status}</span>
          <a href={`/farmer/lands/${field.id}`} className="flex items-center gap-2 rounded-xl bg-[#85c254] px-4 py-2.5 text-sm font-semibold text-[#15240a] transition-colors hover:bg-[#98cf6a]">Tinjau Kondisi <ChevronRight size={16} /></a>
        </div>
      </div>
    </motion.article>
  );
}

export function FarmerDashboard() {
  const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [fields, setFields] = useState<FieldData[]>([]);
  const user = getUser();
  void user;

  useEffect(() => {
    let active = true;
    farmerApi.listLands().then(async (lands) => {
      const mapped = await Promise.all(lands.map(async (land, index): Promise<FieldData> => {
        const crop = await farmerApi.getActiveCrop(land.id).catch(() => null);
        const stages = { vegetative: "Fase Vegetatif", flowering: "Fase Berbunga", ripening: "Fase Pematangan", unknown: "Fase belum diketahui" };
        return {
          id: land.id,
          name: land.name,
          location: [land.village || land.district, land.regency].filter(Boolean).join(", ") || "Lokasi tersimpan",
          group: land.location_source === "bmkg_verified" ? "LOKASI BMKG TERVERIFIKASI" : "LAHAN PETANI",
          area: land.description?.match(/Perkiraan luas:\s*([^|]+)/i)?.[1]?.trim() || "Luas belum diisi",
          variety: crop ? [crop.crop_name, crop.variety_name].filter(Boolean).join(" ") : "Konteks tanaman belum diisi",
          stage: crop ? stages[crop.growth_stage] : "Perlu konteks tanaman",
          image: index % 2 === 0 ? firstFieldImage : secondFieldImage,
          tone: crop ? "green" : "amber",
          status: crop ? "Siap ditinjau" : "Lengkapi konteks tanaman",
          insightTitle: "Sinkronisasi BMKG",
          insight: land.adm4_code ? `ADM4 ${land.adm4_code} siap diperbarui` : "Kode wilayah BMKG belum diverifikasi",
        };
      }));
      if (active) setFields(mapped);
    }).catch(() => { if (active) setFields([]); });
    return () => { active = false; };
  }, []);
  const visibleFields = activeFilter === filters[0]
    ? fields
    : fields.filter((field) => activeFilter === filters[1] || (activeFilter === filters[2] ? field.tone === "amber" : field.tone === "green"));

  return (
    <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white"><Leaf size={15} className="text-[#85c254]" /> REMBUKTANI</div>
            <button className="md:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu"><X size={20} /></button>
          </div>
          <button className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a] shadow-sm transition-colors hover:bg-[#98cf6a]"><Plus size={16} /> Tambah Lahan</button>
          <nav className="space-y-1">
            <NavItem icon={Warehouse} label="Beranda" active />
            <a href="/farmer/lands" className="block"><NavItem icon={Sprout} label="Lahan" /></a>
            <NavItem icon={History} label="Riwayat" />
            <NavItem icon={UserCircle2} label="Profil" />
          </nav>
        </div>
        <div className="space-y-4 px-1">
          <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3"><span className="size-2.5 rounded-full bg-[#85c254]" /><div><p className="text-xs font-bold">Sinkronisasi BMKG</p><p className="text-xs text-[#44483f]">Data cuaca aktif</p></div></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div><div><p className="text-xs font-bold">Pak Slamet</p><p className="text-xs text-[#44483f]">Ketua Poktan</p></div></div><Settings size={18} className="text-[#44483f]" /></div>
        </div>
      </aside>

      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#deded4]/60 bg-[#fafaf6]/90 px-4 shadow-sm backdrop-blur-xl sm:px-8">
          <button className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Buka menu"><Menu size={22} /></button>
          <span className="rounded bg-[#e4f6b0] px-2 py-1 text-xs font-semibold">Wilayah: Subak Jatiluwih</span>
          <div className="flex items-center gap-3 sm:gap-4"><span className="hidden items-center gap-2 text-xs font-semibold text-[#44483f] sm:flex"><CloudSun size={18} /> Cerah Berawan 28°C</span><Bell size={17} className="text-[#44483f]" /><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div></div>
        </header>

        <main className="mx-auto max-w-[1200px] space-y-8 px-4 py-8 sm:px-8 lg:py-10">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative min-h-[288px] overflow-hidden rounded-2xl bg-[#15240a] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
            <img src={heroImage} alt="Lanskap sawah Subak Jatiluwih" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#15240a]/90 via-[#15240a]/35 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-[#15240a]/85 via-transparent to-transparent" />
            <div className="relative flex min-h-[288px] flex-col justify-end p-6 sm:p-8"><div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#98cf6a]"><span className="rounded-full bg-[#85c254]/20 px-3 py-1.5 backdrop-blur-md">● Sistem Pemantauan Terpadu BMKG & Subak</span><span>· Sinkron 10 Menit Lalu</span></div><p className="text-base text-[#bacda5]">Selamat Pagi, Pak Mandor</p><h1 className="mt-1 max-w-2xl font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">Lahan mana yang ingin Anda tinjau?</h1><p className="mt-2 max-w-xl text-sm leading-5 text-[#deded4]/90">Pilih petak sawah untuk memeriksa sinkronisasi BMKG dan memulai rembuk keputusan hari ini dengan ketenangan data lapangan.</p></div>
          </motion.section>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${activeFilter === filter ? "bg-[#213014] text-[#85c254]" : "bg-[#fafaf6] text-[#44483f] hover:bg-[#e4f6b0]"}`}>{filter}</button>)}</div><span className="flex w-fit items-center gap-2 rounded-xl bg-[#e9fcb5] px-3 py-2 text-xs font-semibold text-[#364c23]"><Warehouse size={14} /> Wilayah Mandor Petak 1A - 2B</span></div>

          <div className="grid gap-6 lg:grid-cols-2">{visibleFields.map((field, index) => <FieldCard key={field.name} field={field} index={index} />)}</div>

          <section className="space-y-4 pt-2"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#213014] text-[#98cf6a]"><FileCheck2 size={20} /></div><div><h2 className="font-display text-xl font-bold sm:text-2xl">Keputusan Terbaru</h2><p className="text-xs text-[#44483f] sm:text-sm">Risalah rembuk sah dan kesepakatan penanganan air/pupuk kelompok tani</p></div></div><button className="hidden items-center gap-1 text-xs font-semibold text-[#364c23] sm:flex">Arsip Buku Petak <History size={14} /></button></div><article className="flex flex-col gap-5 rounded-2xl bg-[#fafaf6] p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-4"><div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-[#def0ab] text-[#15240a] sm:flex"><FileCheck2 size={22} /></div><div><div className="mb-2 flex flex-wrap items-center gap-2 text-xs"><span className="rounded-md bg-[#d8eaa5] px-2 py-1 font-bold">Blok Tirto A3</span><span className="font-semibold text-[#44483f]">· 3 September 2026</span><span className="rounded-full bg-[#4f8a45]/15 px-2 py-1 font-semibold text-[#4f8a45]">✓ Sah Tercatat di Buku Petak</span></div><h3 className="font-display text-base font-semibold leading-6 sm:text-xl">“Tunda pemupukan urea susulan sampai air irigasi masuk”</h3><div className="mt-3 flex flex-col gap-1 text-xs text-[#44483f] sm:flex-row sm:gap-5"><span>💧 Dasar Bukti: BMKG potensi hujan lokal 15mm/jam</span><span>◷ Jadwal Pintu Air Subak pukul 16:00 WIB</span></div></div></div><div className="shrink-0 text-left lg:text-right"><button className="rounded-xl bg-[#e4f6b0] px-4 py-2.5 text-sm font-semibold text-[#15240a] transition-colors hover:bg-[#cfe99b]">Lihat Risalah Lengkap</button><p className="mt-2 text-xs font-semibold text-[#44483f]">Oleh Pak Slamet (Ketua Poktan)</p></div></article></section>
        </main>
      </div>
    </div>
  );
}
