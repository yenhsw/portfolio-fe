// ============================================================
// DASHBOARD COMPONENT
// Admin Dashboard - Portfolio Overview
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  computed,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthStore } from '../../store/auth.store';

interface StatCard {
  icon: SafeHtml;
  title: string;
  value: number;
  growth: number;
  color: string;
}

interface QuickAction {
  icon: SafeHtml;
  title: string;
  description: string;
  route: string;
  color: string;
}

interface Project {
  id: number;
  title: string;
  status: string;
  technologies: string[];
  updatedAt: string;
}

interface Blog {
  id: number;
  title: string;
  tags: string[];
  createdAt: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
  isRead: boolean;
}

interface Activity {
  id: number;
  action: string;
  description: string;
  time: string;
  icon: SafeHtml;
}

interface SystemStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard" [class.visible]="isVisible()">
      <!-- Background Effects -->
      <div class="dashboard-bg">
        <div class="bg-grid"></div>
        <div class="bg-glow glow-1"></div>
        <div class="bg-glow glow-2"></div>
      </div>

      <!-- Welcome Section -->
      <div class="welcome-section" [class.visible]="isVisible()">
        <div class="welcome-content">
          <span class="greeting">{{ greeting() }}</span>
          <h1 class="welcome-title">{{ authStore.userName() }}</h1>
          <p class="welcome-date">{{ currentDate }}</p>
        </div>
        <div class="welcome-glow"></div>
      </div>

      <!-- Statistics Grid -->
      <div class="stats-grid">
        @for (stat of stats; track stat.title; let i = $index) {
          <div
            class="stat-card"
            [class.visible]="isVisible()"
            [style.--stat-color]="stat.color"
            [style.animation-delay]="(i * 0.1) + 's'"
          >
            <div class="stat-border-beam"></div>
            <div class="stat-glow"></div>
            <div class="stat-icon" [innerHTML]="stat.icon"></div>
            <div class="stat-content">
              <span class="stat-title">{{ stat.title }}</span>
              <span class="stat-value">{{ displayValues()[stat.title] || 0 }}</span>
              <div class="stat-growth" [class.positive]="stat.growth > 0" [class.negative]="stat.growth < 0">
                @if (stat.growth > 0) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                } @else if (stat.growth < 0) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                    <polyline points="17 18 23 18 23 12"/>
                  </svg>
                }
                <span>{{ stat.growth > 0 ? '+' : '' }}{{ stat.growth }}%</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="section" [class.visible]="isVisible()">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          @for (action of quickActions; track action.title; let i = $index) {
            <a
              [routerLink]="action.route"
              class="action-card"
              [style.--action-color]="action.color"
              [style.animation-delay]="(i * 0.05) + 's'"
            >
              <div class="action-border-beam"></div>
              <div class="action-icon" [innerHTML]="action.icon"></div>
              <div class="action-content">
                <span class="action-title">{{ action.title }}</span>
                <span class="action-desc">{{ action.description }}</span>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Visitor Analytics -->
        <div class="chart-card large" [class.visible]="isVisible()">
          <div class="chart-border-beam"></div>
          <div class="chart-header">
            <h3 class="chart-title">Visitor Analytics</h3>
            <span class="chart-subtitle">Monthly visitors</span>
          </div>
          <div class="visitor-chart">
            @for (bar of visitorData; track bar.month; let i = $index) {
              <div class="bar-wrapper">
                <div
                  class="bar"
                  [style.height.%]="(bar.value / maxVisitors()) * 100"
                  [style.animation-delay]="(i * 0.1) + 's'"
                >
                  <span class="bar-tooltip">{{ bar.value }}</span>
                </div>
                <span class="bar-label">{{ bar.month }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Technology Usage -->
        <div class="chart-card" [class.visible]="isVisible()">
          <div class="chart-border-beam"></div>
          <div class="chart-header">
            <h3 class="chart-title">Technology Stack</h3>
            <span class="chart-subtitle">Usage distribution</span>
          </div>
          <div class="tech-chart">
            @for (tech of techData; track tech.name; let i = $index) {
              <div class="tech-item" [style.animation-delay]="(i * 0.1) + 's'">
                <div class="tech-info">
                  <span class="tech-name">{{ tech.name }}</span>
                  <span class="tech-value">{{ tech.value }}%</span>
                </div>
                <div class="tech-bar">
                  <div
                    class="tech-progress"
                    [style.width.%]="tech.value"
                    [style.background]="tech.color"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Content Row -->
      <div class="content-row">
        <!-- Recent Projects -->
        <div class="content-card" [class.visible]="isVisible()">
          <div class="content-border-beam"></div>
          <div class="content-header">
            <h3 class="content-title">Recent Projects</h3>
            <a routerLink="/admin/projects" class="view-all">View All</a>
          </div>
          <div class="projects-list">
            @for (project of recentProjects; track project.id) {
              <div class="project-item">
                <div class="project-info">
                  <span class="project-title">{{ project.title }}</span>
                  <div class="project-tags">
                    @for (tech of project.technologies.slice(0, 2); track tech) {
                      <span class="tech-badge">{{ tech }}</span>
                    }
                  </div>
                </div>
                <span class="project-status" [class]="project.status.toLowerCase().replace(' ', '-')">{{ project.status }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Recent Blog Posts -->
        <div class="content-card" [class.visible]="isVisible()">
          <div class="content-border-beam"></div>
          <div class="content-header">
            <h3 class="content-title">Recent Blogs</h3>
            <a routerLink="/admin/blogs" class="view-all">View All</a>
          </div>
          <div class="blogs-list">
            @for (blog of recentBlogs; track blog.id) {
              <div class="blog-item">
                <div class="blog-info">
                  <span class="blog-title">{{ blog.title }}</span>
                  <div class="blog-tags">
                    @for (tag of blog.tags.slice(0, 2); track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </div>
                </div>
                <span class="blog-date">{{ blog.createdAt }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="bottom-row">
        <!-- Recent Messages -->
        <div class="content-card" [class.visible]="isVisible()">
          <div class="content-border-beam"></div>
          <div class="content-header">
            <h3 class="content-title">Recent Messages</h3>
            <a routerLink="/admin/messages" class="view-all">View All</a>
          </div>
          <div class="messages-list">
            @for (message of recentMessages; track message.id) {
              <div class="message-item" [class.unread]="!message.isRead">
                <div class="message-avatar">
                  {{ message.name.charAt(0) }}
                </div>
                <div class="message-info">
                  <div class="message-header">
                    <span class="message-name">{{ message.name }}</span>
                    @if (!message.isRead) {
                      <span class="unread-badge"></span>
                    }
                  </div>
                  <span class="message-subject">{{ message.subject }}</span>
                  <span class="message-email">{{ message.email }}</span>
                </div>
                <span class="message-date">{{ message.createdAt }}</span>
              </div>
            }
          </div>
        </div>

        <!-- System Status -->
        <div class="content-card" [class.visible]="isVisible()">
          <div class="content-border-beam"></div>
          <div class="content-header">
            <h3 class="content-title">System Status</h3>
            <span class="status-indicator online">All Systems Operational</span>
          </div>
          <div class="status-list">
            @for (system of systemStatus; track system.name) {
              <div class="status-item">
                <div class="status-info">
                  <span class="status-dot" [class]="system.status"></span>
                  <span class="status-name">{{ system.name }}</span>
                </div>
                <span class="status-uptime">{{ system.uptime }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="content-card" [class.visible]="isVisible()">
          <div class="content-border-beam"></div>
          <div class="content-header">
            <h3 class="content-title">Activity Timeline</h3>
          </div>
          <div class="activity-list">
            @for (activity of activities; track activity.id) {
              <div class="activity-item">
                <div class="activity-icon" [innerHTML]="activity.icon"></div>
                <div class="activity-content">
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-desc">{{ activity.description }}</span>
                </div>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  readonly authStore = inject(AuthStore);

  readonly isVisible = signal(false);
  readonly currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  readonly displayValues = signal<Record<string, number>>({});

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });

  readonly maxVisitors = computed(() => {
    return Math.max(...this.visitorData.map(v => v.value));
  });

  readonly stats: StatCard[] = [
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'), title: 'Projects', value: 12, growth: 15, color: '#8b5cf6' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'), title: 'Blogs', value: 8, growth: 25, color: '#ec4899' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'), title: 'Skills', value: 24, growth: 10, color: '#f59e0b' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'), title: 'Certificates', value: 5, growth: 0, color: '#10b981' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'), title: 'Messages', value: 47, growth: 8, color: '#3b82f6' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'), title: 'Visitors', value: 2847, growth: 32, color: '#06b6d4' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'), title: 'Views', value: 12847, growth: 45, color: '#f97316' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'), title: 'Downloads', value: 156, growth: 12, color: '#a855f7' },
  ];

  readonly quickActions: QuickAction[] = [
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'), title: 'Add Project', description: 'Create new project', route: '/admin/projects', color: '#8b5cf6' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'), title: 'Write Blog', description: 'Create new post', route: '/admin/blogs', color: '#ec4899' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'), title: 'Edit Profile', description: 'Update info', route: '/admin/profile', color: '#3b82f6' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'), title: 'Manage Skills', description: 'Add or edit', route: '/admin/settings', color: '#f59e0b' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'), title: 'View Messages', description: 'Check inbox', route: '/admin/messages', color: '#10b981' },
    { icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'), title: 'Settings', description: 'Configure app', route: '/admin/settings', color: '#64748b' },
  ];

  readonly visitorData = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1900 },
    { month: 'Mar', value: 1500 },
    { month: 'Apr', value: 2200 },
    { month: 'May', value: 2800 },
    { month: 'Jun', value: 2400 },
  ];

  readonly techData = [
    { name: 'Angular', value: 35, color: '#dd0031' },
    { name: 'Spring Boot', value: 25, color: '#6db33f' },
    { name: 'PostgreSQL', value: 15, color: '#336791' },
    { name: 'Docker', value: 15, color: '#2496ed' },
    { name: 'TypeScript', value: 10, color: '#3178c6' },
  ];

  readonly recentProjects: Project[] = [
    { id: 1, title: 'Portfolio Website', status: 'Completed', technologies: ['Angular', 'TypeScript'], updatedAt: '2 hours ago' },
    { id: 2, title: 'E-Commerce API', status: 'In Progress', technologies: ['Spring Boot', 'PostgreSQL'], updatedAt: '1 day ago' },
    { id: 3, title: 'Blog Platform', status: 'In Progress', technologies: ['Angular', 'Node.js'], updatedAt: '3 days ago' },
    { id: 4, title: 'Task Manager', status: 'Completed', technologies: ['React', 'Firebase'], updatedAt: '1 week ago' },
    { id: 5, title: 'Weather App', status: 'Completed', technologies: ['Vue.js', 'API'], updatedAt: '2 weeks ago' },
  ];

  readonly recentBlogs: Blog[] = [
    { id: 1, title: 'Building Scalable REST APIs with Spring Boot', tags: ['Spring Boot', 'Java'], createdAt: 'Dec 15, 2024' },
    { id: 2, title: 'Angular Signals: The Complete Guide', tags: ['Angular', 'TypeScript'], createdAt: 'Nov 28, 2024' },
    { id: 3, title: 'PostgreSQL Performance Optimization', tags: ['PostgreSQL', 'Database'], createdAt: 'Nov 10, 2024' },
    { id: 4, title: 'Docker Best Practices for Production', tags: ['Docker', 'DevOps'], createdAt: 'Oct 22, 2024' },
    { id: 5, title: 'Linux Server Administration Basics', tags: ['Linux', 'Server'], createdAt: 'Oct 5, 2024' },
  ];

  readonly recentMessages: Message[] = [
    { id: 1, name: 'John Smith', email: 'john@example.com', subject: 'Project Inquiry', createdAt: '2 hours ago', isRead: false },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', subject: 'Collaboration Opportunity', createdAt: '5 hours ago', isRead: false },
    { id: 3, name: 'Mike Brown', email: 'mike@example.com', subject: 'Freelance Project', createdAt: '1 day ago', isRead: true },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', subject: 'Technical Question', createdAt: '2 days ago', isRead: true },
    { id: 5, name: 'Alex Wilson', email: 'alex@example.com', subject: 'Job Opportunity', createdAt: '3 days ago', isRead: true },
  ];

  readonly systemStatus: SystemStatus[] = [
    { name: 'Frontend', status: 'online', uptime: '99.9%' },
    { name: 'Backend API', status: 'online', uptime: '99.8%' },
    { name: 'Database', status: 'online', uptime: '99.9%' },
    { name: 'Storage', status: 'online', uptime: '100%' },
    { name: 'CDN', status: 'online', uptime: '99.9%' },
  ];

  readonly activities: Activity[] = [
    { id: 1, action: 'Login', description: 'Admin logged in', time: '2 hours ago', icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>') },
    { id: 2, action: 'Updated', description: 'Portfolio project', time: '3 hours ago', icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>') },
    { id: 3, action: 'Published', description: 'New blog post', time: '1 day ago', icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>') },
    { id: 4, action: 'Message', description: 'Reply to inquiry', time: '2 days ago', icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>') },
    { id: 5, action: 'Updated', description: 'Profile information', time: '3 days ago', icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>') },
  ];

  private observer: IntersectionObserver | null = null;
  private animationFrame: ReturnType<typeof requestAnimationFrame> | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isVisible()) {
          this.isVisible.set(true);
          this.startCounters();
        }
      });
    }, options);

    setTimeout(() => {
      const section = document.querySelector('.dashboard');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  private startCounters(): void {
    const duration = 2000;
    const startTime = performance.now();
    const targets: Record<string, number> = {};

    this.stats.forEach(stat => {
      targets[stat.title] = stat.value;
    });

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const values: Record<string, number> = {};
      this.stats.forEach(stat => {
        values[stat.title] = Math.round(targets[stat.title] * eased);
      });
      this.displayValues.set(values);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
