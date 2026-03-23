'use client';

import React, { useEffect, useRef, useState } from 'react';
import type p5 from 'p5';
import { type TrackData } from '@/data/tracks';
import { TEAMS_LIST } from '@/lib/constants';

interface SpeedTrailArtProps {
  track: TrackData;
}

const SpeedTrailArt: React.FC<SpeedTrailArtProps> = ({ track }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.2);
  const [visibleTeams, setVisibleTeams] = useState<Record<string, boolean>>(
    TEAMS_LIST.reduce((acc, t) => ({ ...acc, [t.id]: true }), {})
  );

  // Sync state to ref for p5 access without re-setup
  const configRef = useRef({
    visibleTeams,
    speedMultiplier,
    track
  });

  useEffect(() => {
    configRef.current = { visibleTeams, speedMultiplier, track };
  }, [visibleTeams, speedMultiplier, track]);

  useEffect(() => {
    let p5Module: any;

    const initP5 = async () => {
      if (p5InstanceRef.current) return;
      
      const p5Import = await import('p5');
      p5Module = p5Import.default;

      if (!containerRef.current) return;

      const sketch = (p: p5) => {
        let teamTrails: TeamTrail[] = [];

        class Particle {
          x: number;
          y: number;
          baseY: number;
          amplitude: number;
          frequency: number;
          phase: number;
          trail: { x: number; y: number }[] = [];
          teamId: string;
          color: string;
          size: number;

          constructor(teamId: string, color: string) {
            this.teamId = teamId;
            this.color = color;
            this.x = p.random(0, p.width);
            this.y = p.random(p.height * 0.2, p.height * 0.8);
            this.baseY = this.y;
            this.amplitude = p.random(30, 70);
            this.frequency = p.random(0.008, 0.012);
            this.phase = p.random(p.TWO_PI);
            this.size = p.random(3, 6);
          }

          update() {
            const { track, speedMultiplier, visibleTeams } = configRef.current;
            if (!visibleTeams[this.teamId]) return;

            // Compute avg speed for the team on the current track
            let totalSpeed = 0;
            let count = 0;
            for (const seg of track.segments) {
              if (seg.speeds[this.teamId]) {
                totalSpeed += seg.speeds[this.teamId];
                count++;
              }
            }
            const teamAvgSpeed = count > 0 ? totalSpeed / count : 250;
            const speed = p.map(teamAvgSpeed, 200, 350, 1.5, 4);

            // 1. Update position
            this.x += speed * speedMultiplier;
            this.y = this.baseY + p.sin(this.x * this.frequency + this.phase) * this.amplitude;

            // Hover repulsion
            const d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
            if (d < 80) {
              const force = (80 - d) * 0.06;
              const angle = p.atan2(this.y - p.mouseY, this.x - p.mouseX);
              this.x += p.cos(angle) * force;
              this.y += p.sin(angle) * force;
            }

            // 2. Add current position to trail array
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 25) {
              this.trail.shift();
            }

            // 3. Wrap around
            if (this.x > p.width + 50) {
              this.x = -50;
              this.trail = [];
            }
          }

          display() {
            const { visibleTeams } = configRef.current;
            if (!visibleTeams[this.teamId] || this.trail.length === 0) return;

            p.noFill();
            // 4. Draw the trail
            for (let i = 0; i < this.trail.length; i++) {
              const alpha = p.map(i, 0, this.trail.length, 0, 255);
              const weight = p.map(i, 0, this.trail.length, 0.5, 4);
              const c = p.color(this.color);
              p.stroke(p.red(c), p.green(c), p.blue(c), alpha);
              p.strokeWeight(weight);
              if (i > 0) {
                p.line(this.trail[i - 1].x, this.trail[i - 1].y, this.trail[i].x, this.trail[i].y);
              }
            }

            // 5. Draw head dot
            p.fill(this.color);
            p.noStroke();
            p.circle(this.x, this.y, this.size);
          }
        }

        class TeamTrail {
          teamId: string;
          color: string;
          particles: Particle[] = [];

          constructor(teamId: string, color: string) {
            this.teamId = teamId;
            this.color = color;
            for (let i = 0; i < 10; i++) {
              this.particles.push(new Particle(teamId, color));
            }
          }

          update() {
            this.particles.forEach(pt => pt.update());
          }

          display() {
            this.particles.forEach(pt => pt.display());
          }
        }

        p.setup = () => {
          const w = containerRef.current?.clientWidth || 800;
          const h = 300;
          const canvas = p.createCanvas(w, h);
          canvas.parent(containerRef.current!);
          
          TEAMS_LIST.forEach(team => {
            teamTrails.push(new TeamTrail(team.id, team.color));
          });
          
          p.background(10, 10, 10);
        };

        p.draw = () => {
          // Semi-transparent background for motion blur ghost effect
          p.background(10, 10, 10, 25);
          
          teamTrails.forEach(trail => {
            trail.update();
            trail.display();
          });
        };

        p.windowResized = () => {
          const w = containerRef.current?.clientWidth || 800;
          p.resizeCanvas(w, 300);
          p.background(10, 10, 10);
        };
      };

      p5InstanceRef.current = new p5Module(sketch);
    };

    initP5();

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array for single init

  const toggleTeam = (id: string) => {
    setVisibleTeams(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="speed-signature-art card" style={{ padding: '24px', background: '#0a0a0a', border: '1px solid #1e1e3e' }}>
      <div style={{ marginBottom: '20px' }}>
        <p className="sec-label" style={{ margin: 0, background: 'none', border: 'none', padding: 0 }}>Speed Signature</p>
        <p className="sub-label">Generative visualization of telemetry data flow.</p>
      </div>
      
      <div ref={containerRef} style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e1e3e', background: '#0a0a0a' }}>
        {/* p5 canvas will be injected here */}
      </div>

      <div className="art-controls" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TEAMS_LIST.map(team => (
            <button
              key={team.id}
              onClick={() => toggleTeam(team.id)}
              style={{
                background: visibleTeams[team.id] ? team.color : 'transparent',
                color: visibleTeams[team.id] ? '#000' : team.color,
                border: `1px solid ${team.color}`,
                padding: '6px 12px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '4px',
                opacity: visibleTeams[team.id] ? 1 : 0.4,
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {team.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="sub-label" style={{ fontSize: '11px', color: '#9898c8' }}>INTENSITY:</span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            style={{ width: '160px', accentColor: '#e10600' }}
          />
          <span style={{ fontSize: '11px', color: '#9898c8', width: '30px', fontWeight: 700 }}>{speedMultiplier.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};

export default SpeedTrailArt;
