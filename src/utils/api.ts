// ============================================
// API Configuration
// ============================================

/**
 * Backend API Base URL
 * Hardcoded FastAPI backend server URL
 */
export const API_BASE_URL = 'http://localhost:8000';

/**
 * Mock Data Toggle
 * Set to false when connecting to real backend
 */
export const USE_MOCK_DATA = false;

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
  isDevelopment: true,
  isProduction: false,
  apiUrl: API_BASE_URL,
};

/**
 * Helper to construct full API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}