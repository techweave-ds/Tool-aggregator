import { memo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { getAllTools } from '@/utils/tools';
import { getRelationships } from '@/utils/relationships';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

const ToolConstellation = memo(function ToolConstellation({ onClose }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const navigate = useNavigate();

  const handleNodeClick = useCallback((id) => {
    navigate(`/tool/${id}`);
    if (onClose) onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = containerRef.current.offsetWidth;
    const h = Math.min(600, w * 0.6);
    const allTools = getAllTools();

    // Build nodes and edges
    const nodes = allTools.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      color: CAT_COLORS[t.category] || '#6366f1',
      status: t.status,
      radius: t.status === 'Production' ? 6 : t.status === 'Beta' ? 5 : 4,
    }));

    const edges = [];
    allTools.forEach(t => {
      const rel = getRelationships(t.id);
      rel.complements.forEach(target => {
        if (nodes.find(n => n.id === target)) {
          edges.push({ source: t.id, target, type: 'complement' });
        }
      });
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', w).attr('height', h);

    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);

    const g = svg.append('g');

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 8));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', 'rgba(99,102,241,0.15)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.4);

    // Nodes group
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Circles
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', d => d.color + '40')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'r 0.2s')
      .on('mouseenter', function() { d3.select(this).attr('r', d => d.radius + 3); })
      .on('mouseleave', function() { d3.select(this).attr('r', d => d.radius); })
      .on('click', (event, d) => handleNodeClick(d.id));

    // Glow rings for production nodes
    node.filter(d => d.status === 'Production')
      .append('circle')
      .attr('r', d => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', d => d.color + '30')
      .attr('stroke-width', 1)
      .style('pointer-events', 'none');

    // Labels
    node.append('text')
      .text(d => d.name.length > 14 ? d.name.slice(0, 12) + '…' : d.name)
      .attr('x', 0)
      .attr('y', d => d.radius + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', 9)
      .attr('font-family', 'JetBrains Mono, monospace')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Category legend
    const legend = svg.append('g')
      .attr('transform', `translate(16, ${h - 100})`);

    const cats = Object.entries(CAT_COLORS);
    cats.forEach(([name, color], i) => {
      const ly = i * 18;
      legend.append('circle').attr('cx', 0).attr('cy', ly).attr('r', 3).attr('fill', color);
      legend.append('text')
        .attr('x', 10).attr('y', ly + 4)
        .text(name)
        .attr('fill', '#94a3b8')
        .attr('font-size', 9)
        .attr('font-family', 'JetBrains Mono, monospace');
    });

    return () => { simulation.stop(); };
  }, [handleNodeClick]);

  return (
    <div ref={containerRef} className="w-full rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
});

export default ToolConstellation;
