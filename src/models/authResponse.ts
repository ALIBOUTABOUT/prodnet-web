/**
 * Auth Response Model — aligned with mobile app's `auth_response.dart`
 *
 * README ref: "Authentication Flow Summary > Login Flow"
 * Backend returns: access_token (JWT), refresh_token, user info, role
 */

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
