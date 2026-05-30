# Proposal Website Komunitas GKI Kelapa Cengkir

> Dokumen perencanaan untuk pengembangan website komunitas jemaat dengan fitur crowdfunding, promosi usaha (UMKM), dan lowongan kerja.

---

## 1. Latar Belakang

Saat ini GKI Kelapa Cengkir memiliki website [gkikelapacengkir.org](https://gkikelapacengkir.org/) yang berfungsi sebagai website informatif (jadwal ibadah, warta jemaat, renungan, dll). Website yang akan dibangun ini **bukan menggantikan** website tersebut, melainkan **melengkapinya** dengan platform komunitas yang lebih interaktif dan saling memberdayakan antar jemaat.

**Filosofi utama:** *"Jemaat tolong-menolong jemaat"* — sebuah ekosistem di mana berkat yang diterima satu jemaat dapat mengalir kepada jemaat lain melalui dukungan dana, dukungan usaha, dan dukungan pekerjaan.

---

## 2. Tujuan

1. **Saling menolong secara finansial** — jemaat yang sedang dalam kesulitan (sakit, musibah, kebutuhan pendidikan, dll) bisa mendapat dukungan dana dari sesama jemaat secara transparan.
2. **Saling memberdayakan secara ekonomi** — jemaat yang punya usaha (UMKM) mendapat exposure di komunitas, sehingga jemaat lain bisa menjadi pelanggan/partner.
3. **Saling membuka peluang kerja** — jemaat pemilik usaha bisa membuka lowongan kepada jemaat lain yang sedang mencari pekerjaan.
4. **Tetap selaras dengan nilai gereja** — semua fitur harus melalui moderasi pengurus gereja untuk menjaga integritas dan tujuan kasih.

---

## 3. Tiga Fitur Utama

### 3.1 Crowdfunding (Galang Dana Jemaat)

Mirip seperti kitabisa.com, tapi versi internal komunitas gereja.

**Alur singkat:**
1. Jemaat (atau pengurus atas nama jemaat) mengajukan kampanye galang dana.
2. Pengajuan ditinjau oleh tim pastoral/diakonia untuk verifikasi keaslian kebutuhan.
3. Setelah disetujui, kampanye tayang di halaman publik website.
4. Jemaat lain bisa berdonasi melalui payment gateway (transfer, e-wallet, QRIS).
5. Progres donasi terlihat real-time (target, terkumpul, jumlah donatur).
6. Setelah selesai, ada laporan penggunaan dana yang dibagikan ke donatur.

**Kategori contoh:**
- Bantuan medis (operasi, pengobatan jangka panjang)
- Bantuan pendidikan (beasiswa, biaya kuliah)
- Bantuan musibah (kebakaran, kebanjiran, kedukaan)
- Misi dan pelayanan (mission trip, pelayanan sosial)

**Fitur penting:**
- Verifikasi/moderasi wajib oleh pengurus
- Transparansi: laporan penggunaan dana
- Anonimitas opsional untuk donatur
- Update kampanye dari penggalang dana
- Komentar/doa dari donatur

---

### 3.2 Promosi Usaha Jemaat (Direktori UMKM)

Etalase digital untuk UMKM yang dimiliki jemaat.

**Alur singkat:**
1. Jemaat pemilik usaha mendaftarkan usahanya (nama, kategori, deskripsi, foto, kontak WhatsApp, lokasi, link marketplace jika ada).
2. Pengurus melakukan verifikasi bahwa pendaftar adalah jemaat aktif.
3. Usaha tayang di direktori, bisa dicari/difilter berdasarkan kategori.

**Kategori contoh:**
- Kuliner (catering, kue, frozen food)
- Fashion (baju, hijab, aksesoris)
- Jasa (servis AC, laundry, salon, fotografi)
- Pendidikan (les privat, kursus)
- Properti (kos, kontrakan)
- Lainnya

**Fitur penting:**
- Pencarian dan filter (kategori, lokasi)
- Halaman profil usaha (galeri foto, deskripsi, kontak)
- Tombol "Hubungi via WhatsApp" langsung
- Rating/testimoni dari jemaat lain (opsional, untuk fase 2)
- Tag "Verified by Gereja" untuk membangun kepercayaan

---

### 3.3 Lowongan Kerja Jemaat (Job Board)

Papan lowongan kerja dari jemaat pemilik usaha untuk sesama jemaat.

**Alur singkat:**
1. Jemaat pemilik usaha posting lowongan (posisi, deskripsi, kualifikasi, gaji range, lokasi, kontak).
2. Pengurus memverifikasi pengumuman.
3. Lowongan tayang di halaman job board.
4. Jemaat pencari kerja melamar langsung via kontak yang diberikan (atau melalui form aplikasi internal).

**Fitur penting:**
- Filter berdasarkan jenis pekerjaan (full-time, part-time, freelance, magang)
- Filter berdasarkan kategori industri
- Notifikasi email untuk jemaat yang subscribe kategori tertentu
- Halaman "Saya Sedang Mencari Kerja" — jemaat bisa posting CV singkat (opsional, fase 2)
- Lowongan otomatis arsip setelah 30 hari (bisa diperpanjang)

---

## 4. Peran Pengguna (User Roles)

| Role | Hak Akses |
|------|-----------|
| **Guest** (pengunjung publik) | Lihat kampanye crowdfunding, donasi, lihat direktori UMKM, lihat lowongan kerja |
| **Jemaat** (terdaftar & terverifikasi) | Semua hak Guest + ajukan kampanye, daftarkan usaha, posting lowongan, melamar lowongan |
| **Moderator** (Tim Diakonia/Pastoral) | Review & approve pengajuan kampanye, usaha, dan lowongan |
| **Admin** (Pengurus IT) | Manajemen user, manajemen konten, laporan keuangan, akses penuh |

**Verifikasi jemaat:** Saat registrasi, perlu mekanisme verifikasi bahwa pendaftar memang jemaat GKI Kelapa Cengkir. Opsi:
- Approval manual oleh sekretariat (paling aman, lebih lambat)
- Kode undangan yang dibagikan saat ibadah
- Verifikasi via nomor anggota jemaat

> **Perlu diskusi:** mekanisme verifikasi mana yang paling cocok dengan kondisi gereja?

---

## 5. Struktur Halaman (Sitemap)

```
/                           → Landing page (hero, highlight kampanye, UMKM, lowongan terbaru)
/tentang                    → Tentang platform ini
/cara-kerja                 → Panduan untuk jemaat

/galang-dana                → Daftar semua kampanye
/galang-dana/[slug]         → Detail kampanye + donasi
/galang-dana/ajukan         → Form ajukan kampanye (login required)

/umkm                       → Direktori UMKM jemaat
/umkm/[slug]                → Detail usaha
/umkm/daftarkan             → Form daftarkan usaha (login required)

/lowongan                   → Daftar lowongan kerja
/lowongan/[slug]            → Detail lowongan
/lowongan/posting           → Form posting lowongan (login required)

/auth/login                 → Login
/auth/register              → Registrasi (perlu verifikasi)
/auth/lupa-password         → Reset password

/profil                     → Profil jemaat
/profil/kampanye-saya       → Kampanye yang saya buat
/profil/usaha-saya          → Usaha yang saya daftarkan
/profil/lowongan-saya       → Lowongan yang saya posting
/profil/donasi-saya         → Riwayat donasi

/admin                      → Dashboard admin (terbatas)
/admin/moderasi             → Antrian moderasi
/admin/laporan              → Laporan keuangan & aktivitas
```

---

## 6. Rekomendasi Tech Stack

> Pilihan stack ini berdasarkan: maintainability jangka panjang, ekosistem komunitas yang besar, biaya hosting yang terjangkau, dan kemudahan handover ke developer lain di kemudian hari.

| Layer | Rekomendasi | Alasan |
|-------|-------------|--------|
| **Frontend & Backend** | Next.js 14+ (App Router) + TypeScript | Full-stack, SEO friendly, performa baik, ekosistem besar |
| **UI Framework** | Tailwind CSS + shadcn/ui | Cepat dibangun, modern, mudah di-customize |
| **Database** | PostgreSQL (via Supabase) | Relational data cocok untuk transaksi, Supabase mempermudah setup |
| **Auth** | Supabase Auth atau Clerk | Built-in, aman, support email/password & magic link |
| **File Storage** | Supabase Storage atau Cloudinary | Upload foto UMKM, dokumen kampanye |
| **Payment Gateway** | Midtrans atau Xendit | Support QRIS, transfer, e-wallet — lokal Indonesia |
| **Email** | Resend atau SendGrid | Notifikasi, verifikasi |
| **Hosting** | Vercel (frontend) + Supabase (backend) | Free tier cukup untuk awal, scale-up mudah |
| **Domain** | Subdomain `komunitas.gkikelapacengkir.org` atau domain baru | Tergantung preferensi gereja |

**Estimasi biaya bulanan (fase awal):**
- Vercel Hobby: Gratis
- Supabase Free: Gratis (sampai 500MB DB, 1GB storage)
- Midtrans: Fee per transaksi (~1-2% per donasi, tidak ada biaya bulanan)
- Resend Free: 100 email/hari gratis
- **Total awal: ~Rp 0 - Rp 200.000/bulan** (tergantung volume)

> **Catatan:** Stack ini bisa diganti sesuai preferensi. Jika ada developer gereja yang lebih familiar dengan Laravel/Django/lainnya, bisa disesuaikan.

---

## 7. Roadmap Pengembangan

### Fase 1 — MVP (Minimum Viable Product) — ~4-6 minggu
- Setup project, auth, dan verifikasi jemaat
- Modul crowdfunding (CRUD kampanye, donasi, moderasi)
- Integrasi payment gateway
- Modul direktori UMKM (CRUD + listing)
- Modul lowongan kerja (CRUD + listing)
- Dashboard admin sederhana
- Deploy ke production

### Fase 2 — Penyempurnaan — ~3-4 minggu
- Notifikasi email
- Rating & testimoni UMKM
- Profil "Saya Sedang Mencari Kerja"
- Laporan keuangan terperinci untuk admin
- Update kampanye dari penggalang dana
- Halaman cerita berkat (testimoni penerima dana)

### Fase 3 — Pengembangan Lanjut — opsional
- Mobile app (PWA atau native)
- Integrasi dengan database jemaat existing
- Fitur komunitas (forum, doa bersama)
- Analytics & dashboard public stats

---

## 8. Pertimbangan Penting

### 8.1 Aspek Hukum & Etika
- **Penggalangan dana publik di Indonesia** diatur oleh UU No. 9 Tahun 1961 dan PP No. 29/1980. Untuk dana yang dikumpulkan internal jemaat dengan tujuan kasih, umumnya aman, tapi **perlu konsultasi dengan pengurus gereja** untuk memastikan kepatuhan.
- Perlindungan data pribadi (UU PDP) — pastikan data jemaat tersimpan aman.
- Pajak donasi — donasi ke lembaga keagamaan umumnya tidak kena pajak, tapi mekanisme transfer dana ke penerima perlu dipikirkan.

### 8.2 Moderasi & Trust
- Sistem moderasi mutlak untuk mencegah penyalahgunaan.
- Verifikasi keaslian kampanye (lampiran dokumen, kunjungan pastoral, dll).
- Audit trail untuk semua transaksi.

### 8.3 Pengelolaan Dana
- Apakah dana mengalir langsung ke rekening penerima, atau melewati rekening gereja dulu?
- Siapa yang bertanggung jawab atas pelaporan?
- Bagaimana jika kampanye tidak mencapai target?
- Apa kebijakan untuk dana sisa?

> **Perlu diskusi dengan pengurus gereja:** alur dana yang paling sesuai dengan tata kelola gereja.

### 8.4 Keamanan
- HTTPS wajib
- Rate limiting untuk mencegah spam
- 2FA untuk admin
- Backup database berkala
- Logging aktivitas sensitif

---

## 9. Pertanyaan untuk Didiskusikan

Sebelum mulai develop, ada beberapa hal yang perlu dikonfirmasi:

1. **Sponsor & Stakeholder** — Siapa pengurus gereja yang akan menjadi penanggung jawab proyek ini? (Majelis? Tim IT? Diakonia?)
2. **Mekanisme verifikasi jemaat** — Bagaimana memastikan yang daftar adalah jemaat GKI Kelapa Cengkir asli?
3. **Alur pengelolaan dana** — Dana donasi masuk ke rekening siapa? Bagaimana pencairan ke penerima?
4. **Tim moderasi** — Siapa yang akan jadi moderator? Berapa orang? SOP review?
5. **Branding** — Nama platform? (misalnya "Kasih Jemaat", "Sahabat GKI KC", dll). Logo? Warna sesuai brand gereja?
6. **Domain & integrasi** — Subdomain dari gkikelapacengkir.org, atau domain terpisah? Apakah perlu single sign-on dengan website utama?
7. **Anggaran** — Apakah ada anggaran khusus dari gereja? Atau pengembangan voluntir?
8. **Target launch** — Kapan diharapkan live? Apakah ada momen khusus (HUT gereja, Natal, dll)?

---

## 10. Langkah Selanjutnya

Setelah dokumen ini direview dan disetujui:

1. **Workshop dengan stakeholder gereja** untuk konfirmasi pertanyaan di atas
2. **Finalisasi scope & fitur** untuk MVP
3. **Setup repository & environment**
4. **Mulai development sesuai roadmap fase 1**
5. **Iterasi & feedback dari pengurus**
6. **Soft launch** ke kalangan terbatas (misalnya tim moderasi & majelis)
7. **Public launch** ke seluruh jemaat

---

*Dokumen ini adalah draft awal. Mohon direview dan diberi masukan sebelum lanjut ke tahap implementasi.*
