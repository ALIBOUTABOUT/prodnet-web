/**
 * Project Context — aligned with mobile app's `project_provider.dart`
 *
 * README ref: "State Management Strategy > ProjectProvider"
 * - Manages farmer projects
 * - Handles CRUD operations for projects
 *
 * README ref: "Investor Features > Unified Content Feed"
 * Aggregates all three content types into a single scrollable feed.
 *
 * README ref: "Investor Features > Filtering and Searching"
 * Filtering and sorting are applied client-side on already-loaded project list.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Project, ProjectType } from '@/models/project';
import { MockApi } from '@/core/api/mockApi';

// ── State ─────────────────────────────────────────

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  // README ref: "Filtering and Searching"
  activeTypeFilter: ProjectType | 'all';
  activeRegionFilter: string;
  searchQuery: string;
  sortBy: 'newest' | 'budget_asc' | 'budget_desc' | 'trust_score';
  budgetMin: number | null;
  budgetMax: number | null;
}

const initialState: ProjectState = {
  projects: [],
  isLoading: false,
  error: null,
  activeTypeFilter: 'all',
  activeRegionFilter: 'All',
  searchQuery: '',
  sortBy: 'newest',
  budgetMin: null,
  budgetMax: null,
};

// ── Actions ───────────────────────────────────────

type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TYPE_FILTER'; payload: ProjectType | 'all' }
  | { type: 'SET_REGION_FILTER'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT'; payload: ProjectState['sortBy'] }
  | { type: 'SET_BUDGET_RANGE'; payload: { min: number | null; max: number | null } };

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_TYPE_FILTER':
      return { ...state, activeTypeFilter: action.payload };
    case 'SET_REGION_FILTER':
      return { ...state, activeRegionFilter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_BUDGET_RANGE':
      return { ...state, budgetMin: action.payload.min, budgetMax: action.payload.max };
    default:
      return state;
  }
}

// ── Selectors ─────────────────────────────────────

/**
 * README ref: "Investor Features > Filtering and Searching"
 * Type filter chips: All / Expert Ideas / Pilot Projects / Farmer Projects
 * Region filter: All / North / South / East / West
 * Search: full-text across title, description, category, expert name
 * Sort: Newest / Budget Low→High / Budget High→Low / Trust Score
 */
function getFilteredProjects(state: ProjectState): Project[] {
  let filtered = [...state.projects];

  // Type filter
  if (state.activeTypeFilter !== 'all') {
    filtered = filtered.filter((p) => p.type === state.activeTypeFilter);
  }

  // Region filter
  if (state.activeRegionFilter !== 'All') {
    filtered = filtered.filter((p) => p.region === state.activeRegionFilter);
  }

  // Budget range filter
  if (state.budgetMin !== null) {
    filtered = filtered.filter((p) => p.budget >= state.budgetMin!);
  }
  if (state.budgetMax !== null) {
    filtered = filtered.filter((p) => p.budget <= state.budgetMax!);
  }

  // Search
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.expertName && p.expertName.toLowerCase().includes(q)),
    );
  }

  // Sort
  switch (state.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'budget_asc':
      filtered.sort((a, b) => a.budget - b.budget);
      break;
    case 'budget_desc':
      filtered.sort((a, b) => b.budget - a.budget);
      break;
    case 'trust_score':
      // Trust score not implemented in mock — default sort
      break;
  }

  return filtered;
}

// ── Context ───────────────────────────────────────

interface ProjectContextValue extends ProjectState {
  filteredProjects: Project[];
  loadProjects: () => Promise<void>;
  setTypeFilter: (filter: ProjectType | 'all') => void;
  setRegionFilter: (region: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: ProjectState['sortBy']) => void;
  setBudgetRange: (min: number | null, max: number | null) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const loadProjects = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const projects = await MockApi.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects' });
    }
  }, []);

  const setTypeFilter = useCallback((filter: ProjectType | 'all') => {
    dispatch({ type: 'SET_TYPE_FILTER', payload: filter });
  }, []);

  const setRegionFilter = useCallback((region: string) => {
    dispatch({ type: 'SET_REGION_FILTER', payload: region });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setSortBy = useCallback((sort: ProjectState['sortBy']) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const setBudgetRange = useCallback((min: number | null, max: number | null) => {
    dispatch({ type: 'SET_BUDGET_RANGE', payload: { min, max } });
  }, []);

  const getProjectById = useCallback(
    (id: string) => state.projects.find((p) => p.id === id),
    [state.projects],
  );

  const filteredProjects = getFilteredProjects(state);

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        filteredProjects,
        loadProjects,
        setTypeFilter,
        setRegionFilter,
        setSearchQuery,
        setSortBy,
        setBudgetRange,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
