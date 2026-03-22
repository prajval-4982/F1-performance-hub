'use client';

import React from 'react';

interface StandingSkeletonRowProps {
    showTeam?: boolean;
}

const StandingSkeletonRow = ({ showTeam = true }: StandingSkeletonRowProps) => (
    <div className="skeleton-row">
        <div className="skeleton-item skel-pos shimmer" />
        <div className="skeleton-item skel-dot shimmer" style={{ marginLeft: '4px' }} />
        <div className="skeleton-item skel-name shimmer" style={{ marginLeft: '4px' }} />
        {showTeam && <div className="skeleton-item skel-team shimmer" style={{ marginLeft: '4px' }} />}
        <div className="skeleton-item skel-bar shimmer" style={{ marginLeft: 'auto' }} />
        <div className="skeleton-item skel-pts shimmer" style={{ marginLeft: '8px' }} />
    </div>
);

export default function StandingsSkeleton({ type }: { type: 'drivers' | 'constructors' }) {
    return (
        <div className="stagger">
            {Array.from({ length: 10 }).map((_, i) => (
                <StandingSkeletonRow key={i} showTeam={type === 'drivers'} />
            ))}
        </div>
    );
}
