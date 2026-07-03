// ============================================================
// APP ROUTES
// Application route configuration
// ============================================================

import { Routes } from '@angular/router';
import { authGuard } from './features/admin/guards/auth.guard';

export const routes: Routes = [
  // ============================================================
  // PUBLIC ROUTES
  // ============================================================
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  // ============================================================
  // ADMIN ROUTES
  // ============================================================
  {
    path: 'admin',
    children: [
      // Login (no guard)
      {
        path: 'login',
        loadComponent: () =>
          import('./features/admin/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      // Protected routes with layout
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/layouts/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent
          ),
        canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/admin/pages/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent
              ),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./features/admin/pages/profile/profile.component').then(
                (m) => m.ProfileComponent
              ),
          },
          {
            path: 'hero-section',
            loadComponent: () =>
              import('./features/admin/pages/hero-section/hero-section.component').then(
                (m) => m.HeroSectionComponent
              ),
          },
          {
            path: 'educational',
            loadComponent: () =>
              import('./features/admin/pages/educational/educational.component').then(
                (m) => m.EducationalComponent
              ),
          },
          {
            path: 'career-journey',
            loadComponent: () =>
              import('./features/admin/pages/career-journey/career-journey.component').then(
                (m) => m.CareerJourneyComponent
              ),
          },
          {
            path: 'tech-stack',
            loadComponent: () =>
              import('./features/admin/pages/tech-stack/tech-stack.component').then(
                (m) => m.TechStackComponent
              ),
          },
          {
            path: 'featured-projects',
            loadComponent: () =>
              import('./features/admin/pages/featured-projects/featured-projects.component').then(
                (m) => m.FeaturedProjectsComponent
              ),
          },
          {
            path: 'contact-section',
            loadComponent: () =>
              import('./features/admin/pages/contact-section/contact-section.component').then(
                (m) => m.ContactSectionComponent
              ),
          },
          {
            path: 'footer-section',
            loadComponent: () =>
              import('./features/admin/pages/footer-section/footer-section.component').then(
                (m) => m.FooterSectionComponent
              ),
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./features/admin/pages/projects/projects.component').then(
                (m) => m.ProjectsComponent
              ),
          },
          {
            path: 'blogs',
            loadComponent: () =>
              import('./features/admin/pages/blogs/blogs.component').then(
                (m) => m.BlogsComponent
              ),
          },
          {
            path: 'messages',
            loadComponent: () =>
              import('./features/admin/pages/messages/messages.component').then(
                (m) => m.MessagesComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/admin/pages/settings/settings.component').then(
                (m) => m.SettingsComponent
              ),
          },
        ],
      },
    ],
  },

  // ============================================================
  // FALLBACK ROUTES
  // ============================================================
  {
    path: '**',
    redirectTo: '',
  },
];
