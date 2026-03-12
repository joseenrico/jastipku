<div align="center">
  <img src="./public/JasTipku-Logo.png" alt="JastipKu Logo" width="180" />
  
  # 🛍️ JastipKu
  
  ### *Titip Apapun, Dari Mana Saja.*
  
  Platform titip belanja internasional yang menghubungkan kamu dengan traveler tepercaya di seluruh dunia. Belanja dari California, serasa di Sudirman! 🌏✈️
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📖 Tentang JastipKu

**JastipKu** adalah platform *peer-to-peer* yang merevolusi cara belanja produk internasional. Kami menghubungkan **Buyer** (pembeli) dengan **Jastiper** (traveler) yang sedang bepergian ke luar negeri, sehingga kamu bisa mendapatkan produk impian dari mancanegara tanpa ribet!

> 💡 **Cara Kerja:**  
> Jastiper membuat trip → Buyer memesan barang → Jastiper membeli & mengirim → Buyer menerima barang di rumah!

---

## ✨ Fitur Utama

### 🛒 **Untuk Buyer (Pembeli)**

| Fitur | Deskripsi |
|-------|-----------|
| 🌍 **Global Shopping** | Belanja dari 10+ negara: Korea, Jepang, USA, Thailand, Singapore, dan lebih banyak lagi! |
| 🔒 **100% Safe Escrow** | Dana kamu aman tertahan di sistem dan hanya dilepaskan ke Jastiper setelah barang dikonfirmasi tiba. |
| 📸 **Visual Verification** | Lihat foto bukti pembelian real-time dari Jastiper sebelum transaksi final. |
| 💬 **Direct Chat** | Komunikasi langsung dengan Jastiper untuk negosiasi harga dan detail barang. |
| 🧮 **Tax Calculator** | Kalkulator bea cukai otomatis (PMK 199/2019) dengan threshold $500 per penumpang. |
| 🚚 **Domestic Dispatch** | Integrasi pengiriman lokal (JNE/Gojek/Grab) setelah Jastiper mendarat di Indonesia. |
| 🤖 **Cat AI Assistant** | Konsultasi gratis 24/7 dengan AI chatbot untuk bantuan shopping. |

### ✈️ **Untuk Jastiper (Traveler)**

| Fitur | Deskripsi |
|-------|-----------|
| 📍 **Trip Management** | Buat dan kelola trip internasional dengan mudah (destinasi, tanggal, kapasitas, fee). |
| 💰 **Earnings Dashboard** | Pantau total earnings, pending escrow, dan success rate dalam satu dashboard. |
| 📦 **Order Terminal** | Kelola semua order aktif dengan status tracking yang jelas. |
| 🛃 **Customs Tool** | Kalkulator duty & tax otomatis untuk kepatuhan bea cukai Indonesia. |
| 📊 **Performance Stats** | Lihat rating, total trips, dan histori transaksi untuk membangun kredibilitas. |
| 🔔 **Real-time Notifications** | Notifikasi instan untuk order baru, pembayaran, dan update pengiriman. |

---

## 🎯 Kenapa Memilih JastipKu?

```
┌─────────────────────────────────────────────────────────────────┐
│  🛡️  100% Safe Escrow        │  Dana aman sampai barang tiba   │
│  ✅  Verified Travelers       │  Jastiper terverifikasi E-KTP   │
│  📸  Photo Proof              │  Bukti pembelian real-time      │
│  💎  Tax Transparency         │  Kalkulasi pajak otomatis       │
│  ⚡  Instant Chat             │  Negosiasi langsung & cepat     │
│  🚚  Local Dispatch           │  Pengiriman lokal terintegrasi  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

JastipKu dibangun dengan teknologi modern untuk performa dan pengalaman pengguna terbaik:

### **Frontend**
- ⚛️ **React 19** - UI library
- 🔄 **Next.js 16.1.6** - Full-stack React framework (App Router)
- 📘 **TypeScript 5** - Type safety
- 🎨 **Tailwind CSS 4** - Utility-first styling
- 🎭 **Framer Motion** - Animasi smooth & cinematic
- 🧩 **Radix UI** - Komponen UI yang accessible
- 🗺️ **Leaflet** - Interactive maps untuk trip locations

### **3D & Visual**
- 🌐 **Three.js + React Three Fiber** - 3D Earth globe visualization
- 🎯 **React Three Drei** - 3D helpers dan abstractions

### **Utilities**
- 🎯 **Lucide Icons** - Icon library modern
- 🍞 **Sonner** - Toast notifications
- 🎨 **class-variance-authority** - Component variants
- 🌗 **next-themes** - Dark/Light mode support

---

## 📦 Instalasi & Setup

### **Prerequisites**
- Node.js 20+ 
- npm / yarn / pnpm

### **Langkah Instalasi**

```bash
# 1. Clone repository
git clone https://github.com/your-org/jastipku.git
cd jastipku

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env sesuai kebutuhan

# 4. Run development server
npm run dev

# 5. Buka browser
# http://localhost:3000
```

### **Build untuk Production**

```bash
# Build optimized production
npm run build

# Start production server
npm start
```

---

## 📁 Struktur Folder

```
jastipku/
├── public/                    # Static assets
│   ├── images/               # Images (trip destinations, flags, etc.)
│   ├── JasTipku-Logo.png     # Logo utama
│   ├── cat_ai_404.png        # Cat AI 404 illustration
│   └── background-video.mp4  # Hero background video
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Homepage
│   │   ├── trips/            # Trips browsing & country pages
│   │   ├── jastiper/         # Jastiper dashboard
│   │   ├── orders/           # Order management
│   │   ├── profile/          # User profile
│   │   ├── wallet/           # Wallet & transactions
│   │   └── api/              # API routes (Cat AI chat, etc.)
│   ├── components/           # Reusable React components
│   │   ├── trips/            # Trip-related components
│   │   ├── ui/               # UI primitives (Button, Card, etc.)
│   │   ├── NewTripDialog.tsx # Create trip modal
│   │   ├── CatAIChat.tsx     # AI chatbot
│   │   └── ...
│   ├── lib/                  # Utilities & helpers
│   │   ├── data.ts           # Data fetching functions
│   │   └── utils.ts          # Utility functions
│   ├── types/                # TypeScript type definitions
│   └── data/                 # Dummy data (development)
└── package.json
```

---

## 🎮 Cara Penggunaan

### **Sebagai Buyer:**

1. **Browse Trips** - Kunjungi `/trips` dan pilih negara tujuan
2. **Pilih Jastiper** - Lihat rating dan review Jastiper
3. **Tambah Produk** - Pilih barang yang diinginkan dan tambahkan ke cart
4. **Checkout** - Bayar melalui sistem escrow yang aman
5. **Track Order** - Pantau status order secara real-time
6. **Terima Barang** - Konfirmasi penerimaan dan release pembayaran

### **Sebagai Jastiper:**

1. **Login/Register** - Daftar sebagai Jastiper terverifikasi
2. **Buat Trip** - Klik "Start New Trip" di dashboard
3. **Isi Detail** - Tentukan destinasi, tanggal, kapasitas, dan fee
4. **Kelola Order** - Terima dan proses order dari buyer
5. **Upload Bukti** - Upload foto pembelian sebagai verifikasi
6. **Dispatch** - Kirim barang dan update status pengiriman
7. **Tarik Earnings** - Withdraw earnings setelah order selesai

---

## 📊 Stats

<div align="center">

| 🌍 Countries | 👥 Verified Users | 💰 Transactions | 🔒 Escrow Safe |
|:------------:|:----------------:|:---------------:|:--------------:|
|    **50+**   |     **10k+**     |   **Rp 2B+**    |   **100%**     |

</div>

---

## 🤖 Cat AI Assistant

JastipKu dilengkapi dengan **Cat AI**, asisten virtual berbasis AI yang siap membantu 24/7:

- 💬 Konsultasi produk dan kategori
- 🧮 Kalkulasi estimasi biaya total
- 📦 Tracking status order
- ❓ FAQ dan bantuan umum

> *"Halo! bingung? sini tanya aku."* - Cat AI 🐱

---

## 🔐 Keamanan & Kepercayaan

JastipKu mengutamakan keamanan transaksi:

- ✅ **E-KTP Verification** - Semua Jastiper terverifikasi identitasnya
- 🔒 **Escrow System** - Dana ditahan sampai barang diterima
- 📸 **Photo Proof** - Bukti pembelian real-time dari toko
- 🛡️ **Buyer Protection** - Garansi uang kembali jika barang tidak sesuai
- 📋 **Transaction History** - Semua transaksi tercatat dan transparan

---

## 🛣️ Roadmap

- [ ] Mobile App (iOS & Android)
- [ ] Payment Gateway Integration (GoPay, OVO, DANA)
- [ ] Multi-language Support (EN, ID, ZH)
- [ ] Live Tracking Integration
- [ ] Group Buying / Flash Trips
- [ ] Wishlist & Auto-Request
- [ ] Jastiper Badge System

---

## 🤝 Kontribusi

Kontribusi sangat diapresiasi! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Distributed under the MIT License. Lihat `LICENSE` untuk informasi lebih lanjut.

---

## 📞 Kontak & Support

- 🌐 Website: [jastipku.com](https://jastipku.com)
- 📧 Email: support@jastipku.com
- 💬 Discord: [Join Server](https://discord.gg/jastipku)
- 📱 Instagram: [@jastipku](https://instagram.com/jastipku)

---

<div align="center">
  
  ### 🙏 Terima Kasih
  
  Dibuat dengan ❤️ untuk revolusi belanja global Indonesia
  
  **JastipKu** - *Titip Apapun, Dari Mana Saja.*
  
  ---
  
  ![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=for-the-badge&logo=next.js)
  
</div>
