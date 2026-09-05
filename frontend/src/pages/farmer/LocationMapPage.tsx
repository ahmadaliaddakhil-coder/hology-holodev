/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, Polygon, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import {
  ArrowLeft,
  Bell,
  Check,
  CloudSun,
  Crosshair,
  Database,
  Droplets,
  FileSearch,
  Leaf,
  Map as MapIcon,
  MapPin,
  Menu,
  Navigation,
  Search,
  Settings,
  Sprout,
  UserCircle2,
  Warehouse,
  X,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { readLandDraft, updateLandDraft } from "../../lib/land-draft";

type MapMode = "satellite" | "road" | "subak";

const subakBoundary: LatLngExpression[] = [
  [-8.1225, 112.552],
  [-8.116, 112.586],
  [-8.145, 112.594],
  [-8.153, 112.56],
];

function FlyToLocation({ position }: { position: LatLngExpression }) {
  const map = useMap();
  map.flyTo(position, 14, { duration: 0.7 });
  return null;
}

function MapClickHandler({ onSelect }: { onSelect: (position: [number, number]) => void }) {
  const [points, setPoints] = useState<[number, number][]>([]);
  useMapEvents({
    click: (event) => {
      const point: [number, number] = [event.latlng.lat, event.latlng.lng];
      setPoints((current) => [...current, point]);
      onSelect(point);
    },
  });
  return <>
    {points.length >= 3 && <Polygon positions={points} pathOptions={{ color: "#85c254", weight: 3, fillColor: "#85c254", fillOpacity: 0.28 }}><Tooltip sticky><strong>Boundary lahan pilihan</strong><br />{points.length} titik vertex</Tooltip></Polygon>}
    {points.map((point, index) => <CircleMarker key={`${point[0]}-${point[1]}`} center={point} radius={6} pathOptions={{ color: "#15240a", weight: 2, fillColor: "#e9fcb5", fillOpacity: 1 }}><Tooltip>{`Titik ${index + 1}: ${point[0].toFixed(5)}, ${point[1].toFixed(5)}`}</Tooltip></CircleMarker>)}
  </>;
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <aside className={`fixed inset-y-0 left-0 z-[1000] flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-[0_1px_4px_rgba(21,36,10,0.05)] transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
    <div><div className="mb-6 flex items-center justify-between px-2"><div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white"><Leaf size={15} className="text-[#85c254]" /> REMBUKTANI</div><button className="md:hidden" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button></div><a href="/farmer/lands" className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] px-4 py-3 text-sm font-semibold text-[#15240a]"><span className="text-lg leading-none">+</span> Tambah Lahan</a><nav className="space-y-1"><a href="/farmer/dashboard" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><Warehouse size={18} /> Beranda</a><a href="/farmer/lands" className="flex w-full items-center gap-3 rounded-xl bg-[#213014] px-4 py-3 font-display text-sm font-bold text-white"><Sprout size={18} /> Lahan</a><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><FileSearch size={18} /> Riwayat</button><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#44483f] hover:bg-[#edf4dc]"><UserCircle2 size={18} /> Profil</button></nav></div>
    <div className="space-y-4 px-1"><div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3"><span className="size-2.5 rounded-full bg-[#85c254]" /><div><p className="text-xs font-bold">Sinkronisasi BMKG</p><p className="text-xs text-[#44483f]">Data cuaca aktif</p></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div><div><p className="text-xs font-bold">Pak Slamet</p><p className="text-xs text-[#44483f]">Ketua Poktan</p></div></div><Settings size={18} className="text-[#44483f]" /></div></div>
  </aside>;
}

function MapCanvas({ mode, position, onSelect }: { mode: MapMode; position: [number, number]; onSelect: (position: [number, number]) => void }) {
  const imageryUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const roadUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  return <div className="relative h-[460px] overflow-hidden rounded-2xl bg-[#b6d4bd] shadow-[0_8px_24px_rgba(21,36,10,0.16)] sm:h-[560px]"><MapContainer center={position} zoom={14} scrollWheelZoom className="z-0 h-full w-full"><TileLayer attribution={mode === "satellite" ? "Tiles &copy; Esri" : "&copy; OpenStreetMap contributors"} url={mode === "satellite" ? imageryUrl : roadUrl} opacity={mode === "satellite" ? 0.9 : 0.82} /><MapClickHandler onSelect={onSelect} /><FlyToLocation position={position} /><Polygon positions={subakBoundary} pathOptions={{ color: mode === "subak" ? "#85c254" : "#327eaa", weight: 2, fillColor: mode === "subak" ? "#85c254" : "#75b7c7", fillOpacity: mode === "subak" ? 0.22 : 0.1, dashArray: mode === "subak" ? "8 6" : undefined }}><Tooltip sticky><strong>Subak Tirto Mulyo</strong><br />Batas digital saluran sekunder</Tooltip></Polygon><CircleMarker center={position} radius={10} pathOptions={{ color: "#15240a", weight: 3, fillColor: "#85c254", fillOpacity: 1 }}><Tooltip permanent direction="top" offset={[0, -10]}><strong>Blok Tirto A3 (Target)</strong><br />Luas estimasi: 0.85 Ha</Tooltip></CircleMarker></MapContainer><div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between"><div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-[#213014]/90 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md"><MapPin size={15} className="text-[#85c254]" /> Geser pin atau klik pada sawah</div><div className="pointer-events-auto flex rounded-xl bg-[#85c254] p-1 text-[11px] font-semibold shadow-lg">{(["satellite", "road", "subak"] as MapMode[]).map((item) => <button key={item} onClick={() => undefined} className="rounded-lg px-2 py-2 text-[#15240a]">{item === "satellite" ? "Satelit" : item === "road" ? "Peta Jalan" : "Batas Subak"}</button>)}</div></div><div className="pointer-events-none absolute bottom-4 left-4 rounded-xl bg-[#15240a]/90 px-3 py-2 font-mono text-[11px] text-white shadow-lg"><span className="text-[#85c254]">KOORDINAT SENTROID</span><br />{position[0].toFixed(4)}, {position[1].toFixed(4)}<span className="ml-3 text-[#bacda5]">Elevasi: 312 mdpl</span></div><div className="absolute bottom-4 right-4 flex flex-col gap-2"><button className="flex size-9 items-center justify-center rounded-xl bg-[#15240a]/90 text-white shadow-lg" aria-label="Lokasi saat ini"><Navigation size={16} /></button><button className="flex size-9 items-center justify-center rounded-xl bg-[#15240a]/90 text-white shadow-lg" aria-label="Perbesar peta">+</button><button className="flex size-9 items-center justify-center rounded-xl bg-[#15240a]/90 text-white shadow-lg" aria-label="Perkecil peta">-</button></div></div>;
}

export function LocationMapPage() {
  const initialDraft = readLandDraft();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<MapMode>("satellite");
  const [position, setPosition] = useState<[number, number]>([initialDraft.latitude ?? -8.1294, initialDraft.longitude ?? 112.5718]);
  const [search, setSearch] = useState("Sukoraharjo, Kepanjen");
  const [notice, setNoticeState] = useState("");
  const setNotice = (message: string) => {
    if (message === "Lokasi petak tersimpan dan siap dilanjutkan.") {
      updateLandDraft({
        latitude: position[0],
        longitude: position[1],
        province: "Jawa Timur",
        regency: "Kabupaten Malang",
        district: "Kepanjen",
        village: search.split(",")[0]?.trim() || "Sukoraharjo",
      });
      window.location.href = "/farmer/lands/new/details";
      return;
    }
    setNoticeState(message);
  };

  const useCurrentLocation = () => {
    setMode("subak");
    if (!navigator.geolocation) {
      setNotice("Perangkat ini belum mendukung GPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(({ coords }) => { setPosition([coords.latitude, coords.longitude]); setNotice("Lokasi perangkat berhasil digunakan."); }, () => setNotice("Lokasi perangkat belum dapat dibaca."));
  };

  return <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a]"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="md:pl-[260px]"><header className="sticky top-0 z-[900] flex h-16 items-center justify-between border-b border-[#deded4]/60 bg-[#fafaf6]/90 px-4 shadow-sm backdrop-blur-xl sm:px-8"><button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={22} /></button><span className="rounded bg-[#e4f6b0] px-2 py-1 text-xs font-semibold">Wilayah: Subak Jatiluwih</span><div className="flex items-center gap-3 sm:gap-4"><span className="hidden items-center gap-2 text-xs font-semibold text-[#44483f] sm:flex"><CloudSun size={18} /> Cerah Berawan 28°C</span><Bell size={17} /><div className="flex size-8 items-center justify-center rounded-full bg-[#0d1b03] text-white"><UserCircle2 size={15} /></div></div></header><main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8"><div className="mb-6 flex items-center gap-2"><a href="/farmer/lands/new" className="flex items-center gap-2 text-sm font-semibold text-[#364c23] hover:text-[#15240a]"><ArrowLeft size={14} /> Kembali ke Info Lahan</a></div><div className="grid gap-8 lg:grid-cols-[minmax(320px,0.92fr)_minmax(420px,1.08fr)]"><motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5"><div><h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Tentukan Titik Lokasi Petak</h1><p className="mt-2 text-sm leading-5 text-[#44483f]">Sinkronisasi batas petak sawah dengan jaringan irigasi dan stasiun sensor mikroklimat BMKG.</p></div><div className="space-y-2"><label htmlFor="area-search" className="text-sm font-semibold">Pencarian Wilayah Pertanian</label><div className="relative"><Search className="absolute left-4 top-3.5 text-[#44483f]" size={17} /><input id="area-search" value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full rounded-xl bg-white pl-12 pr-10 text-sm shadow-sm outline-none ring-[#85c254] focus:ring-2" /><button onClick={() => setSearch("")} className="absolute right-3 top-3.5 text-[#75786e]" aria-label="Hapus pencarian"><X size={16} /></button></div></div><div className="space-y-2"><span className="text-xs font-semibold text-[#44483f]">Metode Penentuan:</span><div className="grid grid-cols-3 gap-1 rounded-xl bg-[#deded4] p-1">{([['satellite', 'Peta Satelit', MapIcon], ['road', 'Cari Desa', Search], ['subak', 'GPS Saat Ini', Crosshair]] as const).map(([id, label, Icon]) => <button key={id} onClick={() => id === 'subak' ? useCurrentLocation() : setMode(id)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold ${mode === id ? "bg-white text-[#15240a] shadow-sm" : "text-[#44483f]"}`}><Icon size={16} />{label}</button>)}</div></div><div className="rounded-2xl border-t-[6px] border-[#85c254] bg-white p-5 shadow-md"><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 rounded-full bg-[#e4f6b0] px-3 py-1 text-xs font-semibold"><span className="size-2 rounded-full bg-[#4f8a45]" /> Titik Terkunci di Peta</span><span className="rounded bg-[#f3f3ec] px-2 py-1 font-mono text-[10px] text-[#56652e]">ID: PETAK-SKH-04</span></div><div className="mt-5 flex gap-3"><MapPin className="mt-1 shrink-0 text-[#85c254]" size={26} /><div><h2 className="font-display text-lg font-semibold">Desa Sukoraharjo</h2><p className="text-sm text-[#44483f]">Kecamatan Kepanjen<br />Kabupaten Malang, Jawa Timur</p></div></div><div className="my-4 h-px bg-[#deded4]" /><div className="space-y-3"><div className="flex items-center justify-between gap-2 rounded-xl bg-[#f3f3ec] p-3"><span className="flex min-w-0 items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white"><CloudSun size={15} /></span><span className="text-xs"><strong className="block">Stasiun Radar Terdekat</strong>Stasiun Meteorologi Karangkates</span></span><span className="rounded bg-white px-2 py-1 font-mono text-[10px]">8.4 km</span></div><div className="flex gap-3 rounded-xl bg-[#e9fcb5] p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#85c254]"><Database size={16} /></span><span className="text-xs"><strong className="block">Tercakup dalam Peta Digital Subak</strong>Subak Tirto Mulyo • Saluran Sekunder Kali Metro B4</span></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><span className="font-mono text-[#44483f]">S 8°07'45.8&quot; E<br />112°34'18.5&quot;</span><span className="flex items-center gap-1 font-semibold text-[#4f8a45]"><Check size={14} /> Akurasi GPS ±2m</span></div></div><button onClick={() => setNotice("Lokasi petak tersimpan dan siap dilanjutkan.")} className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#85c254] text-base font-bold text-[#15240a] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#98cf6a]"><Check size={20} /> Gunakan Lokasi Ini</button>{notice && <p role="status" className="rounded-xl bg-[#e9fcb5] px-4 py-3 text-xs font-semibold text-[#364c23]">{notice}</p>}<p className="flex gap-2 px-2 text-xs leading-5 text-[#44483f]"><Database size={15} className="mt-0.5 shrink-0" /> Titik koordinat ini akan mengunci stasiun radar hujan BMKG dan mengatur siklus pembagian air otomatis pada kalender Subak Tirto Mulyo.</p></motion.section><motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="space-y-3"><MapCanvas mode={mode} position={position} onSelect={setPosition} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs"><MapIcon size={18} className="text-[#56652e]" /><span>Sistem Koordinat<strong className="block text-sm">WGS 84 / UTM</strong></span></div><div className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs"><Sprout size={18} className="text-[#56652e]" /><span>Kemiringan Lahan<strong className="block text-sm">2.1% (Datar B)</strong></span></div><div className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs"><Droplets size={18} className="text-[#56652e]" /><span>Sumber Air Utama<strong className="block text-sm">Irigasi Teknis</strong></span></div></div></motion.section></div></main></div></div>;
}
