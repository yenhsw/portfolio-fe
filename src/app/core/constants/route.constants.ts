// ============================================================
// ROUTE ENUMS
// Application route constants
// ============================================================

export enum PublicRoute {
  HOME = '/',
}

export enum AdminRoute {
  LOGIN = '/admin/login',
  DASHBOARD = '/admin/dashboard',
  PROFILE = '/admin/profile',
  PROJECTS = '/admin/projects',
  PROJECT_DETAIL = '/admin/projects/:id',
  BLOG = '/admin/blog',
  BLOG_DETAIL = '/admin/blog/:id',
  MESSAGES = '/admin/messages',
  MESSAGE_DETAIL = '/admin/messages/:id',
  SETTINGS = '/admin/settings',
}

export enum RouteParam {
  ID = 'id',
  SLUG = 'slug',
}
