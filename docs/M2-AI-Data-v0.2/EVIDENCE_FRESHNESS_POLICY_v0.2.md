# Evidence Freshness Policy v0.2

Freshness adalah status sumber, bukan klaim validitas agronomis.

## BMKG

Pada evaluation time `T`:

- `current`: ada minimal satu slot dengan `target_time_utc >= T`, analysis time
  valid, dan respons berhasil dinormalisasi.
- `stale`: cache ada tetapi tidak mempunyai slot target pada/ setelah `T`, atau
  versi analysis lebih lama dipakai setelah fetch live gagal.
- `unavailable`: tidak ada cache usable atau payload tidak dapat dinormalisasi.

UI wajib menyebut `cached` terpisah dari freshness. Cached evidence dapat tetap
`current` bila masih memiliki forecast slot target yang relevan; ia tidak boleh
ditampilkan seolah hasil fetch live.

## Field Pulse

M2 tidak mengarang expiry agronomis universal. Field Pulse dinilai:

- `current_for_case`: diambil setelah Decision Case dimulai atau dikonfirmasi
  ulang secara eksplisit dalam case;
- `needs_confirmation`: berasal dari sebelum case atau waktu observasi tidak ada;
- `unavailable`: object tidak ada/malformed.

## Evaluation requirements

- Status dihitung, tidak disimpan sebagai kebenaran permanen.
- Simpan `evaluated_at` agar hasil repeatable.
- Clock comparison menggunakan instant UTC.
- Future clock anomaly, invalid timestamp, dan `analysis_date` setelah
  `fetched_at` menghasilkan unavailable/error, bukan koreksi diam-diam.

