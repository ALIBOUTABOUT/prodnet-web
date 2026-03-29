/**
 * Storage Service — aligned with mobile app's `storage_service.dart`
 *
 * README ref: "State Persistence"
 * - Authentication State: Stored in SharedPreferences → localStorage on web
 * - Premium Status: Stored locally per user ID
 * - SharedPreferences works on web (uses localStorage) — no changes needed
 *
 * README ref: "What Must Not Be Changed > SharedPreferences Keys"
 * Storage keys must remain consistent to avoid breaking existing user sessions.
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
  INVESTOR_PREMIUM_PREFIX: 'investor_premium_',
  PROFILE_COMPLETED: 'profile_completed',
} as const;

export const StorageService = {
  // ── Auth Token ──────────────────────────────────
  saveAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  saveRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // ── User Data ───────────────────────────────────
  saveUserData(userData: object): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },

  getUserData<T>(): T | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  saveUserRole(role: string): void {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },

  getUserRole(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  },

  // ── Profile Completion ──────────────────────────
  saveProfileCompleted(completed: boolean): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETED, JSON.stringify(completed));
  },

  getProfileCompleted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETED) === 'true';
  },

  // ── Investor Premium Status ─────────────────────
  /**
   * README ref: "Premium Simulation Feature > State Persistence"
   * Premium state is per user ID — switching accounts resets premium.
   */
  saveInvestorPremiumStatus(isPremium: boolean, userId: string): void {
    localStorage.setItem(`${STORAGE_KEYS.INVESTOR_PREMIUM_PREFIX}${userId}`, JSON.stringify(isPremium));
  },

  getInvestorPremiumStatus(userId: string): boolean {
    return localStorage.getItem(`${STORAGE_KEYS.INVESTOR_PREMIUM_PREFIX}${userId}`) === 'true';
  },

  // ── Clear All ───────────────────────────────────
  /**
   * README ref: "Token Management > Logout"
   * Clears local storage and resets provider state.
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);
    // Note: Premium status is intentionally NOT cleared on logout
    // to preserve per-user premium state across sessions.
  },
};
