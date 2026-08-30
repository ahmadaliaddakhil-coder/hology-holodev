# Fixture Limitations & Assumptions (M0)

Dokumen ini mencatat limitasi dari mock data / fixture yang digunakan pada tahap prototipe M0:

1. **Statis & Mocked**: Data tidak diambil langsung dari live API BMKG/SI Katam, melainkan berupa berkas statis JSON.
2. **Cakupan Wilayah Terbatas**: Parameter lokasi hanya disimulasikan untuk 1 hamparan di Kecamatan Kepanjen, Kabupaten Malang.
3. **Penyederhanaan Parameter**: Parameter iklim kompleks disederhanakan menjadi kategori umum (*below_normal*, *consecutive_dry_days*).
4. **Penalti Confidence Fallback**: Penginputan manual (*fallback mode*) secara otomatis mendapat penalti confidence (maksimal 0.65) karena belum melalui instrumen terkalibrasi.