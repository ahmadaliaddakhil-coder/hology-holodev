# Action Options v0.2

| ID | Jenis | Label UI | Kapan tersedia |
|---|---|---|---|
| `OPT-VERIFY-FIELD` | `verify_local_condition` | Periksa kembali kondisi lahan | Semua state non-failure. |
| `OPT-COLLECT-WATER-SOURCE` | `collect_missing_information` | Konfirmasi kondisi atau alokasi sumber air | Semua state non-failure. |
| `OPT-REQUEST-REVIEW` | `request_trusted_review` | Minta pertimbangan pihak tepercaya | Context tersedia, perlu verifikasi, atau conflict. |
| `OPT-DEFER` | `defer` | Tunda perubahan sampai informasi cukup | Semua state non-failure. |

Urutan dalam respons adalah urutan display stabil, bukan ranking kualitas.
Semua opsi tidak mempunyai durasi irigasi, volume air, instruksi pompa/gate,
atau klaim outcome. User boleh membuat keputusan di luar daftar dan mencatat
alasannya.

