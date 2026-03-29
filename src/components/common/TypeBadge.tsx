/**
 * Type Badge — visual indicator for project type.
 *
 * README ref: "Unified Content Feed"
 * Badge Color | Type
 * Blue        | Expert Idea
 * Green       | Pilot Project
 * Orange      | Farmer Project
 */

import React from 'react';
import { ProjectType, getProjectTypeMeta } from '@/models/project';

interface TypeBadgeProps {
  type: ProjectType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const { label, color } = getProjectTypeMeta(type);
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSmall ? '2px 8px' : '4px 12px',
        borderRadius: '9999px',
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        color: '#FFFFFF',
        backgroundColor: color,
        letterSpacing: '0.01em',
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  );
}
