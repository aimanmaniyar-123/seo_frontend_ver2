// ============================================
// API Configuration
// ============================================

/**
 * Backend API Base URL
 *
 * Preferred: set VITE_API_URL in your .env / Vercel env.
 * Fallback: hardcoded Render backend URL.
 */
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.trim() ||
  'https://seo-backend-ver2.onrender.com'; // ✅ no leading space

/**
 * Mock Data Toggle
 * Set VITE_USE_MOCK_DATA="true" to force mock data (for local dev).
 * In production, leave it unset or "false".
 */
export const USE_MOCK_DATA =
  ((import.meta as any).env?.VITE_USE_MOCK_DATA ?? 'false') === 'true';

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  // System Health
  health: '/health',

  // Agent Management
  agents: '/agents',
  agentExecute: '/agents/execute',

  // Phase Management
  phases: '/phases',
  phaseExecute: '/phases/execute',

  // Technical SEO Agents
  technicalSeo: '/technical-seo',

  // On-Page SEO Agents
  onPageSeo: '/on-page-seo',

  // Local SEO Agents
  localSeo: '/local-seo',

  // Off-Page SEO Agents
  offPageSeo: '/off-page-seo',

  // Logs & Monitoring
  logs: '/logs',
  dependencies: '/dependencies',

  // Orchestration
  orchestration: '/orchestration',
};

/**
 * API Configuration Options
 */
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Environment-specific configuration
 */
export const ENV = {
  isDevelopment: (import.meta as any).env?.DEV ?? true,
  isProduction: (import.meta as any).env?.PROD ?? false,
  apiUrl: API_BASE_URL,
};

/**
 * Helper to construct full API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
