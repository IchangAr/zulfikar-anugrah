# PRD - Implementasi Timeline Experience Glassmorphism (SVG Path)

## Tujuan

Mengubah section **Pengalaman** menjadi timeline modern menggunakan
**React + Vite + Tailwind CSS + Framer Motion** dengan **SVG Path**
sebagai jalur utama.

> Inspirasi hanya pada konsep timeline melengkung. Jangan menyalin
> desain referensi secara identik.

## Teknologi

-   React
-   Vite
-   Tailwind CSS
-   Framer Motion
-   SVG Path

## Aturan

-   Jangan mengubah navbar atau section lain.
-   Pertahankan data pengalaman.
-   Pertahankan tema glassmorphism.
-   Fokus hanya pada section Experience.

## Layout Desktop

-   Card pertama di kiri.
-   Card kedua di kanan.
-   Card ketiga di kiri.
-   Lanjut bergantian (zig-zag).

Timeline menjadi elemen visual utama.

## SVG Timeline

Gunakan satu SVG Path responsif. - fill="none" - strokeLinecap="round" -
strokeLinejoin="round" - preserveAspectRatio="none"

Gunakan kurva Bézier yang halus.

## Efek Glass

Timeline harus tampak seperti tabung kaca: - putih transparan - biru
muda - ungu pastel - blur ringan - glow lembut - highlight putih

Gunakan tiga layer: 1. Glow 2. Glass 3. Highlight

## Node

Setiap pengalaman memiliki node glass: - outer ring - inner circle -
glow - pulse saat aktif

## Card

Gunakan: - backdrop-blur-xl - bg-white/10 - border-white/30 - rounded
besar - shadow lembut

Lebar sekitar 45% dan tidak menutupi jalur SVG.

## Animasi

Timeline digambar mengikuti scroll menggunakan: - useScroll() -
pathLength

Card: - kiri muncul dari kiri - kanan muncul dari kanan

## Hover

Saat hover: - naik sedikit - glow bertambah - border lebih jelas

## Mobile

Semua card berada di sisi kanan timeline vertikal yang lebih sederhana.
Tidak boleh overflow horizontal.

## Struktur

``` text
src/
└── sections/
    └── Experience/
        ├── ExperienceSection.jsx
        ├── ExperienceTimeline.jsx
        ├── ExperienceCard.jsx
        └── TimelineNode.jsx
```

Gunakan `experiences.map(...)`.

## Checklist

-   Timeline SVG melengkung kiri-kanan
-   Efek glass
-   Card zig-zag
-   Node glass
-   Animasi scroll
-   Hover
-   Responsive
-   Tidak mengubah section lain
-   Build tanpa error

## Target

Hasil akhir harus menyerupai perjalanan karier modern dengan jalur kaca
melengkung yang menghubungkan setiap pengalaman dan tetap konsisten
dengan tema glassmorphism portofolio.
