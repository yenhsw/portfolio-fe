// ============================================================
// BLOG COMPONENT
// Tech Journal - Sharing Knowledge & Experience
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type BlogFilter = 'all' | 'angular' | 'spring' | 'java' | 'postgresql' | 'docker' | 'linux' | 'design';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  tags: string[];
  category: string;
  readTime: number;
  publishDate: string;
  author: string;
  isFeatured: boolean;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  // Signals
  isVisible = signal(false);
  activeFilter = signal<BlogFilter>('all');
  searchQuery = signal('');
  hoveredCard = signal<number | null>(null);
  isFeaturedHovered = signal(false);

  // Filter options
  readonly filters: { key: BlogFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'angular', label: 'Angular' },
    { key: 'spring', label: 'Spring Boot' },
    { key: 'java', label: 'Java' },
    { key: 'postgresql', label: 'PostgreSQL' },
    { key: 'docker', label: 'Docker' },
    { key: 'linux', label: 'Linux' },
    { key: 'design', label: 'System Design' },
  ];

  // Articles data
  readonly articles: Article[] = [
    {
      id: 1,
      title: 'Building Scalable REST APIs with Spring Boot',
      summary: 'A comprehensive guide to designing and implementing scalable RESTful APIs using Spring Boot framework.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/spring-boot.jpg',
      tags: ['Spring Boot', 'Java', 'REST API'],
      category: 'spring',
      readTime: 12,
      publishDate: 'Dec 15, 2024',
      author: 'Yen Hoang',
      isFeatured: true,
    },
    {
      id: 2,
      title: 'Angular Signals: The Complete Guide',
      summary: 'Learn how to use Angular Signals for reactive programming and better performance.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/angular.jpg',
      tags: ['Angular', 'TypeScript', 'Signals'],
      category: 'angular',
      readTime: 8,
      publishDate: 'Nov 28, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
    {
      id: 3,
      title: 'PostgreSQL Performance Optimization',
      summary: 'Tips and tricks for optimizing PostgreSQL queries and database performance.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/postgresql.jpg',
      tags: ['PostgreSQL', 'Database', 'Performance'],
      category: 'postgresql',
      readTime: 10,
      publishDate: 'Nov 10, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
    {
      id: 4,
      title: 'Docker Best Practices for Production',
      summary: 'Essential Docker practices for building secure and efficient containerized applications.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/docker.jpg',
      tags: ['Docker', 'DevOps', 'Container'],
      category: 'docker',
      readTime: 7,
      publishDate: 'Oct 22, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
    {
      id: 5,
      title: 'Linux Server Administration Basics',
      summary: 'A beginner-friendly guide to Linux server management and command line.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/linux.jpg',
      tags: ['Linux', 'Server', 'DevOps'],
      category: 'linux',
      readTime: 15,
      publishDate: 'Oct 5, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
    {
      id: 6,
      title: 'Microservices Architecture Patterns',
      summary: 'Understanding common microservices patterns: API Gateway, Service Mesh, CQRS, and more.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/architecture.jpg',
      tags: ['System Design', 'Microservices', 'Architecture'],
      category: 'design',
      readTime: 14,
      publishDate: 'Sep 18, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
    {
      id: 7,
      title: 'Java Concurrency Fundamentals',
      summary: 'Deep dive into Java concurrency: threads, executors, and modern async patterns.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/java.jpg',
      tags: ['Java', 'Concurrency', 'Threads'],
      category: 'java',
      readTime: 11,
      publishDate: 'Sep 2, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
    {
      id: 8,
      title: 'Building Real-time Applications with WebSockets',
      summary: 'Implement real-time features using WebSockets and Socket.io in web applications.',
      content: 'Full article content here...',
      thumbnail: '/assets/blog/websocket.jpg',
      tags: ['Angular', 'WebSocket', 'Real-time'],
      category: 'angular',
      readTime: 9,
      publishDate: 'Aug 15, 2024',
      author: 'Hung Nguyen',
      isFeatured: false,
    },
  ];

  // Computed
  featuredArticle = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (query) return null;
    return this.articles.find(a => a.isFeatured) || this.articles[0];
  });

  filteredArticles = computed(() => {
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase();
    const featured = this.featuredArticle();

    let result = this.articles.filter(a => !a.isFeatured);

    if (filter !== 'all') {
      result = result.filter(article =>
        article.category === filter ||
        article.tags.some(tag => tag.toLowerCase().includes(filter))
      );
    }

    if (query) {
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  });

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
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
        }
      });
    }, options);

    setTimeout(() => {
      const section = document.querySelector('.blog-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  setFilter(filter: BlogFilter): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  onCardHover(id: number): void {
    this.hoveredCard.set(id);
  }

  onCardLeave(): void {
    this.hoveredCard.set(null);
  }

  onFeaturedHover(isHovered: boolean): void {
    this.isFeaturedHovered.set(isHovered);
  }
}
