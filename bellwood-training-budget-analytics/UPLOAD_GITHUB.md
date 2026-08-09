# Panduan Upload ke GitHub

> Hapus file ini setelah repo berhasil di-push — isinya panduan sekali pakai, bukan bagian dari portfolio.

---

## Langkah 0 — Ganti nama folder (WAJIB)

Nama folder sekarang `bellwood-hr-governance-analytics`, tapi isinya analisis anggaran training. README sudah memakai nama baru.

Lewat File Explorer, ganti nama folder menjadi:

```
bellwood-training-budget-analytics
```

Nama repo GitHub nanti harus sama persis (konvensi kebab-case, seperti `nbc-sales-analytics`).

---

## Langkah 1 — Buat repo kosong di GitHub

1. Buka https://github.com/new
2. **Repository name:** `bellwood-training-budget-analytics`
3. **Description:**
   `Tracing $1.68M of training spend at a fictional telecom contractor — record integrity audit, hypothesis testing, and a challenged 80% target. SQL · Python · Power BI`
4. **Public**
5. **Jangan** centang "Add a README", "Add .gitignore", atau "Choose a license" — semuanya sudah ada di lokal
6. Klik **Create repository**

---

## Langkah 2 — Inisialisasi dan push

Buka terminal di dalam folder project (Git Bash / PowerShell), lalu:

```bash
git init
git branch -M main

git add .
git commit -m "Training budget effectiveness analysis — Bellwood Networks

Full 6-stage analytics lifecycle on 3,000 training records:
- Record integrity audit: 1,317 records (43.9%, $735,145) with impossible dates
- Hypothesis testing: 5 of 6 candidate drivers rejected
- Lever sizing: 80% target unreachable, 53.4% is the evidenced ceiling
- 6 recommendations addressing $768,304 (45.8% of budget)"

git remote add origin https://github.com/deleonard20/bellwood-training-budget-analytics.git
git push -u origin main
```

Kalau diminta login, gunakan **Personal Access Token** sebagai password
(GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → scope `repo`).

---

## Langkah 3 — Rapikan tampilan repo

Setelah push berhasil, di halaman repo klik ⚙️ di sebelah **About**:

**Topics** (bantu recruiter menemukan repo):
```
people-analytics  hr-analytics  data-analysis  sql  postgresql
python  power-bi  data-quality  statistical-analysis  portfolio
```

Centang: ✅ Releases · ✅ Packages **dinonaktifkan** (tidak relevan)

---

## Langkah 4 — Verifikasi setelah push

Buka repo di browser dan pastikan:

- [ ] Gambar di README tampil (4 gambar: 1 dashboard mockup + 3 figure)
- [ ] Badge Shields.io ter-render
- [ ] File `.pptx` bisa diunduh
- [ ] Struktur folder `01_define` … `06_action` terlihat urut
- [ ] Tidak ada folder kosong yang hilang (`dashboard/` akan hilang karena Git tidak melacak folder kosong — normal, akan terisi saat `.pbix` selesai)

---

## Ukuran repo

**47 file, 5,28 MB** — jauh di bawah batas GitHub (rekomendasi < 1 GB, limit per file 100 MB).
Tidak perlu Git LFS.

File terbesar:

| File | Ukuran |
|------|--------|
| `deck/Training_Budget_Effectiveness_Analysis_Deck.pptx` | 1,9 MB |
| `data/raw/employee_data.csv` | 762 KB |
| `data/raw/recruitment_data.csv` | 681 KB |
| `data/processed/training_spend_mart.csv` | 491 KB |

---

## Yang di-commit vs diabaikan

**Di-commit (disengaja):**

| Path | Alasan |
|------|--------|
| `data/raw/` | CSV sumber — tanpa ini analisis tidak bisa direproduksi |
| `data/processed/` | Analytical mart, didokumentasikan di Data Model dan dibaca Power BI (491 KB) |
| `deck/assets/` | Input yang dibutuhkan `deck/build_deck.js` |
| `deck/build_deck.js` | Deck di-generate lewat kode — ini pembeda, bukan sampah |

> Catatan: `data/processed/` biasanya di-*gitignore* karena bisa di-generate ulang.
> Di sini sengaja di-commit supaya recruiter bisa melihat struktur mart tanpa
> menjalankan apa pun, dan supaya file `.pbix` nanti punya sumber data yang stabil.
> Kalau Anda lebih suka mengikuti konvensi ketat, tambahkan `data/processed/` ke
> `.gitignore` dan hapus baris Data Model yang merujuknya.

**Diabaikan:** artefak build (`*.pdf`, `slide-*.jpg`), `node_modules/`, cache Python, file OS.

---

## Setelah dashboard Power BI selesai

```bash
# 1. Simpan file .pbix
#    dashboard/bellwood_training_budget_dashboard.pbix

# 2. Screenshot tiap halaman ke:
#    05_communication/screenshots/01_executive_summary.png
#    05_communication/screenshots/02_programme_performance.png
#    05_communication/screenshots/03_integrity_exceptions.png

# 3. Di README, ganti bagian "Dashboard Preview":
#    - hapus blok peringatan "Power BI build in progress"
#    - ganti gambar mockup dengan screenshot asli
#    - ubah badge Status jadi:
#      ![Status](https://img.shields.io/badge/Status-Completed-brightgreen)

git add .
git commit -m "Add Power BI dashboard and live screenshots"
git push
```
