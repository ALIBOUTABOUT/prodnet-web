/**
 * Expert Idea Model — aligned with mobile app's `expert_idea.dart`
 *
 * README ref: "Expert Features > Idea Lifecycle"
 * Status progression: draft → published → readyForPilot → pilotActive
 *
 * README ref: "Expert Features > Creating and Editing Ideas"
 * Fields: title, problemStatement, proposedSolution, category,
 * targetRegion, budgetRange, images
 */

// ── Enumerations ──────────────────────────────────

/** README ref: "Expert Features > Idea Lifecycle" */
export type IdeaStatus = 'draft' | 'published' | 'readyForPilot' | 'pilotActive' | 'completed' | 'archived';

export type PilotProjectStatus = 'open' | 'active' | 'completed';

export type CollaborationStatus = 'pending' | 'active' | 'completed';

/**
 * README ref: "Expert Features > Creating and Editing Ideas > Category"
 * Shared category list across all content types.
 */
export type ExpertCategory =
  | 'Crop Farming'
  | 'Livestock'
  | 'Irrigation'
  | 'Organic Farming'
  | 'Aquaculture'
  | 'Poultry'
  | 'Dairy'
  | 'Horticulture'
  | 'Agro-processing'
  | 'Sustainable Agriculture'
  | 'Other';

export const EXPERT_CATEGORIES: ExpertCategory[] = [
  'Crop Farming', 'Livestock', 'Irrigation', 'Organic Farming', 'Aquaculture',
  'Poultry', 'Dairy', 'Horticulture', 'Agro-processing', 'Sustainable Agriculture', 'Other',
];

/**
 * README ref: "Expert Features > Creating and Editing Ideas > Target Region"
 */
export const EXPERT_REGIONS = ['All Regions', 'North', 'East', 'West', 'South'];

// ── Interfaces ────────────────────────────────────

/** README ref: "Expert Features > Creating and Editing Ideas" */
export interface ExpertIdea {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  /** README ref: "Problem Statement: Description of the agricultural problem" */
  problemStatement: string;
  /** README ref: "Proposed Solution: The expert's technical answer" */
  proposedSolution: string;
  category: ExpertCategory;
  targetRegion: string;
  budgetMin: number;
  budgetMax: number;
  status: IdeaStatus;
  expertId: string;
  expertName: string;
  images: string[];
  createdAt: string;
  /** Count of investors who expressed interest */
  interestedInvestors: number;
  /** Individual investor interactions */
  interests: InvestorInterest[];
  /** True when this idea belongs to the current authenticated expert */
  isOwn: boolean;
}

/**
 * Investor interest interaction on an expert idea.
 * README ref: "Expert Features > Investor Engagement"
 */
export interface InvestorInterest {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'negotiating' | 'committed';
}

/**
 * README ref: "Expert Features > Browsing Farmer Projects"
 * A farmer project available for expert participation as a pilot.
 */
export interface PilotProject {
  id: string;
  title: string;
  farmerName: string;
  farmerRegion: string;
  description: string;
  status: PilotProjectStatus;
  category: ExpertCategory;
  budget: number;
  createdAt: string;
  images: string[];
  requiredExpertise: string[];
  /** Whether the current expert has requested/confirmed participation */
  isParticipating: boolean;
}

/**
 * README ref: "Expert Features > Collaboration with Farmers"
 * Active, pending, or completed collaboration between an expert and a farmer.
 */
export interface Collaboration {
  id: string;
  projectId: string;
  projectTitle: string;
  farmerName: string;
  farmerRegion: string;
  status: CollaborationStatus;
  lastInteraction: string;
  category: ExpertCategory;
  description: string;
}

// ── Display Helpers ───────────────────────────────

export function getIdeaStatusMeta(status: IdeaStatus) {
  switch (status) {
    case 'draft':         return { label: 'Draft',           color: '#6C757D', bg: '#F8F9FA' };
    case 'published':     return { label: 'Published',       color: '#3498DB', bg: '#EBF5FB' };
    case 'readyForPilot': return { label: 'Ready for Pilot', color: '#F39C12', bg: '#FEF9E7' };
    case 'pilotActive':   return { label: 'Pilot Active',    color: '#2ECC71', bg: '#E8F8F0' };
    case 'completed':     return { label: 'Completed',       color: '#6C757D', bg: '#F8F9FA' };
    case 'archived':      return { label: 'Archived',        color: '#ADB5BD', bg: '#F1F3F5' };
  }
}

export function getPilotStatusMeta(status: PilotProjectStatus) {
  switch (status) {
    case 'open':      return { label: 'Open',      color: '#3498DB', bg: '#EBF5FB' };
    case 'active':    return { label: 'Active',    color: '#2ECC71', bg: '#E8F8F0' };
    case 'completed': return { label: 'Completed', color: '#6C757D', bg: '#F8F9FA' };
  }
}

export function getCollabStatusMeta(status: CollaborationStatus) {
  switch (status) {
    case 'pending':   return { label: 'Pending',   color: '#F39C12', bg: '#FEF9E7' };
    case 'active':    return { label: 'Active',    color: '#2ECC71', bg: '#E8F8F0' };
    case 'completed': return { label: 'Completed', color: '#6C757D', bg: '#F8F9FA' };
  }
}

/** Format budget range for display */
export function formatBudgetRange(min: number, max: number): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-DZ', { style: 'decimal', minimumFractionDigits: 0 }).format(n);
  return `${fmt(min)} – ${fmt(max)} DZD`;
}
