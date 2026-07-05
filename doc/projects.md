# Section FEATURED PROJECTS — Tài liệu API & Field Mapping

Tài liệu chuẩn để **Backend implement API** và **Frontend map dữ liệu** cho section **FEATURED PROJECTS** trên trang Home (`#projects`).

| Thuộc tính | Giá trị |
|------------|---------|
| Anchor trang | `#projects` |
| **Section type** | **`1`** |
| Public component | `ProjectsComponent` |
| Admin route | `/admin/featured-projects` |
| Model | `src/app/features/admin/models/featured-projects.model.ts` |
| Service | `src/app/features/admin/services/featured-projects.service.ts` |
| Store | `src/app/features/admin/store/featured-projects.store.ts` |
| Type constant | `section-type.constants.ts` → `SECTION_API_TYPE = 1` |
| API constants | `PROJECTS_*` (`/api/admin/projects/*?type=1`) |
| Backend doc | `portfolio-api/doc/projects.md` |

> **Phân biệt section:** Endpoint `/api/admin/projects`, luôn kèm `type: 1`.

> **Lưu ý:** Admin CMS đầy đủ (`/admin/projects`, `project.model.ts`) phục vụ quản lý portfolio chi tiết (SEO, gallery, team…). Module **Featured Projects** align trực tiếp với UI Home `#projects`.

---

## Quy tắc chung

| Quy tắc | Mô tả |
|---------|-------|
| Public hiển thị | Chỉ project `isActive = true` |
| Filter bar | Chỉ filter `isActive = true`, sort `sortOrder` |
| Thứ tự project | Sort tăng dần theo `sortOrder` |
| Filter logic | Key `all` → tất cả active projects; key khác → `technologies[].name` contains key (case insensitive) |
| ID | string — FE hiện dùng string |
| Response wrapper | `{ success: boolean, data: T, message?: string }` |

---

## Cấu trúc danh mục Admin

```
FEATURED PROJECTS
├── 0. Cấu hình Section       → FeaturedProjectsSectionConfig
├── 1. Bộ lọc                 → ProjectFilterItem[]
└── 2. Dự án                  → FeaturedProject[]
```

---

## Bảng endpoint tổng hợp

| Entity | GET list | GET one | POST | PUT | DELETE | PATCH status |
|--------|----------|---------|------|-----|--------|--------------|
| Section | `GET /api/featured-projects/section` | — | — | `PUT /api/featured-projects/section` | — | — |
| Filters | `GET /api/featured-projects/filters` | optional | `POST .../filters` | `PUT .../filters/:id` | `DELETE .../filters/:id` | `PATCH .../filters/:id/status` |
| Projects | `GET /api/featured-projects/projects` | optional | `POST .../projects` | `PUT .../projects/:id` | `DELETE .../projects/:id` | `PATCH .../projects/:id/status` |
| **Public aggregate** | `GET /api/public/featured-projects` | — | — | — | — | — |

Constant FE: `FEATURED_PROJECTS_SECTION`, `FEATURED_PROJECTS_FILTERS`, `FEATURED_PROJECTS_FILTER_BY_ID`, `FEATURED_PROJECTS_ITEMS`, `FEATURED_PROJECTS_ITEM_BY_ID`, `FEATURED_PROJECTS_PUBLIC`.

---

## 0. Cấu hình Section — `FeaturedProjectsSectionConfig`

**Admin tab:** Cấu hình Section  
**Singleton** — không có `id`.

### Field mapping

| API field | Type | Required | Admin UI label | Public FE binding | CSS / vị trí Home |
|-----------|------|----------|----------------|-------------------|-------------------|
| `sectionTag` | string | ✅ | Section Tag | `section().sectionTag` | `.section-tag` |
| `titleAccent` | string | ✅ | Tiêu đề (Accent) | `section().titleAccent` | `.section-title .title-accent` |
| `titleText` | string | ✅ | Tiêu đề (Text) | `section().titleText` | `.section-title .title-text` |
| `subtitle` | string | ✅ | Mô tả Section | `section().subtitle` | `.section-subtitle` |

### API

**GET** `/api/featured-projects/section`

**PUT** `/api/featured-projects/section`

```json
{
  "sectionTag": "My Work",
  "titleAccent": "FEATURED",
  "titleText": "PROJECTS",
  "subtitle": "Some projects I have worked on - Showcasing my skills and experience in building scalable applications."
}
```

---

## 1. Bộ lọc — `ProjectFilterItem`

**Admin tab:** Bộ lọc  
**Public:** Filter bar `.filter-bar` — button `.filter-btn`.

### Field mapping

| API field | Type | Required | Admin UI label | Public FE binding | Ghi chú |
|-----------|------|----------|----------------|-------------------|---------|
| `id` | string | ✅ | — | `filter.id` (track) | PK |
| `key` | string | ✅ | Key | `filter.key` | `all` = show all; không xóa được |
| `label` | string | ✅ | Label hiển thị | `filter.label` | Text trên button |
| `sortOrder` | number | ✅ | Thứ tự hiển thị | Thứ tự button | ≥ 1 |
| `isActive` | boolean | ✅ | Active/Inactive | Lọc public | — |

### Dữ liệu mẫu

| key | label | sortOrder |
|-----|-------|-----------|
| all | All | 1 |
| angular | Angular | 2 |
| spring | Spring Boot | 3 |
| java | Java | 4 |
| postgresql | PostgreSQL | 5 |
| dotnet | .NET | 6 |

### API CRUD

```
GET    /api/featured-projects/filters
POST   /api/featured-projects/filters
PUT    /api/featured-projects/filters/:id
DELETE /api/featured-projects/filters/:id
PATCH  /api/featured-projects/filters/:id/status   { "isActive": true }
```

---

## 2. Dự án — `FeaturedProject`

**Admin tab:** Dự án  
**Public:** Card `.project-card` trong `.projects-grid`.

### Field mapping — cơ bản

| API field | Type | Required | Admin UI label | Public FE binding | CSS / vị trí |
|-----------|------|----------|----------------|-------------------|--------------|
| `id` | string | ✅ | — | track, expand | — |
| `name` | string | ✅ | Tên dự án | `project.name` | `.card-title`, placeholder |
| `role` | string | ✅ | Vai trò | `project.role` | `.card-role` |
| `description` | string | ✅ | Mô tả ngắn | `project.description` | `.card-description` |
| `longDescription` | string | ❌ | Mô tả dài | — | **Chưa hiển thị HTML** |
| `status` | enum | ✅ | Status | `project.status` | `.status-badge.status-*` |
| `isFeatured` | boolean | ✅ | Featured checkbox | `project.isFeatured` | `.featured`, `.featured-badge` |
| `isActive` | boolean | ✅ | Active/Inactive | Lọc public | — |
| `image` | string | ❌ | Image URL | — | **Chưa load ảnh — dùng placeholder** |
| `demoUrl` | string? | ❌ | Demo URL | Live Demo link | `.image-actions` |
| `githubUrl` | string? | ❌ | GitHub URL | GitHub link | `.image-actions` |
| `startDate` | string | ✅ | Start date | timeline text | `.project-timeline` |
| `endDate` | string | ✅ | End date | timeline text | `.project-timeline` |
| `teamSize` | number | ✅ | Team size | expand meta | `.detail-meta` |
| `duration` | string | ✅ | Duration | expand meta | `.detail-meta` |
| `sortOrder` | number | ✅ | Thứ tự hiển thị | Thứ tự grid | ≥ 1 |

### Enum `FeaturedProjectStatus`

| Value | Label UI |
|-------|----------|
| `completed` | Completed |
| `in-progress` | In Progress |
| `private` | Private |
| `open-source` | Open Source |

### Nested: `technologies[]` — `ProjectTechnology`

| Field | Type | Required | Enum |
|-------|------|----------|------|
| `name` | string | ✅ | — |
| `category` | string | ✅ | `frontend` \| `backend` \| `database` \| `devops` |

→ CSS class `.tech-badge.tech-{category}` trên Home.

### Nested: `statistics[]` — `ProjectStatistic`

| Field | Type | Required | Ví dụ |
|-------|------|----------|-------|
| `label` | string | ✅ | `"Modules"` |
| `value` | string | ✅ | `"15+"` |
| `icon` | string | ❌ | `"📦"` |

→ Hiển thị `.stat-chip` trên card.

### Nested: string arrays

| Field | Public UI |
|-------|-----------|
| `responsibilities[]` | Expand — Responsibilities list |
| `features[]` | Expand — Key Features list |
| `achievements[]` | **Chưa hiển thị** — lưu sẵn cho tương lai |

### API CRUD

```
GET    /api/featured-projects/projects?active=true
POST   /api/featured-projects/projects
PUT    /api/featured-projects/projects/:id
DELETE /api/featured-projects/projects/:id
PATCH  /api/featured-projects/projects/:id/status   { "isActive": true }
PATCH  /api/featured-projects/projects/:id/featured { "isFeatured": true }
```

**POST body mẫu:**

```json
{
  "name": "Hospital Information System",
  "role": "Software Engineer",
  "description": "Comprehensive hospital management platform...",
  "longDescription": "A full-stack hospital management system...",
  "technologies": [
    { "name": "Angular", "category": "frontend" },
    { "name": "Spring Boot", "category": "backend" }
  ],
  "status": "completed",
  "isFeatured": true,
  "isActive": true,
  "image": "/assets/projects/hospital.jpg",
  "demoUrl": "https://hospital-demo.com",
  "githubUrl": "https://github.com/hungnv/hospital-system",
  "statistics": [
    { "label": "Modules", "value": "15+", "icon": "📦" }
  ],
  "startDate": "Jan 2025",
  "endDate": "Present",
  "responsibilities": ["Design and implement RESTful APIs"],
  "features": ["Patient management with history tracking"],
  "achievements": ["Reduced processing time by 40%"],
  "teamSize": 5,
  "duration": "6+ months",
  "sortOrder": 1
}
```

---

## 3. Public aggregate — `GET /api/public/featured-projects`

```json
{
  "success": true,
  "data": {
    "section": {
      "sectionTag": "My Work",
      "titleAccent": "FEATURED",
      "titleText": "PROJECTS",
      "subtitle": "Some projects I have worked on..."
    },
    "filters": [
      { "id": "all", "key": "all", "label": "All", "sortOrder": 1 }
    ],
    "projects": [
      {
        "id": "1",
        "name": "Hospital Information System",
        "role": "Software Engineer",
        "description": "...",
        "technologies": [{ "name": "Angular", "category": "frontend" }],
        "status": "completed",
        "isFeatured": true,
        "statistics": [{ "label": "Modules", "value": "15+", "icon": "📦" }],
        "startDate": "Jan 2025",
        "endDate": "Present",
        "responsibilities": ["..."],
        "features": ["..."],
        "teamSize": 5,
        "duration": "6+ months",
        "sortOrder": 1
      }
    ]
  }
}
```

**Lưu ý BE:** Chỉ trả `isActive = true`. Filters và projects đã sort theo `sortOrder`.

---

## 4. Validation rules

| Entity | Field | Rule |
|--------|-------|------|
| Section | texts | 1–500 ký tự (subtitle dài hơn) |
| Filter | `key` | lowercase, unique, không xóa `all` |
| Filter | `label` | 1–50 ký tự |
| Project | `name` | 3–120 ký tự |
| Project | `description` | 10–500 ký tự |
| Project | `status` | Enum hợp lệ |
| Project | `technologies` | Min 0, max 20 |
| Project | `level` / stats | `statistics[].value` max 20 ký tự |
| Project | URLs | URL hợp lệ hoặc empty |
| Project | `teamSize` | 1–100 |

---

## 5. UI-only fields (public)

| Field | Mô tả |
|-------|-------|
| `activeFilter` | Filter đang chọn (default `all`) |
| `expandedId`, `hoveredId` | UI state expand card |
| `filteredProjects` | computed từ store + filter key |
| `isVisible` | scroll animation |

---

## 6. Admin UI checklist

- [x] Tab Cấu hình Section
- [x] Tab Bộ lọc — CRUD + toggle Active (không xóa `all`)
- [x] Tab Dự án — CRUD đầy đủ nested lists
- [x] Toggle Featured trên bảng
- [x] Public `ProjectsComponent` wired qua `FeaturedProjectsStore`
- [x] Kết nối API thật (`FeaturedProjectsService` + `FeaturedProjectsStore`)
- [ ] Hiển thị `image` thay placeholder
- [ ] Hiển thị `achievements` trong expand
- [ ] Hiển thị `longDescription`

---

## 7. Khác biệt với Admin CMS (`/admin/projects`)

| Featured Projects (Home) | Projects CMS |
|--------------------------|--------------|
| `description` string | `shortDescription` + `fullDescription` HTML |
| `technologies[]` với category | `technologies: string[]` |
| `statistics`, `responsibilities`, `features` | Chưa có trong CMS form |
| Status: completed, in-progress, private, open-source | draft, published, archived… |
| Filter bar config riêng | Không có filter Home |
| Route `/admin/featured-projects` | Route `/admin/projects` |

Khi tích hợp API, **ưu tiên `featured-projects.model.ts`** làm source of truth cho section Home `#projects`.

---

## Ghi chú triển khai FE

- **`FeaturedProjectsService`** — gọi HTTP theo `portfolio-api/doc/projects.md`
- **`FeaturedProjectsStore.load()`** — Home `#projects`: `GET /api/public/projects?type=1`
- **`FeaturedProjectsStore.loadAdmin()`** — Admin: 3 GET song song (section + filters + projects), Bearer JWT
- Mọi entity **luôn có `type: 1`** — FE tự gắn qua `withSectionType()` / `sectionTypeQuery()`
- Filter/Project Add/Edit: **PUT/POST không gửi `isActive`** — đổi trạng thái qua `PATCH .../{id}/status`
- Toggle Featured trên bảng: `PATCH .../projects/{id}/featured`
- Không xóa filter có `key === 'all'` (backend + FE đều bảo vệ)
- API lỗi → fallback mock data (giữ UI chạy được)

---

## Checklist Backend Projects

- [x] `GET /api/public/projects?type=1`
- [x] `GET/PUT /api/admin/projects/section?type=1`
- [x] CRUD filters + PATCH status (protect `all`)
- [x] CRUD projects + PATCH status + PATCH featured
- [x] Response luôn include `type: 1`
- [x] Validate `type = 1`
- [x] FE wired (`FeaturedProjectsService` + `FeaturedProjectsStore`)
