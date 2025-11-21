import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="size-8" />
            <div>
              <h1 className="text-white">SEO Micro-Agents Orchestration System</h1>
              <p className="text-blue-100 text-sm">Advanced Agent Management & Execution Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/30 px-4 py-2 rounded-lg">
              <span className="text-blue-100 text-sm">Version</span>
              <div className="text-white">v2.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}