/**
 * Project Model — aligned with mobile app's `project.dart`
 *
 * README ref: "Farmer Features > Project Publishing"
 * Projects contain: title, description, budget, production estimate,
 * region, category, images.
 *
 * README ref: "Investor Features > Unified Content Feed"
 * Three project types shown in investor feed:
 *   - expert_idea (Blue badge)
 *   - pilot_project (Green badge)
 *   - farmer_project (Orange badge)
 */

export type ProjectType = 'expert_idea' | 'pilot_project' | 'farmer_project';

/**
 * README ref: "Expert Features > Creating and Editing Ideas > Category"
 * Shared category list used across all content types.
 */
export type ProjectCategory =
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

/**
 * README ref: "Expert Features > Creating and Editing Ideas > Target Region"
 */
export type Region = 'All Regions' | 'North' | 'East' | 'West' | 'South';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  budget: number;
  productionEstimate: string;
  region: string;
  category: string;
  type: ProjectType;
  expertName?: string;
  farmerId?: string;
  images: string[];
  createdAt: string;
}

/**
 * Returns display label and color for a project type.
 * README ref: "Unified Content Feed" badge specifications.
 */
export function getProjectTypeMeta(type: ProjectType) {
  switch (type) {
    case 'expert_idea':
      return { label: 'Expert Idea', color: '#3498DB' };
    case 'pilot_project':
      return { label: 'Pilot Project', color: '#2ECC71' };
    case 'farmer_project':
      return { label: 'Farmer Project', color: '#F39C12' };
  }
}

/** Format budget in DZD currency */
export function formatBudget(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' DZD';
}

/**
 * Derives a status label from project age.
 * ≤10 days  → "new"
 * ≥45 days  → "closing_soon"
 * otherwise → "hot"
 */
export function getProjectStatus(
  createdAt: string,
): 'new' | 'hot' | 'closing_soon' {
  const days = (Date.now() - new Date(createdAt).getTime()) / 86_400_000;
  if (days <= 10) return 'new';
  if (days >= 45) return 'closing_soon';
  return 'hot';
}
