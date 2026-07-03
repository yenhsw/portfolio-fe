# Section SKILLS (Tech Stack) — Tài liệu API & Field Mapping

Tài liệu chuẩn để **Backend implement API** và **Frontend map dữ liệu** cho section **TECH STACK** trên trang Home (`#skills`).

| Thuộc tính | Giá trị |
|------------|---------|
| Anchor trang | `#skills` |
| **Section type** | **`1`** |
| Public component | `SkillsComponent` |
| Admin route | `/admin/tech-stack` |
| Model | `src/app/features/admin/models/tech-stack.model.ts` |
| Store (mock) | `src/app/features/admin/store/tech-stack.store.ts` |
| Type constant | `section-type.constants.ts` → `SECTION_API_TYPE = 1` |
| API constants | `SKILLS_*` (`/api/admin/skills/*?type=1`) |
| localStorage key (mock) | `portfolio_tech_stack_data` |

> **Phân biệt section:** Hero `/api/admin/hero`, Educational `/api/admin/educational`, Experience `/api/admin/experience`, Skills `/api/admin/skills`. Cả bốn đều `type: 1`.

---

## Quy tắc `type`

| Màn | Base path | `type` |
|-----|-----------|--------|
| Hero | `/api/admin/hero/*` | `1` |
| Educational | `/api/admin/educational/*` | `1` |
| Experience | `/api/admin/experience/*` | `1` |
| **Skills (màn này)** | **`/api/admin/skills/*`** | **`1`** |

### Cách truyền `type`

| HTTP Method | Cách truyền | Ví dụ Skills |
|-------------|-------------|--------------|
| **GET** | Query `?type=1` | `GET /api/public/skills?type=1` |
| **POST / PUT / PATCH** | Body `{ "type": 1, ... }` | `POST /api/admin/skills/statistics` |
| **Response** | Luôn có `"type": 1` | |

FE **tự gắn `type: 1`** khi save — admin form không cần nhập thủ công.

---

## Quy tắc chung

| Quy tắc | Mô tả |
|---------|-------|
| Section type | Skills **luôn** `type: 1` |
| Public hiển thị | Chỉ item `isActive = true` |
| Thứ tự | Sort tăng dần theo `sortOrder` (1 = hiển thị trước) |
| Admin CRUD | Có thể quản lý cả item inactive |
| ID | string |
| Response wrapper | `{ success: boolean, data: T, message?: string }` |
| Category xóa cascade | Xóa category → xóa luôn skills thuộc category đó |
| Category public | Chỉ hiển thị category có ít nhất 1 skill active |

---

## Cấu trúc danh mục Admin

```
SKILLS (type = 1, path /api/admin/skills)
├── 0. Cấu hình Section       → TechStackSectionConfig
├── 1. Thống kê               → TechStackStatistic[]
├── 2. Danh mục               → TechStackCategory[]
└── 3. Kỹ năng                → TechStackSkill[]
```

---

## Bảng endpoint tổng hợp

Base path Skills: **`/api/admin/skills/*`** — luôn kèm **`?type=1`**.

| Entity | GET | PUT body | POST body | DELETE | PATCH status |
|--------|-----|----------|-----------|--------|--------------|
| Section config | `GET /api/admin/skills/section?type=1` | `PUT /api/admin/skills/section` `{ type: 1, ... }` | — | — | — |
| Statistics | `GET /api/admin/skills/statistics?type=1` | `PUT /api/admin/skills/statistics/:id` | `POST /api/admin/skills/statistics` | `DELETE .../:id` | `PATCH .../:id/status` |
| Categories | `GET /api/admin/skills/categories?type=1` | `PUT /api/admin/skills/categories/:id` | `POST /api/admin/skills/categories` | `DELETE .../:id` | `PATCH .../:id/status` |
| Skills | `GET /api/admin/skills/skills?type=1` | `PUT /api/admin/skills/skills/:id` | `POST /api/admin/skills/skills` | `DELETE .../:id` | `PATCH .../:id/status` |
| **Public aggregate** | `GET /api/public/skills?type=1` | — | — | — | — |

Constants FE:
- `SKILLS_ADMIN`, `SKILLS_SECTION`, `SKILLS_STATISTICS`, `SKILLS_CATEGORIES`, `SKILLS_ITEMS`, `SKILLS_PUBLIC`
- `TECH_STACK_*` — alias deprecated (cùng path)
- `SECTION_API_TYPE` = `1`

---

## 0. Cấu hình Section — `TechStackSectionConfig`

**Singleton** — 1 record section config.

| API field | Type | Required | Admin UI | Public FE binding | CSS Home |
|-----------|------|----------|----------|-------------------|----------|
| **`type`** | **number** | **✅** | readonly = 1 | — | Schema version |
| `sectionTag` | string | ✅ | Section Tag | `section().sectionTag` | `.section-tag` |
| `titleAccent` | string | ✅ | Tiêu đề (Accent) | `section().titleAccent` | `.title-accent` |
| `titleText` | string | ✅ | Tiêu đề (Text) | `section().titleText` | `.title-text` |
| `subtitle` | string | ✅ | Mô tả Section | `section().subtitle` | `.section-subtitle` |

**PUT body:**

```json
{
  "type": 1,
  "sectionTag": "What I Know",
  "titleAccent": "TECH",
  "titleText": "STACK",
  "subtitle": "Technologies I Work With - Building modern, scalable applications with cutting-edge tools."
}
```

---

## 1. Thống kê — `TechStackStatistic`

| API field | Type | Required | Ghi chú |
|-----------|------|----------|---------|
| `id` | string | ✅ | PK |
| **`type`** | **number** | **✅** | = 1 |
| `valueNumber` | number | ✅ | Count-up animation |
| `valueSuffix` | string | ❌ | `+`, `%`, `K` |
| `label` | string | ✅ | `.stat-label` |
| `sortOrder` | number | ✅ | ≥ 1 |
| `isActive` | boolean | ✅ | Public filter |

**POST body:**

```json
{
  "type": 1,
  "valueNumber": 15,
  "valueSuffix": "+",
  "label": "Technologies",
  "sortOrder": 1,
  "isActive": true
}
```

---

## 2. Danh mục — `TechStackCategory`

| API field | Type | Required | Ghi chú |
|-----------|------|----------|---------|
| `id` | string | ✅ | PK, FK cho skills |
| **`type`** | **number** | **✅** | = 1 |
| `name` | string | ✅ | `.category-title` |
| `icon` | string | ❌ | Emoji |
| `color` | string (hex) | ✅ | `--category-color` |
| `sortOrder` | number | ✅ | ≥ 1 |
| `isActive` | boolean | ✅ | Public filter |

**POST body:**

```json
{
  "type": 1,
  "name": "Frontend",
  "icon": "🎨",
  "color": "#00f5ff",
  "sortOrder": 1,
  "isActive": true
}
```

---

## 3. Kỹ năng — `TechStackSkill`

| API field | Type | Required | Ghi chú |
|-----------|------|----------|---------|
| `id` | string | ✅ | PK |
| **`type`** | **number** | **✅** | = 1 |
| `categoryId` | string | ✅ | FK → category |
| `name` | string | ✅ | `.skill-name` |
| `logo` | string (URL) | ❌ | `<img class="skill-logo">` |
| `level` | number (0–100) | ✅ | Chưa render public UI |
| `sortOrder` | number | ✅ | ≥ 1 |
| `isActive` | boolean | ✅ | Public filter |

**POST body:**

```json
{
  "type": 1,
  "categoryId": "frontend",
  "name": "Angular",
  "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg",
  "level": 90,
  "sortOrder": 1,
  "isActive": true
}
```

---

## Public aggregate — `GET /api/public/skills?type=1`

```json
{
  "success": true,
  "data": {
    "type": 1,
    "section": {
      "type": 1,
      "sectionTag": "What I Know",
      "titleAccent": "TECH",
      "titleText": "STACK",
      "subtitle": "Technologies I Work With - ..."
    },
    "statistics": [
      { "id": "1", "type": 1, "valueNumber": 15, "valueSuffix": "+", "label": "Technologies", "sortOrder": 1 }
    ],
    "categories": [
      {
        "id": "frontend",
        "type": 1,
        "name": "Frontend",
        "icon": "🎨",
        "color": "#00f5ff",
        "sortOrder": 1,
        "skills": [
          {
            "id": "1",
            "type": 1,
            "name": "Angular",
            "logo": "https://cdn.jsdelivr.net/.../angular-original.svg",
            "level": 90,
            "sortOrder": 1
          }
        ]
      }
    ]
  }
}
```

> Public: chỉ item `isActive = true`, đã sort. Categories rỗng loại bỏ.

---

## Validation rules

| Entity | Field | Rule |
|--------|-------|------|
| All | `type` | bắt buộc = `1` |
| Section | `sectionTag`, `titleAccent`, `titleText` | 1–100 ký tự |
| Section | `subtitle` | 0–500 ký tự |
| Statistic | `valueNumber` | integer ≥ 0 |
| Category | `name` | 2–50 ký tự, unique trong section |
| Category | `color` | Hex `#RRGGBB` |
| Skill | `name` | 1–50 ký tự |
| Skill | `level` | 0–100 integer |
| Skill | `categoryId` | Phải tồn tại |

---

## Mapping modules

| Module | Anchor | Endpoint | `type` | Doc |
|--------|--------|----------|--------|-----|
| Hero | `#home` | `/api/admin/hero` | `1` | `doc/hero.md` |
| Educational | `#career` | `/api/admin/educational` | `1` | `doc/educational.md` |
| Experience | `#experience` | `/api/admin/experience` | `1` | `doc/experience.md` |
| **Skills** | **`#skills`** | **`/api/admin/skills`** | **`1`** | **`doc/skills.md`** |

---

## Ghi chú triển khai FE

- Store mock: `portfolio_tech_stack_data` — mọi entity có `type: 1`
- Admin badge: **Section type: 1 — Skills**
- Dialog Add/Edit: FE tự gắn `type: 1`
- Public: `SkillsComponent` ← `TechStackStore`

---

## Checklist Backend Skills

- [ ] `GET /api/public/skills?type=1`
- [ ] `GET/PUT /api/admin/skills/section?type=1`
- [ ] CRUD statistics/categories/skills trên `/api/admin/skills/*`
- [ ] Response luôn include `type: 1`
- [ ] Reject body `type !== 1`
- [ ] Cascade delete category → skills

---

## Khác biệt với module admin cũ (`pages/skills/`)

| Module cũ | Module mới (`tech-stack`) |
|-----------|---------------------------|
| `skill.model.ts` — icon key | `logo` URL trực tiếp |
| Không có statistics / section config | Đủ 4 entity + `type: 1` |
| Route riêng legacy | Route `/admin/tech-stack` |

Khi tích hợp API, **ưu tiên `tech-stack.model.ts`** làm source of truth cho Home `#skills`.
