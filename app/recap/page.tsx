'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { teamColor } from '@/lib/constants';
import { TRACKS } from '@/data/tracks';
import { SEASON_2026, completedRaces } from '@/lib/season2026';
import './recap.css';

/* ── HELPERS ── */
function getTrackKey(raceName: string): string {
  const n = raceName.toLowerCase();
  if (n.includes('italian')) return 'monza';
  if (n.includes('japanese')) return 'suzuka';
  if (n.includes('chinese')) return 'china';
  if (n.includes('australian')) return 'australia';
  if (n.includes('british')) return 'silverstone';
  if (n.includes('monaco')) return 'monaco';
  if (n.includes('bahrain')) return 'bahrain';
  if (n.includes('belgian')) return 'spa';
  if (n.includes('dutch')) return 'zandvoort';
  if (n.includes('brazilian')) return 'interlagos';
  return '';
}

/* ── COMPONENTS ── */

const SCROLL_THRESHOLD = 0.5;

function RaceSection({ 
    race, 
    index, 
    onVisible 
}: { 
    race: any; 
    index: number; 
    onVisible: (idx: number, color: string) => void 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: SCROLL_THRESHOLD });
  const color = race.winner ? teamColor(race.winner.team.toLowerCase().replace(/\s+/g, '_')) : '#27F4D2';

  useEffect(() => {
    if (isInView) {
      onVisible(index, color);
    }
  }, [isInView, index, color, onVisible]);

  const trackKey = getTrackKey(race.name);
  const trackData = trackKey ? TRACKS[trackKey] : null;

  const pathData = useMemo(() => {
    if (!trackData) return '';
    const points = trackData.segments.flatMap(s => s.pts);
    if (points.length === 0) return '';
    return `M ${points[0][0]} ${points[0][1]} ${points.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' ')} Z`;
  }, [trackData]);

  return (
    <section id={`race-${race.round}`} ref={ref} className="race-section" style={{ opacity: isInView ? 1 : 0.3, transition: 'opacity 0.6s ease' }}>
      {pathData && (
        <svg className="race-bg-outline" viewBox="0 0 900 520">
          <motion.path 
            d={pathData} 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.15 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      )}

      <motion.div 
        className="race-content"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="race-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="round-num">Round {race.round}</span>
            {race.sprint && <span className="tag tag-sprint" style={{ background: 'var(--lp-orange)', color: '#000', fontWeight: 800, fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>SPRINT</span>}
          </div>
          <h2 className="race-title">{race.name} {race.flag}</h2>
          <div className="race-location">
            <span>{race.circuit}, {race.country}</span>
          </div>
        </div>

        <div className="recap-cards-grid">
          {race.winner && (
            <motion.div 
              className="card winner-card-recap" 
              style={{ color }}
              initial={{ x: 100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="win-label">Race Winner</span>
              <h3 className="win-name">{race.winner.driver}</h3>
              <p className="win-team">{race.winner.team}</p>
              <div className="win-time">{race.winner.time}</div>
            </motion.div>
          )}

          <div className="podium-wrap">
            <div className="podium-list">
              {(race.podium || []).map((result: any, i: number) => (
                <motion.div 
                  key={result.driver}
                  className="card podium-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                >
                  <span className="pod-pos">{result.pos}</span>
                  <div className="tdot" style={{ background: teamColor(result.team.toLowerCase().replace(/\s+/g, '_')) }} />
                  <span style={{ fontWeight: 600 }}>{result.driver.split(' ').pop()}</span>
                </motion.div>
              ))}
            </div>

            {race.fastestLap && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8 }}
                style={{ marginTop: '24px' }}
              >
                <div className="tag tag-fl">Fastest Lap</div>
                <p className="fl-info">
                  {race.fastestLap.driver} — {race.fastestLap.time}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function SeasonRecap() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeColor, setActiveColor] = useState('#27F4D2');

  const handleVisible = useCallback((idx: number, color: string) => {
    setActiveIdx(idx);
    setActiveColor(color);
  }, []);

  return (
    <div className="recap-root pane-in">
      <aside className="timeline-sidebar">
        <div className="timeline-line" />
        <div className="timeline-dots">
          {SEASON_2026.races.map((r, i) => {
            const isCompleted = r.completed;
            const isCurrent = i === activeIdx;
            const dotColor = isCompleted 
                ? teamColor(r.winner!.team.toLowerCase().replace(/\s+/g, '_'))
                : undefined;

            return (
              <div 
                key={r.round} 
                className={`timeline-dot ${isCurrent ? 'active' : ''} ${!isCompleted ? 'upcoming' : ''}`}
                style={{ 
                  color: isCurrent ? activeColor : dotColor,
                  background: isCurrent ? 'currentColor' : undefined
                }}
                onClick={() => {
                  if (isCompleted) {
                    document.getElementById(`race-${r.round}`)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            );
          })}
        </div>
      </aside>

      <main className="recap-main">
        {completedRaces.map((race, i) => (
          <RaceSection 
              key={race.round}
              race={race} 
              index={i} 
              onVisible={handleVisible} 
          />
        ))}
      </main>
    </div>
  );
}
