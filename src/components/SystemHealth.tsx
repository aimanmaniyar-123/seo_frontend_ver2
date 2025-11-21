import { useEffect, useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface HealthData {
  health_status: string;
  total_agents: number;
  successful_agents: number;
  failed_agents: number;
  success_percentage: number;
}

export function SystemHealth({ refreshTrigger }: { refreshTrigger: number }) {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, [refreshTrigger]);

  const fetchHealth = async () => {
    try {
      const data = await apiFetch<HealthData>('/health');
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !health) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'text-green-600 bg-green-50';
      case 'GOOD': return 'text-blue-600 bg-blue-50';
      case 'FAIR': return 'text-yellow-600 bg-yellow-50';
      case 'POOR': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return <CheckCircle className="size-6 text-green-600" />;
      case 'GOOD': return <Activity className="size-6 text-blue-600" />;
      case 'FAIR': return <AlertTriangle className="size-6 text-yellow-600" />;
      case 'POOR': return <XCircle className="size-6 text-red-600" />;
      default: return <Activity className="size-6 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getHealthIcon(health.health_status)}
          <div>
            <h2 className="text-slate-900">System Health</h2>
            <div className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getHealthColor(health.health_status)}`}>
              {health.health_status}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-slate-600 text-sm">Total Agents</div>
          <div className="text-slate-900 text-2xl mt-1">{health.total_agents}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm">Successful</div>
          <div className="text-green-900 text-2xl mt-1">{health.successful_agents}</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-red-600 text-sm">Failed</div>
          <div className="text-red-900 text-2xl mt-1">{health.failed_agents}</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm">Success Rate</div>
          <div className="text-blue-900 text-2xl mt-1">
            {(health?.success_percentage ?? 0).toFixed(1)}%
          </div>
        </div>

      </div>
    </div>
  );
}
