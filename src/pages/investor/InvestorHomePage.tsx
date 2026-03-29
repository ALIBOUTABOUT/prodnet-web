/**
 * Investor Home Page — aligned with mobile app's `investor_home_screen.dart`
 *
 * README ref: "Investor Features > Unified Content Feed"
 * Aggregates all three content types into a single scrollable feed.
 * Each card displays: title, short description, budget (DZD), region,
 * type badge, expert name (if applicable), "View Details" button.
 *
 * README ref: "Investor Features > Project Comparison Feature"
 * - Compare toggle icon on each card
 * - Maximum 3 projects (_maxCompareProjects = 3)
 * - FAB appears when 2+ projects selected: "Compare (N)"
 * - Comparison is entirely client-side
 *
 * README ref: "Before Premium (Free tier)"
 * - Persistent orange upgrade banner at top
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { useInvestorPayment } from '@/contexts/InvestorPaymentContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { ProjectCard } from '@/components/investor/ProjectCard';
import { FilterBar } from '@/components/investor/FilterBar';
import { ComparisonSheet } from '@/components/investor/ComparisonSheet';
import { PremiumBanner } from '@/components/investor/PremiumBanner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GitCompare } from 'lucide-react';

/** README ref: "Maximum selection capped at _maxCompareProjects = 3" */
const MAX_COMPARE_PROJECTS = 3;

export function InvestorHomePage() {
  const {
    filteredProjects,
    isLoading,
    loadProjects,
    activeTypeFilter,
    activeRegionFilter,
    searchQuery,
    sortBy,
    budgetMin,
    budgetMax,
    setTypeFilter,
    setRegionFilter,
    setSearchQuery,
    setSortBy,
    setBudgetRange,
    getProjectById,
  } = useProjects();

  const { isPremium } = useInvestorPayment();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();

  /**
   * README ref: "Project Comparison Feature"
   * Track selected project IDs for comparison
   */
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  /**
   * README ref: "Project Comparison Feature > How it works"
   * Step 2: Investor taps icon → select for comparison
   * Card border highlights in primary color
   * Haptic feedback on toggle (simulated by visual feedback on web)
   */
  const handleToggleCompare = useCallback((projectId: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else if (next.size < MAX_COMPARE_PROJECTS) {
        next.add(projectId);
      }
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setCompareIds(new Set());
    setShowComparison(false);
  }, []);

  const handleViewDetails = useCallback(
    (projectId: string) => {
      navigate(`/investor/project/${projectId}`);
    },
    [navigate],
  );

  const compareProjects = Array.from(compareIds)
    .map((id) => getProjectById(id))
    .filter(Boolean) as any[];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Premium Banner */}
        <PremiumBanner isPremium={isPremium} />

        {/* Filter Bar */}
        <FilterBar
          activeTypeFilter={activeTypeFilter}
          activeRegionFilter={activeRegionFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onTypeFilterChange={setTypeFilter}
          onRegionFilterChange={setRegionFilter}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onBudgetRangeChange={setBudgetRange}
        />

        {/* Loading State */}
        {isLoading && <LoadingSpinner message="Loading projects..." />}

        {/* Project Grid */}
        {!isLoading && (
          <>
            <p style={styles.resultCount}>
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
            <div style={styles.grid}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelectedForCompare={compareIds.has(project.id)}
                  onToggleCompare={handleToggleCompare}
                  compareDisabled={compareIds.size >= MAX_COMPARE_PROJECTS}
                  onViewDetails={handleViewDetails}
                  isBookmarked={isBookmarked(project.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>No projects found</p>
                <p style={styles.emptyDesc}>Try adjusting your filters or search terms</p>
              </div>
            )}
          </>
        )}

        {/**
         * README ref: "Project Comparison Feature > How it works"
         * Step 3: "Once 2+ projects selected, FAB appears: Compare (N)"
         */}
        {compareIds.size >= 2 && (
          <button
            onClick={() => setShowComparison(true)}
            style={styles.compareFab}
          >
            <GitCompare size={20} />
            Compare ({compareIds.size})
          </button>
        )}

        {/* Comparison Modal */}
        {showComparison && (
          <ComparisonSheet
            projects={compareProjects}
            onClose={() => setShowComparison(false)}
            onClearSelection={handleClearSelection}
          />
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#F8F9FA',
    padding: '1rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  resultCount: {
    margin: '0.5rem 0 0',
    fontSize: '0.8125rem',
    color: '#ADB5BD',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },
  emptyTitle: {
    margin: '0 0 0.25rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#6C757D',
  },
  emptyDesc: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#ADB5BD',
  },
  compareFab: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.75rem',
    border: 'none',
    borderRadius: '9999px',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.9375rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(46, 204, 113, 0.4)',
    zIndex: 1000,
    fontFamily: 'inherit',
    transition: 'transform 0.15s',
  },
};
