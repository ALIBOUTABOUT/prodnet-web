/**
 * API Constants — aligned with mobile app's `api_constants.dart`
 * 
 * README ref: "Backend Configuration"
 * - Base URL: https://testo-3ki7.onrender.com
 * - Authentication: JWT (access + refresh tokens)
 * - Request Timeout: 15 seconds
 * - Content Type: JSON (application/json)
 */

export const API_CONSTANTS = {
  BASE_URL: 'https://testo-3ki7.onrender.com',
  REQUEST_TIMEOUT: 5000, // 5 seconds — keeps mock fallback fast on cold starts
  // Allow demo auth to continue when backend is unreachable in hosted environments.
  ALLOW_AUTH_MOCK_FALLBACK_IN_PROD:
    (import.meta.env.VITE_ALLOW_AUTH_MOCK_FALLBACK_IN_PROD ?? 'true') === 'true',

  // README ref: "Key API Endpoints"
  ENDPOINTS: {
    LOGIN: '/api/auth/login/',
    REFRESH: '/api/auth/refresh/',
    REGISTER_FARMER: '/api/auth/register/farmer/',
    REGISTER_EXPERT: '/api/auth/register/expert/',
    REGISTER_INVESTOR: '/api/auth/register/investor/',
  },
} as const;
