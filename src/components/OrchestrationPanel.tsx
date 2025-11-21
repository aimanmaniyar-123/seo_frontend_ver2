import { useState } from 'react';
import { Play, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface OrchestrationPanelProps {
  currentUrl: string;
  onRefresh: () => void;
  refreshTrigger: number;
}

export function OrchestrationPanel({ currentUrl, onRefresh }: OrchestrationPanelProps) {
  const [executing, setExecuting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [triggerAllResult, setTriggerAllResult] = useState<any>(null);

  const runOrchestration = async () => {
    setExecuting(true);
    try {
      const body = currentUrl ? { url: currentUrl } : {};
      const data = await apiFetch<any>('/seo_orchestration_core', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data && data.result) {
        setOrchestrationResult(data.result);
        toast.success('SEO Orchestration completed successfully');
        onRefresh();
      } else {
        toast.error('Failed to run orchestration');
      }
    } catch (error) {
      console.error('Failed to run orchestration:', error);
      toast.error('Failed to run orchestration');
    } finally {
      setExecuting(false);
    }
  };

  const triggerAllAgents = async () => {
    setExecuting(true);
    try {
      const data = await apiFetch<any>('/trigger_all_agents?retry_failed=true&max_retries=3', {
        method: 'POST'
      });

      if (data) {
        setTriggerAllResult(data);
        toast.success(`Executed ${data.successful} agents successfully`);
        onRefresh();
      } else {
        toast.error('Failed to trigger all agents');
      }
    } catch (error) {
      console.error('Failed to trigger all agents:', error);
      toast.error('Failed to trigger all agents');
    } finally {
      setExecuting(false);
    }
  };

  const resetAgents = async () => {
    setResetting(true);
    try {
      const data = await apiFetch<any>('/reset_agents', {
        method: 'POST'
      });

      if (data) {
        toast.success('All agents have been reset');
        setOrchestrationResult(null);
        setTriggerAllResult(null);
        onRefresh();
      } else {
        toast.error('Failed to reset agents');
      }
    } catch (error) {
      console.error('Failed to reset agents:', error);
      toast.error('Failed to reset agents');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-white mb-4">Orchestration Control Center</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={runOrchestration}
            disabled={executing}
            className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {executing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="size-5" />
                Run SEO Orchestration
              </>
            )}
          </button>

          <button
            onClick={triggerAllAgents}
            disabled={executing}
            className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {executing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="size-5" />
                Trigger All Agents
              </>
            )}
          </button>

          <button
            onClick={resetAgents}
            disabled={resetting}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {resetting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <RotateCcw className="size-5" />
                Reset All Agents
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning if no URL */}
      {!currentUrl && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-yellow-600 mt-0.5" />
          <div>
            <div className="text-yellow-900">No URL configured</div>
            <p className="text-yellow-700 text-sm mt-1">
              Enter a target URL above to enable URL-based orchestration features
            </p>
          </div>
        </div>
      )}

      {/* Orchestration Result */}
      {orchestrationResult && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-slate-900 mb-4">Orchestration Plan</h3>
          
          {orchestrationResult.source_url && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-sm">Target URL</div>
              <div className="text-blue-900 mt-1">{orchestrationResult.source_url}</div>
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(orchestrationResult.orchestration_plan).map(([key, phase]: [string, any]) => {
              if (key === 'url' || key === 'domain') return null;
              
              return (
                <div key={key} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-slate-900">{key.replace(/_/g, ' ').toUpperCase()}</h4>
                    <span className="text-slate-600 text-sm">{phase.estimated_duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.agents.map((agent: string) => (
                      <span
                        key={agent}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                  {phase.dependencies.length > 0 && (
                    <div className="mt-2 text-slate-600 text-sm">
                      Dependencies: {phase.dependencies.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {orchestrationResult.recommendations && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="text-green-900 mb-2">Recommendations</div>
              <ul className="space-y-1">
                {orchestrationResult.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-green-700 text-sm">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Trigger All Result */}
      {triggerAllResult && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-slate-900 mb-4">Execution Results</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-slate-600 text-sm">Total Agents</div>
              <div className="text-slate-900 text-2xl mt-1">{triggerAllResult.total_agents}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 text-sm">Successful</div>
              <div className="text-green-900 text-2xl mt-1">{triggerAllResult.successful}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-red-600 text-sm">Failed</div>
              <div className="text-red-900 text-2xl mt-1">{triggerAllResult.failed}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 text-sm">Success Rate</div>
              <div className="text-blue-900 text-2xl mt-1">{triggerAllResult.success_rate.toFixed(1)}%</div>
            </div>
          </div>

          <div className="space-y-2">
            {triggerAllResult.results.map((result: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={result.success ? 'text-green-900' : 'text-red-900'}>
                    {result.agent}
                  </span>
                  <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Success' : `Failed (${result.retries} retries)`}
                  </span>
                </div>
                {result.error && (
                  <div className="text-red-700 text-sm mt-1">{result.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}