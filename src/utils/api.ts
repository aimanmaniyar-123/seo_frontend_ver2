// ============================================
// API Configuration
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock Data Toggle
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// API Endpoints
export const API_ENDPOINTS = {
  health: '/health',
  agents: '/agents',
  agentExecute: '/agents/execute',
  phases: '/phases',
  phaseExecute: '/phases/execute',
  technicalSeo: '/technical_seo',
  onPageSeo: '/onpage_seo',
  localSeo: '/local_seo',
  offPageSeo: '/offpage_seo',
  logs: '/logs',
  dependencies: '/dependencies',
  orchestration: '/orchestration',
};

// Timeout & retries
export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
