import { useState } from 'react';
import { MapPin, Building2, Star, FileCheck, Search, TrendingUp, Award, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface LocalSEOPanelProps {
  currentUrl?: string;
  onRefresh?: () => void;
}

export function LocalSEOPanel({ currentUrl, onRefresh }: LocalSEOPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Agent-specific inputs
  const [agentInputs, setAgentInputs] = useState<Record<string, any>>({
    gmb_manager: { url: '', name: '', address: '', phone: '', website: '' },
    business_profile_manager: { url: '', name: '', address: '', phone: '', website: '' },
    citation_builder: { url: '', name: '', address: '', phone: '' },
    citation_audit: { url: '', name: '', address: '', phone: '' },
    nap_consistency: { url: '', name: '', address: '', phone: '' },
    review_management: { url: '', reviews: '' },
    local_keyword_research: { url: '', location: '', business_type: '', services: '' },
    map_pack_tracker: { url: '', location: '', keywords: '', competitors: '' },
    competitor_benchmark: { url: '', name: '', competitors: '' }
  });

  const localAgents = [
  {
    id: 'gmb_manager',
    name: 'GMB Manager',
    icon: Building2,
    description: 'Manage Google Business Profile',
    color: 'bg-blue-500',
    endpoint: '/local_seo/gmb_manager',
    inputs: ['url', 'name', 'address', 'phone', 'website']
  },
  {
    id: 'business_profile_manager',
    name: 'Profile Manager',
    icon: FileCheck,
    description: 'Manage business profile attributes',
    color: 'bg-indigo-500',
    endpoint: '/local_seo/business_profile_manager',
    inputs: ['url', 'name', 'address', 'phone', 'website']
  },
  {
    id: 'citation_builder',
    name: 'Citation Builder',
    icon: MapPin,
    description: 'Build citations across directories',
    color: 'bg-green-500',
    endpoint: '/local_seo/citation_builder',
    inputs: ['url', 'name', 'address', 'phone']
  },
  {
    id: 'citation_audit',
    name: 'Citation Audit',
    icon: FileCheck,
    description: 'Audit citation consistency',
    color: 'bg-emerald-500',
    endpoint: '/local_seo/citation_creation_audit',
    inputs: ['url', 'name', 'address', 'phone']
  },
  {
    id: 'nap_consistency',
    name: 'NAP Consistency',
    icon: Award,
    description: 'Check Name, Address, Phone consistency',
    color: 'bg-yellow-500',
    endpoint: '/local_seo/nap_consistency',
    inputs: ['url', 'name', 'address', 'phone']
  },
  {
    id: 'review_management',
    name: 'Review Management',
    icon: Star,
    description: 'Manage and respond to reviews',
    color: 'bg-orange-500',
    endpoint: '/local_seo/review_management',
    inputs: ['url', 'reviews']
  },
  {
    id: 'local_keyword_research',
    name: 'Keyword Research',
    icon: Search,
    description: 'Discover local keywords',
    color: 'bg-purple-500',
    endpoint: '/local_seo/local_keyword_research',
    inputs: ['url', 'location', 'business_type', 'services']
  },
  {
    id: 'map_pack_tracker',
    name: 'Map Pack Tracker',
    icon: TrendingUp,
    description: 'Track map pack rankings',
    color: 'bg-pink-500',
    endpoint: '/local_seo/map_pack_rank_tracker',
    inputs: ['url', 'location', 'keywords', 'competitors']
  },
  {
    id: 'competitor_benchmark',
    name: 'Competitor Benchmark',
    icon: Award,
    description: 'Benchmark against competitors',
    color: 'bg-red-500',
    endpoint: '/local_seo/local_competitor_benchmark',
    inputs: ['url', 'name', 'competitors']
  }
];


  const updateAgentInput = (agentId: string, field: string, value: string) => {
    setAgentInputs(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [field]: value
      }
    }));
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
      setResult(null);
    } else {
      setSelectedAgent(agentId);
      setResult(null);
    }
  };

  const executeAgent = async (agent: typeof localAgents[0]) => {
    setExecuting(true);
    setResult(null);

    try {
      let requestBody: any = {};
      const inputs = agentInputs[agent.id];

      // Use URL from current URL input or agent-specific input
      const targetUrl = currentUrl || inputs.url;

      if (targetUrl) {
        requestBody.url = targetUrl;
      }

      // Build agent-specific request body
      if (['gmb_manager', 'business_profile_manager', 'citation_builder', 'citation_audit'].includes(agent.id)) {
        if (!targetUrl && inputs.name) {
          requestBody.business_data = {
            name: inputs.name,
            address: inputs.address,
            phone: inputs.phone,
            website: inputs.website
          };
        }
      }

      if (agent.id === 'nap_consistency') {
        if (!targetUrl && inputs.name) {
          requestBody.listings = [{
            name: inputs.name,
            address: inputs.address,
            phone: inputs.phone
          }];
        }
      }

      if (agent.id === 'review_management') {
        requestBody.response_templates = {
          positive: "Thank you for your wonderful review!",
          negative: "Thank you for your feedback. We're working to improve.",
          neutral: "Thank you for taking the time to review us."
        };
        if (inputs.reviews && !targetUrl) {
          try {
            requestBody.reviews = JSON.parse(inputs.reviews);
          } catch (e) {
            toast.error('Invalid reviews JSON format');
            setExecuting(false);
            return;
          }
        }
      }

      if (agent.id === 'local_keyword_research') {
        if (inputs.location) requestBody.location = inputs.location;
        if (inputs.business_type) requestBody.business_type = inputs.business_type;
        if (inputs.services) requestBody.services = inputs.services.split(',').map((s: string) => s.trim());
      }

      if (agent.id === 'map_pack_tracker') {
        if (inputs.location) requestBody.location = inputs.location;
        if (inputs.keywords) requestBody.keywords = inputs.keywords.split(',').map((k: string) => k.trim());
        if (inputs.competitors) requestBody.competitors = inputs.competitors.split(',').map((c: string) => c.trim());
      }

      if (agent.id === 'competitor_benchmark') {
        if (!targetUrl && inputs.name) {
          requestBody.business_data = { name: inputs.name };
        }
        if (inputs.competitors) {
          requestBody.competitor_urls = inputs.competitors.split(',').map((c: string) => c.trim());
        }
      }

      const apiResult = await apiFetch<any>(agent.endpoint, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      setResult(apiResult);
      toast.success(`${agent.name} executed successfully`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Failed to execute ${agent.name}:`, error);
      toast.error(`Failed to execute ${agent.name}`);
    } finally {
      setExecuting(false);
    }
  };

  const renderInputField = (agentId: string, field: string, label: string, placeholder: string, type: string = 'text') => {
    const value = agentInputs[agentId][field];
    
    if (type === 'textarea') {
      return (
        <div>
          <label className="block text-sm text-slate-700 mb-1">{label}</label>
          <textarea
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            rows={3}
            value={value}
            onChange={(e) => updateAgentInput(agentId, field, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm text-slate-700 mb-1">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          value={value}
          onChange={(e) => updateAgentInput(agentId, field, e.target.value)}
        />
      </div>
    );
  };

  const renderAgentInputs = (agent: typeof localAgents[0]) => {
    const inputs = agentInputs[agent.id];

    return (
      <div className="space-y-4 mt-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-slate-900">Input Options</h4>
          <span className="text-xs text-slate-500">Provide URL or manual data</span>
        </div>

        {/* Common URL input */}
        {!currentUrl && (
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business/Listing URL (Optional)</label>
            <input
              type="url"
              placeholder="https://business.google.com/... or any business listing URL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              value={inputs.url || ''}
              onChange={(e) => updateAgentInput(agent.id, 'url', e.target.value)}
            />
          </div>
        )}

        {currentUrl && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">Using URL: <span className="font-mono text-xs">{currentUrl}</span></p>
          </div>
        )}

        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-600 mb-3">Or provide manual data:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.inputs.includes('name') && renderInputField(agent.id, 'name', 'Business Name', 'Example Business')}
            {agent.inputs.includes('address') && renderInputField(agent.id, 'address', 'Address', '123 Main St, New York, NY')}
            {agent.inputs.includes('phone') && renderInputField(agent.id, 'phone', 'Phone', '(555) 123-4567')}
            {agent.inputs.includes('website') && renderInputField(agent.id, 'website', 'Website', 'https://example.com')}
            {agent.inputs.includes('location') && renderInputField(agent.id, 'location', 'Location', 'New York, NY')}
            {agent.inputs.includes('business_type') && renderInputField(agent.id, 'business_type', 'Business Type', 'restaurant')}
            {agent.inputs.includes('services') && renderInputField(agent.id, 'services', 'Services (comma-separated)', 'dining, takeout, catering')}
            {agent.inputs.includes('keywords') && renderInputField(agent.id, 'keywords', 'Keywords (comma-separated)', 'restaurant near me, best pizza')}
            {agent.inputs.includes('competitors') && renderInputField(agent.id, 'competitors', 'Competitors (comma-separated)', 'Competitor A, Competitor B')}
          </div>

          {agent.inputs.includes('reviews') && (
            <div className="col-span-2">
              {renderInputField(agent.id, 'reviews', 'Reviews JSON (Optional)', '[{"text": "Great!", "rating": 5}]', 'textarea')}
            </div>
          )}
        </div>

        <button
          onClick={() => executeAgent(agent)}
          disabled={executing}
          className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            executing
              ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
          }`}
        >
          {executing ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              Execute {agent.name}
            </>
          )}
        </button>
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-slate-900">Results</h4>
          <span className={`px-2 py-1 rounded text-xs ${
            result.status === 'SUCCESS' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {result.status}
          </span>
        </div>

        <div className="space-y-3">
          {result.result?.source_url && (
            <div className="p-2 bg-slate-50 rounded text-xs">
              <span className="text-slate-600">Source: </span>
              <span className="text-slate-900 font-mono">{result.result.source_url}</span>
            </div>
          )}

          <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-xs text-green-400 font-mono">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <MapPin className="size-6 text-blue-600" />
          <div>
            <h2 className="text-slate-900">Local SEO Agents</h2>
            <p className="text-sm text-slate-600">
              Click on any agent below to configure inputs and execute
            </p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localAgents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;
          const isExecuting = executing && isSelected;

          return (
            <div
              key={agent.id}
              className={`bg-white rounded-lg shadow-sm border transition-all ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-200 md:col-span-2 lg:col-span-3' 
                  : 'border-slate-200 hover:shadow-md cursor-pointer'
              }`}
            >
              <div 
                className="p-6"
                onClick={() => !isSelected && toggleAgent(agent.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`${agent.color} p-3 rounded-lg`}>
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-slate-900">{agent.name}</h3>
                      {isSelected ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAgent(agent.id);
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="size-5" />
                        </button>
                      ) : (
                        <ChevronDown className="size-5 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{agent.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <>
                    {renderAgentInputs(agent)}
                    {renderResult()}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
