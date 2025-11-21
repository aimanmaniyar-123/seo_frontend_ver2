import { Link, Search } from 'lucide-react';

interface URLInputProps {
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
}

export function URLInput({ currentUrl, setCurrentUrl }: URLInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Link className="size-5 text-blue-600" />
        <h3 className="text-slate-900">Target URL</h3>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setCurrentUrl('')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
      {currentUrl && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <CheckCircle className="size-4 text-green-600" />
          <span>URL configured for agent operations</span>
        </div>
      )}
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
