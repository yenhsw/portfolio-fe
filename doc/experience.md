# Section EXPERIENCE (Career Journey) — Tài liệu API & Field Mapping

Tài liệu chuẩn để **Backend implement API** và **Frontend map dữ liệu** cho section **CAREER JOURNEY** (kinh nghiệm làm việc) trên Home (`#experience`).

| Thuộc tính | Giá trị |
|------------|---------|
| Anchor trang | `#experience` |
| **Section type** | **`1`** |
| Public component | `ExperienceComponent` |
| Admin route | `/admin/career-journey` |
| Model | `src/app/features/admin/models/career-journey.model.ts` |
| Store (mock) | `src/app/features/admin/store/career-journey.store.ts` |
| Type constant | `section-type.constants.ts` → `SECTION_API_TYPE = 1` |
| API constants | `EXPERIENCE_*` (`/api/admin/experience/*?type=1`) |
| localStorage key (mock) | `portfolio_career_journey_data` |

> **Phân biệt section:** Hero `/api/admin/hero`, Educational `/api/admin/educational`, Experience `/api/admin/experience`. Cả ba đều `type: 1`.

**Lưu ý:** Khác section **EDUCATIONAL** (`#career`) — đây là timeline **công việc**, không phải học vấn.

---

## Quy tắc `type`

| Màn | Base path | `type` |
|-----|-----------|--------|
| Hero | `/api/admin/hero/*` | `1` |
| Educational | `/api/admin/educational/*` | `1` |
| **Experience (màn này)** | **`/api/admin/experience/*`** | **`1`** |

### Cách truyền `type`

| HTTP Method | Cách truyền | Ví dụ Experience |
|-------------|-------------|------------------|
| **GET** | Query `?type=1` | `GET /api/public/experience?type=1` |
| **POST / PUT / PATCH** | Body `{ "type": 1, ... }` | `POST /api/admin/experience/experiences` |
| **Response** | Luôn có `"type": 1` | |

FE **tự gắn `type: 1`** khi save — admin form không cần nhập thủ công.

---

## Quy tắc chung

| Quy tắc | Mô tả |
|---------|-------|
| Section type | Experience **luôn** `type: 1` |
| Public hiển thị | Chỉ `WorkExperience` có `isActive = true` |
| Thứ tự | Sort tăng dần theo `sortOrder` |
| Expand card | UI-only — `expandedId` không lưu DB |
| ID | string |
| Response wrapper | `{ success: boolean, data: T, message?: string }` |

---

## Cấu trúc Admin

```
EXPERIENCE (type = 1, path /api/admin/experience)
├── 0. Cấu hình Section     → CareerJourneySectionConfig
└── 1. Kinh nghiệm làm việc → WorkExperience[]
```

---

## Bảng endpoint

Base path Experience: **`/api/admin/experience/*`** — luôn kèm **`?type=1`**.

| Entity | GET | PUT body | POST body | DELETE | PATCH status |
|--------|-----|----------|-----------|--------|--------------|
| Section config | `GET /api/admin/experience/section?type=1` | `PUT /api/admin/experience/section` `{ type: 1, ... }` | — | — | — |
| Experiences | `GET /api/admin/experience/experiences?type=1` | `PUT /api/admin/experience/experiences/:id` | `POST /api/admin/experience/experiences` | `DELETE .../:id` | `PATCH .../:id/status` |
| **Public aggregate** | `GET /api/public/experience?type=1` | — | — | — | — |

Constants FE:
- `EXPERIENCE_ADMIN`, `EXPERIENCE_SECTION`, `EXPERIENCE_EXPERIENCES`, `EXPERIENCE_PUBLIC`
- `SECTION_API_TYPE` = `1`
- `sectionTypeQuery()` → `{ type: '1' }`

---

## 0. Cấu hình Section — `CareerJourneySectionConfig`

| API field | Type | Required | Admin UI | Public FE binding | CSS Home |
|-----------|------|----------|----------|-------------------|----------|
| **`type`** | **number** | **✅** | Section type (readonly = 1) | — | Schema version |
| `sectionTag` | string | ✅ | Section Tag | `section().sectionTag` | `.section-tag` |
| `titleAccent` | string | ✅ | Tiêu đề (Accent) | `section().titleAccent` | `.title-accent` |
| `titleText` | string | ✅ | Tiêu đề (Text) | `section().titleText` | `.title-text` |
| `subtitle` | string | ✅ | Mô tả Section | `section().subtitle` | `.section-subtitle` |

**PUT body:**

```json
{
  "type": 1,
  "sectionTag": "My Story",
  "titleAccent": "CAREER",
  "titleText": "JOURNEY",
  "subtitle": "My Professional Experience - Building impactful solutions..."
}
```

---

## 1. Kinh nghiệm làm việc — `WorkExperience`

### Field mapping chính

| API field | Type | Required | Admin UI | Admin table | Public FE | CSS Home |
|-----------|------|----------|----------|-------------|-----------|----------|
| `id` | string | ✅ | — | — | track | — |
| **`type`** | **number** | **✅** | auto | — | — | Schema version (= 1) |
| `position` | string | ✅ | Chức danh | CHỨC DANH | `exp.position` | `.card-position` |
| `positionIcon` | string | ✅ | Icon chức danh | ICON | `exp.positionIcon` | `.card-icon` |
| `company` | string | ✅ | Công ty | CÔNG TY | `exp.company` | `.company-name` |
| `period` | string | ✅ | Thời gian | THỜI GIAN | `exp.period` | `.period-badge span` |
| `location` | string | ✅ | Địa điểm | ĐỊA ĐIỂM | `exp.location` | `.company-location` |
| `description` | string | ✅ | Mô tả ngắn | — | `exp.description` | `.card-description` |
| `sortOrder` | number | ✅ | Thứ tự hiển thị | THỨ TỰ | sort server | thứ tự timeline |
| `isActive` | boolean | ✅ | Active toggle | TRẠNG THÁI | filter | ẩn nếu false |

### Nested: `technologies[]` — `WorkTechnology`

| API field | Type | Required | Admin | Public FE | CSS Home |
|-----------|------|----------|-------|-----------|----------|
| `name` | string | ✅ | Chip công nghệ | `tech.name` | `.tech-badge` |
| `icon` | string | ❌ | (auto từ tên) | không hiển thị HTML | — |

### Nested: `responsibilities[]` — `WorkResponsibility`

| API field | Type | Required | Admin | Public FE | CSS Home |
|-----------|------|----------|-------|-----------|----------|
| `text` | string | ✅ | Danh sách trách nhiệm | `resp.text` | `.checklist-item span` |
| `icon` | string | ❌ | default `✓` | không hiển thị | — |

**Hiển thị:** Chỉ khi user expand card → `.card-expanded` → block "Responsibilities".

### Nested: `projects[]` — `WorkProject`

| API field | Type | Required | Admin | Public FE | CSS Home |
|-----------|------|----------|-------|-----------|----------|
| `name` | string | ✅ | Tên dự án | `project.name` | `.project-chip` |
| `icon` | string | ❌ | Emoji icon | `project.icon` | `.project-chip span` |

### Nested: `achievements[]` — `WorkAchievement`

| API field | Type | Required | Admin | Public FE | CSS Home |
|-----------|------|----------|-------|-----------|----------|
| `value` | number | ✅ | Số (count-up) | animation | `.achievement-number` |
| `suffix` | string | ❌ | Hậu tố `+` | hiển thị ghép | `.achievement-suffix` |
| `label` | string | ✅ | Nhãn | `achievement.label` | `.achievement-label` |
| `icon` | string | ❌ | — | không hiển thị | — |

**Hiển thị:** Expand card → count-up animation khi mở lần đầu.

---

## POST / PUT body — `WorkExperience`

```json
{
  "type": 1,
  "position": "Software Engineer",
  "positionIcon": "💻",
  "company": "DTMED",
  "period": "2025 - Hiện tại",
  "location": "Ho Chi Minh City",
  "description": "Phát triển và bảo trì hệ thống thông tin bệnh viện...",
  "technologies": [
    { "name": "Angular", "icon": "A" },
    { "name": "Spring Boot", "icon": "SB" }
  ],
  "responsibilities": [
    { "text": "Phát triển RESTful API với Spring Boot", "icon": "API" }
  ],
  "projects": [
    { "name": "Hospital Information System", "icon": "🏥" }
  ],
  "achievements": [
    { "value": 50, "suffix": "+", "label": "REST APIs", "icon": "🔗" }
  ],
  "sortOrder": 1,
  "isActive": true
}
```

### PATCH status

**PATCH** `/api/admin/experience/experiences/:id/status`

```json
{ "isActive": false }
```

### Validation

| Field | Rule |
|-------|------|
| `type` | bắt buộc = `1` |
| `position` | 2–100 ký tự, required |
| `company` | 2–100 ký tự, required |
| `period` | 2–50 ký tự |
| `location` | max 100 ký tự |
| `description` | max 1000 ký tự |
| `technologies` | max 30 items |
| `responsibilities` | max 20 items, text max 300 ký tự |
| `projects` | max 15 items |
| `achievements` | max 10 items, `value` ≥ 0 |
| `sortOrder` | integer ≥ 1 |

---

## Public API — aggregate

**GET** `/api/public/experience?type=1`

```json
{
  "success": true,
  "data": {
    "type": 1,
    "section": {
      "type": 1,
      "sectionTag": "My Story",
      "titleAccent": "CAREER",
      "titleText": "JOURNEY",
      "subtitle": "My Professional Experience..."
    },
    "experiences": [
      {
        "id": "1",
        "type": 1,
        "position": "Software Engineer",
        "positionIcon": "💻",
        "company": "DTMED",
        "period": "2025 - Hiện tại",
        "location": "Ho Chi Minh City",
        "description": "...",
        "technologies": [{ "name": "Angular", "icon": "A" }],
        "responsibilities": [{ "text": "Phát triển RESTful API...", "icon": "API" }],
        "projects": [{ "name": "Hospital Information System", "icon": "🏥" }],
        "achievements": [{ "value": 50, "suffix": "+", "label": "REST APIs", "icon": "🔗" }],
        "sortOrder": 1
      }
    ]
  }
}
```

> Public: chỉ item `isActive = true`, sorted `sortOrder`, **không** trả `isActive`.

### Logic hiển thị Home

| Block | Điều kiện |
|-------|-----------|
| Cả `#experience` | `hasAnyContent()` |
| Section header | Có ít nhất 1 text field section |
| Timeline | `experiences.length > 0` (active) |
| Tech badges | `technologies.length > 0` |
| Expand blocks | Chỉ khi user click expand |

---

## Gợi ý schema DB

Bảng riêng theo module Experience. Field **`type INT NOT NULL DEFAULT 1`**.

### `experience_section_configs` (singleton)

| Column | Type |
|--------|------|
| type | INT DEFAULT 1 |
| section_tag | VARCHAR(100) |
| title_accent | VARCHAR(100) |
| title_text | VARCHAR(100) |
| subtitle | TEXT |

### `experience_work_items`

| Column | Type |
|--------|------|
| id | PK |
| type | INT DEFAULT 1 |
| position | VARCHAR(100) |
| position_icon | VARCHAR(20) |
| company | VARCHAR(100) |
| period | VARCHAR(50) |
| location | VARCHAR(100) |
| description | TEXT |
| technologies | JSON |
| responsibilities | JSON |
| projects | JSON |
| achievements | JSON |
| sort_order | INT |
| is_active | BOOLEAN |

---

## So sánh với EDUCATIONAL

| | EDUCATIONAL `#career` | EXPERIENCE `#experience` |
|--|----------------------|--------------------------|
| Nội dung | Học tập, chứng chỉ, mục tiêu | Kinh nghiệm làm việc |
| Admin | `/admin/educational` | `/admin/career-journey` |
| API | `/api/admin/educational` | `/api/admin/experience` |
| `type` | `1` | `1` |
| Entity chính | Timeline học tập | WorkExperience |
| Card expand | Không | Có (responsibilities, projects, achievements) |

---

## Mapping modules

| Module | Anchor | Endpoint | `type` | Doc |
|--------|--------|----------|--------|-----|
| Hero | `#home` | `/api/admin/hero` | `1` | `doc/hero.md` |
| Educational | `#career` | `/api/admin/educational` | `1` | `doc/educational.md` |
| **Experience** | **`#experience`** | **`/api/admin/experience`** | **`1`** | **`doc/experience.md`** |
| Skills | `#skills` | `/api/admin/skills` | `1` | `doc/skills.md` |

---

## Ghi chú triển khai FE

- Store mock: `portfolio_career_journey_data` — mọi entity có `type: 1`
- Admin badge: **Section type: 1 — Experience**
- Dialog Add/Edit: FE tự gắn `type: 1`, không hiển thị field
- Public: `GET EXPERIENCE_PUBLIC` + `?type=1`

---

## Trạng thái triển khai

### Admin FE — ✅
- [x] Model `career-journey.model.ts` + `type: 1`
- [x] Store localStorage + SSR-safe + auto inject type
- [x] Page `/admin/career-journey` (2 tabs)
- [x] CRUD + sortOrder + Active/Inactive
- [x] Confirm dialog + toast

### Public FE — ✅
- [x] `ExperienceComponent` đọc `CareerJourneyStore`
- [x] Ẩn section khi không có dữ liệu active

### Backend API — ⏳
- [ ] `GET /api/public/experience?type=1`
- [ ] `GET/PUT /api/admin/experience/section?type=1`
- [ ] CRUD `/api/admin/experience/experiences`
- [ ] `PATCH .../experiences/:id/status`
- [ ] Response luôn include `type: 1`
- [ ] Reject body `type !== 1`
