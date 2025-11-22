import { useState } from 'react';
import { Link, MessageSquare, Users, Building, Shield, TrendingUp, ExternalLink, Star, AlertTriangle, Target, Loader2, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface OffPageSEOPanelProps {
  currentUrl?: string;
  onRefresh?: () => void;
}

export function OffPageSEOPanel({ currentUrl, onRefresh }: OffPageSEOPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Agent-specific inputs
  const [agentInputs, setAgentInputs] = useState<Record<string, any>>({
    quality_backlink_sourcing: { url: '', keywords: '', niche: '' },
    backlink_acquisition: { url: '', target_domains: '' },
    guest_posting: { url: '', niche: '', content_samples: '' },
    outreach_guest_posting: { url: '', niche: '', outreach_list: '' },
    outreach_execution: { url: '', prospects: '' },
    broken_link_building: { url: '', niche_websites: '' },
    skyscraper_content: { url: '', content_topic: '' },
    lost_backlink_recovery: { url: '', lost_links: '' },
    backlink_quality_evaluator: { url: '', backlink_data: '' },
    anchor_text_diversity: { url: '', backlink_profile: '' },
    toxic_link_detection: { url: '', domain: '' },
    backlink_profile_monitor: { url: '', domain: '', monitoring_period: '30_days' },
    unlinked_brand_mention_finder: { url: '', brand_name: '', site_limit: '50' },
    brand_mention_outreach: { url: '', mentions: '' },
    brand_mention_sentiment: { url: '', brand_mentions: '' },
    social_signal_collector: { url: '', social_platforms: 'facebook,twitter,linkedin,instagram' },
    forum_participation: { url: '', niche: '', target_forums: '' },
    forum_engagement: { url: '', niche: '' },
    citation_directory_listing: { url: '', business_data: '' },
    directory_submissions: { url: '', business_data: '' },
    competitor_backlink_analysis: { url: '', competitor_domains: '' },
    spam_defense: { url: '', domain: '', monitoring_keywords: '' },
    offpage_performance_report: { url: '', time_period: '30_days' },
    reputation_monitoring: { url: '', brand_name: '' }
  });

  const OFFPAGE_PREFIX = "/offpage_seo";

const offPageAgents = [
  // BACKLINK ACQUISITION & MANAGEMENT (12 agents)
  {
    id: 'quality_backlink_sourcing',
    name: 'Quality Backlink Sourcing',
    icon: Target,
    description: 'Identify authoritative, relevant sites for backlinks',
    color: 'bg-blue-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/quality_backlink_sourcing`,
    inputs: ['url', 'keywords', 'niche']
  },
  {
    id: 'backlink_acquisition',
    name: 'Backlink Acquisition',
    icon: Link,
    description: 'Source and recommend high-authority backlink prospects',
    color: 'bg-indigo-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/backlink_acquisition`,
    inputs: ['url', 'target_domains']
  },
  {
    id: 'guest_posting',
    name: 'Guest Posting Research',
    icon: ExternalLink,
    description: 'Research and manage guest blog opportunities',
    color: 'bg-purple-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/guest_posting`,
    inputs: ['url', 'niche', 'content_samples']
  },
  {
    id: 'outreach_guest_posting',
    name: 'Guest Post Outreach',
    icon: MessageSquare,
    description: 'Automate guest posting outreach campaigns',
    color: 'bg-violet-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/outreach_guest_posting`,
    inputs: ['url', 'niche', 'outreach_list']
  },
  {
    id: 'outreach_execution',
    name: 'Outreach Execution',
    icon: MessageSquare,
    description: 'Personalize and manage outreach emails',
    color: 'bg-fuchsia-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/outreach_execution`,
    inputs: ['url', 'prospects']
  },
  {
    id: 'broken_link_building',
    name: 'Broken Link Building',
    icon: AlertTriangle,
    description: 'Find broken links and suggest replacements',
    color: 'bg-amber-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/broken_link_building`,
    inputs: ['url', 'niche_websites']
  },
  {
    id: 'skyscraper_content',
    name: 'Skyscraper Content',
    icon: TrendingUp,
    description: 'Create enhanced content to attract backlinks',
    color: 'bg-cyan-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/skyscraper_content_outreach`,
    inputs: ['url', 'content_topic']
  },
  {
    id: 'lost_backlink_recovery',
    name: 'Lost Link Recovery',
    icon: Link,
    description: 'Monitor and recover lost backlinks',
    color: 'bg-rose-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/lost_backlink_recovery`,
    inputs: ['url', 'lost_links']
  },
  {
    id: 'backlink_quality_evaluator',
    name: 'Quality Evaluator',
    icon: Star,
    description: 'Assess backlink quality and authority',
    color: 'bg-green-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/backlink_quality_evaluator`,
    inputs: ['url', 'backlink_data']
  },
  {
    id: 'anchor_text_diversity',
    name: 'Anchor Text Diversity',
    icon: Target,
    description: 'Optimize anchor text distribution',
    color: 'bg-teal-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/anchor_text_diversity`,
    inputs: ['url', 'backlink_profile']
  },
  {
    id: 'toxic_link_detection',
    name: 'Toxic Link Detection',
    icon: Shield,
    description: 'Detect and disavow toxic backlinks',
    color: 'bg-red-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/toxic_link_detection`,
    inputs: ['url', 'domain']
  },
  {
    id: 'backlink_profile_monitor',
    name: 'Profile Monitor',
    icon: TrendingUp,
    description: 'Track backlink profile changes',
    color: 'bg-sky-500',
    category: 'backlinks',
    endpoint: `${OFFPAGE_PREFIX}/backlink_profile_monitor`,
    inputs: ['url', 'domain', 'monitoring_period']
  },

  // BRAND MENTION & SOCIAL SIGNALS (4 agents)
  {
    id: 'unlinked_brand_mention_finder',
    name: 'Brand Mention Finder',
    icon: MessageSquare,
    description: 'Find unlinked brand mentions',
    color: 'bg-orange-500',
    category: 'brand',
    endpoint: `${OFFPAGE_PREFIX}/unlinked_brand_mention_finder`,
    inputs: ['url', 'brand_name', 'site_limit']
  },
  {
    id: 'brand_mention_outreach',
    name: 'Mention Outreach',
    icon: ExternalLink,
    description: 'Convert mentions into backlinks',
    color: 'bg-amber-500',
    category: 'brand',
    endpoint: `${OFFPAGE_PREFIX}/brand_mention_outreach`,
    inputs: ['url', 'mentions']
  },
  {
    id: 'brand_mention_sentiment',
    name: 'Sentiment Analysis',
    icon: Star,
    description: 'Analyze brand mention sentiment',
    color: 'bg-yellow-500',
    category: 'brand',
    endpoint: `${OFFPAGE_PREFIX}/brand_mention_sentiment`,
    inputs: ['url', 'brand_mentions']
  },
  {
    id: 'social_signal_collector',
    name: 'Social Signals',
    icon: Users,
    description: 'Track social media engagement',
    color: 'bg-pink-500',
    category: 'brand',
    endpoint: `${OFFPAGE_PREFIX}/social_signal_collector`,
    inputs: ['url', 'social_platforms']
  },

  // FORUM & COMMUNITY (2 agents)
  {
    id: 'forum_participation',
    name: 'Forum Participation',
    icon: MessageSquare,
    description: 'Engage in niche forums and Q&A sites',
    color: 'bg-violet-500',
    category: 'community',
    endpoint: `${OFFPAGE_PREFIX}/forum_participation`,
    inputs: ['url', 'niche', 'target_forums']
  },
  {
    id: 'forum_engagement',
    name: 'Community Engagement',
    icon: Users,
    description: 'Build authority in online communities',
    color: 'bg-purple-500',
    category: 'community',
    endpoint: `${OFFPAGE_PREFIX}/forum_engagement`,
    inputs: ['url', 'niche']
  },

  // CITATIONS & DIRECTORIES (2 agents)
  {
    id: 'citation_directory_listing',
    name: 'Directory Listings',
    icon: Building,
    description: 'Manage business directory submissions',
    color: 'bg-emerald-500',
    category: 'citations',
    endpoint: `${OFFPAGE_PREFIX}/citation_directory_listing`,
    inputs: ['url', 'business_data']
  },
  {
    id: 'directory_submissions',
    name: 'Directory Submissions',
    icon: Building,
    description: 'Automate directory submissions',
    color: 'bg-green-500',
    category: 'citations',
    endpoint: `${OFFPAGE_PREFIX}/directory_submissions`,
    inputs: ['url', 'business_data']
  },

  // MONITORING & REPORTING (4 agents)
  {
    id: 'competitor_backlink_analysis',
    name: 'Competitor Analysis',
    icon: Target,
    description: 'Analyze competitor backlink strategies',
    color: 'bg-blue-500',
    category: 'monitoring',
    endpoint: `${OFFPAGE_PREFIX}/competitor_backlink_analysis`,
    inputs: ['url', 'competitor_domains']
  },
  {
    id: 'spam_defense',
    name: 'Spam Defense',
    icon: Shield,
    description: 'Protect against negative SEO',
    color: 'bg-red-500',
    category: 'monitoring',
    endpoint: `${OFFPAGE_PREFIX}/spam_defense`,
    inputs: ['url', 'domain', 'monitoring_keywords']
  },
  {
    id: 'offpage_performance_report',
    name: 'Performance Report',
    icon: TrendingUp,
    description: 'Generate off-page SEO insights',
    color: 'bg-indigo-500',
    category: 'monitoring',
    endpoint: `${OFFPAGE_PREFIX}/offpage_performance_report`,
    inputs: ['url', 'time_period']
  },
  {
    id: 'reputation_monitoring',
    name: 'Reputation Monitor',
    icon: Star,
    description: 'Monitor brand reputation online',
    color: 'bg-purple-500',
    category: 'monitoring',
    endpoint: `${OFFPAGE_PREFIX}/reputation_monitoring`,
    inputs: ['url', 'brand_name']
  }
];


  const categories = [
    { id: 'all', name: 'All Agents', count: offPageAgents.length },
    { id: 'backlinks', name: 'Backlink Management', count: offPageAgents.filter(a => a.category === 'backlinks').length },
    { id: 'brand', name: 'Brand & Social', count: offPageAgents.filter(a => a.category === 'brand').length },
    { id: 'community', name: 'Community', count: offPageAgents.filter(a => a.category === 'community').length },
    { id: 'citations', name: 'Citations', count: offPageAgents.filter(a => a.category === 'citations').length },
    { id: 'monitoring', name: 'Monitoring', count: offPageAgents.filter(a => a.category === 'monitoring').length }
  ];

  const filteredAgents = activeCategory === 'all' 
    ? offPageAgents 
    : offPageAgents.filter(a => a.category === activeCategory);

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

  const executeAgent = async (agent: typeof offPageAgents[0]) => {
    setExecuting(true);
    setResult(null);

    try {
      let requestBody: any = {};
      const inputs = agentInputs[agent.id];
      const targetUrl = currentUrl || inputs.url;

      if (targetUrl) {
        requestBody.url = targetUrl;
      }

      // Build agent-specific request body
      if (inputs.keywords) requestBody.keywords = inputs.keywords.split(',').map((k: string) => k.trim());
      if (inputs.niche) requestBody.niche = inputs.niche;
      if (inputs.target_domains) requestBody.target_domains = inputs.target_domains.split(',').map((d: string) => d.trim());
      if (inputs.content_samples) requestBody.content_samples = inputs.content_samples.split(',').map((s: string) => s.trim());
      if (inputs.outreach_list) requestBody.outreach_list = inputs.outreach_list.split(',').map((o: string) => o.trim());
      if (inputs.niche_websites) requestBody.niche_websites = inputs.niche_websites.split(',').map((w: string) => w.trim());
      if (inputs.content_topic) requestBody.content_topic = inputs.content_topic;
      if (inputs.domain) requestBody.domain = inputs.domain;
      if (inputs.monitoring_period) requestBody.monitoring_period = inputs.monitoring_period;
      if (inputs.brand_name) requestBody.brand_name = inputs.brand_name;
      if (inputs.site_limit) requestBody.site_limit = parseInt(inputs.site_limit);
      if (inputs.social_platforms) requestBody.social_platforms = inputs.social_platforms.split(',').map((p: string) => p.trim());
      if (inputs.target_forums) requestBody.target_forums = inputs.target_forums.split(',').map((f: string) => f.trim());
      if (inputs.competitor_domains) requestBody.competitor_domains = inputs.competitor_domains.split(',').map((c: string) => c.trim());
      if (inputs.monitoring_keywords) requestBody.monitoring_keywords = inputs.monitoring_keywords.split(',').map((k: string) => k.trim());
      if (inputs.time_period) requestBody.time_period = inputs.time_period;

      // Parse JSON inputs
      if (inputs.prospects && !targetUrl) {
        try {
          requestBody.prospects = JSON.parse(inputs.prospects);
        } catch (e) {
          toast.error('Invalid prospects JSON format');
          setExecuting(false);
          return;
        }
      }

      if (inputs.lost_links && !targetUrl) {
        try {
          requestBody.lost_links = JSON.parse(inputs.lost_links);
        } catch (e) {
          toast.error('Invalid lost_links JSON format');
          setExecuting(false);
          return;
        }
      }

      if (inputs.backlink_data && !targetUrl) {
        try {
          requestBody.backlink_data = JSON.parse(inputs.backlink_data);
        } catch (e) {
          toast.error('Invalid backlink_data JSON format');
          setExecuting(false);
          return;
        }
      }

      if (inputs.backlink_profile && !targetUrl) {
        try {
          requestBody.backlink_profile = JSON.parse(inputs.backlink_profile);
        } catch (e) {
          toast.error('Invalid backlink_profile JSON format');
          setExecuting(false);
          return;
        }
      }

      if (inputs.mentions && !targetUrl) {
        try {
          requestBody.mentions = JSON.parse(inputs.mentions);
        } catch (e) {
          toast.error('Invalid mentions JSON format');
          setExecuting(false);
          return;
        }
      }

      if (inputs.brand_mentions && !targetUrl) {
        try {
          requestBody.brand_mentions = JSON.parse(inputs.brand_mentions);
        } catch (e) {
          toast.error('Invalid brand_mentions JSON format');
          setExecuting(false);
          return;
        }
      }

      if (inputs.business_data && !targetUrl) {
        try {
          requestBody.business_data = JSON.parse(inputs.business_data);
        } catch (e) {
          toast.error('Invalid business_data JSON format');
          setExecuting(false);
          return;
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

  const renderAgentInputs = (agent: typeof offPageAgents[0]) => {
    const inputs = agentInputs[agent.id];

    return (
      <div className="space-y-4 mt-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-slate-900">Input Options</h4>
          <span className="text-xs text-slate-500">Provide URL or manual data</span>
        </div>

        {!currentUrl && (
          <div>
            <label className="block text-sm text-slate-700 mb-1">Target URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com"
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
          <p className="text-sm text-slate-600 mb-3">Additional parameters:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.inputs.includes('keywords') && renderInputField(agent.id, 'keywords', 'Keywords (comma-separated)', 'seo, marketing, analytics')}
            {agent.inputs.includes('niche') && renderInputField(agent.id, 'niche', 'Niche', 'digital marketing')}
            {agent.inputs.includes('target_domains') && renderInputField(agent.id, 'target_domains', 'Target Domains (comma-separated)', 'example.com, authority-site.com')}
            {agent.inputs.includes('content_samples') && renderInputField(agent.id, 'content_samples', 'Content Samples (comma-separated)', 'article1, article2')}
            {agent.inputs.includes('outreach_list') && renderInputField(agent.id, 'outreach_list', 'Outreach List (comma-separated)', 'site1.com, site2.com')}
            {agent.inputs.includes('niche_websites') && renderInputField(agent.id, 'niche_websites', 'Niche Websites (comma-separated)', 'industry-site.com')}
            {agent.inputs.includes('content_topic') && renderInputField(agent.id, 'content_topic', 'Content Topic', 'SEO Guide 2024')}
            {agent.inputs.includes('domain') && renderInputField(agent.id, 'domain', 'Domain', 'example.com')}
            {agent.inputs.includes('monitoring_period') && renderInputField(agent.id, 'monitoring_period', 'Monitoring Period', '30_days')}
            {agent.inputs.includes('brand_name') && renderInputField(agent.id, 'brand_name', 'Brand Name', 'MyBrand')}
            {agent.inputs.includes('site_limit') && renderInputField(agent.id, 'site_limit', 'Site Limit', '50', 'number')}
            {agent.inputs.includes('social_platforms') && renderInputField(agent.id, 'social_platforms', 'Social Platforms (comma-separated)', 'facebook,twitter,linkedin')}
            {agent.inputs.includes('target_forums') && renderInputField(agent.id, 'target_forums', 'Target Forums (comma-separated)', 'reddit.com, quora.com')}
            {agent.inputs.includes('competitor_domains') && renderInputField(agent.id, 'competitor_domains', 'Competitor Domains (comma-separated)', 'competitor1.com')}
            {agent.inputs.includes('monitoring_keywords') && renderInputField(agent.id, 'monitoring_keywords', 'Monitoring Keywords (comma-separated)', 'brand, company')}
            {agent.inputs.includes('time_period') && renderInputField(agent.id, 'time_period', 'Time Period', '30_days')}
          </div>

          {(agent.inputs.includes('prospects') || agent.inputs.includes('lost_links') || 
            agent.inputs.includes('backlink_data') || agent.inputs.includes('backlink_profile') ||
            agent.inputs.includes('mentions') || agent.inputs.includes('brand_mentions') ||
            agent.inputs.includes('business_data')) && (
            <div className="col-span-2 mt-3">
              {agent.inputs.includes('prospects') && renderInputField(agent.id, 'prospects', 'Prospects JSON (Optional)', '[{"domain": "example.com"}]', 'textarea')}
              {agent.inputs.includes('lost_links') && renderInputField(agent.id, 'lost_links', 'Lost Links JSON (Optional)', '[{"url": "link.com"}]', 'textarea')}
              {agent.inputs.includes('backlink_data') && renderInputField(agent.id, 'backlink_data', 'Backlink Data JSON (Optional)', '[{"url": "site.com", "da": 75}]', 'textarea')}
              {agent.inputs.includes('backlink_profile') && renderInputField(agent.id, 'backlink_profile', 'Backlink Profile JSON (Optional)', '{"exact_match": 15}', 'textarea')}
              {agent.inputs.includes('mentions') && renderInputField(agent.id, 'mentions', 'Mentions JSON (Optional)', '[{"site": "site.com"}]', 'textarea')}
              {agent.inputs.includes('brand_mentions') && renderInputField(agent.id, 'brand_mentions', 'Brand Mentions JSON (Optional)', '[{"text": "Great!"}]', 'textarea')}
              {agent.inputs.includes('business_data') && renderInputField(agent.id, 'business_data', 'Business Data JSON (Optional)', '{"name": "My Business"}', 'textarea')}
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
        <div className="flex items-center gap-3 mb-4">
          <Link className="size-6 text-blue-600" />
          <div>
            <h2 className="text-slate-900">Off-Page SEO Agents</h2>
            <p className="text-sm text-slate-600">
              24+ agents for backlinks, brand mentions, social signals, and reputation management
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;

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
