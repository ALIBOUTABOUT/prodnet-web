/**
 * Expert Mock Data — aligned with mobile app's mock_api.dart patterns.
 *
 * README ref: "Offline Strategy / Mock API Fallback"
 * Provides hardcoded mock data for the Expert role so the web app
 * works fully offline without a backend.
 *
 * Current date: March 7, 2026
 * - Ideas created in the past few months to exercise status / age logic
 */

import { ExpertIdea, PilotProject, Collaboration, InvestorInterest } from '@/models/expertIdea';

/** README ref: "Expert Features > Idea Lifecycle" */
export const MOCK_EXPERT_IDEAS: ExpertIdea[] = [
  {
    id: 'ei-1',
    title: 'Sustainable Greenhouse Farming System',
    shortDescription:
      'Traditional farming methods are inefficient and vulnerable to climate change, leading to unpredictable yields.',
    detailedDescription:
      'This expert idea proposes a fully controlled greenhouse farming system integrating IoT sensors, automated climate management, and hydroponic nutrition delivery. By isolating crops from external climate volatility, consistent year-round yields become achievable. The concept targets semi-arid regions of northern Algeria where water scarcity and heat extremes regularly cut open-field yields by 30–50%.',
    problemStatement:
      'Traditional open-field farming in northern Algeria suffers from water scarcity, unpredictable rainfall, and heat extremes that cut yields by 30–50%.',
    proposedSolution:
      'Deploy modular greenhouse units with drip irrigation, automated shading, and solar-powered climate control. Each unit covers 500 m² and is operable by a single farmer with minimal training.',
    category: 'Crop Farming',
    targetRegion: 'North',
    budgetMin: 80000,
    budgetMax: 150000,
    status: 'published',
    expertId: 'expert_1',
    expertName: 'You',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=300&fit=crop'],
    createdAt: '2026-02-10T09:00:00Z',
    interestedInvestors: 3,
    interests: [
      { id: 'int-1', investorId: 'inv_1', investorName: 'Karim Benali', investorEmail: 'karim@invest.dz', message: 'Very interested in the greenhouse concept for northern Algeria. Can we discuss scaling?', createdAt: '2026-02-20T10:00:00Z', status: 'negotiating' },
      { id: 'int-2', investorId: 'inv_2', investorName: 'Samira Haddad', investorEmail: 'samira@capital.dz', message: 'Our fund focuses on sustainable agriculture. This aligns perfectly.', createdAt: '2026-02-22T14:00:00Z', status: 'contacted' },
      { id: 'int-3', investorId: 'inv_3', investorName: 'Yacine Djerbal', investorEmail: 'yacine@agrifund.dz', message: 'Would like to visit a prototype installation if available.', createdAt: '2026-03-01T09:30:00Z', status: 'new' },
    ],
    isOwn: true,
  },
  {
    id: 'ei-2',
    title: 'Low-Cost Solar Pumping for Remote Farms',
    shortDescription:
      'Remote farms lack reliable electricity for irrigation, preventing efficient water distribution.',
    detailedDescription:
      'A practical solar-powered water pumping solution designed for remote agricultural sites without grid access. The system uses a 1 kW photovoltaic panel to drive a submersible pump delivering 3,000 L/h from depths up to 25 m. Includes a battery buffer for cloudy-day operation and a mobile monitoring dashboard.',
    problemStatement:
      'Over 40% of Algerian smallholder farms lack reliable grid electricity, forcing farmers to use expensive diesel generators for irrigation pumping.',
    proposedSolution:
      'Deploy low-cost solar pump kits assembled from locally-sourced components. Provide farmer training modules and a remote monitoring service to reduce downtime.',
    category: 'Irrigation',
    targetRegion: 'South',
    budgetMin: 40000,
    budgetMax: 80000,
    status: 'readyForPilot',
    expertId: 'expert_1',
    expertName: 'You',
    images: ['https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&h=300&fit=crop'],
    createdAt: '2026-01-15T14:00:00Z',
    interestedInvestors: 1,
    interests: [
      { id: 'int-4', investorId: 'inv_2', investorName: 'Samira Haddad', investorEmail: 'samira@capital.dz', message: 'Solar pumping has great ROI potential. Let us know when the pilot starts.', createdAt: '2026-02-05T11:00:00Z', status: 'new' },
    ],
    isOwn: true,
  },
  {
    id: 'ei-3',
    title: 'AI-Powered Soil Analysis Platform',
    shortDescription:
      'Farmers lack accessible tools for soil analysis, leading to inefficient and costly fertilizer use.',
    detailedDescription:
      'A mobile-first platform where farmers photograph soil samples and receive AI-powered nutrient analysis in minutes. The model is trained on Algerian soil datasets across all 48 wilayas. Results include recommended fertilizer types, quantities, expected yield improvements, and a monitoring timeline.',
    problemStatement:
      'Professional soil testing costs 5,000–15,000 DZD per sample and takes 2–3 weeks, making it inaccessible to smallholders.',
    proposedSolution:
      'Build a convolutional neural network trained on soil color spectra and texture data. Partner with agronomic labs to compile the Algerian soil training dataset.',
    category: 'Other',
    targetRegion: 'All Regions',
    budgetMin: 200000,
    budgetMax: 500000,
    status: 'draft',
    expertId: 'expert_1',
    expertName: 'You',
    images: [],
    createdAt: '2026-03-01T10:30:00Z',
    interestedInvestors: 0,
    interests: [],
    isOwn: true,
  },
  {
    id: 'ei-4',
    title: 'Integrated Organic Pest Management',
    shortDescription:
      'Chemical pesticides damage soil health and human health while creating resistant pest strains.',
    detailedDescription:
      'A holistic pest control system using biological agents (beneficial insects, fungi), trap crops, and crop rotation schedules tailored to Algerian agricultural zones. This approach eliminates the need for synthetic pesticides on participating farms within 2 growing seasons.',
    problemStatement:
      'Overuse of chemical pesticides has led to resistant pest populations and progressive soil degradation across several key farming wilayas.',
    proposedSolution:
      'Introduce certified lacewing and ladybug insectaries to supply beneficial insects, combined with digital scheduling tools for rotation planning and pest monitoring.',
    category: 'Organic Farming',
    targetRegion: 'East',
    budgetMin: 30000,
    budgetMax: 70000,
    status: 'pilotActive',
    expertId: 'expert_1',
    expertName: 'You',
    images: ['https://images.unsplash.com/photo-1565362887836-0e0c34be9b26?w=600&h=300&fit=crop'],
    createdAt: '2025-12-20T08:00:00Z',
    interestedInvestors: 5,
    interests: [
      { id: 'int-5', investorId: 'inv_1', investorName: 'Karim Benali', investorEmail: 'karim@invest.dz', message: 'Organic pest management is the future. Fully committed to this project.', createdAt: '2025-12-28T10:00:00Z', status: 'committed' },
      { id: 'int-6', investorId: 'inv_4', investorName: 'Nabil Lounis', investorEmail: 'nabil@greenfund.dz', message: 'Would like to fund the lacewing insectary component.', createdAt: '2026-01-05T08:30:00Z', status: 'negotiating' },
      { id: 'int-7', investorId: 'inv_5', investorName: 'Amina Rouabah', investorEmail: 'amina@solagri.dz', message: 'Interested in applying this to our east region orchards.', createdAt: '2026-01-10T14:00:00Z', status: 'contacted' },
      { id: 'int-8', investorId: 'inv_2', investorName: 'Samira Haddad', investorEmail: 'samira@capital.dz', message: 'We can co-fund the digital scheduling tool component.', createdAt: '2026-01-15T09:00:00Z', status: 'new' },
      { id: 'int-9', investorId: 'inv_3', investorName: 'Yacine Djerbal', investorEmail: 'yacine@agrifund.dz', message: 'Very promising results. Count us in for Phase 2.', createdAt: '2026-02-01T16:00:00Z', status: 'new' },
    ],
    isOwn: true,
  },
  {
    id: 'ei-5',
    title: 'Camel Milk Processing Unit',
    shortDescription: 'Establishing a small-scale camel milk processing facility in the Saharan region.',
    detailedDescription: 'A completed project that successfully set up a camel milk pasteurization and packaging unit in Tamanrasset, producing 500L/day for regional markets.',
    problemStatement: 'Camel milk, a nutritious staple of Saharan communities, spoils quickly without proper processing, limiting its market reach.',
    proposedSolution: 'Build a mobile pasteurization unit that can be shared among multiple herders, with cold-chain logistics to urban markets.',
    category: 'Livestock',
    targetRegion: 'South',
    budgetMin: 150000,
    budgetMax: 300000,
    status: 'completed',
    expertId: 'expert_1',
    expertName: 'You',
    images: ['https://images.unsplash.com/photo-1566847438217-76e82d383f84?w=600&h=300&fit=crop'],
    createdAt: '2025-09-15T10:00:00Z',
    interestedInvestors: 4,
    interests: [
      { id: 'int-10', investorId: 'inv_1', investorName: 'Karim Benali', investorEmail: 'karim@invest.dz', message: 'Excellent completed project. Would like to replicate in Ghardaia.', createdAt: '2025-11-01T10:00:00Z', status: 'committed' },
    ],
    isOwn: true,
  },
  {
    id: 'ei-6',
    title: 'Heritage Wheat Variety Preservation',
    shortDescription: 'Archiving and testing traditional Algerian wheat landraces for drought resistance.',
    detailedDescription: 'This archived idea documented 12 heritage wheat varieties from the Aurès mountains, testing their drought tolerance versus modern cultivars.',
    problemStatement: 'Traditional wheat varieties with centuries of natural selection for local conditions are being lost as farmers switch to imported cultivars.',
    proposedSolution: 'Create a seed bank and field trial network to preserve, test, and redistribute heritage landraces to interested farmers.',
    category: 'Crop Farming',
    targetRegion: 'East',
    budgetMin: 20000,
    budgetMax: 50000,
    status: 'archived',
    expertId: 'expert_1',
    expertName: 'You',
    images: [],
    createdAt: '2025-06-01T10:00:00Z',
    interestedInvestors: 1,
    interests: [],
    isOwn: true,
  },
];

/** README ref: "Expert Features > Browsing Farmer Projects" */
export const MOCK_PILOT_PROJECTS: PilotProject[] = [
  {
    id: 'pp-1',
    title: 'Alfalfa Expansion in Ouargla',
    farmerName: 'Mohamed Khelil',
    farmerRegion: 'Ouargla',
    description:
      'A farmer in the Ouargla highlands wants to expand alfalfa cultivation across 20 hectares using improved drip irrigation. Seeking an irrigation expert to design a drip system suited to sandy-loam soil.',
    status: 'open',
    category: 'Irrigation',
    budget: 120000,
    createdAt: '2026-02-25T11:00:00Z',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=300&fit=crop'],
    requiredExpertise: ['Irrigation Engineering', 'Soil Science'],
    isParticipating: false,
  },
  {
    id: 'pp-2',
    title: 'Oasis Date Palm Rehabilitation',
    farmerName: 'Fatima Zeggane',
    farmerRegion: 'Biskra',
    description:
      'Rehabilitation of 200 aging date palms using crown management, soil enrichment, and micro-irrigation. The farmer needs expertise in palm horticulture and nutrient management for optimal yield recovery.',
    status: 'active',
    category: 'Horticulture',
    budget: 85000,
    createdAt: '2026-01-20T09:00:00Z',
    images: ['https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&h=300&fit=crop'],
    requiredExpertise: ['Horticulture', 'Organic Farming'],
    isParticipating: true,
  },
  {
    id: 'pp-3',
    title: 'Mountain Beekeeping Initiative',
    farmerName: 'Bachir Meziane',
    farmerRegion: 'Tizi Ouzou',
    description:
      'Establishing 50 beehives in the Kabylie highlands to produce honey and improve pollination for neighbouring orchards. Seeking an expert in apiculture and natural ecosystem management.',
    status: 'open',
    category: 'Sustainable Agriculture',
    budget: 45000,
    createdAt: '2026-03-01T07:30:00Z',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=300&fit=crop'],
    requiredExpertise: ['Apiculture', 'Sustainable Agriculture'],
    isParticipating: false,
  },
  {
    id: 'pp-4',
    title: 'Saharan Drip Irrigation Trial',
    farmerName: 'Youcef Ouled',
    farmerRegion: 'Tamanrasset',
    description:
      'A completed trial demonstrating drip irrigation viability in extreme desert conditions. Reduced water usage by 65% while maintaining vegetable yields. Now seeking an expert to document the methodology for replication in other Saharan wilayas.',
    status: 'completed',
    category: 'Irrigation',
    budget: 60000,
    createdAt: '2025-11-10T08:00:00Z',
    images: ['https://images.unsplash.com/photo-1530836176759-510f58baebf4?w=600&h=300&fit=crop'],
    requiredExpertise: ['Irrigation Engineering'],
    isParticipating: false,
  },
];

/** README ref: "Expert Features > Collaboration" */
export const MOCK_COLLABORATIONS: Collaboration[] = [
  {
    id: 'col-1',
    projectId: 'pp-2',
    projectTitle: 'Oasis Date Palm Rehabilitation',
    farmerName: 'Fatima Zeggane',
    farmerRegion: 'Biskra',
    status: 'active',
    lastInteraction: '2026-03-05T14:30:00Z',
    category: 'Horticulture',
    description:
      'Ongoing collaboration on palm crown management and organic soil enrichment. Phase 1 soil testing is complete and a nutrient schedule has been approved.',
  },
  {
    id: 'col-2',
    projectId: 'pp-1',
    projectTitle: 'Alfalfa Expansion in Ouargla',
    farmerName: 'Mohamed Khelil',
    farmerRegion: 'Ouargla',
    status: 'pending',
    lastInteraction: '2026-03-06T09:00:00Z',
    category: 'Irrigation',
    description:
      'Participation request sent. Awaiting farmer confirmation to begin the drip irrigation system design phase.',
  },
  {
    id: 'col-3',
    projectId: 'pp-4',
    projectTitle: 'Saharan Drip Irrigation Trial',
    farmerName: 'Youcef Ouled',
    farmerRegion: 'Tamanrasset',
    status: 'completed',
    lastInteraction: '2026-01-28T16:00:00Z',
    category: 'Irrigation',
    description:
      'Successfully documented the drip irrigation trial methodology. Final technical report submitted and approved.',
  },
];
