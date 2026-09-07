# LLM Integration and Data Inventory v0.3

## Jawaban singkat untuk tim

Data yang RembukTani kumpulkan saat ini:

1. **Lahan:** nama, koordinat, provinsi, kabupaten/kota, kecamatan, desa/kelurahan, ADM4 terverifikasi, dan sumber lokasi.
2. **Konteks tanaman:** komoditas, varietas, fase pertumbuhan, tanggal tanam, dan status aktif.
3. **BMKG canonical evidence:** waktu analisis/target, deskripsi cuaca, suhu, kelembapan, angin, arah angin, tutupan awan, jarak pandang, provenance, freshness, quality, dan penanda mock/live.
4. **Field Pulse:** keberadaan air (`present/limited/none/unknown`), aliran irigasi (`flowing/limited/not_flowing/unknown`), pelapor, dan waktu observasi.
5. **Jejak keputusan:** decision case, assessment version, faktor, data yang hilang, keterbatasan, alternatif, review opsional, keputusan manusia, evidence snapshot, dan Decision Brief.

Data yang **tidak** dimiliki dan tidak boleh diklaim: sensor tanah, NDVI/Sentinel, debit air, curah hujan kumulatif, dosis pupuk, diagnosis hama, jadwal pintu air, atau prediksi hasil panen.

## Arsitektur hybrid

```text
BMKG canonical + Crop Context + Field Pulse
                  ↓
       deterministic water-v0.2 guardrail
                  ↓
 Gemini structured generation (opsional)
                  ↓
 backend safety/business validation
                  ↓
 assessment + 2–4 unranked action options
                  ↓
 review opsional → keputusan akhir manusia
```

LLM tidak mengganti evidence normalizer, freshness policy, atau keputusan manusia. Jika key, jaringan, timeout, schema, atau safety validation gagal, hasil deterministic dipakai dan kegagalan tidak menghasilkan narasi palsu.

## Model

Default implementasi adalah `gemini-2.5-flash`: stabil, cepat, structured JSON, dan cocok untuk demo interaktif. Model dapat diganti melalui `LLM_MODEL` tanpa mengubah route atau UI. API key hanya berada di backend dan tidak dikirim ke browser.

## Guardrail output

- Bahasa Indonesia sederhana.
- Dua sampai empat alternatif, tanpa ranking.
- Tidak boleh membuat data baru.
- Tidak boleh memberi dosis, volume, durasi, jadwal presisi, diagnosis, atau jaminan hasil.
- Saat evidence kurang, opsi hanya verifikasi, kumpulkan data, minta review, atau tunda.
- Setiap output disimpan bersama `rule_version` model dan evidence yang mendasarinya.
