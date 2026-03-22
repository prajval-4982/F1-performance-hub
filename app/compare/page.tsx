'use client';

import { RADAR_TEAMS, ATTR_LABELS, CAR_DIFFS } from '@/data/radar';
import Link from 'next/link';
import D3RadarChart from '@/components/compare/D3RadarChart';

export default function ComparePage() {
    return (
        <section aria-label="Car Comparison" className="pane-in">
            <div className="sub-bar">
                <span className="pill-btn active">Car Comparison</span>
                <Link href="/compare/drivers" className="pill-btn">Driver H2H</Link>
            </div>
            <div className="grid-2col">
                <div className="col-main">
                    <div className="card">
                        <p className="sec-label">Car attribute radar — estimated from 2026 race data</p>
                        <D3RadarChart />
                        <div className="radar-legend">
                            {RADAR_TEAMS.map(t => (
                                <div key={t.name} className="rleg-item">
                                    <div className="rleg-line" style={{ background: t.color }} />
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-side">
                    <div className="card">
                        <p className="sec-label">Attribute breakdown</p>
                        <AttrBars />
                    </div>
                </div>
            </div>
            <div className="card" style={{ marginTop: '14px' }}>
                <p className="sec-label">Key differentiators — 2026 cars</p>
                <div className="diff-grid">
                    {CAR_DIFFS.map(c => (
                        <div key={c.name} className="diff-card" style={{ borderLeftColor: c.color }}>
                            <p className="diff-title" style={{ color: c.color }}>{c.name}</p>
                            <p className="diff-note">{c.note}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AttrBars() {
    return (
        <>
            {ATTR_LABELS.map((label, ai) => (
                <div key={label} className="attr-block">
                    <div className="attr-label">{label}</div>
                    {RADAR_TEAMS.map(t => (
                        <div key={t.name} className="attr-row">
                            <span className="attr-name">{t.name}</span>
                            <div className="attr-wrap">
                                <div
                                    className="attr-fill"
                                    style={{ width: `${t.attrs[ai]}%`, background: t.color }}
                                />
                            </div>
                            <span className="attr-val" style={{ color: t.color }}>
                                {t.attrs[ai]}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}
