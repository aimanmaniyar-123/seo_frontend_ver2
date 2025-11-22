import { API_BASE_URL } from '../utils/api';

// Local mock mode toggle (no conflict with imports)
export const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === 'true' ? true : false;

// ... your mock data function (if exists)
// function getMockData(...) { ... }

// API fetch wrapper with optional mock mode
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Explicit mock mode (local dev only)
  if (USE_MOCK_DATA) {
    console.info(`[apiFetch] MOCK mode enabled. Returning mock for ${endpoint}`);
    return getMockData(endpoint) as T;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `API error for ${endpoint}: ${response.status} ${response.statusText}${
          text ? ` - ${text.slice(0, 200)}` : ''
        }`,
      );
    }

    if (!contentType.includes('application/json')) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `Expected JSON but got "${contentType || 'unknown'}" for ${endpoint}. Body: ${text.slice(
          0,
          200,
        )}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[apiFetch] Request to ${url} failed`, error);
    throw error;
  }
}

