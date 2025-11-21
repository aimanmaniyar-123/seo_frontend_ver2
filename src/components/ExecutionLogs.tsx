import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface LogEntry {
  agent: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export function ExecutionLogs({ refreshTrigger }: { refreshTrigger: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page, refreshTrigger]);

  const fetchLogs = async () => {
    try {
      const offset = page * limit;
      const data = await apiFetch<any>(`/execution_log?limit=${limit}&offset=${offset}`);
      setLogs(data.logs);
      setTotal(data.total_entries);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Execution Logs</h2>
          <p className="text-slate-600 text-sm mt-1">Total entries: {total}</p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No execution logs available
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  log.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {log.success ? (
                    <CheckCircle className="size-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="size-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900">{log.agent}</span>
                      <span className="text-slate-500 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mt-1">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>
              <span className="text-slate-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}