# Section HERO — Tài liệu API & Field Mapping

Tài liệu chuẩn để **Backend implement API** và **Frontend map dữ liệu** cho section **HERO** trên trang Home (`#home`).

| Thuộc tính | Giá trị |
|------------|---------|
| Anchor trang | `#home` |
| **Section type** | **`1`** (Hero) |
| Public component | `HeroComponent` |
| Admin route | `/admin/hero-section` |
| Model | `src/app/features/admin/models/hero-section.model.ts` |
| Store (mock) | `src/app/features/admin/store/hero-section.store.ts` |
| Type constant | `section-type.constants.ts` → `SECTION_API_TYPE = 1` |
| API constants | `api.constants.ts` → `HERO_*` (`/api/admin/hero/*?type=1`) |
| localStorage key (mock) | `portfolio_hero_section_data` |

---

## Quy tắc `type` (quan trọng)

Mọi section dùng **`type: 1`** (phiên bản/schema API hiện tại). **Phân biệt section bằng path endpoint**, không dùng số `type` khác nhau.

| Màn | Base path | `type` |
|-----|-----------|--------|
| **Hero** (màn này) | `/api/admin/hero/*` | **`1`** |
| Educational | `/api/admin/educational/*` | **`1`** |

### Cách truyền `type`

| HTTP Method | Cách truyền | Ví dụ Hero |
|-------------|-------------|------------|
| **GET** (list / aggregate) | Query param `?type=` | `GET /api/public/hero?type=1` |
| **GET** (singleton) | Query param `?type=` | `GET /api/admin/hero/section?type=1` |
| **POST / PUT / PATCH** | Field trong **body** | `{ "type": 1, ... }` |
| **Response** | Luôn trả `type` | `{ "type": 1, "greeting": "..." }` |

### Backend bắt buộc

1. Route theo module (`/api/admin/hero`, `/api/admin/educational`, …)
2. Mọi request/response kèm `type: 1`
3. POST/PUT **validate** `type` khớp schema hiện tại
4. Không mix data giữa các module dù cùng `type=1`

---

## Quy tắc chung

| Quy tắc | Mô tả |
|---------|-------|
| Section type | Hero **luôn** `type: 1` |
| Public hiển thị | Chỉ typing line / social link `isActive = true` |
| Thứ tự | Sort tăng dần theo `sortOrder` |
| Avatar / nút | Toggle `isActive` / `contactEnabled` / `cvEnabled` riêng |
| Contact Me | Click → `ScrollService.scrollToSection(contactScrollTarget)` |
| Download CV | Click → mở `cvUrl` tab mới |
| Response wrapper | `{ success: boolean, data: T, message?: string }` |

---

## Cấu trúc danh mục Admin

```
HERO SECTION (type = 1)
├── 0. Cấu hình Section       → HeroSectionConfig + HeroAvatarConfig
├── 1. Typing effect          → HeroTypingLine[]
├── 2. Social badges          → HeroSocialLink[]
└── 3. Nút hành động          → HeroButtonsConfig
```

---

## Bảng endpoint tổng hợp

Base path Hero: **`/api/admin/hero/*`** — luôn kèm **`?type=1`**.

| Entity | GET | PUT body `{ type: 1, ... }` | POST body | DELETE | PATCH status |
|--------|-----|----------------------------|-----------|--------|--------------|
| Section config | `GET /api/admin/hero/section?type=1` | `PUT /api/admin/hero/section` | — | — | — |
| Avatar | `GET /api/admin/hero/avatar?type=1` | `PUT /api/admin/hero/avatar` | — | — | — |
| Typing lines | `GET /api/admin/hero/typing?type=1` | `PUT /api/admin/hero/typing/:id` | `POST /api/admin/hero/typing` | `DELETE /api/admin/hero/typing/:id` | `PATCH /api/admin/hero/typing/:id/status` |
| Social badges | `GET /api/admin/hero/social?type=1` | `PUT /api/admin/hero/social/:id` | `POST /api/admin/hero/social` | `DELETE /api/admin/hero/social/:id` | `PATCH /api/admin/hero/social/:id/status` |
| Buttons | `GET /api/admin/hero/buttons?type=1` | `PUT /api/admin/hero/buttons` | — | — | — |
| **Public aggregate** | `GET /api/public/hero?type=1` | — | — | — | — |

Constant FE:
- `HERO_ADMIN`, `HERO_SECTION_*` — endpoint Hero
- `SECTION_API_TYPE` = `1`
- `sectionTypeQuery()` → `{ type: '1' }`

---

## 0. Cấu hình Section — `HeroSectionConfig` + `HeroAvatarConfig`

**Admin tab:** Cấu hình Section  
**Singleton per type** — mỗi `type` có 1 bản ghi section config.

### Field mapping — Section

| API field | Type | Required | Admin UI label | Public FE binding | CSS / vị trí Home |
|-----------|------|----------|----------------|-------------------|-------------------|
| **`type`** | **number** | **✅** | **Section type (readonly = 1)** | — | Backend filter key |
| `greeting` | string | ✅ | Lời chào | `section().greeting` | `.hero-greeting` |
| `nameText` | string | ✅ | Tên (phần thường) | `section().nameText` | `.name-text` |
| `nameAccent` | string | ✅ | Tên (Accent) | `section().nameAccent` | `.name-highlight` |
| `description` | string | ✅ | Mô tả | `section().description` | `.hero-description` |
| `typingPrefix` | string | ❌ | Prefix typing | `section().typingPrefix` | `.typing-prefix` |

**PUT `/api/admin/hero/section` body:**

```json
{
  "type": 1,
  "greeting": "Xin chào, tôi là",
  "nameText": "HOANG SY ",
  "nameAccent": "YEN",
  "description": "...",
  "typingPrefix": "| "
}
```

### Field mapping — Avatar

| API field | Type | Required | Admin UI | Public FE | Ghi chú |
|-----------|------|----------|----------|-----------|---------|
| **`type`** | **number** | **✅** | **1 (readonly)** | — | |
| `imageUrl` | string | ✅ | URL ảnh | `[src]` avatar | |
| `alt` | string | ✅ | Alt text | `[alt]` | |
| `fallbackInitials` | string | ✅ | Fallback initials | `.avatar-fallback span` | Max 4 ký tự |
| `isActive` | boolean | ✅ | Hiển thị avatar | Ẩn/hiện `.hero-avatar` | |

---

## 1. Typing effect — `HeroTypingLine`

**Admin tab:** Typing effect  
**Collection — filter `type = 1`**

### Field mapping

| API field | Type | Required | Admin UI | Public FE |
|-----------|------|----------|----------|-----------|
| `id` | string | ✅ | — | track |
| **`type`** | **number** | **✅** | **1 (auto)** | Backend filter |
| `text` | string | ✅ | Nội dung | Typing animation |
| `sortOrder` | number | ✅ | Thứ tự | Thứ tự luân phiên |
| `isActive` | boolean | ✅ | Active/Inactive | Lọc public |

**POST `/api/admin/hero/typing` body:**

```json
{
  "type": 1,
  "text": "Software Engineer",
  "sortOrder": 1
}
```

---

## 2. Social badges — `HeroSocialLink`

**Admin tab:** Social badges  
**Collection — filter `type = 1`**

### Field mapping

| API field | Type | Required | Admin UI | Public FE |
|-----------|------|----------|----------|-----------|
| `id` | string | ✅ | — | track |
| **`type`** | **number** | **✅** | **1 (auto)** | Backend filter |
| `name` | string | ✅ | Tên | `[alt]` icon |
| `icon` | string | ✅ | Icon URL | `[src]` img |
| `url` | string | ✅ | URL | `[href]` |
| `sortOrder` | number | ✅ | Thứ tự | Thứ tự animation |
| `isActive` | boolean | ✅ | Active/Inactive | Lọc public |

---

## 3. Nút hành động — `HeroButtonsConfig`

**Admin tab:** Nút hành động  
**Singleton per type**

### Field mapping — Contact Me

| API field | Type | Required | Admin UI | Public FE | Ghi chú |
|-----------|------|----------|----------|-----------|---------|
| **`type`** | **number** | **✅** | **1** | — | |
| `contactLabel` | string | ✅ | Nhãn nút | Button text | |
| `contactScrollTarget` | string | ✅ | Scroll target | `scrollToContact()` | Section id không có `#` |
| `contactVariant` | enum | ✅ | Variant | `[variant]` | |
| `contactBorderBeam` | enum | ✅ | Border beam | `[borderBeam]` | |
| `contactEnabled` | boolean | ✅ | Hiển thị nút | `@if` | |

### Field mapping — Download CV

| API field | Type | Required | Admin UI | Public FE | Ghi chú |
|-----------|------|----------|----------|-----------|---------|
| **`type`** | **number** | **✅** | **1** | — | |
| `cvLabel` | string | ✅ | Nhãn nút | Button text | |
| `cvUrl` | string | ✅ | URL file CV | `downloadCv()` | |
| `cvVariant` | enum | ✅ | Variant | `[variant]` | |
| `cvBorderBeam` | enum | ✅ | Border beam | `[borderBeam]` | |
| `cvEnabled` | boolean | ✅ | Hiển thị nút | `@if` | |

---

## Public aggregate response

**`GET /api/public/hero?type=1`**

```json
{
  "success": true,
  "data": {
    "type": 1,
    "section": {
      "type": 1,
      "greeting": "Xin chào, tôi là",
      "nameText": "HOANG SY ",
      "nameAccent": "YEN",
      "description": "...",
      "typingPrefix": "| "
    },
    "avatar": {
      "type": 1,
      "imageUrl": "/assets/images/avatar.jpg",
      "alt": "Hoang Sy Yen",
      "fallbackInitials": "YHS",
      "isActive": true
    },
    "buttons": {
      "type": 1,
      "contactLabel": "Contact Me",
      "contactScrollTarget": "contact",
      "contactVariant": "outline",
      "contactBorderBeam": "cw",
      "contactEnabled": true,
      "cvLabel": "Download CV",
      "cvUrl": "/assets/cv/hoang-sy-yen-cv.pdf",
      "cvVariant": "glow",
      "cvBorderBeam": "contour",
      "cvEnabled": true
    },
    "typingLines": [
      { "id": "1", "type": 1, "text": "Software Engineer", "sortOrder": 1, "isActive": true }
    ],
    "socialLinks": [
      { "id": "1", "type": 1, "name": "GitHub", "icon": "...", "url": "...", "sortOrder": 1, "isActive": true }
    ]
  }
}
```

Public FE:
1. Gọi `GET /api/public/hero?type=1`
2. Chỉ render item `isActive: true`, sort theo `sortOrder`

---

## Database gợi ý

Mọi bảng Hero thêm cột **`type INT NOT NULL DEFAULT 1`**:

| Bảng | Unique gợi ý |
|------|--------------|
| `section_configs` | `UNIQUE(type)` — 1 config / type |
| `section_avatars` | `UNIQUE(type)` |
| `section_buttons` | `UNIQUE(type)` |
| `section_typing_lines` | `(type, id)` PK |
| `section_social_links` | `(type, id)` PK |

Index: `CREATE INDEX idx_section_typing_type ON section_typing_lines(type);`

---

## Mapping modules (roadmap)

| Module | Anchor | Endpoint | `type` | Doc | Trạng thái |
|--------|--------|----------|--------|-----|------------|
| **Hero** | `#home` | `/api/admin/hero` | **1** | `doc/hero.md` | ✅ |
| Educational | `#career` | `/api/admin/educational` | **1** | `doc/educational.md` | ✅ |
| Career Journey | `#experience` | `/api/admin/experience` | **1** | `doc/experience.md` | ✅ |
| Skills | `#skills` | `/api/admin/skills` | **1** | `doc/skills.md` | ✅ |
| Projects | `#projects` | `/api/admin/projects` | **1** | `doc/projects.md` | ✅ |
| Contact | `#contact` | `/api/admin/contact` | **1** | `doc/contact.md` | ✅ |
| Footer | *(footer)* | `/api/admin/footer` | **1** | `doc/footer.md` | ✅ |

---

## Ghi chú triển khai FE (mock hiện tại)

- Store đọc/ghi `localStorage` key `portfolio_hero_section_data`
- Mọi entity trong store **luôn có `type: 1`**
- Admin hiển thị badge **Section type: 1 — Hero** (readonly)
- Khi Backend sẵn sàng:
  - Public: `GET SECTION_PUBLIC` + `sectionTypeQuery(1)`
  - Admin save: body kèm `"type": 1`
  - Thay `persist()` bằng HttpClient

---

## Checklist Backend Hero (type = 1)

- [ ] `GET /api/public/hero?type=1` — aggregate public
- [ ] `GET /api/admin/hero/section?type=1` — admin read config
- [ ] `PUT /api/admin/hero/section` — body `{ type: 1, ... }`
- [ ] CRUD typing/social — filter + validate `type = 1`
- [ ] Response luôn include field `type`
- [ ] Reject request nếu body `type` ≠ 1 trên Hero admin routes
