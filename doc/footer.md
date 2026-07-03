# Section FOOTER — Tài liệu API & Field Mapping

Tài liệu chuẩn để **Backend implement API** và **Frontend map dữ liệu** cho **Footer** trên trang Home (cuối trang, sau tất cả section).

| Thuộc tính | Giá trị |
|------------|---------|
| Vị trí | Cuối trang Home (không có anchor riêng) |
| **Section type** | **`1`** |
| Public component | `FooterComponent` |
| Admin route | `/admin/footer-section` |
| Model | `src/app/features/admin/models/footer-section.model.ts` |
| Store (mock) | `src/app/features/admin/store/footer-section.store.ts` |
| Type constant | `section-type.constants.ts` → `SECTION_API_TYPE = 1` |
| API constants | `FOOTER_*` (`/api/admin/footer/*?type=1`) |
| localStorage key (mock) | `portfolio_footer_section_data` |

> **Phân biệt section:** Endpoint `/api/admin/footer`, luôn kèm `type: 1`.

> **Lưu ý:** Footer **khác** Contact Section (`#contact`). Footer contact column chỉ hiển thị thông tin tóm tắt (email, phone, địa chỉ). Settings → Footer copyright là metadata site-wide; footer section này quản lý **nội dung UI footer** trên Home.

---

## Quy tắc chung

| Quy tắc | Mô tả |
|---------|-------|
| Public hiển thị | Chỉ item `isActive = true` (quick links, services, contact, social, tech badges) |
| Thứ tự | Sort tăng dần theo `sortOrder` |
| Copyright | Chuỗi `copyrightTemplate` hỗ trợ placeholder `{year}` → FE thay bằng năm hiện tại |
| Social icon | Lưu SVG string; FE sanitize qua `DomSanitizer` |
| Quick link href | Thường là anchor `#home`, `#skills`, … hoặc URL ngoài |
| Response wrapper | `{ success: boolean, data: T, message?: string }` |

---

## Cấu trúc danh mục Admin

```
FOOTER
├── 1. Brand & layout     → FooterBrandConfig + FooterColumnTitles + FooterDividerConfig + FooterTechConfig + FooterBottomConfig
├── 2. Quick Links          → FooterLinkItem[]
├── 3. Services             → FooterServiceItem[]
├── 4. Contact              → FooterContactItem[]
├── 5. Social               → FooterSocialItem[] (dưới brand)
└── 6. Tech stack           → FooterTechBadge[]
```

---

## Bảng endpoint tổng hợp

| Entity | GET | PUT | POST | DELETE | PATCH status |
|--------|-----|-----|------|--------|--------------|
| Brand panel (singleton) | `GET /api/footer-section/brand` | `PUT .../brand` | — | — | — |
| Quick links | `GET .../quick-links` | `PUT .../quick-links/:id` | `POST .../quick-links` | `DELETE .../quick-links/:id` | `PATCH .../quick-links/:id/status` |
| Services | `GET .../services` | `PUT .../services/:id` | `POST .../services` | `DELETE .../services/:id` | `PATCH .../services/:id/status` |
| Contact items | `GET .../contact` | `PUT .../contact/:id` | `POST .../contact` | `DELETE .../contact/:id` | `PATCH .../contact/:id/status` |
| Social links | `GET .../social` | `PUT .../social/:id` | `POST .../social` | `DELETE .../social/:id` | `PATCH .../social/:id/status` |
| Tech badges | `GET .../tech-badges` | `PUT .../tech-badges/:id` | `POST .../tech-badges` | `DELETE .../tech-badges/:id` | `PATCH .../tech-badges/:id/status` |
| **Public aggregate** | `GET /api/public/footer-section` | — | — | — | — |

Constant FE: `FOOTER_SECTION_BRAND`, `FOOTER_SECTION_QUICK_LINKS`, `FOOTER_SECTION_SERVICES`, `FOOTER_SECTION_CONTACT`, `FOOTER_SECTION_SOCIAL`, `FOOTER_SECTION_TECH`, `FOOTER_SECTION_PUBLIC`.

---

## 1. Brand & layout (singleton)

**Admin tab:** Brand & layout  
Gộp 5 nhóm config trong một PUT.

### FooterBrandConfig

| API field | Type | Required | Admin UI | Public binding | CSS Home |
|-----------|------|----------|----------|----------------|----------|
| `logoIcon` | string | ✅ | Logo icon | `brand().logoIcon` | `.logo-icon` |
| `logoText` | string | ✅ | Logo text | `brand().logoText` | `.logo-text` |
| `logoAccent` | string | ✅ | Logo accent | `brand().logoAccent` | `.logo-accent` |
| `description` | string | ✅ | Brand description | `brand().description` | `.brand-description` |

### FooterColumnTitles

| API field | Type | Public binding | CSS |
|-----------|------|----------------|-----|
| `quickLinksTitle` | string | `columnTitles().quickLinksTitle` | `.footer-links .links-title` (cột 1) |
| `servicesTitle` | string | `columnTitles().servicesTitle` | cột Services |
| `contactTitle` | string | `columnTitles().contactTitle` | `.footer-contact .links-title` |

### FooterDividerConfig

| API field | Type | Public binding | Ghi chú |
|-----------|------|----------------|---------|
| `icon` | string | `divider().icon` | Emoji hoặc ký tự, ví dụ `⚡` |
| `isActive` | boolean | `@if (divider().isActive)` | Ẩn cả khối divider khi false |

### FooterTechConfig

| API field | Type | Public binding | CSS |
|-----------|------|----------------|-----|
| `label` | string | `tech().label` | `.tech-label` ("Built with:") |

### FooterBottomConfig

| API field | Type | Public binding | Ghi chú |
|-----------|------|----------------|---------|
| `copyrightTemplate` | string | `copyrightText()` computed | Thay `{year}` → năm hiện tại |
| `madeWithText` | string | `bottom().madeWithText` | `.made-with` |
| `showBackToTop` | boolean | `@if (bottom().showBackToTop)` | Nút ↑ góc phải |
| `backToTopThreshold` | number | Scroll listener | Hiện nút khi `scrollY > threshold` (px) |

---

## 2. Quick Links — `FooterLinkItem[]`

| API field | Type | Required | Public |
|-----------|------|----------|--------|
| `id` | string | ✅ | track key |
| `label` | string | ✅ | Text link |
| `href` | string | ✅ | `#home`, `#contact`, … |
| `sortOrder` | number | ✅ | Thứ tự |
| `isActive` | boolean | ✅ | Chỉ Active hiển thị |

**Ví dụ mock:** Home → `#home`, Skills → `#skills`, Experience → `#experience`, Projects → `#projects`, Contact → `#contact`.

---

## 3. Services — `FooterServiceItem[]`

| API field | Type | Required | Public |
|-----------|------|----------|--------|
| `id` | string | ✅ | |
| `label` | string | ✅ | Tên dịch vụ |
| `href` | string | | Link (mặc định `#`) |
| `sortOrder` | number | ✅ | |
| `isActive` | boolean | ✅ | |

---

## 4. Contact items — `FooterContactItem[]`

| API field | Type | Required | Public |
|-----------|------|----------|--------|
| `id` | string | ✅ | |
| `icon` | string | ✅ | Emoji 📧 📱 📍 |
| `text` | string | ✅ | Nội dung hiển thị |
| `link` | string | | `mailto:`, `tel:`, hoặc rỗng |
| `sortOrder` | number | ✅ | |
| `isActive` | boolean | ✅ | |

---

## 5. Social links — `FooterSocialItem[]`

Hiển thị **dưới brand description** (khác social trong Contact section).

| API field | Type | Required | Public |
|-----------|------|----------|--------|
| `id` | string | ✅ | |
| `name` | string | ✅ | `aria-label` |
| `url` | string | ✅ | GitHub, LinkedIn, mailto, … |
| `iconSvg` | string | ✅ | SVG inline |
| `sortOrder` | number | ✅ | |
| `isActive` | boolean | ✅ | |

---

## 6. Tech badges — `FooterTechBadge[]`

| API field | Type | Required | Public |
|-----------|------|----------|--------|
| `id` | string | ✅ | |
| `label` | string | ✅ | Angular, Java, … |
| `sortOrder` | number | ✅ | |
| `isActive` | boolean | ✅ | |

---

## Public aggregate — `GET /api/public/footer-section`

Response gợi ý:

```json
{
  "success": true,
  "data": {
    "brand": { "logoIcon": "Y", "logoText": "YHS", "logoAccent": ".DEV", "description": "..." },
    "columnTitles": { "quickLinksTitle": "Quick Links", "servicesTitle": "Services", "contactTitle": "Contact" },
    "divider": { "icon": "⚡", "isActive": true },
    "tech": { "label": "Built with:" },
    "bottom": {
      "copyrightTemplate": "© {year} YHS.DEV. All rights reserved.",
      "madeWithText": "Made with ❤️ and Angular",
      "showBackToTop": true,
      "backToTopThreshold": 500
    },
    "quickLinks": [ { "id": "1", "label": "Home", "href": "#home", "sortOrder": 1, "isActive": true } ],
    "services": [],
    "contactItems": [],
    "socialLinks": [],
    "techBadges": []
  }
}
```

FE hiện tại: `FooterSectionStore.load()` đọc mock từ `localStorage` key `portfolio_footer_section_data`. Khi có API, thay `load()` bằng `HttpClient.get(FOOTER_SECTION_PUBLIC)`.

---

## Mapping component → Store

| UI Footer (Home) | Store signal / computed |
|------------------|-------------------------|
| Logo + mô tả | `brand()` |
| Social icons (brand) | `activeSocialLinks()` |
| Quick Links column | `activeQuickLinks()` + `columnTitles().quickLinksTitle` |
| Services column | `activeServices()` + `columnTitles().servicesTitle` |
| Contact column | `activeContactItems()` + `columnTitles().contactTitle` |
| Divider | `divider()` |
| Tech badges | `activeTechBadges()` + `tech().label` |
| Copyright | `bottom().copyrightTemplate` + `{year}` |
| Made with | `bottom().madeWithText` |
| Back to top | `bottom().showBackToTop`, `bottom().backToTopThreshold` |

---

## Checklist Backend

- [ ] CRUD + PATCH status cho 5 loại list entity
- [ ] PUT singleton brand panel (5 object lồng nhau hoặc tách endpoint — FE mock gộp một lần)
- [ ] Public aggregate chỉ trả item `isActive: true`, đã sort
- [ ] Validate `href` / `url` (optional XSS sanitize phía server cho SVG social)
- [ ] `{year}` trong copyright do FE xử lý — BE lưu nguyên template string

---

## Checklist Frontend (đã làm)

- [x] Model + mock defaults khớp UI cũ
- [x] Store localStorage
- [x] Admin `/admin/footer-section` — 6 tabs
- [x] `FooterComponent` đọc store
- [x] Sidebar menu **Footer**
- [x] API constants + i18n admin labels
