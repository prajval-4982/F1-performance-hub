'use client';

import { type Segment } from '@/data/tracks';
import Image from 'next/image';
import TeamLogo from '@/components/common/TeamLogo';
import { TEAMS_LIST } from '@/lib/constants';

function fastest(seg: Segment): string {
    const entries = Object.entries(seg.speeds);
    if (!entries.length) return '';
    let maxTeam = entries[0][0];
    let maxSpeed = entries[0][1];
    for (const [team, speed] of entries) {
        if (speed > maxSpeed) {
            maxSpeed = speed;
            maxTeam = team;
        }
    }
    return maxTeam;
}

interface SegmentDetailProps {
    seg: Segment | null;
}

export default function SegmentDetail({ seg }: SegmentDetailProps) {
    if (!seg) {
        return (
            <div className="card" id="detail-card">
                <div className="empty-state">
                    <span className="empty-icon">🏁</span>
                    <p>Click a segment to compare team speeds</p>
                </div>
            </div>
        );
    }

    const fid = fastest(seg);
    const ft = TEAMS_LIST.find(t => t.id === fid)!;
    const maxS = Math.max(...TEAMS_LIST.map(t => seg.speeds[t.id]));
    const badgeCls = seg.type === 'straight' ? 'straight-tag' : 'corner-tag';

    return (
        <div className="card" id="detail-card">
            <div style={{ animation: 'slide-up 180ms ease both' }}>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '9px' }}>
                    <span className={`type-tag ${badgeCls}`}>{seg.type}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                        {seg.label}
                    </span>
                </div>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{seg.name}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-2)', marginBottom: '13px', lineHeight: 1.5 }}>
                    {seg.desc}
                </p>
                {TEAMS_LIST.map(t => {
                    const s = seg.speeds[t.id];
                    const isFast = t.id === fid;
                    const pct = Math.round((s / maxS) * 100);
                    return (
                        <div key={t.id} className="speed-section">
                            <div className="speed-header">
                                <span
                                    className="speed-label"
                                    style={{
                                        fontWeight: isFast ? 600 : 400,
                                        color: isFast ? 'var(--text-1)' : 'var(--text-2)',
                                    }}
                                >
                                    {isFast && (
                                        <span
                                            className="tag-fast"
                                            style={{
                                                background: ft.color,
                                                color: t.id === 'mclaren' ? '#000' : '#fff',
                                            }}
                                        >
                                            FASTEST
                                        </span>
                                    )}
                                    <div className="team-logo-detail" style={{ width: '32px', height: '20px', background: '#fff', borderRadius: '2px', overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                                        <TeamLogo
                                            src={t.logo}
                                            name={t.name}
                                            color={t.color}
                                        />
                                    </div>
                                    {t.name}
                                </span>
                                <span className="speed-val" style={{ color: t.color }}>{s}</span>
                            </div>
                            <div className="bar-wrap">
                                <div className="bar-fill" style={{ width: `${pct}%`, background: t.color }} />
                            </div>
                        </div>
                    );
                })}
                <p style={{ fontSize: '10px', color: 'var(--text-3)', textAlign: 'right', marginTop: '4px' }}>
                    ↑ km/h at this segment
                </p>
            </div>
        </div>
    );
}
