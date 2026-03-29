/**
 * Investor Interest Model — aligned with mobile app's `investor_interest.dart`
 *
 * README ref: "Investor Features > Investor Dashboard"
 * Tracks which projects an investor has expressed interest in,
 * including their message and proposed investment amount.
 */

export interface InvestorInterest {
  id: string;
  projectId: string;
  investorId: string;
  message: string;
  proposedAmount: number;
  createdAt: string;
}
