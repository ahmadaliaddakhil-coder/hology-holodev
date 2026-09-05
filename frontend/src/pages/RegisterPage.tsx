import { ArrowRight, AtSign, Bike, CircleHelp, Leaf, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField";
import { AuthShell } from "../components/auth/AuthShell";
import { authApi, saveAuth } from "../lib/auth";

type Role = "farmer" | "reviewer";

export function RegisterPage() {
  const [role, setRole] = useState<Role>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    const displayName = String(form.get("name") ?? "").trim();
    const identity = String(form.get("identity") ?? "").trim();
    if (!displayName || !identity || password.length < 8) return setError("Lengkapi data dan gunakan kata sandi minimal 8 karakter.");
    if (password !== confirmation) return setError("Konfirmasi kata sandi belum sama.");
    if (!form.get("consent")) return setError("Persetujuan penggunaan dan perlindungan data wajib dipilih.");
    setLoading(true);
    setError("");
    try {
      const result = await authApi.register({ displayName, identity, password, role });
      if (result.session) {
        saveAuth(result.session, result.user, true);
        navigate("/home", { replace: true });
      } else {
        setError("Akun dibuat. Periksa WhatsApp/email untuk verifikasi, lalu masuk.");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Pendaftaran gagal");
    } finally { setLoading(false); }
  }

  return (
    <AuthShell title="Daftar Akun">
      <section className="relative mb-5 overflow-hidden rounded-2xl bg-[#213014] p-5 text-white shadow-sm">
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-[#85c254]/10 blur-xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#15240a]/60 px-2.5 py-1 text-xs font-semibold tracking-[.02em] text-[#98cf6a]"><Leaf size={13} /> Langkah Awal</span><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.025em]">Buat akun RembukTani</h2><p className="mt-1 font-display text-[15px] leading-[22px] text-[#bacda5]">Mulai dengan menambahkan lahan<br />pertama Anda.</p></div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#15240a] text-[#98cf6a]"><UserRound size={24} /></div>
        </div>
      </section>

      <form className="space-y-4 rounded-2xl bg-white p-5 shadow-sm" onSubmit={submit} noValidate>
        <fieldset><legend className="mb-2 text-sm font-semibold">Pilih Peran Akun</legend><div className="space-y-2.5">
          <RoleCard selected={role === "farmer"} onClick={() => setRole("farmer")} icon={<Bike size={22} />} title="Petani / Ketua Poktan" description="Kelola lahan, rekam kondisi sawah, dan tetapkan keputusan tindakan mandiri." badge="Utama" />
          <RoleCard selected={role === "reviewer"} onClick={() => setRole("reviewer")} icon={<CircleHelp size={22} />} title="Reviewer / Ahli Pertanian" description="Berikan telaah, validasi kondisi cuaca/hama, dan dampingi musyawarah tani." />
        </div></fieldset>
        <input type="hidden" name="role" value={role} />
        <AuthField name="name" label="Nama Lengkap" icon={<UserRound size={18} />} placeholder="Pak Slamet / Ibu Sri" autoComplete="name" />
        <AuthField name="identity" label="Nomor WhatsApp atau Email" icon={<AtSign size={20} />} placeholder="0812-XXXX-XXXX atau nama@email.com" autoComplete="username" />
        <AuthField name="password" label="Kata Sandi" icon={<LockKeyhole size={18} />} placeholder="Minimal 8 karakter" type={showPassword ? "text" : "password"} autoComplete="new-password" onToggleVisibility={() => setShowPassword((value) => !value)} />
        <AuthField name="confirmation" label="Konfirmasi Kata Sandi" icon={<ShieldCheck size={19} />} placeholder="Ulangi kata sandi" type={showConfirmation ? "text" : "password"} autoComplete="new-password" onToggleVisibility={() => setShowConfirmation((value) => !value)} />
        <label className="flex items-start gap-3 font-display text-sm leading-[18px]"><input name="consent" type="checkbox" className="mt-0.5 size-6 shrink-0 accent-[#85c254]" /><span>Saya menyetujui <span className="font-semibold underline decoration-[#85c254]">ketentuan penggunaan</span> dan <span className="font-semibold underline decoration-[#85c254]">prinsip perlindungan data petani</span>.</span></label>
        <div className="flex gap-3 rounded-xl bg-[#e9fcb5] p-3.5"><ShieldCheck size={19} className="shrink-0" /><p className="font-display text-sm leading-[19px]"><strong className="block text-xs tracking-[.02em]">Tanpa beban administrasi</strong>Luas lahan, NIK, dan poligon satelit dapat dilengkapi nanti.</p></div>
        <button type="submit" disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#85c254] font-semibold shadow-md transition hover:bg-[#94d162] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15240a]">{loading ? "Membuat akun…" : "Daftar"} <ArrowRight size={17} /></button>
        {error && <p className="rounded-lg bg-[#f3f3ec] p-3 font-display text-sm text-[#364c23]" role="status">{error}</p>}
      </form>
      <Link to="/login" className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-white/60 py-3 font-display text-[15px] shadow-sm">Sudah punya akun? <span className="font-semibold underline decoration-[#85c254]">Masuk</span></Link>
    </AuthShell>
  );
}

function RoleCard({ selected, onClick, icon, title, description, badge }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string; badge?: string }) {
  return <button type="button" role="radio" aria-checked={selected} onClick={onClick} className={`relative flex w-full gap-3 rounded-xl p-4 text-left transition ${selected ? "border-2 border-[#85c254] bg-[#e9fcb5]/60" : "border border-[#c5c8bc] bg-[#fafaf6]"}`}><span className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-[#15240a] text-[#98cf6a]" : "bg-[#15240a]/10 text-[#364c23]"}`}>{icon}</span><span className="min-w-0 pr-5"><span className="flex flex-wrap items-center gap-1.5 text-sm font-bold">{title}{badge && <span className="rounded-full bg-[#85c254]/30 px-1.5 py-0.5 text-[11px]">{badge}</span>}</span><span className="mt-0.5 block font-display text-sm leading-[19px] text-[#44483f]">{description}</span></span><span className={`absolute right-3.5 top-3.5 flex size-5 items-center justify-center rounded-full border-2 ${selected ? "border-[#15240a]" : "border-[#c5c8bc]"}`}>{selected && <span className="size-2.5 rounded-full bg-[#15240a]" />}</span></button>;
}
