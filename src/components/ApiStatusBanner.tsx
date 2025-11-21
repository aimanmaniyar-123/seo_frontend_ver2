import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { USE_MOCK_DATA } from '../lib/api';

export function ApiStatusBanner() {
  return (
    <div className={`rounded-lg p-4 mb-6 flex items-start gap-3 ${
      USE_MOCK_DATA 
        ? 'bg-amber-50 border border-amber-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      {USE_MOCK_DATA ? (
        <WifiOff className="size-5 text-amber-600 mt-0.5" />
      ) : (
        <Wifi className="size-5 text-green-600 mt-0.5" />
      )}
      <div className="flex-1">
        <div className={USE_MOCK_DATA ? 'text-amber-900' : 'text-green-900'}>
          {USE_MOCK_DATA ? 'Demo Mode - Using Mock Data' : 'Connected to Live API'}
        </div>
        <p className={`text-sm mt-1 ${USE_MOCK_DATA ? 'text-amber-700' : 'text-green-700'}`}>
          {USE_MOCK_DATA 
            ? 'The UI is currently displaying mock data. To connect to your FastAPI backend, set VITE_USE_MOCK_DATA=false and configure VITE_API_BASE_URL in your environment.'
            : 'Successfully connected to your backend API.'
          }
        </p>
      </div>
    </div>
  );
}
