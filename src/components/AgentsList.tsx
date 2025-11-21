import { useEffect, useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface Agent {
  name: string;
  dependencies: string[];
  status: string;
  last_run: string | null;
}

interface AgentsListProps {
  currentUrl: string;
  onRefresh: () => void;
  refreshTrigger: number;
}

export function AgentsList({ currentUrl, onRefresh, refreshTrigger }: AgentsListProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingAgent, setExecutingAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, [refreshTrigger]);

  const fetchAgents = async () => {
    try {
      const data = await apiFetch<any>('/agents');
      setAgents(data.agents);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const triggerAgent = async (agentName: string) => {
    setExecutingAgent(agentName);
    try {
      const body = currentUrl ? { url: currentUrl } : {};
      const data = await apiFetch<any>(`/trigger_agent/${agentName}`, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data) {
        toast.success(`Agent ${agentName} executed successfully`);
        onRefresh();
        await fetchAgents();
      } else {
        toast.error(`Failed to execute agent ${agentName}`);
      }
    } catch (error) {
      console.error('Failed to trigger agent:', error);
      toast.error('Failed to trigger agent');
    } finally {
      setExecutingAgent(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="size-5 text-green-600" />;
      case 'failed':
        return <XCircle className="size-5 text-red-600" />;
      default:
        return <Clock className="size-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-900">Registered Agents ({agents.length})</h2>
        <button
          onClick={fetchAgents}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <h3 className="text-slate-900">{agent.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      {agent.dependencies.length > 0 && (
                        <span className="text-slate-600 text-sm">
                          Depends on: {agent.dependencies.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {agent.last_run && (
                  <div className="text-slate-500 text-sm mt-2">
                    Last run: {new Date(agent.last_run).toLocaleString()}
                  </div>
                )}
              </div>
              <button
                onClick={() => triggerAgent(agent.name)}
                disabled={executingAgent === agent.name}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {executingAgent === agent.name ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="size-4" />
                    Execute
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}