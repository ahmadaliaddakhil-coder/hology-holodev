# Action Options Catalog

Registry executable: `data/evidence/v0.2/ACTION_OPTIONS_v0.2.json`.

| ID stabil | Title | Description | Rationale |
|---|---|---|---|
| `OPT-VERIFY-FIELD` | Periksa kembali kondisi lahan | Ulangi pengamatan lokal yang relevan untuk kasus aktif. | Mengurangi informasi lokal yang belum diketahui atau perlu konfirmasi. |
| `OPT-COLLECT-WATER-SOURCE` | Konfirmasi kondisi sumber air | Catat kondisi atau alokasi sumber air tanpa menetapkan volume/durasi. | Melengkapi konteks air yang belum tersedia. |
| `OPT-REQUEST-REVIEW` | Minta pertimbangan pihak tepercaya | Bagikan evidence kepada reviewer/penyuluh untuk telaah manusia. | Menambah konteks ketika evidence terbatas atau berkonflik. |
| `OPT-DEFER` | Tunda perubahan | Tunda perubahan tindakan sampai informasi cukup. | Menjaga abstention saat dasar keputusan belum memadai. |

ID adalah semantic contract lintas AI/Data, backend, database, dan frontend; UUID
database tetap hanya row identifier. Urutan display bukan ranking. Tidak ada best
option, recommended score, prescription, durasi irigasi, atau klaim outcome.
