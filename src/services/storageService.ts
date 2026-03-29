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

function withStorage<T>(action: (storage: Storage) => T, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    return action(window.localStorage);
  } catch {
    return fallback;
  }
}

export const StorageService = {
  // ── Auth Token ──────────────────────────────────
  saveAuthToken(token: string): void {
    withStorage((storage) => storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token), undefined);
  },

  getAuthToken(): string | null {
    return withStorage((storage) => storage.getItem(STORAGE_KEYS.AUTH_TOKEN), null);
  },

  saveRefreshToken(token: string): void {
    withStorage((storage) => storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token), undefined);
  },

  getRefreshToken(): string | null {
    return withStorage((storage) => storage.getItem(STORAGE_KEYS.REFRESH_TOKEN), null);
  },

  // ── User Data ───────────────────────────────────
  saveUserData(userData: object): void {
    withStorage((storage) => storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)), undefined);
  },

  getUserData<T>(): T | null {
    const raw = withStorage((storage) => storage.getItem(STORAGE_KEYS.USER_DATA), null);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  saveUserRole(role: string): void {
    withStorage((storage) => storage.setItem(STORAGE_KEYS.USER_ROLE, role), undefined);
  },

  getUserRole(): string | null {
    return withStorage((storage) => storage.getItem(STORAGE_KEYS.USER_ROLE), null);
  },

  // ── Profile Completion ──────────────────────────
  saveProfileCompleted(completed: boolean): void {
    withStorage(
      (storage) => storage.setItem(STORAGE_KEYS.PROFILE_COMPLETED, JSON.stringify(completed)),
      undefined,
    );
  },

  getProfileCompleted(): boolean {
    return withStorage((storage) => storage.getItem(STORAGE_KEYS.PROFILE_COMPLETED) === 'true', false);
  },

  // ── Investor Premium Status ─────────────────────
  /**
   * README ref: "Premium Simulation Feature > State Persistence"
   * Premium state is per user ID — switching accounts resets premium.
   */
  saveInvestorPremiumStatus(isPremium: boolean, userId: string): void {
    withStorage(
      (storage) =>
        storage.setItem(`${STORAGE_KEYS.INVESTOR_PREMIUM_PREFIX}${userId}`, JSON.stringify(isPremium)),
      undefined,
    );
  },

  getInvestorPremiumStatus(userId: string): boolean {
    return withStorage(
      (storage) => storage.getItem(`${STORAGE_KEYS.INVESTOR_PREMIUM_PREFIX}${userId}`) === 'true',
      false,
    );
  },

  // ── Clear All ───────────────────────────────────
  /**
   * README ref: "Token Management > Logout"
   * Clears local storage and resets provider state.
   */
  clearAll(): void {
    withStorage((storage) => {
      storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER_DATA);
      storage.removeItem(STORAGE_KEYS.USER_ROLE);
      storage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);
    }, undefined);
    // Note: Premium status is intentionally NOT cleared on logout
    // to preserve per-user premium state across sessions.
  },
};
