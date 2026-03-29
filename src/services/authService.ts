/**
 * Auth Service — aligned with mobile app's `auth_service.dart`
 *
 * README ref: "API Communication Model"
 * All API requests follow the same pattern:
 *   1. Build URL with ApiConstants.BASE_URL + endpoint
 *   2. POST with JSON content type and auth headers
 *   3. Handle response or fallback to mock data
 *
 * README ref: "Fallback Strategy"
 * When backend is unavailable → catch exception → return mock data.
 *
 * NOTE: This is the web version — UI and state placeholders only.
 * Actual backend calls are attempted but fall back to mock on failure.
 */

import { API_CONSTANTS } from '@/core/api/apiConstants';
import { AuthResponse } from '@/models/authResponse';
import { UserRole } from '@/models/user';

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: string; message?: string };
    return data.detail || data.message || fallback;
  } catch {
    return fallback;
  }
}

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    error.name === 'TypeError' ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('load failed')
  );
}

function shouldUseMockFallback(error: unknown): boolean {
  return (
    isNetworkError(error) &&
    (!import.meta.env.PROD || API_CONSTANTS.ALLOW_AUTH_MOCK_FALLBACK_IN_PROD)
  );
}

export const AuthService = {
  /**
   * README ref: "Login Flow"
   * POST /api/auth/login/
   * Returns: access_token, refresh_token, user info
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(API_CONSTANTS.REQUEST_TIMEOUT),
      });

      if (response.ok) {
        return await response.json();
      }

      const message = await getErrorMessage(response, `Login failed: ${response.status}`);
      throw new Error(message);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        console.warn('Backend unavailable, using mock login:', error);
        // Fallback: return mock auth response for demo
        return {
          access_token: 'mock_jwt_token_' + Date.now(),
          refresh_token: 'mock_refresh_token_' + Date.now(),
          user: {
            id: 'user_' + Date.now(),
            email,
            role: '', // Role will be set during role selection or from stored data
          },
        };
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to sign in. Please try again.');
    }
  },

  /**
   * README ref: "Registration Flow"
   * POST /api/auth/register/{role}/
   * Each role has a separate registration endpoint.
   */
  async register(email: string, password: string, role: UserRole): Promise<AuthResponse> {
    const endpointMap: Record<UserRole, string> = {
      Farmer: API_CONSTANTS.ENDPOINTS.REGISTER_FARMER,
      Expert: API_CONSTANTS.ENDPOINTS.REGISTER_EXPERT,
      Investor: API_CONSTANTS.ENDPOINTS.REGISTER_INVESTOR,
    };

    try {
      const response = await fetch(`${API_CONSTANTS.BASE_URL}${endpointMap[role]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(API_CONSTANTS.REQUEST_TIMEOUT),
      });

      if (response.ok) {
        return await response.json();
      }

      const message = await getErrorMessage(response, `Registration failed: ${response.status}`);
      throw new Error(message);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        console.warn('Backend unavailable, using mock registration:', error);
        return {
          access_token: 'mock_jwt_token_' + Date.now(),
          refresh_token: 'mock_refresh_token_' + Date.now(),
          user: {
            id: 'user_' + Date.now(),
            email,
            role,
          },
        };
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to register. Please try again.');
    }
  },

  /**
   * README ref: "Token Management > Refresh"
   * POST /api/auth/refresh/
   * Not yet fully implemented in mobile — placeholder for web.
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string } | null> {
    try {
      const response = await fetch(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
        signal: AbortSignal.timeout(API_CONSTANTS.REQUEST_TIMEOUT),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  },
};
