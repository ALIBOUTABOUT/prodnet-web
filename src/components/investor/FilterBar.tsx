/**
 * Filter Bar — controls for filtering and sorting the investor feed.
 *
 * README ref: "Investor Features > Filtering and Searching"
 * - Type filter chips: All / Expert Ideas / Pilot Projects / Farmer Projects
 * - Region filter: All / North / South / East / West
 * - Search bar: full-text across title, description, category, expert name
 * - Sort: Newest / Budget Low→High / Budget High→Low / Trust Score
 */

import React from 'react';
import { ProjectType } from '@/models/project';
import { Search, SlidersHorizontal, MapPin, Check, DollarSign, X } from 'lucide-react';

interface FilterBarProps {
  activeTypeFilter: ProjectType | 'all';
  activeRegionFilter: string;
  searchQuery: string;
  sortBy: string;
  onTypeFilterChange: (filter: ProjectType | 'all') => void;
  onRegionFilterChange: (region: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'newest' | 'budget_asc' | 'budget_desc' | 'trust_score') => void;
  budgetMin: number | null;
  budgetMax: number | null;
  onBudgetRangeChange: (min: number | null, max: number | null) => void;
}

const typeFilters: { value: ProjectType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'expert_idea', label: 'Expert Ideas' },
  { value: 'pilot_project', label: 'Pilot Projects' },
  { value: 'farmer_project', label: 'Farmer Projects' },
];

const regions = ['All', 'Biskra', 'Tiaret', 'Sétif', 'Tipaza', 'Tizi Ouzou', 'Annaba'];

const sortOptions: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'budget_asc', label: 'Budget: Low → High' },
  { value: 'budget_desc', label: 'Budget: High → Low' },
  { value: 'trust_score', label: 'Trust Score' },
];

export function FilterBar({
  activeTypeFilter,
  activeRegionFilter,
  searchQuery,
  sortBy,
  budgetMin,
  budgetMax,
  onTypeFilterChange,
  onRegionFilterChange,
  onSearchChange,
  onSortChange,
  onBudgetRangeChange,
}: FilterBarProps) {
  return (
    <div style={styles.container}>
      {/* Search + Sort row */}
      <div style={styles.searchRow}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.selectGroup}>
          {/* Region */}
          <div style={styles.selectWrapper}>
            <MapPin size={14} style={styles.selectIcon} />
            <select
              value={activeRegionFilter}
              onChange={(e) => onRegionFilterChange(e.target.value)}
              style={{ ...styles.select, paddingLeft: '2rem' }}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Regions' : r}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={styles.selectWrapper}>
            <SlidersHorizontal size={14} style={styles.selectIcon} />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              style={{ ...styles.select, paddingLeft: '2rem' }}
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div style={styles.chipRow}>
        {typeFilters.map((f) => {
          const isActive = activeTypeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => onTypeFilterChange(f.value)}
              style={{
                ...styles.chip,
                backgroundColor: isActive ? '#2ECC71' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#495057',
                borderColor: isActive ? '#2ECC71' : '#DEE2E6',
              }}
            >
              {isActive && <Check size={14} style={{ marginRight: '4px' }} />}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Budget Range */}
      <div style={styles.budgetRow}>
        <DollarSign size={14} style={{ color: '#ADB5BD', flexShrink: 0 }} />
        <span style={styles.budgetLabel}>Budget (DZD):</span>
        <input
          type="number"
          placeholder="Min"
          value={budgetMin ?? ''}
          min={0}
          onChange={(e) => onBudgetRangeChange(e.target.value === '' ? null : Number(e.target.value), budgetMax)}
          style={styles.budgetInput}
        />
        <span style={styles.budgetSep}>—</span>
        <input
          type="number"
          placeholder="Max"
          value={budgetMax ?? ''}
          min={0}
          onChange={(e) => onBudgetRangeChange(budgetMin, e.target.value === '' ? null : Number(e.target.value))}
          style={styles.budgetInput}
        />
        {(budgetMin !== null || budgetMax !== null) && (
          <button onClick={() => onBudgetRangeChange(null, null)} style={styles.clearBudgetBtn} title="Clear">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '0.5rem 0',
  },
  searchRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '200px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#ADB5BD',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '0.625rem 0.75rem 0.625rem 2.5rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.625rem',
    fontSize: '0.875rem',
    color: '#212529',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  selectGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  selectWrapper: {
    position: 'relative',
  },
  selectIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#ADB5BD',
    pointerEvents: 'none',
  },
  select: {
    padding: '0.625rem 2rem 0.625rem 0.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.625rem',
    fontSize: '0.875rem',
    color: '#212529',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    appearance: 'auto' as any,
  },
  chipRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.375rem 0.875rem',
    border: '1.5px solid',
    borderRadius: '9999px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    backgroundColor: '#FFFFFF',
  },
  budgetRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  budgetLabel: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: '#495057',
    whiteSpace: 'nowrap' as const,
  },
  budgetInput: {
    width: '110px',
    padding: '0.5rem 0.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    color: '#212529',
    backgroundColor: '#FFFFFF',
  },
  budgetSep: {
    color: '#ADB5BD',
  },
  clearBudgetBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#F8F9FA',
    color: '#6C757D',
    cursor: 'pointer',
    flexShrink: 0,
  },
};
