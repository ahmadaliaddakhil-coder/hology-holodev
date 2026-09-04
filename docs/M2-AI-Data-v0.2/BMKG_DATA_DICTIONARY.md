# BMKG Public Forecast API — Data Dictionary v0.2

## Audit

- Endpoint: `GET https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={adm4}`
- Tiga sample live diambil 3 September 2026:
  - `31.71.03.1001` — Kemayoran, DKI Jakarta;
  - `35.73.05.1001` — Tunggulwulung, Jawa Timur;
  - `34.71.14.1001` — Rejowinangun, Daerah Istimewa Yogyakarta.
- Ketiganya mengembalikan satu `data[]`, 21 slot pada waktu audit, analysis time
  yang sama, dan key slot yang konsisten. Jumlah 21 adalah snapshot saat fetch,
  bukan invariant; dokumentasi tetap menjadi basis horizon/granularity.
- Struktur aktual: `lokasi`, lalu `data[]`; setiap item mempunyai `lokasi` dan
  `cuaca[][]`. Normalizer wajib flatten seluruh grup `cuaca` tanpa mengandalkan
  jumlah inner array.
- Dokumentasi menyatakan horizon 3 hari, interval 3 jam, update dua kali sehari,
  dan rate limit 60 request/menit/IP.
- Attribution BMKG wajib tampil pada aplikasi.

## Top-level dan lokasi

| Path | Tipe aktual | M2 | Keterangan |
|---|---|---|---|
| `lokasi` | object | simpan | Metadata lokasi query. |
| `data` | array | simpan | Container prakiraan. Bisa kosong saat lokasi/data tidak tersedia. |
| `lokasi.adm1..adm4` | string | simpan | Kode administrasi; `adm4` menjadi join key utama. |
| `lokasi.provinsi/kotkab/kecamatan/desa` | string | tampil/simpan | Label lokasi. Jangan digunakan sebagai pengganti stable code. |
| `lokasi.lat/lon` | number | simpan | Titik representatif wilayah BMKG, bukan geometry lahan. |
| `lokasi.timezone` | string | simpan | Aktual dapat berupa IANA (`Asia/Jakarta`) atau offset (`+0700`) pada nested location. |
| `data[].cuaca` | array of arrays | proses | Flatten; jangan asumsikan selalu tepat tiga inner array. |

## Field prakiraan

| Field BMKG | Arti resmi | Tipe aktual | Digunakan M2? | Alasan |
|---|---|---|---|---|
| `utc_datetime` | Waktu target UTC | string datetime | **Ya** | Waktu target canonical. Parse sebagai UTC. |
| `local_datetime` | Waktu target lokal | string datetime | **Ya, display** | Tampilan sesuai konteks lokasi; bukan source clock utama. |
| `t` | Suhu udara °C | number | Simpan/tampil | Tidak dipakai reasoning air tanpa rule tervalidasi. |
| `hu` | Kelembapan % | number | Simpan/tampil | Tidak dipakai reasoning air tanpa rule tervalidasi. |
| `weather_desc` | Deskripsi cuaca Indonesia | string | **Ya** | Ringkasan evidence; tidak otomatis berarti kondisi air lahan. |
| `weather_desc_en` | Deskripsi cuaca Inggris | string | Simpan | Fallback/localization. |
| `ws` | Kecepatan angin km/jam | number | Simpan | Tidak dipakai reasoning M2. |
| `wd` | Arah asal angin | string | Simpan | Tidak dipakai reasoning M2. |
| `tcc` | Tutupan awan % | number | Simpan | Tidak dipakai reasoning M2. |
| `vs_text` | Jarak pandang | string | Simpan | Display opsional; bukan input reasoning. |
| `analysis_date` | Waktu produksi forecast UTC | string datetime | **Ya** | Basis source freshness/version. Aktual tidak membawa suffix zona; treat sebagai UTC sesuai dokumentasi. |

## Field tambahan yang terlihat pada sample live

`datetime`, `tp`, `weather`, `wd_deg`, `wd_to`, `vs`, `time_index`, dan `image`
terlihat pada respons sampel. Field ini boleh disimpan dalam raw snapshot, tetapi
tidak menjadi contract M2 sampai BMKG mendokumentasikannya atau tim menyetujui
mapping eksplisit. Khusus `tp`, jangan diasumsikan sebagai curah hujan untuk rule.

## Null/missing policy

Dokumentasi tidak memberi jaminan nullability per field. Implementasi harus:

1. menolak respons yang tidak mempunyai `lokasi.adm4` atau tidak mempunyai slot valid;
2. melewati slot malformed secara eksplisit dan mencatat normalization error;
3. tidak mengganti nilai hilang dengan `0`, `Cerah`, atau nilai sintetis;
4. mempertahankan raw snapshot/reference untuk audit;
5. menghasilkan `unavailable` bila tidak ada slot usable.

## Timestamp policy

- `analysis_date`: kapan forecast diproduksi.
- `utc_datetime`: waktu target forecast.
- `fetched_at`: kapan RembukTani mengambil respons; dibuat oleh adapter.
- Ketiganya berbeda dan tidak boleh saling menggantikan.

## Referensi

- BMKG, Data Prakiraan Cuaca Terbuka: https://data.bmkg.go.id/prakiraan-cuaca/
- Sample resmi pada halaman BMKG: `adm4=31.71.03.1001`; dua kode lain
  diverifikasi melalui respons API, bukan hasil location resolver RembukTani.

