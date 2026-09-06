import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, ChevronLeft, CloudSun, FileSearch, Leaf, Minus, Plus, Settings, Sprout, UserCircle2, Warehouse, X } from "lucide-react";
import { clearLandDraft, readLandDraft } from "../../lib/land-draft";
import { farmerApi } from "../../services/farmer-api";

const cropImage = "https://www.figma.com/api/mcp/asset/69a63cd3-cfab-47f3-9eb3-46d730f440d3.png";
const phases = [
  { id: "vegetative", title: "Fase Vegetatif", range: "0 - 35 HST", description: "Pembentukan anakan aktif, pertunasan, dan pembukaan helai daun baru.", icon: "⌁" },
  { id: "flowering", title: "Fase Bunting / Berbunga", range: "36 - 65 HST · Aktif", description: "Pembentukan bunting, bungaan & bulir padi. Sangat sensitif terhadap kekeringan air dan suhu kering.", icon: "✦" },
  { id: "ripening", title: "Fase Pematangan", range: "66 - 110 HST", description: "Pengisian carian susu bulir, pengerasan gabah bernas, dan persiapan panen raya.", icon: "☼" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}><div><div className="mb-6 flex items-center justify-between px-2"><div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white"><Leaf size={15} className="text-[#85c254]" /> REMBUKTANI</div><button className="md:hidden" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button></div><a href="/farmer/lands" className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a]"><Plus size={16} /> Tambah Lahan</a><nav className="space-y-1"><a href="/farmer/dashboard" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><Warehouse size={18} /> Beranda</a><a href="/farmer/lands" className="flex w-full items-center gap-3 rounded-xl bg-[#213014] px-4 py-3 font-display text-sm font-bold text-white"><Sprout size={18} /> Lahan</a><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><FileSearch size={18} /> Riwayat</button><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><UserCircle2 size={18} /> Profil</button></nav></div><div className="space-y-4 px-1"><div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3"><span className="size-2.5 rounded-full bg-[#85c254]" /><div><p className="text-xs font-bold">Sinkronisasi BMKG</p><p className="text-xs text-[#44483f]">Data cuaca aktif</p></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div><div><p className="text-xs font-bold">Pak Slamet</p><p className="text-xs text-[#44483f]">Ketua Poktan</p></div></div><Settings size={18} className="text-[#44483f]" /></div></div></aside>;
}

export function CropContextPage() {
  const draft = readLandDraft();
  const [menuOpen, setMenuOpen] = useState(false);
  const [phase, setPhase] = useState("flowering");
  const [days, setDays] = useState(55);
  const [cropName] = useState("Padi Sawah");
  const [variety] = useState("Inpari 32 HDB");
  const [note, setNote] = useState("");
  const [notice, setNoticeState] = useState("");
  const [, setSaving] = useState(false);

  const saveLand = async () => {
    if (!draft.name || draft.latitude === undefined || draft.longitude === undefined) {
      setNoticeState("Data lahan atau lokasi belum lengkap. Kembali ke langkah pertama.");
      return;
    }
    setSaving(true);
    setNoticeState("");
    let createdLandId: string | null = null;
    try {
      const land = await farmerApi.createLand({
        name: draft.name,
        latitude: draft.latitude,
        longitude: draft.longitude,
        description: [draft.area ? `Perkiraan luas: ${draft.area}` : "", note.trim()].filter(Boolean).join(" | ") || undefined,
        province: draft.province,
        regency: draft.regency,
        district: draft.district,
        village: draft.village,
        location_source: "client_provided",
      });
      createdLandId = land.id;
      const plantedAt = new Date();
      plantedAt.setUTCDate(plantedAt.getUTCDate() - days);
      await farmerApi.createCrop(land.id, {
        crop_name: cropName,
        variety_name: variety,
        growth_stage: phase as "vegetative" | "flowering" | "ripening",
        planting_date: plantedAt.toISOString().slice(0, 10),
      });
      clearLandDraft();
      window.location.href = `/farmer/lands/${land.id}`;
    } catch (error) {
      if (createdLandId) await farmerApi.archiveLand(createdLandId).catch(() => undefined);
      setNoticeState(error instanceof Error ? error.message : "Lahan gagal disimpan ke database.");
    } finally {
      setSaving(false);
    }
  };

  const setNotice = (message: string) => {
    if (message.startsWith("Lahan tersimpan")) {
      void saveLand();
      return;
    }
    setNoticeState(message);
  };

  return <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a]"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="md:pl-[260px]"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#deded4]/60 bg-[#fafaf6]/90 px-4 shadow-sm backdrop-blur-xl sm:px-8"><button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Warehouse size={20} /></button><span className="rounded bg-[#e4f6b0] px-2 py-1 text-xs font-semibold">Wilayah: Subak Jatiluwih</span><div className="flex items-center gap-3 sm:gap-4"><span className="hidden items-center gap-2 text-xs font-semibold text-[#44483f] sm:flex"><CloudSun size={18} /> Cerah Berawan 28°C</span><Bell size={17} /><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div></div></header><main className="mx-auto max-w-[760px] px-4 py-8 sm:px-8 lg:py-10"><div className="flex items-center justify-between gap-3"><a href="/farmer/lands/new/location" className="flex items-center gap-2 text-xs font-semibold text-[#364c23] hover:text-[#15240a]"><ChevronLeft size={14} /> Kembali ke Pilih Lahan</a><span className="flex shrink-0 items-center gap-2 rounded-full bg-[#e4f6b0] px-3 py-1 text-xs font-semibold"><span className="size-2 rounded-full bg-[#85c254]" /> Langkah 2 dari 2</span></div><motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3"><h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Informasi Tanaman & Umur Padi</h1><p className="mt-1 text-xs leading-5 text-[#44483f]">Menentukan kebutuhan air, keamanan pemupukan, dan ketahanan terhadap prakiraan cuaca BMKG.</p><span className="mt-2 inline-flex rounded-full bg-[#e4f6b0] px-3 py-1 text-[10px] font-semibold">◉ Lahan: Blok Tirto A3 · Desa Sukoraharjo, Kepanjen</span></motion.section><div className="relative mt-3 h-20 overflow-hidden rounded-xl bg-[#15240a] shadow-md"><img src={cropImage} alt="Hamparan sawah untuk konteks tanaman" className="h-full w-full object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-r from-[#15240a]/80 via-transparent to-[#15240a]/20" /><div className="absolute inset-x-3 bottom-3 flex justify-between gap-3 text-[10px] font-semibold text-white"><span>♧ Irigasi Subak Tersier Aktif · Aliran Normal</span><span className="text-[#98cf6a]">Status: Siap Kalibrasi</span></div></div><motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} onSubmit={(event) => { event.preventDefault(); setNotice("Lahan tersimpan. Data siap digunakan untuk rembuk keputusan."); }} className="mt-5 space-y-6 rounded-2xl bg-white p-5 shadow-[0_8px_24px_-4px_rgba(21,36,10,0.06)] sm:p-6"><section><h2 className="flex items-center gap-2 text-sm font-semibold"><Sprout size={16} className="text-[#56652e]" />1. Komoditas & Varietas</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-[10px] font-semibold">Komoditas Utama<select className="mt-1 h-10 w-full rounded-lg bg-[#f3f3ec] px-3 text-xs outline-none focus:ring-2 focus:ring-[#85c254]"><option>Padi Sawah (Oryza sativa)</option><option>Jagung</option><option>Kedelai</option></select></label><label className="text-[10px] font-semibold">Varietas Bibit<select className="mt-1 h-10 w-full rounded-lg bg-[#f3f3ec] px-3 text-xs outline-none focus:ring-2 focus:ring-[#85c254]"><option>Inpari 32 HDB</option><option>Ciherang</option><option>IR 64</option></select></label></div></section><section><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">✳ 2. Fase Pertumbuhan Saat Ini</h2><span className="rounded bg-[#d9f59b] px-2 py-1 text-[9px] font-bold text-[#56652e]">WAJIB KALIBRASI</span></div><p className="mt-1 text-[10px] text-[#666a60]">Pilihan fase mempengaruhi kalkulasi serapan air serta peringatan cuaca ekstrem BMKG.</p><div className="mt-3 space-y-2">{phases.map((item) => { const selected = phase === item.id; return <button type="button" key={item.id} onClick={() => setPhase(item.id)} className={`flex w-full items-start gap-2 rounded-xl border p-3 text-left transition-all ${selected ? "border-[#85c254] bg-[#def0ab] shadow-[0_3px_8px_rgba(133,194,84,0.2)]" : "border-transparent bg-[#f3f3ec] hover:bg-[#edf4dc]"}`}><span className={`mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#15240a] bg-[#15240a] text-[#85c254]" : "border-[#888f82]"}`}>{selected && <Check size={9} />}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-xs font-bold">{item.title}<span className="rounded-full bg-[#d8eaa5] px-2 py-0.5 text-[9px] font-medium">{item.range}</span></span><span className="mt-1 block max-w-[420px] text-[10px] leading-4 text-[#44483f]">{item.description}</span></span><span className="text-base text-[#777f70]">{item.icon}</span></button>; })}</div></section><section><h2 className="text-sm font-semibold">▣ 3. Estimasi Hari Setelah Tanam (HST)</h2><div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#f3f3ec] p-3"><div><p className="text-[9px] text-[#666a60]">Kalkulasi Kalender Tanam</p><p className="text-xs font-bold">Ditanam sekitar 10 Juli 2026</p><p className="text-[9px] text-[#666a60]">Umur panen tersisa ±60 hari ke depan</p></div><div className="flex items-center rounded-lg bg-white"><button type="button" onClick={() => setDays((value) => Math.max(0, value - 1))} className="flex size-10 items-center justify-center hover:bg-[#e4f6b0]" aria-label="Kurangi HST"><Minus size={15} /></button><div className="min-w-14 border-x border-[#f3f3ec] text-center"><strong className="font-display text-2xl">{days}</strong><span className="block text-[8px]">HST</span></div><button type="button" onClick={() => setDays((value) => Math.min(150, value + 1))} className="flex size-10 items-center justify-center hover:bg-[#e4f6b0]" aria-label="Tambah HST"><Plus size={15} /></button></div></div></section><section><h2 className="text-sm font-semibold">▤ 4. Catatan Pengamatan Tambahan <span className="text-[10px] font-normal text-[#666a60]">(Opsional)</span></h2><p className="mt-1 text-[10px] text-[#666a60]">Kondisi air petakan, serangan hama kecil, atau catatan teknis sebelum pemupukan.</p><textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-20 w-full resize-y rounded-xl bg-[#f3f3ec] p-3 text-xs leading-5 outline-none focus:ring-2 focus:ring-[#85c254]" /></section><div className="rounded-xl bg-[#18310e] p-3 text-[10px] leading-4 text-[#d8eaa5]"><p className="font-bold text-[#98cf6a]">▣ Integritas Keputusan Agronomi RembukTani</p><p className="mt-1">Kebutuhan air pada fase berbunga berbeda drastis dengan fase pematangan. Data yang akurat menjaga efisiensi takaran pupuk/NP dan mengamankan jadwal pembagian air irigasi bersama kelompok tani.</p></div><div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between"><a href="/farmer/lands/new/location" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f3f3ec] px-5 text-sm font-semibold text-[#364c23] hover:bg-[#e4f6b0]"><ChevronLeft size={16} /> Kembali</a><button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#85c254] px-6 text-sm font-bold text-[#15240a] shadow-md hover:bg-[#98cf6a]">Simpan Lahan & Selesai <Check size={16} /></button></div>{notice && <p role="status" className="rounded-xl bg-[#e9fcb5] px-4 py-3 text-xs font-semibold text-[#364c23]">{notice}</p>}</motion.form><footer className="flex flex-col gap-2 px-2 pt-1 text-[9px] text-[#666a60] sm:flex-row sm:justify-between"><span>Sinkronisasi Otomatis · Modul Agronomi Padi v4.2</span><span className="text-[#4f8a45]">● Terhubung ke Sistem Subak & BMKG</span></footer></main></div></div>;
}
