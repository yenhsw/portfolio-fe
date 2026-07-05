# Section EDUCATIONAL — Tài liệu API & Field Mapping

Tài liệu chuẩn để **Backend implement API** và **Frontend map dữ liệu** cho section **EDUCATIONAL** trên trang Home (`#career`).

| Thuộc tính | Giá trị |
|------------|---------|
| Anchor trang | `#career` |
| **Section type** | **`1`** |
| Public component | `CareerTimelineComponent` |
| Admin route | `/admin/educational` |
| Model | `src/app/features/admin/models/educational.model.ts` |
| Store | `src/app/features/admin/store/educational.store.ts` |
| Service | `src/app/features/admin/services/educational.service.ts` |
| Type constant | `section-type.constants.ts` → `SECTION_API_TYPE = 1` |
| API constants | `EDUCATIONAL_*` (`/api/admin/educational/*?type=1`) |
| Backend doc | `portfolio-api/doc/educational.md` |

> **Phân biệt section:** Hero dùng `/api/admin/hero`, Educational dùng `/api/admin/educational`. Cả hai đều `type: 1`.

---

## Quy tắc `type`

| Màn | Base path | `type` |
|-----|-----------|--------|
| Hero | `/api/admin/hero/*` | `1` |
| **Educational (màn này)** | **`/api/admin/educational/*`** | **`1`** |

### Cách truyền `type`

| HTTP Method | Cách truyền | Ví dụ Educational |
|-------------|-------------|------------------|
| **GET** | Query `?type=1` | `GET /api/public/educational?type=1` |
| **POST / PUT / PATCH** | Body `{ "type": 1, ... }` | `POST /api/admin/educational/highlights` |
| **Response** | Luôn có `"type": 1` | |

FE **tự gắn `type: 1`** khi save — admin form không cần nhập thủ công.

---

## Quy tắc chung

| Quy tắc | Mô tả |
|---------|-------|
| Section type | Educational **luôn** `type: 1` |
| Public hiển thị | Chỉ item `isActive = true` |
| Thứ tự | Sort tăng dần theo `sortOrder` |
| Response wrapper | `{ success: boolean, data: T, message?: string }` |

---

## Cấu trúc danh mục Admin

```
EDUCATIONAL (type = 1, path /api/admin/educational)
├── 0. Cấu hình Section       → EducationalSectionConfig
├── 1. Thống kê nổi bật        → EducationalHighlight[]
├── 2. Quá trình học tập       → EducationRecord[]
├── 3. Chứng chỉ               → EducationalCertificate[]
└── 4. Mục tiêu tương lai      → FutureGoal[]
```

---

## Bảng endpoint tổng hợp

Base path Educational: **`/api/admin/educational/*`** — luôn kèm **`?type=1`**.

| Entity | GET | PUT body | POST body | DELETE | PATCH status |
|--------|-----|----------|-----------|--------|--------------|
| Section config | `GET /api/admin/educational/section?type=1` | `PUT /api/admin/educational/section` `{ type: 1, ... }` | — | — | — |
| Highlights | `GET /api/admin/educational/highlights?type=1` | `PUT /api/admin/educational/highlights/:id` | `POST /api/admin/educational/highlights` | `DELETE .../:id` | `PATCH .../:id/status` |
| Timeline | `GET /api/admin/educational/timeline?type=1` | `PUT /api/admin/educational/timeline/:id` | `POST /api/admin/educational/timeline` | `DELETE .../:id` | `PATCH .../:id/status` |
| Certificates | `GET /api/admin/educational/certificates?type=1` | `PUT /api/admin/educational/certificates/:id` | `POST /api/admin/educational/certificates` | `DELETE .../:id` | `PATCH .../:id/status` |
| Future goals | `GET /api/admin/educational/future-goals?type=1` | `PUT /api/admin/educational/future-goals/:id` | `POST /api/admin/educational/future-goals` | `DELETE .../:id` | `PATCH .../:id/status` |
| **Public aggregate** | `GET /api/public/educational?type=1` | — | — | — | — |

Constants FE:
- `EDUCATIONAL_ADMIN`, `EDUCATIONAL_SECTION`, `EDUCATIONAL_HIGHLIGHTS`, …
- `SECTION_API_TYPE` = `1`
- `sectionTypeQuery()` → `{ type: '1' }`

---

## 0. Cấu hình Section — `EducationalSectionConfig`

**Singleton** — 1 record section config cho module Educational.

| API field | Type | Required | Public FE binding |
|-----------|------|----------|-------------------|
| **`type`** | **number** | **✅** | Schema version (= 1) |
| `sectionTag` | string | ✅ | `section().sectionTag` |
| `titleAccent` | string | ✅ | `section().titleAccent` |
| `titleText` | string | ✅ | `section().titleText` |
| `subtitle` | string | ✅ | `section().subtitle` |
| `certificatesDividerText` | string | ✅ | `section().certificatesDividerText` |
| `certificatesSubTitle` | string | ✅ | `section().certificatesSubTitle` |
| `futureGoalsDividerText` | string | ✅ | `section().futureGoalsDividerText` |
| `futureGoalsSubTitle` | string | ✅ | `section().futureGoalsSubTitle` |

**PUT body mẫu:**

```json
{
  "type": 1,
  "sectionTag": "My Path",
  "titleAccent": "EDUCATIONAL",
  "titleText": "BACKGROUND",
  "subtitle": "Learning, Working and Growing...",
  "certificatesDividerText": "Certifications & Achievements",
  "certificatesSubTitle": "Professional Certificates",
  "futureGoalsDividerText": "Future Goals",
  "futureGoalsSubTitle": "Future Goals"
}
```

---

## 1. Highlights — `EducationalHighlight`

| API field | Type | Required |
|-----------|------|----------|
| `id` | string | ✅ |
| **`type`** | **number** | **✅** (= 1) |
| `icon` | string | ✅ |
| `valueNumber` | number | ✅ |
| `valueSuffix` | string | ❌ |
| `label` | string | ✅ |
| `sortOrder` | number | ✅ |
| `isActive` | boolean | ✅ |

---

## 2. Timeline — `EducationRecord`

| API field | Type | Required |
|-----------|------|----------|
| `id` | string | ✅ |
| **`type`** | **number** | **✅** (= 1) |
| `icon` | string | ✅ |
| `institutionName` | string | ✅ |
| `courseName` | string | ✅ |
| `year` | string | ✅ |
| `description` | string | ✅ |
| `technologies` | string[] | ✅ |
| `sortOrder` | number | ✅ |
| `isActive` | boolean | ✅ |

---

## 3. Certificates — `EducationalCertificate`

| API field | Type | Required |
|-----------|------|----------|
| `id` | string | ✅ |
| **`type`** | **number** | **✅** (= 1) |
| `icon` | string | ✅ |
| `name` | string | ✅ |
| `provider` | string | ✅ |
| `year` | string | ✅ |
| `badge` | string | ✅ |
| `sortOrder` | number | ✅ |
| `isActive` | boolean | ✅ |

---

## 4. Future Goals — `FutureGoal`

| API field | Type | Required |
|-----------|------|----------|
| `id` | string | ✅ |
| **`type`** | **number** | **✅** (= 1) |
| `icon` | string | ✅ |
| `title` | string | ✅ |
| `description` | string | ✅ |
| `sortOrder` | number | ✅ |
| `isActive` | boolean | ✅ |

---

## Public aggregate response

**`GET /api/public/educational?type=1`**

```json
{
  "success": true,
  "data": {
    "type": 1,
    "section": { "type": 1, "sectionTag": "My Path", "titleAccent": "EDUCATIONAL", "titleText": "BACKGROUND", "subtitle": "...", "certificatesDividerText": "...", "certificatesSubTitle": "...", "futureGoalsDividerText": "...", "futureGoalsSubTitle": "..." },
    "highlights": [{ "id": "1", "type": 1, "icon": "🔗", "valueNumber": 100, "valueSuffix": "+", "label": "REST APIs Built", "sortOrder": 1, "isActive": true }],
    "timeline": [{ "id": "1", "type": 1, "icon": "🎓", "institutionName": "...", "courseName": "...", "year": "2021", "description": "...", "technologies": ["Java"], "sortOrder": 1, "isActive": true }],
    "certificates": [{ "id": "1", "type": 1, "icon": "🏆", "name": "Oracle Database", "provider": "Oracle", "year": "2024", "badge": "Associate", "sortOrder": 1, "isActive": true }],
    "futureGoals": [{ "id": "1", "type": 1, "icon": "☁️", "title": "Cloud Architecture", "description": "...", "sortOrder": 1, "isActive": true }]
  }
}
```

---

## Database gợi ý

Bảng riêng theo module (vd. `educational_section_configs`, `educational_highlights`, …). Field **`type INT NOT NULL DEFAULT 1`** cho schema versioning.

| Bảng | Ghi chú |
|------|---------|
| `educational_section_configs` | Singleton |
| `educational_highlights` | CRUD + `sort_order` |
| `educational_timeline` | CRUD + `sort_order` |
| `educational_certificates` | CRUD + `sort_order` |
| `educational_future_goals` | CRUD + `sort_order` |

---

## Mapping modules

| Module | Anchor | Endpoint | `type` | Doc |
|--------|--------|----------|--------|-----|
| Hero | `#home` | `/api/admin/hero` | `1` | `doc/hero.md` |
| **Educational** | **`#career`** | **`/api/admin/educational`** | **`1`** | **`doc/educational.md`** |
| Career Journey | `#experience` | `/api/admin/experience` | `1` | `doc/experience.md` |
| Skills | `#skills` | `/api/admin/skills` | `1` | `doc/skills.md` |

---

## Ghi chú triển khai FE

- **`EducationalService`** — gọi HTTP theo `portfolio-api/doc/educational.md`
- **`EducationalStore.load()`** — Home `#career`: `GET /api/public/educational?type=1`
- **`EducationalStore.loadAdmin()`** — Admin: 5 GET song song (section + 4 collections), Bearer JWT
- Mọi entity **luôn có `type: 1`** — FE tự gắn qua `withSectionType()` / `sectionTypeQuery()`
- Admin badge: **Section type: 1 — Educational**
- Dialog Add/Edit: **PUT/POST không gửi `isActive`** — đổi trạng thái qua `PATCH .../{id}/status`
- Timeline: backend yêu cầu `technologies` **không rỗng** (`@NotEmpty`)
- API lỗi → fallback mock data (giữ UI chạy được)

---

## Checklist Backend Educational

- [x] `GET /api/public/educational?type=1`
- [x] `GET/PUT /api/admin/educational/section?type=1`
- [x] CRUD highlights/timeline/certificates/future-goals trên `/api/admin/educational/*`
- [x] PATCH `.../{id}/status` cho từng collection
- [x] Response luôn include `type: 1`
- [x] Reject body `type !== 1`
- [x] FE wired (`EducationalService` + `EducationalStore`)
