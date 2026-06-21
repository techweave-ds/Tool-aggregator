import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Shuffle, Zap } from 'lucide-react';
import { getComplementaryTools, getAlternativeTools, getWorkflowPartners } from '@/utils/relationships';
import { getAllTools } from '@/utils/tools';
import { getIcon } from '@/utils/icons';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

function ToolChip({ tool, compact }) {
  const navigate = useNavigate();
  const c = CAT_COLORS[tool.category] || 'var(--accent)';
  const Icon = getIcon(tool.icon);

  return (
    <div
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:-translate-y-0.5"
      style={{ background: 'var(--card2)', border: '1px solid rgba(0,0,0,0.05)' }}
    >
      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: c + '18' }}>
        <Icon size={11} style={{ color: c }} />
      </div>
      <span className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{tool.name}</span>
      {!compact && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: c + '15', color: c }}>{tool.category}</span>}
    </div>
  );
}

export default function ToolRelationships({ toolId }) {
  const allTools = getAllTools();
  const complements = getComplementaryTools(toolId, allTools);
  const alternatives = getAlternativeTools(toolId, allTools);
  const workflow = getWorkflowPartners(toolId, allTools);

  const sections = [];

  if (workflow.length > 0) {
    sections.push({
      key: 'workflow',
      label: 'Used Together With',
      icon: Zap,
      tools: workflow,
      color: '#6366f1',
      desc: 'These tools are commonly used alongside this one in workflows.'
    });
  }

  if (complements.length > 0) {
    sections.push({
      key: 'complements',
      label: 'Complements',
      icon: GitBranch,
      tools: complements,
      color: '#8b5cf6',
      desc: 'Tools that enhance or extend this tool\'s capabilities.'
    });
  }

  if (alternatives.length > 0) {
    sections.push({
      key: 'alternatives',
      label: 'Alternatives',
      icon: Shuffle,
      tools: alternatives,
      color: '#f59e0b',
      desc: 'Similar tools that can serve a comparable purpose.'
    });
  }

  if (sections.length === 0) return null;

  return (
    <div className="space-y-5">
      {sections.map((section, si) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: si * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: section.color + '15' }}>
                <Icon size={12} style={{ color: section.color }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{section.label}</span>
              <span className="text-[10px] font-mono ml-auto" style={{ color: 'var(--text3)' }}>{section.tools.length} tools</span>
            </div>
            {section.desc && (
              <p className="text-xs mb-3" style={{ color: 'var(--text3)' }}>{section.desc}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {section.tools.map(tool => (
                <ToolChip key={tool.id} tool={tool} compact={section.tools.length > 4} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
