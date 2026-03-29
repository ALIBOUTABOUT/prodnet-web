/**
 * SkeletonCard — shimmer placeholder for loading states.
 *
 * Injects a single <style> tag with the keyframe animation on first render.
 * All subsequent instances reuse it.
 *
 * Props:
 *   height    — card height in px (default 120)
 *   withImage — add a taller image placeholder strip at top
 */

import React, { useEffect } from 'react';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('__skeleton_styles')) return;
  const tag = document.createElement('style');
  tag.id = '__skeleton_styles';
  tag.textContent = `
    @keyframes skeletonShimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px  0; }
    }
    .sk {
      background: linear-gradient(90deg, #EBEBEB 25%, #D6D6D6 50%, #EBEBEB 75%);
      background-size: 800px 100%;
      animation: skeletonShimmer 1.4s infinite linear;
      border-radius: 6px;
    }
  `;
  document.head.appendChild(tag);
}

interface SkeletonCardProps {
  withImage?: boolean;
  lines?: number;
}

export function SkeletonCard({ withImage = false, lines = 3 }: SkeletonCardProps) {
  useEffect(() => { injectStyles(); }, []);

  return (
    <div style={cardStyle}>
      {withImage && <div className="sk" style={{ height: 130, borderRadius: '0 0 0 0', flexShrink: 0 }} />}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {/* Category + badge row */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="sk" style={{ width: 80, height: 14 }} />
          <div className="sk" style={{ width: 60, height: 14 }} />
        </div>
        {/* Title */}
        <div className="sk" style={{ width: '70%', height: 18 }} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div key={i} className="sk" style={{ width: i === lines - 2 ? '50%' : '100%', height: 12 }} />
        ))}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};
