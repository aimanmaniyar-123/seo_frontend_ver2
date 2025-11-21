import { useState } from 'react';
import { Play, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface PhaseControlProps {
  currentUrl: string;
  onRefresh: () => void;
}

const phases = [
  {
    id: 'phase_1_foundation',
    name: 'Phase 1: Foundation',
    description: 'Robots.txt, Sitemap, Canonical Tags',
    agents: ['robots_txt_management', 'xml_sitemap_generator', 'canonical_tag_management'],
    color: 'blue',
    icon: '🏗️'
  },
  {
    id: 'phase_2_onpage',
    name: 'Phase 2: On-Page',
    description: 'Title Tags, Meta Descriptions, Headers',
    agents: ['title_tag_optimizer', 'meta_description_generator', 'header_tag_manager'],
    color: 'green',
    icon: '📝'
  },
  {
    id: 'phase_3_technical',
    name: 'Phase 3: Technical',
    description: 'Speed, Mobile, Schema Markup',
    agents: ['page_speed_analyzer', 'mobile_usability_tester', 'schema_markup_validator'],
    color: 'purple',
    icon: '⚙️'
  },
  {
    id: 'phase_4_content',
    name: 'Phase 4: Content',
    description: 'Quality, Keywords, Internal Links',
    agents: ['content_quality_depth', 'keyword_mapping', 'internal_links_agent'],
    color: 'orange',
    icon: '📄'
  },
  {
    id: 'phase_5_offpage',
    name: 'Phase 5: Off-Page',
    description: 'Backlinks, Social Signals, Mentions',
    agents: ['backlink_analyzer', 'social_signal_tracker', 'brand_mention_outreach'],
    color: 'pink',
    icon: '🔗'
  }
];

export function PhaseControl({ currentUrl, onRefresh }: PhaseControlProps) {
  const [executingPhase, setExecutingPhase] = useState<string | null>(null);
  const [phaseResults, setPhaseResults] = useState<Record<string, any>>({});

  const triggerPhase = async (phaseId: string) => {
    setExecutingPhase(phaseId);
    try {
      const body = currentUrl ? { url: currentUrl } : {};
      const data = await apiFetch<any>(`/trigger_phase/${phaseId}`, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data) {
        setPhaseResults(prev => ({ ...prev, [phaseId]: data }));
        toast.success(`${phaseId} completed successfully`);
        onRefresh();
      } else {
        toast.error(`Failed to execute ${phaseId}`);
      }
    } catch (error) {
      console.error('Failed to trigger phase:', error);
      toast.error('Failed to trigger phase');
    } finally {
      setExecutingPhase(null);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      pink: 'bg-pink-50 border-pink-200 text-pink-900'
    };
    return colors[color] || colors.blue;
  };

  const getButtonColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      pink: 'bg-pink-500 hover:bg-pink-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-4">
      {phases.map((phase) => {
        const isExecuting = executingPhase === phase.id;
        const result = phaseResults[phase.id];

        return (
          <div
            key={phase.id}
            className={`border rounded-lg p-6 ${getColorClasses(phase.color)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{phase.icon}</span>
                  <div>
                    <h3 className="text-slate-900">{phase.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{phase.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {phase.agents.map((agent) => (
                    <span
                      key={agent}
                      className="px-3 py-1 bg-white/50 rounded-full text-sm text-slate-700"
                    >
                      {agent}
                    </span>
                  ))}
                </div>

                {result && (
                  <div className="mt-4 p-4 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span className="text-slate-900">Execution Complete</span>
                    </div>
                    <div className="text-slate-600 text-sm">
                      Agents executed: {result.agents_executed}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => triggerPhase(phase.id)}
                disabled={isExecuting}
                className={`px-6 py-3 ${getButtonColor(phase.color)} text-white rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="size-5" />
                    Execute Phase
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}