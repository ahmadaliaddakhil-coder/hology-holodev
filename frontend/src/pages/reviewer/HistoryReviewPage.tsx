import { useState, useEffect } from "react";
import {
    Bell, CloudSun, Leaf, Menu,
    Settings, UserCircle2, Warehouse, History,
    ClipboardCheck, Check, X,
    Layers, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

// Komponen Navigasi Sidebar (Standar)
function NavItem({ icon: Icon, label, active = false }: { icon: typeof Warehouse; label: string; active?: boolean }) {
    return (
        <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 ${active ? "bg-[#1c2a13] text-white shadow-md" : "text-[#44483f] hover:bg-[#edf4dc]"
            }`}>
            <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
            <span className={active ? "font-display text-sm font-bold" : "text-sm font-semibold"}>
                {label}
            </span>
        </button>
    );
}

// Data Mockup untuk Riwayat
const historyData = [
    {
        id: "1",
        title: "Blok Tirto A3",
        location: "Kepanjen, Malang",
        owner: "Pak Budi",
        date: "7 September 2026",
        status: "Selesai",
        preview: "Sebaiknya periksa kondisi pintu air terlebih dahulu karena sumber air belum diketahui secara pasti dari sensor cuaca.",
        assessment: {
            status: "Kondisi perlu ditinjau",
            desc: "Terjadi perbedaan kebutuhan air fase berbunga dengan kondisi saluran irigasi sekunder terbatas."
        },
        evidence: [
            "BMKG (Cerah Berawan 24°C)",
            "Kondisi Lapangan (Macak-macak)",
            "Tanaman (Padi Inpari 32)"
        ],
        consideration: {
            arah: "Perlu informasi tambahan",
            catatan: "Sebaiknya periksa kondisi pintu air terlebih dahulu karena sumber air belum diketahui secara pasti dari sensor cuaca."
        }
    },
    {
        id: "2",
        title: "Petak Bawah Timur #04",
        location: "Karangploso, Malang",
        owner: "Bu Ani",
        date: "5 September 2026",
        status: "Selesai",
        preview: "Informasi tambahan diperlukan sebelum keputusan dibuat terkait jadwal giliran air subak.",
        assessment: {
            status: "Perlu konfirmasi cuaca",
            desc: "Kondisi awan mendung tebal namun prediksi BMKG menunjukkan cerah berawan."
        },
        evidence: [
            "BMKG (Potensi Hujan)",
            "Kondisi Lapangan (Mendung tebal)"
        ],
        consideration: {
            arah: "Perlu informasi tambahan",
            catatan: "Informasi tambahan diperlukan sebelum keputusan dibuat terkait jadwal giliran air subak."
        }
    },
    {
        id: "3",
        title: "Sawah Blok Kulon 02",
        location: "Dau, Malang",
        owner: "Pak Hadi",
        date: "2 September 2026",
        status: "Selesai",
        preview: "Informasi cuaca dan genangan air sudah cukup jelas untuk melanjutkan penyiangan tahap...",
        assessment: {
            status: "Kondisi aman",
            desc: "Kebutuhan air tercukupi dan fase vegetatif berjalan normal tanpa kendala."
        },
        evidence: [
            "BMKG (Cerah)",
            "Kondisi Lapangan (Genangan 3cm)"
        ],
        consideration: {
            arah: "Informasi sudah cukup jelas",
            catatan: "Informasi cuaca dan genangan air sudah cukup jelas untuk melanjutkan penyiangan tahap awal."
        }
    }
];

export function HistoryReviewPage() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeFilter, setActiveFilter] = useState("semua");

    // State untuk melacak Accordion mana yang terbuka
    // Secara default kita buka ID "1" seperti di desain
    const [expandedId, setExpandedId] = useState<string | null>("1");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const toggleAccordion = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        // MASTER WRAPPER
        <div className="min-h-screen min-w-[300px] bg-[#f3f3ec] text-[#15240a] font-sans overflow-hidden flex relative">

            {/* Overlay Mobile Sidebar */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden"
                    onClick={() => setMobileNavOpen(false)}
                />
            )}

            {/* SIDEBAR STANDAR */}
            <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col justify-between bg-[#fafaf6] p-5 shadow-sm transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

                <div>
                    <div className="mb-8 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 rounded-xl bg-[#15240a]/80 px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-white">
                            <Leaf size={15} className="text-[#85c254]" /> REMBUKTANI
                        </div>
                        <button className="xl:hidden text-[#44483f] hover:text-[#15240a] transition-colors" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <Link to={`/reviewer/dashboard`}><NavItem icon={Warehouse} label="Beranda" /></Link>
                        <Link to={`/reviewer/review`}><NavItem icon={ClipboardCheck} label="Review Masuk" /></Link>
                        <Link to={`/reviewer/history`}><NavItem active icon={History} label="Riwayat" /></Link>
                        <Link to={`/reviewer/profile`}><NavItem icon={UserCircle2} label="Profil" /></Link>
                    </nav>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 rounded-xl bg-[#e9fcb5] p-3 text-xs">
                        <span className="size-2.5 rounded-full bg-[#85c254] shrink-0" />
                        <div>
                            <p className="font-bold text-[#15240a]">Sinkronisasi BMKG</p>
                            <p className="text-[10px] text-[#56652e]">Data cuaca aktif</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0d1b03] text-white">
                                <UserCircle2 size={15} />
                            </div>
                            <div>
                                <p className="max-w-[100px] truncate text-xs font-bold text-[#15240a]">Pak Slamet</p>
                                <p className="text-[10px] text-[#666a60]">Ketua Poktan</p>
                            </div>
                        </div>
                        <Settings size={16} className="text-[#666a60] cursor-pointer hover:text-[#15240a]" />
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-[260px]">

                {/* TOPBAR STANDAR */}
                <header className="fixed top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-[#f3f3ec]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 border-b border-[#deded4]/40">
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

                {/* CONTENT BODY */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-5xl pt-14">

                        {/* Header Section */}
                        <div className={`mb-8 flex flex-col md:flex-row md:items-start justify-between gap-5 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold leading-tight text-[#15240a]">
                                    Riwayat Review
                                </h1>
                                <p className="mt-2 text-xs sm:text-sm text-[#44483f] leading-relaxed max-w-xl">
                                    Lihat kembali pertimbangan yang pernah Anda berikan kepada petani.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-xl bg-[#e9fcb5]/60 border border-[#d9f59b] px-4 py-2.5 text-[10px] sm:text-xs font-medium text-[#56652e]">
                                <ShieldCheck size={16} className="text-[#85c254]" /> Arsip transparansi pertimbangan mandiri petani
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className={`mb-8 flex flex-wrap items-center gap-2 sm:gap-3 transition-all delay-100 duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <button
                                onClick={() => setActiveFilter("semua")}
                                className={`rounded-full px-5 py-2 text-[10px] sm:text-xs font-bold transition-all ${activeFilter === "semua" ? "bg-[#15240a] text-white shadow-md" : "bg-white border border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]"}`}
                            >
                                Semua (6)
                            </button>
                            <button
                                onClick={() => setActiveFilter("selesai")}
                                className={`rounded-full px-5 py-2 text-[10px] sm:text-xs font-bold transition-all ${activeFilter === "selesai" ? "bg-[#15240a] text-white shadow-md" : "bg-white border border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]"}`}
                            >
                                Selesai (6)
                            </button>
                            <button
                                onClick={() => setActiveFilter("terbaru")}
                                className={`rounded-full px-5 py-2 text-[10px] sm:text-xs font-bold transition-all ${activeFilter === "terbaru" ? "bg-[#15240a] text-white shadow-md" : "bg-white border border-[#deded4] text-[#44483f] hover:bg-[#fafaf6]"}`}
                            >
                                Terbaru
                            </button>
                        </div>

                        {/* History Cards List */}
                        <div className="space-y-4 sm:space-y-5">
                            {historyData.map((item, index) => {
                                const isExpanded = expandedId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className={`rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 lg:p-7 transition-all duration-300 ease-out ${isExpanded ? "border-2 border-[#85c254] shadow-lg" : "border border-[#deded4]/60 shadow-sm hover:border-[#85c254]/50 hover:shadow-md"
                                            }`}
                                        style={{ transitionDelay: `${200 + index * 100}ms`, opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(24px)' }}
                                    >

                                        {/* Card Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                                            {/* Left Info */}
                                            <div className="flex items-start gap-4">
                                                <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3ec] text-[#44483f]">
                                                    <Layers size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                        <h2 className="text-base sm:text-lg font-bold text-[#15240a]">{item.title}</h2>
                                                        <span className="inline-flex items-center gap-1 rounded bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#166534]">
                                                            <div className="size-1.5 rounded-full bg-[#22c55e]"></div> {item.status}
                                                        </span>
                                                        <span className="text-[10px] sm:text-xs text-[#a4a99d]">• {item.location}</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs text-[#666a60]">
                                                        <span>Pemilik: <strong className="text-[#15240a]">{item.owner}</strong></span>
                                                        <span className="text-[#deded4] hidden sm:inline">•</span>
                                                        <span>Tanggal: {item.date}</span>
                                                    </div>

                                                    {/* Preview Text (Only shows when collapsed) */}
                                                    <div className={`grid transition-all duration-300 ease-in-out ${!isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                                                        <div className="overflow-hidden">
                                                            <p className="text-[10px] sm:text-[11px] text-[#666a60] italic line-clamp-1">
                                                                Pertimbangan: "{item.preview}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Action (Toggle Button) */}
                                            <button
                                                onClick={() => toggleAccordion(item.id)}
                                                className={`flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[10px] sm:text-xs font-bold transition-all ${isExpanded
                                                        ? "bg-[#85c254] text-[#15240a] hover:bg-[#98cf6a]"
                                                        : "bg-[#e9fcb5] text-[#56652e] hover:bg-[#d9f59b]"
                                                    }`}
                                            >
                                                {isExpanded ? "Tutup Detail" : "Lihat Detail"}
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>

                                        </div>

                                        {/* EXPANDABLE CONTENT */}
                                        <div
                                            className={`grid transition-all duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-5 sm:mt-6 pt-5 border-t border-[#deded4]/60" : "grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">

                                                    {/* Box: Penilaian Sistem */}
                                                    <div className="rounded-2xl bg-[#fafaf6] border border-[#deded4]/50 p-4 sm:p-5">
                                                        <h3 className="text-[9px] font-bold tracking-widest text-[#a4a99d] uppercase mb-3">
                                                            Penilaian Sistem (Assessment)
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#15240a] mb-2">
                                                            <div className="size-2 rounded-full bg-[#ca8a04]"></div> {item.assessment.status}
                                                        </div>
                                                        <p className="text-[10px] sm:text-xs text-[#666a60] leading-relaxed">
                                                            {item.assessment.desc}
                                                        </p>
                                                    </div>

                                                    {/* Box: Informasi yang digunakan */}
                                                    <div className="rounded-2xl bg-[#fafaf6] border border-[#deded4]/50 p-4 sm:p-5">
                                                        <h3 className="text-[9px] font-bold tracking-widest text-[#a4a99d] uppercase mb-3">
                                                            Informasi Yang Digunakan (Evidence)
                                                        </h3>
                                                        <ul className="space-y-2">
                                                            {item.evidence.map((ev, i) => (
                                                                <li key={i} className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#15240a]">
                                                                    <Check size={14} className="text-[#85c254] shrink-0" strokeWidth={3} /> {ev}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                </div>

                                                {/* Box: Pertimbangan Anda */}
                                                <div className="rounded-2xl bg-white border border-[#deded4] p-4 sm:p-5">
                                                    <h3 className="text-[9px] font-bold tracking-widest text-[#a4a99d] uppercase mb-3">
                                                        Pertimbangan Yang Anda Berikan
                                                    </h3>
                                                    <div className="inline-flex items-center rounded-lg bg-[#e9fcb5]/50 px-3 py-1.5 text-[10px] sm:text-xs font-bold text-[#213014] mb-4">
                                                        Arah: {item.consideration.arah}
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-[#44483f] italic leading-relaxed mb-5">
                                                        "{item.consideration.catatan}"
                                                    </p>

                                                    <div className="flex items-start gap-2 pt-4 border-t border-[#deded4]/40">
                                                        <CheckCircle2 size={14} className="text-[#a4a99d] shrink-0 mt-0.5" />
                                                        <p className="text-[9px] sm:text-[10px] text-[#a4a99d]">
                                                            Diserahkan sebagai bahan pertimbangan bagi {item.owner} (Keputusan akhir tetap pada pemilik lahan).
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        <div className="h-10"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
