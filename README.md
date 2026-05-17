# Nextzy Wheel — เกมสะสมคะแนน

เว็บแอปพลิเคชันเกมหมุนวงล้อสะสมคะแนน พัฒนาด้วย Next.js 16 + Tailwind CSS เชื่อมต่อกับ Backend API

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| State Management | Zustand (player identity) |
| Data Fetching | TanStack Query v5 |
| Notifications | Sonner |

## Installation

**Prerequisites:** Node.js 18+, pnpm

```bash
pnpm install
```

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

```bash
pnpm dev      # development
pnpm build    # production build
pnpm lint     # lint
```

## Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing — กรอกชื่อเพื่อเข้าเล่น
│   ├── home/page.tsx     # Home — คะแนนสะสม, ประวัติ, รับรางวัล
│   └── game/page.tsx     # Game — หมุนวงล้อ
├── components/
│   ├── layout/           # PageShell (h-screen layout)
│   ├── ui/               # Shared UI (Modal, BottomBar, Spinner)
│   ├── home/             # ScoreCard, TabBar, HistoryList, ClaimConfirmModal
│   └── game/             # SpinWheel (SVG), SpinResultModal
├── services/
│   └── player-service.ts # API calls ทั้งหมด
├── store/
│   └── player-store.ts   # Zustand — เก็บ player id, username
├── lib/
│   ├── constants.ts      # WHEEL_SEGMENTS, CHECKPOINTS, MAX_SCORE
│   └── api.ts            # Server-side fetch helper
└── types/index.ts        # Shared types + ApiResponse<T>
```

### Data Flow

```
Landing → login API → Zustand store (id, username)
                ↓
Home → useQuery(profile) → ScoreCard แสดงคะแนน + progress bar
     → useQuery(rewards)  → แสดงปุ่มรับรางวัลตาม checkpoint
     → useInfiniteQuery   → HistoryList (global / mine / rewards tab)
                ↓
Game → SpinWheel หมุน (requestAnimationFrame)
     → กดหยุด → คำนวณ segment จาก rotation angle
     → POST /spins { points }
     → invalidateQueries(profile) → คะแนนอัปเดตอัตโนมัติ
```

### Key Design Decisions

- **Player session ไม่ persist** — Zustand in-memory only หากรีเฟรชจะ redirect กลับ `/` เพื่อรองรับหลายคนต่อเครื่องเดียวกัน
- **Spin result คำนวณ client-side** — rotation angle → segment index → ส่ง points ไป API
- **Progress bar non-linear** — marker positions `[10%, 45%, 100%]` ไม่ตรงกับสัดส่วน threshold จริง จึงใช้ interpolation ให้ fill ตรงกับ marker เสมอ
- **API calls ตรงจาก client** — ไม่ผ่าน Next.js API proxy เพราะ backend มี CORS และไม่มี secret

## Features

### Landing (`/`)
- กรอกชื่อผู้เล่น → เรียก login API → เข้าสู่หน้า Home
- ชื่อซ้ำกับ CSV ที่ import ไว้ → ระบบรวมเป็นผู้เล่นคนเดียวกัน

### Home (`/home`)
- **ScoreCard** — แสดงคะแนนสะสม, progress bar พร้อม 3 checkpoint (500 / 1,000 / 10,000)
- **Reward buttons** — กดรับรางวัลเมื่อถึง checkpoint, แสดง modal ยืนยัน, กดซ้ำไม่ได้
- **HistoryList** — 3 tab: ประวัติทั่วโลก, ประวัติของฉัน, รางวัลของฉัน พร้อม infinite scroll

### Game (`/game`)
- **SpinWheel** — SVG วงล้อ 4 ช่อง (300 / 500 / 1,000 / 3,000 คะแนน)
- กด "เริ่มหมุน" → วงล้อหมุน, กด "หยุด" → หยุดทันที คำนวณ segment ใต้เข็ม → บันทึกคะแนน
- แสดง modal ผลคะแนน → กดปิดแล้วเล่นต่อได้เลย
