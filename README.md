# 💍 Wedding Guest Management

Sistem manajemen tamu undangan pernikahan berbasis Next.js 14 + MongoDB.

---

## Stack

| Layer        | Pilihan                          |
|--------------|----------------------------------|
| Framework    | Next.js 14 (App Router)          |
| Language     | TypeScript                       |
| Database     | MongoDB + Mongoose                |
| Auth         | NextAuth.js (Credentials + JWT)  |
| Password     | bcryptjs                         |
| Validation   | Zod                              |
| UI           | TailwindCSS                      |

---

## Struktur Folder

```
wedding-guest-management/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   ← NextAuth handler
│   │   ├── admin/
│   │   │   ├── guests/
│   │   │   │   ├── route.ts              ← GET list, POST create
│   │   │   │   └── [id]/route.ts         ← GET, PUT, DELETE single
│   │   │   └── seed/route.ts             ← Dev-only seed endpoint
│   │   └── rsvp/[code]/route.ts          ← Public RSVP GET + POST
│   ├── admin/
│   │   ├── layout.tsx                    ← Protected admin layout
│   │   └── guests/
│   │       ├── page.tsx                  ← Guest list page
│   │       ├── new/page.tsx              ← Create guest
│   │       └── [id]/edit/page.tsx        ← Edit guest
│   ├── invitation/[code]/page.tsx        ← Public RSVP page
│   ├── login/page.tsx                    ← Admin login
│   ├── layout.tsx
│   ├── page.tsx                          ← Redirect root
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── EditGuestClient.tsx
│   │   ├── GuestForm.tsx
│   │   ├── GuestListClient.tsx
│   │   └── LoginForm.tsx
│   └── RSVPClient.tsx
├── lib/
│   ├── api-response.ts                   ← { ok, error } helpers
│   ├── auth.ts                           ← NextAuth config
│   ├── db.ts                             ← MongoDB singleton
│   ├── rate-limit.ts                     ← In-memory rate limiter
│   └── validations.ts                    ← Zod schemas
├── middleware.ts                         ← Route protection
├── models/
│   ├── AdminUser.ts
│   └── Guest.ts
├── scripts/
│   └── seed-admin.ts
└── types/
    └── next-auth.d.ts
```

---

## Setup & Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB URI — local atau Atlas
MONGODB_URI=mongodb://localhost:27017/wedding_db

# Generate dengan: openssl rand -base64 32
NEXTAUTH_SECRET=isi_dengan_random_secret_yang_panjang

NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Buat admin pertama

**Cara A — ts-node script (rekomendasi):**
```bash
npm run seed
# Default: admin@wedding.com / admin123

# Custom:
npm run seed -- super@admin.com MySecurePassword!
```

**Cara B — API endpoint (dev only):**
```bash
# Jalankan server dulu, lalu:
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wedding.com","password":"admin123"}'
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka: [http://localhost:3000](http://localhost:3000)

---

## URL & Routing

| URL                          | Deskripsi                        | Auth     |
|------------------------------|----------------------------------|----------|
| `/`                          | Redirect ke dashboard / login    | —        |
| `/login`                     | Login admin                      | Public   |
| `/admin/guests`              | Daftar tamu + ringkasan          | Admin    |
| `/admin/guests/new`          | Tambah tamu baru                 | Admin    |
| `/admin/guests/:id/edit`     | Edit tamu                        | Admin    |
| `/invitation/:code`          | Halaman RSVP untuk tamu          | Public   |

---

## API Endpoints

### Admin (semua butuh session)

| Method | URL                         | Keterangan              |
|--------|-----------------------------|-------------------------|
| GET    | `/api/admin/guests`         | List + pagination + search |
| POST   | `/api/admin/guests`         | Buat tamu baru          |
| GET    | `/api/admin/guests/:id`     | Detail tamu             |
| PUT    | `/api/admin/guests/:id`     | Update tamu             |
| DELETE | `/api/admin/guests/:id`     | Hapus tamu              |

**Query params GET list:**
- `page` (default: 1)
- `limit` (default: 20, max: 50)
- `search` — cari nama / telepon / kode
- `status` — `INVITED` | `CONFIRMED` | `DECLINED`
- `category` — `Akad` | `Resepsi` | `Both`

### Public RSVP

| Method | URL                   | Keterangan                 |
|--------|-----------------------|----------------------------|
| GET    | `/api/rsvp/:code`     | Info tamu (nama, maxPax)   |
| POST   | `/api/rsvp/:code`     | Submit RSVP                |

**POST body:**
```json
{
  "attending": true,
  "pax": 2,
  "note": "Terima kasih undangannya!"
}
```

### Response Format

Semua endpoint mengembalikan format konsisten:

```json
// Sukses
{ "ok": true, "data": { ... } }

// Error
{ "ok": false, "error": { "code": "...", "message": "...", "details": {} } }
```

---

## Data Model

### Guest

```typescript
{
  name:           string        // Nama tamu
  phone:          string        // No. HP (opsional)
  invitationCode: string        // Kode unik 10 karakter (nanoid)
  category:       "Akad" | "Resepsi" | "Both"
  maxPax:         number        // Maks. tamu yang boleh hadir
  status:         "INVITED" | "CONFIRMED" | "DECLINED"
  rsvp: {
    attending:   boolean | null
    pax:         number  | null
    note:        string  | null
    respondedAt: Date    | null
  }
  createdAt: Date
  updatedAt: Date
}
```

---

## Fitur Keamanan

- ✅ Password di-hash dengan bcrypt (cost factor 12)
- ✅ Session JWT dengan expiry 8 jam
- ✅ Middleware proteksi semua route `/admin/*`
- ✅ Rate limiting login: 10 percobaan / 15 menit per IP
- ✅ Validasi input server-side dengan Zod
- ✅ RSVP di-scope per `invitationCode` (tidak bisa update tamu lain)
- ✅ Validasi `pax ≤ maxPax` di server
- ✅ Error response tidak bocorkan stack trace
- ✅ ObjectId validation sebelum query MongoDB

---

## Production Notes

1. **Rate limiter** saat ini in-memory — ganti dengan Redis untuk multi-instance
2. Set `NEXTAUTH_URL` ke domain produksi
3. Gunakan MongoDB Atlas dengan connection string yang aman
4. Generate `NEXTAUTH_SECRET` baru: `openssl rand -base64 32`
