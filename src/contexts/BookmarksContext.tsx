/**
 * BookmarksContext — tracks saved (bookmarked) projects and viewed projects.
 * Saved projects show in the Dashboard "Saved" tab.
 * Viewed projects feed the "Projects Viewed" real statistic.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

interface BookmarksState {
  savedIds: string[];
  viewedIds: string[];
}

type BookmarksAction =
  | { type: 'TOGGLE_BOOKMARK'; id: string }
  | { type: 'TRACK_VIEW'; id: string };

function reducer(state: BookmarksState, action: BookmarksAction): BookmarksState {
  switch (action.type) {
    case 'TOGGLE_BOOKMARK': {
      const exists = state.savedIds.includes(action.id);
      return {
        ...state,
        savedIds: exists
          ? state.savedIds.filter((id) => id !== action.id)
          : [...state.savedIds, action.id],
      };
    }
    case 'TRACK_VIEW':
      if (state.viewedIds.includes(action.id)) return state;
      return { ...state, viewedIds: [...state.viewedIds, action.id] };
    default:
      return state;
  }
}

interface BookmarksContextValue {
  savedIds: string[];
  viewedIds: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  trackView: (id: string) => void;
  totalSaved: number;
  totalViewed: number;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { savedIds: [], viewedIds: [] });

  const toggleBookmark = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_BOOKMARK', id });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => state.savedIds.includes(id),
    [state.savedIds],
  );

  const trackView = useCallback((id: string) => {
    dispatch({ type: 'TRACK_VIEW', id });
  }, []);

  return (
    <BookmarksContext.Provider
      value={{
        savedIds: state.savedIds,
        viewedIds: state.viewedIds,
        toggleBookmark,
        isBookmarked,
        trackView,
        totalSaved: state.savedIds.length,
        totalViewed: state.viewedIds.length,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be used inside BookmarksProvider');
  return ctx;
}
