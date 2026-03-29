/**
 * Mock API — aligned with mobile app's `mock_api.dart`
 *
 * README ref: "Offline Strategy" / "Mock API Fallback"
 * - Offline mode uses hardcoded mock data
 * - Provides fallback data when backend is unavailable
 *
 * README ref: "Investor Features > Unified Content Feed"
 * - Blue badge → Expert Idea
 * - Green badge → Pilot Project
 * - Orange badge → Farmer Project
 */

import { Project, ProjectType } from '@/models/project';
import { InvestorInterest } from '@/models/investorInterest';

/**
 * Mock projects for the investor unified feed.
 * Includes all three content types: expert ideas, pilot projects, farmer projects.
 */
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Sustainable Irrigation System for Arid Regions',
    shortDescription: 'Smart drip irrigation for smallholder farms in Biskra and Ghardaia wilayas.',
    detailedDescription:
      'This expert idea proposes implementing a smart drip irrigation system designed specifically for Algeria\'s arid regions. The system uses solar-powered sensors to monitor soil moisture and automatically adjust water flow, reducing water usage by up to 60% compared to traditional methods. Perfect for tomato, date palm, and vegetable cultivation in the southern wilayas. The pilot phase involves 10 farms across 3 communes in Biskra.',
    budget: 150000,
    productionEstimate: '2,000 kg/season',
    region: 'Biskra',
    category: 'Irrigation',
    type: 'expert_idea' as ProjectType,
    expertName: 'Dr. Hassan Benali',
    images: ['https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=600&h=300&fit=crop'],
    createdAt: '2026-02-15T10:00:00Z',
    farmerId: undefined,
  },
  {
    id: '2',
    title: 'Organic Wheat Production in Tiaret',
    shortDescription: 'Large-scale organic wheat farming using certified organic methods in the Hauts Plateaux.',
    detailedDescription:
      'A comprehensive organic wheat program spanning 50 hectares in the Tiaret highlands. Uses heritage Algerian seed varieties, companion planting, and biological pest control. Expected to produce certified organic wheat adapted to the semi-arid climate of the Hauts Plateaux. Includes a 3-year soil restoration plan and targets national wheat self-sufficiency goals.',
    budget: 450000,
    productionEstimate: '15,000 quintaux/year',
    region: 'Tiaret',
    category: 'Crop Farming',
    type: 'farmer_project' as ProjectType,
    expertName: undefined,
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=300&fit=crop'],
    createdAt: '2026-02-20T14:30:00Z',
    farmerId: 'farmer_1',
  },
  {
    id: '3',
    title: 'Solar-Powered Poultry Farm in Sétif',
    shortDescription: 'Sustainable poultry farm powered by solar energy in the eastern highlands.',
    detailedDescription:
      'A pilot project implementing solar-powered climate control and automated feeding systems in a 2,000-bird poultry operation in Sétif. Algeria imports significant poultry — this project aims to demonstrate that renewable energy can reduce operational costs by 35% while maintaining optimal bird welfare. Targets the local market in eastern wilayas.',
    budget: 320000,
    productionEstimate: '500 eggs/day',
    region: 'Sétif',
    category: 'Poultry',
    type: 'pilot_project' as ProjectType,
    expertName: 'Pr. Karim Saifi',
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=300&fit=crop'],
    createdAt: '2026-01-10T09:00:00Z',
    farmerId: 'farmer_2',
  },
  {
    id: '4',
    title: 'Greenhouse Tomato Cultivation in Tipaza',
    shortDescription: 'Year-round greenhouse tomato production along the Mediterranean coast.',
    detailedDescription:
      'Advanced greenhouse operation using hydroponic systems for consistent year-round tomato production in Tipaza wilaya. The Mediterranean climate is ideal for extending growing seasons. Features climate monitoring, nutrient management automation, and integrated pest management. Targets Algiers and surrounding wilayas with fresh premium produce.',
    budget: 280000,
    productionEstimate: '8,000 kg/year',
    region: 'Tipaza',
    category: 'Horticulture',
    type: 'farmer_project' as ProjectType,
    expertName: undefined,
    images: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=300&fit=crop'],
    createdAt: '2026-02-28T11:00:00Z',
    farmerId: 'farmer_3',
  },
  {
    id: '5',
    title: 'Dairy Goat Enterprise in Tizi Ouzou',
    shortDescription: 'Artisanal goat dairy with cheese processing in the Kabylie mountains.',
    detailedDescription:
      'Establishment of a 100-head dairy goat farm with an attached artisanal cheese-making facility in Tizi Ouzou. Uses improved goat breeds adapted to the mountainous terrain of Kabylie. Includes pasture development and a direct-to-consumer sales channel. Algeria\'s growing demand for local artisanal dairy products makes this a promising investment.',
    budget: 180000,
    productionEstimate: '200 liters/day',
    region: 'Tizi Ouzou',
    category: 'Dairy',
    type: 'expert_idea' as ProjectType,
    expertName: 'Dr. Youcef Hadj',
    images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&h=300&fit=crop'],
    createdAt: '2026-03-01T08:15:00Z',
    farmerId: undefined,
  },
  {
    id: '6',
    title: 'Aquaculture Pilot in Annaba',
    shortDescription: 'Fish farming using recirculating aquaculture systems along the coast.',
    detailedDescription:
      'Pilot project for indoor fish production using state-of-the-art recirculating aquaculture systems in Annaba wilaya. Water recycling rate exceeds 95%, minimizing environmental impact. Supports Algeria\'s national plan to develop aquaculture and reduce reliance on wild-caught fish. Includes fingerling production and targets the eastern coastline market.',
    budget: 520000,
    productionEstimate: '10,000 kg/year',
    region: 'Annaba',
    category: 'Aquaculture',
    type: 'pilot_project' as ProjectType,
    expertName: 'Dr. Leila Mansouri',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=300&fit=crop'],
    createdAt: '2026-02-05T16:45:00Z',
    farmerId: 'farmer_4',
  },
];

/**
 * README ref: "Investor Dashboard > Interested Projects tab"
 * Mock interests that the investor has expressed.
 */
export const MOCK_INVESTOR_INTERESTS: InvestorInterest[] = [
  {
    id: 'int_1',
    projectId: '1',
    investorId: 'investor_mock',
    message: 'Very interested in the irrigation solution for the South.',
    proposedAmount: 100000,
    createdAt: '2026-02-16T10:00:00Z',
  },
  {
    id: 'int_2',
    projectId: '3',
    investorId: 'investor_mock',
    message: 'Solar poultry aligns with my portfolio focus.',
    proposedAmount: 200000,
    createdAt: '2026-02-12T14:00:00Z',
  },
];

/**
 * README ref: "Investor Dashboard > Statistics tab"
 */
export const MOCK_INVESTOR_STATS = {
  totalProjectsViewed: 24,
  interestsExpressed: 2,
  savedProjects: 5,
  premiumSince: null as string | null,
};

export const MockApi = {
  getProjects: (): Promise<Project[]> =>
    new Promise((resolve) => setTimeout(() => resolve([...MOCK_PROJECTS]), 500)),

  getInvestorInterests: (): Promise<InvestorInterest[]> =>
    new Promise((resolve) => setTimeout(() => resolve([...MOCK_INVESTOR_INTERESTS]), 300)),

  getInvestorStats: () =>
    new Promise((resolve) => setTimeout(() => resolve({ ...MOCK_INVESTOR_STATS }), 200)),
};
