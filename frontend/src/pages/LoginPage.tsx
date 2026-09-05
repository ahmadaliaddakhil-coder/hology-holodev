import { AtSign, Leaf, LockKeyhole, LogIn, ShieldCheck, Sun } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField";
import { AuthShell } from "../components/auth/AuthShell";
import { authApi, saveAuth } from "../lib/auth";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified") === "1";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("identity") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!identity || !password) {
      setMessage("Nomor WhatsApp/email dan kata sandi wajib diisi.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const result = await authApi.login(identity, password);
      saveAuth(result.session, result.user, form.get("remember") === "on");
      const destination = (location.state as { from?: string } | null)?.from || "/home";
      navigate(destination, { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal");
    } finally { setLoading(false); }
  }

  return (
    <AuthShell title="Login Petani">
      <section className="relative overflow-hidden rounded-xl bg-[#15240a] px-4 pb-5 pt-6 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="absolute -bottom-10 -right-8 size-44 rounded-full bg-[#364c23]/50 blur-xl" />
        <div className="relative flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#85c254] text-[#15240a]"><Leaf size={20} fill="currentColor" /></div>
          <div><p className="text-xs font-semibold tracking-[.1em] text-[#85c254]">REMBUKTANI</p><p className="font-display text-sm text-[#d0e29d]/80">Kemandirian Petani Digital</p></div>
        </div>
        <div className="relative mt-3">
          <h2 className="font-display text-2xl font-bold tracking-[-.01em]">Selamat datang kembali</h2>
          <p className="mt-1 font-display leading-6 text-[#d0e29d]/90">Masuk ke RembukTani untuk mengelola petak lahan Anda.</p>
        </div>
        <div className="relative mt-3 flex items-center gap-2 rounded-lg bg-[#213014]/70 p-2 font-display text-sm text-[#d0e29d]">
          <Sun size={17} className="text-amber-300" /> Musim Tanam 2 • Tinjauan cuaca &amp; pupuk aktif
        </div>
      </section>

      <form className="space-y-4 pt-5" onSubmit={submit} noValidate>
        {verified && (
          <p className="rounded-xl border border-[#85c254]/40 bg-[#e9fcb5] p-3 font-display text-sm leading-5 text-[#213014]" role="status">
            Email berhasil dikonfirmasi. Silakan masuk dengan akun Anda.
          </p>
        )}
        <AuthField name="identity" label="Nomor WhatsApp atau Email" hint={<span className="font-display font-normal text-[#364c23]/75">Wajib</span>} icon={<AtSign size={21} />} placeholder="0812-XXXX-XXXX atau nama@email.com" autoComplete="username" />
        <AuthField name="password" label="Kata Sandi" hint={<button type="button" className="text-xs text-[#56652e] underline">Lupa Password?</button>} icon={<LockKeyhole size={20} />} placeholder="Masukkan kata sandi akun" type={showPassword ? "text" : "password"} autoComplete="current-password" onToggleVisibility={() => setShowPassword((value) => !value)} />
        <label className="flex items-center gap-2 px-1 font-display text-[15px]"><input name="remember" type="checkbox" defaultChecked className="size-5 accent-[#85c254]" />Ingat saya di perangkat ini</label>
        <button type="submit" disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#85c254] font-display text-lg font-semibold shadow-md transition hover:bg-[#94d162] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15240a]"><LogIn size={21} /> {loading ? "Memeriksa akun…" : "Masuk"}</button>
        {message && <p className="rounded-lg bg-[#e9fcb5] p-3 font-display text-sm text-[#364c23]" role="status">{message}</p>}
      </form>

      <div className="flex items-center gap-3 py-5"><span className="h-0.5 flex-1 rounded-full bg-[#deded4]" /><span className="text-xs font-semibold tracking-[.05em] text-[#364c23]">ATAU PILIHAN LAIN</span><span className="h-0.5 flex-1 rounded-full bg-[#deded4]" /></div>
      <section className="rounded-xl bg-white p-4 text-center shadow-sm">
        <p className="font-display">Belum punya akun RembukTani?</p>
        <Link to="/register" className="mt-2 flex h-[52px] items-center justify-center rounded-xl bg-[#e9fcb5] font-display text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85c254]">Daftar Akun Baru</Link>
      </section>
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#def0ab]"><ShieldCheck size={20} /></span><p className="font-display text-sm leading-[17.5px]">Akses aman terenkripsi untuk kelompok tani dan penyuluh pertanian lapangan.</p></div>
    </AuthShell>
  );
}
