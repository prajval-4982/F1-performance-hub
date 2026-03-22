'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RADAR_TEAMS, ATTR_LABELS } from '@/data/radar';

export default function D3RadarChart() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const container = d3.select(svgRef.current);
        const width = 300;
        const height = 280;
        const cx = width / 2;
        const cy = height / 2 + 8; // Offset to match original design
        const radius = 90;
        const levels = 5;
        const numAttrs = ATTR_LABELS.length;

        // Clear previous render for HMR
        container.selectAll('*').remove();

        const svg = container
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('class', 'radar-svg');

        const g = svg.append('g');
        const angleSlice = (Math.PI * 2) / numAttrs;
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);

        // Draw Grid
        const gridGroup = g.append('g').attr('class', 'grid');
        for (let j = 0; j < levels; j++) {
            const levelFactor = radius * ((j + 1) / levels);
            gridGroup
                .append('polygon')
                .attr('points', ATTR_LABELS.map((_, i) => {
                    const angle = angleSlice * i - Math.PI / 2;
                    return `${cx + levelFactor * Math.cos(angle)},${cy + levelFactor * Math.sin(angle)}`;
                }).join(' '))
                .attr('fill', 'none')
                .attr('stroke', '#1e1e38')
                .attr('stroke-width', '0.5');
        }

        // Draw Axes and Labels
        const axisGroup = g.append('g').attr('class', 'axes');
        const axes = axisGroup.selectAll('.axis')
            .data(ATTR_LABELS)
            .enter()
            .append('g')
            .attr('class', 'axis');

        axes.append('line')
            .attr('x1', cx)
            .attr('y1', cy)
            .attr('x2', (d, i) => cx + rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => cy + rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr('stroke', '#1e1e38')
            .attr('stroke-width', '0.5');

        axes.append('text')
            .attr('class', 'legend')
            .style('font-size', '8.5px')
            .style('font-family', 'Rajdhani, sans-serif')
            .attr('fill', '#2a2a4a')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('x', (d, i) => cx + rScale(100) * 1.15 * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (d, i) => cy + rScale(100) * 1.15 * Math.sin(angleSlice * i - Math.PI / 2) + 4)
            .text(d => d);

        const radarLine = d3.lineRadial<number>()
            .angle((d, i) => i * angleSlice)
            .radius(d => rScale(d))
            .curve(d3.curveLinearClosed);

        // Tooltip
        const tooltip = d3.select('body').selectAll('.d3-tooltip').data([0]).join('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'rgba(11, 11, 24, 0.95)')
            .style('border', '1px solid #1e1e38')
            .style('padding', '8px 12px')
            .style('border-radius', '6px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.5)');

        // Draw Teams
        const teamGroup = g.append('g').attr('class', 'teams');
        
        RADAR_TEAMS.forEach(team => {
            const teamG = teamGroup.append('g').attr('class', `team-${team.name.replace(/\\s+/g, '')}`);
            
            // Polygon
            const path = teamG.append('path')
                .datum(team.attrs)
                .attr('class', 'radar-area')
                .attr('d', radarLine(team.attrs.map(() => 0)))
                .attr('transform', `translate(${cx},${cy})`)
                .style('fill', team.color)
                .style('fill-opacity', 0.1)
                .style('stroke', team.color)
                .style('stroke-width', 1.5)
                .style('cursor', 'pointer');
            
            path.transition()
                .duration(1000)
                .ease(d3.easeCubicOut)
                .attr('d', radarLine(team.attrs));

            path.on('mouseover', function() {
                teamGroup.selectAll('.radar-area')
                    .transition().duration(200)
                    .style('fill-opacity', 0.05);
                d3.select(this)
                    .transition().duration(200)
                    .style('fill-opacity', 0.3)
                    .style('stroke-width', 2.5);
            })
            .on('mouseout', function() {
                teamGroup.selectAll('.radar-area')
                    .transition().duration(200)
                    .style('fill-opacity', 0.1)
                    .style('stroke-width', 1.5);
            });

            // Points
            const points = teamG.selectAll('.radar-point')
                .data(team.attrs)
                .enter()
                .append('circle')
                .attr('class', 'radar-point')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 0)
                .style('fill', '#0b0b18')
                .style('stroke', team.color)
                .style('stroke-width', 1.5)
                .style('cursor', 'crosshair');
                
            points.transition()
                .duration(1000)
                .delay((d, i) => i * 50)
                .ease(d3.easeCubicOut)
                .attr('cx', (d, i) => cx + rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
                .attr('cy', (d, i) => cy + rScale(d) * Math.sin(angleSlice * i - Math.PI / 2))
                .attr('r', 3);
            
            points.on('mouseover', function(event, d) {
                const attrIndex = team.attrs.indexOf(d);
                const attrName = ATTR_LABELS[attrIndex];
                
                d3.select(this)
                    .transition().duration(150)
                    .attr('r', 5)
                    .style('fill', team.color);

                tooltip
                    .html(`
                        <div style="color: ${team.color}; font-family: 'Orbitron', monospace; font-size: 13px; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.05em;">${team.name}</div>
                        <div style="color: #9494c7; font-size: 12px; font-family: 'Barlow', sans-serif;">
                            ${attrName}: <span style="color: #eeeef8; font-weight: 600;">${d}</span>
                        </div>
                    `)
                    .style('visibility', 'visible');
            })
            .on('mousemove', function(event) {
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition().duration(150)
                    .attr('r', 3)
                    .style('fill', '#0b0b18');

                tooltip.style('visibility', 'hidden');
            });
        });

        return () => {
            d3.select('body').selectAll('.d3-tooltip').remove();
        };
    }, []);

    return <svg ref={svgRef} className="radar-svg" viewBox="0 0 300 280" />;
}
