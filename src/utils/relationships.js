const RELATIONSHIPS = {
  'crypto-alert-bot': {
    complements: ['orb-scanner', 'position-size-calculator', 'trading-journal'],
    alternatives: ['orb-scanner'],
    workflow: ['position-size-calculator', 'trading-journal']
  },
  'orb-scanner': {
    complements: ['crypto-alert-bot', 'position-size-calculator'],
    alternatives: ['crypto-alert-bot'],
    workflow: ['crypto-alert-bot', 'position-size-calculator']
  },
  'position-size-calculator': {
    complements: ['crypto-alert-bot', 'orb-scanner', 'trading-journal'],
    alternatives: [],
    workflow: ['crypto-alert-bot', 'orb-scanner', 'trading-journal']
  },
  'trading-journal': {
    complements: ['crypto-alert-bot', 'position-size-calculator'],
    alternatives: [],
    workflow: ['crypto-alert-bot', 'orb-scanner']
  },
  'rag-playground': {
    complements: ['knowledgos', 'prompt-generator'],
    alternatives: ['knowledgos'],
    workflow: ['prompt-generator', 'knowledgos']
  },
  'prompt-generator': {
    complements: ['rag-playground', 'ai-chat-dashboard'],
    alternatives: ['ai-chat-dashboard'],
    workflow: ['rag-playground', 'ai-chat-dashboard']
  },
  'ai-chat-dashboard': {
    complements: ['prompt-generator', 'knowledgos'],
    alternatives: ['prompt-generator'],
    workflow: ['prompt-generator', 'knowledgos']
  },
  'image-gen-studio': {
    complements: ['prompt-generator'],
    alternatives: [],
    workflow: ['prompt-generator']
  },
  'knowledgos': {
    complements: ['rag-playground', 'supportweave', 'leadlaunch'],
    alternatives: ['rag-playground'],
    workflow: ['rag-playground', 'supportweave']
  },
  'supportweave': {
    complements: ['knowledgos', 'leadlaunch', 'social-scheduler'],
    alternatives: [],
    workflow: ['leadlaunch', 'knowledgos']
  },
  'leadlaunch': {
    complements: ['supportweave', 'social-scheduler', 'knowledgos'],
    alternatives: [],
    workflow: ['supportweave', 'social-scheduler']
  },
  'qr-generator': {
    complements: ['qr-ordering-system'],
    alternatives: ['qr-studio-pro'],
    workflow: ['qr-ordering-system']
  },
  'qr-studio-pro': {
    complements: ['qr-ordering-system'],
    alternatives: ['qr-generator'],
    workflow: ['qr-ordering-system']
  },
  'pageforge': {
    complements: ['3d-print-pro'],
    alternatives: [],
    workflow: ['3d-print-pro']
  },
  '3dforge-hub': {
    complements: ['3d-print-pro'],
    alternatives: [],
    workflow: ['3d-print-pro']
  },
  '3d-print-pro': {
    complements: ['pageforge', '3dforge-hub'],
    alternatives: [],
    workflow: ['pageforge']
  },
  'profitcalci': {
    complements: ['leadlaunch', 'social-scheduler'],
    alternatives: [],
    workflow: ['leadlaunch', 'social-scheduler']
  },
  'nutriplan-ai': {
    complements: [],
    alternatives: [],
    workflow: []
  },
  'commitkit': {
    complements: ['ci-cd-pipeline', 'deployment-bot'],
    alternatives: [],
    workflow: ['ci-cd-pipeline', 'deployment-bot']
  },
  'adprompt': {
    complements: ['social-scheduler'],
    alternatives: [],
    workflow: ['social-scheduler']
  },
  'qr-ordering-system': {
    complements: ['menu-builder', 'reservation-system'],
    alternatives: [],
    workflow: ['menu-builder', 'reservation-system']
  },
  'reservation-system': {
    complements: ['qr-ordering-system', 'menu-builder'],
    alternatives: [],
    workflow: ['qr-ordering-system', 'menu-builder']
  },
  'menu-builder': {
    complements: ['qr-ordering-system', 'reservation-system'],
    alternatives: [],
    workflow: ['qr-ordering-system', 'reservation-system']
  },
  'ci-cd-pipeline': {
    complements: ['deployment-bot', 'commitkit'],
    alternatives: [],
    workflow: ['commitkit', 'deployment-bot']
  },
  'api-tester': {
    complements: ['ci-cd-pipeline'],
    alternatives: [],
    workflow: ['ci-cd-pipeline']
  },
  'code-snippet-manager': {
    complements: ['commitkit'],
    alternatives: [],
    workflow: ['commitkit']
  },
  'deployment-bot': {
    complements: ['ci-cd-pipeline', 'backup-automator'],
    alternatives: [],
    workflow: ['ci-cd-pipeline', 'backup-automator']
  },
  'social-scheduler': {
    complements: ['leadlaunch', 'adprompt'],
    alternatives: [],
    workflow: ['leadlaunch', 'adprompt']
  },
  'backup-automator': {
    complements: ['deployment-bot'],
    alternatives: [],
    workflow: ['deployment-bot']
  },
  'json-formatter': {
    complements: ['api-tester'],
    alternatives: [],
    workflow: ['api-tester']
  },
  'password-manager': {
    complements: [],
    alternatives: [],
    workflow: []
  },
  'color-palette': {
    complements: [],
    alternatives: [],
    workflow: []
  },
  'old-project-alpha': {
    complements: [],
    alternatives: [],
    workflow: []
  }
};

export function getRelationships(toolId) {
  return RELATIONSHIPS[toolId] || { complements: [], alternatives: [], workflow: [] };
}

export function getComplementaryTools(toolId, allTools) {
  const rel = getRelationships(toolId);
  return allTools.filter(t => rel.complements.includes(t.id));
}

export function getAlternativeTools(toolId, allTools) {
  const rel = getRelationships(toolId);
  return allTools.filter(t => rel.alternatives.includes(t.id));
}

export function getWorkflowPartners(toolId, allTools) {
  const rel = getRelationships(toolId);
  return allTools.filter(t => rel.workflow.includes(t.id));
}

export function getAllEdges(allTools) {
  const edges = [];
  allTools.forEach(tool => {
    const rel = RELATIONSHIPS[tool.id];
    if (rel) {
      rel.complements.forEach(target => {
        edges.push({ source: tool.id, target, type: 'complement' });
      });
    }
  });
  return edges;
}

export default RELATIONSHIPS;
