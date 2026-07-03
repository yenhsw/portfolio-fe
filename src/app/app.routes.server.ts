import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public routes - Prerender
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },

  // Admin routes - Server-side rendering for dynamic content
  {
    path: 'admin/login',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/dashboard',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/profile',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/projects',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/blogs',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/messages',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/settings',
    renderMode: RenderMode.Server,
  },

  // Fallback - Server render
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
