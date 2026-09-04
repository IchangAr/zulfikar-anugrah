# Prompt Migrasi Portofolio ke React + Vite + Tailwind CSS + Framer Motion

## Tujuan

Saya ingin melakukan migrasi project portofolio saya dari **Vanilla
HTML, CSS, dan JavaScript** ke **React + Vite + Tailwind CSS + Framer
Motion**.

Migrasi ini **hanya mengubah arsitektur project**, **bukan** mengubah
tampilan visual.

------------------------------------------------------------------------

## Aturan Utama

-   Jangan mengubah layout.
-   Jangan mengubah struktur visual.
-   Jangan mengubah spacing.
-   Jangan mengubah warna.
-   Jangan mengubah typography.
-   Jangan mengubah ukuran komponen.
-   Jangan mengubah animasi yang sudah ada kecuali dipindahkan ke Framer
    Motion.
-   Jangan menghapus fitur apa pun.
-   Pertahankan seluruh UX dan UI saat ini.

Website setelah migrasi harus terlihat **IDENTIK** dengan website lama.

------------------------------------------------------------------------

## Tech Stack

-   React 19
-   Vite
-   Tailwind CSS
-   Framer Motion
-   React Icons
-   Lucide React

------------------------------------------------------------------------

## Struktur Folder

``` text
src/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── components/
│   ├── ui/
│   ├── common/
│   └── layout/
│
├── sections/
│   ├── Hero/
│   ├── About/
│   ├── Experience/
│   ├── Projects/
│   ├── Achievements/
│   ├── Certificates/
│   ├── Contact/
│   └── Footer/
│
├── data/
├── hooks/
├── utils/
├── styles/
├── App.jsx
└── main.jsx
```

------------------------------------------------------------------------

## Arsitektur Komponen

Pisahkan setiap section menjadi komponen React.

Contoh:

-   `<Navbar />`
-   `<Hero />`
-   `<About />`
-   `<Experience />`
-   `<Projects />`
-   `<Achievements />`
-   `<Certificates />`
-   `<Contact />`
-   `<Footer />`

Jangan membuat seluruh halaman berada di `App.jsx`.

------------------------------------------------------------------------

## Manajemen Data

Seluruh data harus dipisahkan ke folder `data`.

Contoh:

-   `projects.js`
-   `experience.js`
-   `skills.js`
-   `certificates.js`
-   `achievements.js`
-   `social.js`

Jangan hardcode data langsung di dalam komponen.

------------------------------------------------------------------------

## Styling

Gunakan Tailwind CSS sebagai styling utama.

CSS custom hanya untuk:

-   Glassmorphism
-   Gradient kompleks
-   Keyframe khusus
-   Scrollbar
-   Cursor custom

------------------------------------------------------------------------

## Animasi

Migrasikan seluruh animasi JavaScript ke Framer Motion.

Gunakan:

-   `motion.div`
-   `AnimatePresence`
-   `useScroll`
-   `whileHover`
-   `whileTap`
-   `initial`
-   `animate`
-   `exit`
-   `transition`

Hindari manipulasi DOM manual untuk animasi.

------------------------------------------------------------------------

## Best Practice React

-   Functional Component
-   React Hooks
-   useState
-   useEffect (jika diperlukan)
-   Props
-   map() untuk render list
-   Reusable Component
-   Hindari duplikasi kode

------------------------------------------------------------------------

## Performa

-   Lazy Load Image
-   Optimasi render
-   Pisahkan komponen besar
-   Gunakan memoisasi bila diperlukan

------------------------------------------------------------------------

## Standar Kode

Kode harus:

-   Clean
-   Scalable
-   Reusable
-   Maintainable
-   Mudah dikembangkan

Ikuti praktik terbaik React modern.

------------------------------------------------------------------------

## Yang Tidak Boleh Dilakukan

-   ❌ Jangan redesign.
-   ❌ Jangan mengubah UI.
-   ❌ Jangan mengganti icon.
-   ❌ Jangan mengganti font.
-   ❌ Jangan mengubah layout.
-   ❌ Jangan mengubah warna.
-   ❌ Jangan mengubah spacing.
-   ❌ Jangan menghapus efek glassmorphism.
-   ❌ Jangan menghapus animasi.

------------------------------------------------------------------------

## Strategi Migrasi Bertahap

1.  Setup React + Vite + Tailwind CSS + Framer Motion.
2.  Migrasi Navbar + Hero.
3.  Migrasi About + Skills.
4.  Migrasi Experience.
5.  Migrasi Projects + Modal + Gallery.
6.  Migrasi Achievements + Certificates.
7.  Migrasi Contact + Footer.
8.  Refactoring, optimasi performa, dan pengujian.

------------------------------------------------------------------------

## Target Akhir

Target utama adalah melakukan migrasi teknologi dari **Vanilla
JavaScript** ke **React** tanpa mengubah pengalaman pengguna. Fokus pada
peningkatan kualitas arsitektur, kemudahan pemeliharaan, dan
skalabilitas aplikasi.
