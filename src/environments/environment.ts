// ============================================================
// ENVIRONMENT
// Environment configuration for different environments
// ============================================================

export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  apiTimeout: number;
  appName: string;
  appVersion: string;
  locale: string;
  supportedLocales: string[];
  sentryDsn?: string;
  googleAnalyticsId?: string;
}

export const environment: AppEnvironment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  apiTimeout: 30000,
  appName: 'Portfolio',
  appVersion: '1.0.0',
  locale: 'en',
  supportedLocales: ['en', 'vi'],
};

export const environmentProduction: AppEnvironment = {
  production: true,
  apiUrl: '/api',
  apiTimeout: 30000,
  appName: 'Portfolio',
  appVersion: '1.0.0',
  locale: 'en',
  supportedLocales: ['en', 'vi'],
};
