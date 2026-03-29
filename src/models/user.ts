/**
 * User Model — aligned with mobile app's `user.dart`
 *
 * README ref: "Role-Based System Design"
 * Three distinct roles: Farmer, Expert, Investor
 * Each role has separate registration endpoints and UI flows.
 */

export type UserRole = 'Farmer' | 'Expert' | 'Investor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  region?: string;
  bio?: string;
  profileImage?: string;

  // README ref: "Profile Completion"
  // Each role has a mandatory profile completion step
  hasCompletedProfile: boolean;
}

/**
 * Farmer-specific profile fields
 * README ref: "Farmer Features > Profile Data"
 */
export interface FarmerProfile extends User {
  role: 'Farmer';
  farmType?: string;
}

/**
 * Expert-specific profile fields
 * README ref: "Expert Features"
 */
export interface ExpertProfile extends User {
  role: 'Expert';
  specialization?: string;
  experience?: string;
  education?: string;
  certifications?: string[];
  linkedinUrl?: string;
}

/**
 * Investor-specific profile fields
 * README ref: "Investor Features"
 */
export interface InvestorProfile extends User {
  role: 'Investor';
  investmentFocus?: string;
  portfolioSize?: string;
}
