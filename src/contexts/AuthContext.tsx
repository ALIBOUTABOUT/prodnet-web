/**
 * Auth Context — aligned with mobile app's `auth_provider.dart`
 *
 * README ref: "State Management Strategy > AuthProvider"
 * - Manages authentication state (token, user, role)
 * - Handles login/logout/signup operations
 * - Stores user profile data (farmer/expert/investor)
 * - Provides isAuthenticated, needsRoleSelection, hasCompletedProfile flags
 *
 * README ref: "Role-Based Navigation"
 * After successful login, users are redirected based on role:
 *   Farmer → farmer profile
 *   Expert → expert home
 *   Investor → investor dashboard
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/models/user';
import { AuthService } from '@/services/authService';
import { StorageService } from '@/services/storageService';

function normalizeUserRole(role: string | null | undefined): UserRole {
  const normalized = (role || '').trim().toLowerCase();

  switch (normalized) {
    case 'farmer':
      return 'Farmer';
    case 'expert':
      return 'Expert';
    case 'investor':
      return 'Investor';
    default:
      return 'Investor';
  }
}

// ── State Shape ───────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // README ref: "Registration Flow"
  // After email/password, user selects role → needsRoleSelection
  needsRoleSelection: boolean;

  // README ref: "Profile Completion"
  // Each role has mandatory profile completion step
  hasCompletedProfile: boolean;

  // Temp storage for signup flow
  pendingEmail?: string;
  pendingPassword?: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  needsRoleSelection: false,
  hasCompletedProfile: false,
};

// ── Actions ───────────────────────────────────────

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SIGNUP_PENDING_ROLE'; payload: { email: string; password: string } }
  | { type: 'ROLE_SELECTED'; payload: { user: User; token: string } }
  | { type: 'PROFILE_COMPLETED' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string; profileCompleted: boolean } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        needsRoleSelection: false,
        hasCompletedProfile: action.payload.user.hasCompletedProfile,
      };
    case 'SIGNUP_PENDING_ROLE':
      return {
        ...state,
        needsRoleSelection: true,
        pendingEmail: action.payload.email,
        pendingPassword: action.payload.password,
        isLoading: false,
        error: null,
      };
    case 'ROLE_SELECTED':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        needsRoleSelection: false,
        hasCompletedProfile: false,
        isLoading: false,
        error: null,
        pendingEmail: undefined,
        pendingPassword: undefined,
      };
    case 'PROFILE_COMPLETED':
      return {
        ...state,
        hasCompletedProfile: true,
        user: state.user ? { ...state.user, hasCompletedProfile: true } : null,
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        hasCompletedProfile: action.payload.profileCompleted,
        isLoading: false,
      };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => void;
  selectRole: (role: UserRole) => Promise<void>;
  completeProfile: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * README ref: "State Persistence"
   * App state rehydrated on startup via _initializeApp() in app.dart
   */
  useEffect(() => {
    const token = StorageService.getAuthToken();
    const userData = StorageService.getUserData<User>();
    const profileCompleted = StorageService.getProfileCompleted();

    if (token && userData) {
      const normalizedUser: User = {
        ...userData,
        role: normalizeUserRole(userData.role),
      };

      dispatch({
        type: 'RESTORE_SESSION',
        payload: { user: normalizedUser, token, profileCompleted },
      });

      StorageService.saveUserData(normalizedUser);
      StorageService.saveUserRole(normalizedUser.role);
    }
  }, []);

  /**
   * README ref: "Login Flow"
   * Email + Password → AuthService.login() → JWT Token → Local Storage → Role-based nav
   */
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await AuthService.login(email, password);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        role: normalizeUserRole(response.user.role),
        hasCompletedProfile: true, // For login, assume profile is already completed
      };

      StorageService.saveAuthToken(response.access_token);
      StorageService.saveRefreshToken(response.refresh_token);
      StorageService.saveUserData(user);
      StorageService.saveUserRole(user.role);
      StorageService.saveProfileCompleted(true);

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: response.access_token } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  }, []);

  /**
   * README ref: "Registration Flow"
   * Step 1: Email + Password Collection → Step 2: Role Selection Page
   */
  const signup = useCallback((email: string, password: string) => {
    dispatch({ type: 'SIGNUP_PENDING_ROLE', payload: { email, password } });
  }, []);

  /**
   * README ref: "Registration Flow"
   * Role chosen → Backend Registration API Call → JWT Token → Complete Profile Page
   */
  const selectRole = useCallback(
    async (role: UserRole) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const email = state.pendingEmail || '';
        const password = state.pendingPassword || '';
        const response = await AuthService.register(email, password, role);
        const user: User = {
          id: response.user.id,
          email: response.user.email || email,
          role,
          hasCompletedProfile: false,
        };

        StorageService.saveAuthToken(response.access_token);
        StorageService.saveRefreshToken(response.refresh_token);
        StorageService.saveUserData(user);
        StorageService.saveUserRole(role);
        StorageService.saveProfileCompleted(false);

        dispatch({ type: 'ROLE_SELECTED', payload: { user, token: response.access_token } });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    },
    [state.pendingEmail, state.pendingPassword],
  );

  /**
   * README ref: "Profile Completion"
   * After completing role-specific profile form.
   */
  const completeProfile = useCallback(() => {
    StorageService.saveProfileCompleted(true);
    if (state.user) {
      StorageService.saveUserData({ ...state.user, hasCompletedProfile: true });
    }
    dispatch({ type: 'PROFILE_COMPLETED' });
  }, [state.user]);

  /**
   * README ref: "Token Management > Logout"
   * Clears local storage and resets provider state.
   */
  const logout = useCallback(() => {
    StorageService.clearAll();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        selectRole,
        completeProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
