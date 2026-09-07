import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ErrorCard, LoadingCard, WorkflowLayout } from "../../components/farmer/WorkflowLayout";
import { ensureAssessment, readWorkflow, type WorkflowData } from "../../lib/decision-workflow";
import { farmerApi, type ApiTrustedReview } from "../../services/farmer-api";

export function SelectReviewerPage() {
  const { landId = "" } = useParams();
  const [data, setData] = useState<WorkflowData>();
  const [reviews, setReviews] = useState<ApiTrustedReview[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const chosen = readWorkflow(landId);

  useEffect(() => {
    if (!landId) return;
    ensureAssessment(landId).then(async (nextData) => {
      setData(nextData);
      setReviews(await farmerApi.listReviews(nextData.decisionCase.id));
    }).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Review gagal dimuat"));
  }, [landId]);

  const request = async () => {
    if (!data) return;
    setSending(true);
    setError("");
    try {
      await farmerApi.requestReview(data.decisionCase.id, {
        assessment_id: data.result.assessment.id,
        selected_action_option_id: String(chosen.option_id || "") || undefined,
      });
      setReviews(await farmerApi.listReviews(data.decisionCase.id));
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Permintaan gagal");
    } finally {
      setSending(false);
    }
  };

  const alreadyPending = submitted || data?.decisionCase.status === "review_pending" || reviews.some((review) => review.status === "pending");
  return <WorkflowLayout landId={landId} step="5 · Review opsional" title="Permintaan review tepercaya" subtitle="Permintaan ini disimpan ke database dan akan masuk ke antrean reviewer. Keputusan akhir tetap berada di tangan Anda.">
    {error && <ErrorCard message={error} />}
    {!data ? <LoadingCard /> : <div className="grid gap-5 md:grid-cols-[1fr_320px]">
      <section className="rounded-2xl bg-white p-6">
        <Users className="text-[#4f8a45]" />
        <h2 className="mt-4 text-xl font-bold">Kirim permintaan review</h2>
        <p className="mt-2 text-sm text-[#56652e]">Lahan: <b>{data.land.name}</b></p>
        <div className="mt-4 rounded-xl bg-[#f3f3ec] p-4 text-sm">
          <p className="text-xs text-[#666a60]">Opsi ruleset terpilih</p>
          <p className="mt-1 font-bold">{String(chosen.option_title || "Belum ada opsi tersimpan")}</p>
        </div>
        {alreadyPending && <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#e9fcb5] p-3 text-sm text-[#36551b]"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />Permintaan review sudah tersimpan dan menunggu reviewer.</div>}
        <button disabled={sending || alreadyPending} onClick={() => void request()} className="mt-5 w-full rounded-xl bg-[#85c254] px-4 py-3 text-sm font-bold disabled:opacity-50">{sending ? "Mengirim permintaan…" : alreadyPending ? "Permintaan sudah dikirim" : "Kirim permintaan reviewer"}</button>
        <Link to={`/farmer/lands/${landId}/final-decision`} className="mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#56652e] hover:bg-[#f3f3ec]">Lanjut ke keputusan akhir <ArrowRight size={16} /></Link>
      </section>
      <section className="rounded-2xl bg-[#213014] p-6 text-white"><h2 className="flex items-center gap-2 font-bold"><Clock3 size={18} />Status antrean ({reviews.length})</h2><div className="mt-4 space-y-3">{reviews.length ? reviews.map((review, index) => <div key={review.id || index} className="rounded-xl bg-white/10 p-3 text-sm"><b>{review.status}</b>{review.comment && <p className="mt-1 text-xs text-[#d9e7cb]">{review.comment}</p>}</div>) : <p className="text-sm text-[#d9e7cb]">Belum ada respons reviewer.</p>}</div></section>
    </div>}
  </WorkflowLayout>;
}
