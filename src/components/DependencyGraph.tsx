import { useEffect, useState } from 'react';
import { GitBranch, RefreshCw } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface DependencyInfo {
  dependencies: string[];
  dependents: string[];
}

interface DependencyData {
  dependency_graph: Record<string, DependencyInfo>;
  total_agents: number;
  agents_with_dependencies: number;
  agents_with_dependents: number;
}

export function DependencyGraph({ refreshTrigger }: { refreshTrigger: number }) {
  const [data, setData] = useState<DependencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDependencies();
  }, [refreshTrigger]);

  const fetchDependencies = async () => {
    try {
      const result = await apiFetch<DependencyData>('/agent_dependencies');
      setData(result);
    } catch (error) {
      console.error('Failed to fetch dependencies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GitBranch className="size-6 text-blue-600" />
          <div>
            <h2 className="text-slate-900">Agent Dependencies</h2>
            <p className="text-slate-600 text-sm mt-1">
              {data.agents_with_dependencies} agents have dependencies
            </p>
          </div>
        </div>
        <button
          onClick={fetchDependencies}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm">Total Agents</div>
          <div className="text-blue-900 text-2xl mt-1">{data.total_agents}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-purple-600 text-sm">With Dependencies</div>
          <div className="text-purple-900 text-2xl mt-1">{data.agents_with_dependencies}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm">With Dependents</div>
          <div className="text-green-900 text-2xl mt-1">{data.agents_with_dependents}</div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(data.dependency_graph).map(([agent, info]) => {
          const hasDeps = info.dependencies.length > 0;
          const hasDepents = info.dependents.length > 0;

          if (!hasDeps && !hasDepents) return null;

          return (
            <div
              key={agent}
              className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <h3 className="text-slate-900 mb-3">{agent}</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {hasDeps && (
                  <div>
                    <div className="text-slate-600 text-sm mb-2">Depends on:</div>
                    <div className="flex flex-wrap gap-2">
                      {info.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasDepents && (
                  <div>
                    <div className="text-slate-600 text-sm mb-2">Required by:</div>
                    <div className="flex flex-wrap gap-2">
                      {info.dependents.map((dep) => (
                        <span
                          key={dep}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}