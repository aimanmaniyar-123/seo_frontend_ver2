import { useState } from 'react';
import { FileText, Hash, Link2, Image, Code, Zap, Search, Globe, AlertCircle, Shield, Share2, Settings, Loader2, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface OnPageSEOPanelProps {
  currentUrl?: string;
  onRefresh?: () => void;
}

export function OnPageSEOPanel({ currentUrl, onRefresh }: OnPageSEOPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Agent-specific inputs - simplified to common patterns
  const [agentInputs, setAgentInputs] = useState<Record<string, any>>({});

  const onPageAgents = [
    // KEYWORD & CONTENT INTELLIGENCE (15 agents)
    { id: 'target_keyword_research', name: 'Keyword Research', icon: Search, description: 'Research target keywords from content', color: 'bg-blue-500', category: 'keywords', endpoint: '/target_keyword_research', inputs: ['url', 'content'] },
    { id: 'target_keyword_discovery', name: 'Keyword Discovery', icon: Search, description: 'Discover target keywords', color: 'bg-indigo-500', category: 'keywords', endpoint: '/target_keyword_discovery', inputs: ['url', 'content'] },
    { id: 'keyword_mapping', name: 'Keyword Mapping', icon: Hash, description: 'Map keywords to sections', color: 'bg-violet-500', category: 'keywords', endpoint: '/keyword_mapping', inputs: ['url', 'content'] },
    { id: 'lsi_semantic_keywords', name: 'LSI Keywords', icon: Search, description: 'Integrate semantic keywords', color: 'bg-purple-500', category: 'keywords', endpoint: '/lsi_semantic_keywords', inputs: ['url', 'content'] },
    { id: 'content_gap_analyzer', name: 'Content Gap Analysis', icon: FileText, description: 'Analyze content gaps vs competitors', color: 'bg-fuchsia-500', category: 'keywords', endpoint: '/content_gap_analyzer', inputs: ['url', 'content', 'competitor_url'] },
    { id: 'content_quality_depth', name: 'Content Quality', icon: FileText, description: 'Analyze content depth', color: 'bg-pink-500', category: 'keywords', endpoint: '/content_quality_depth', inputs: ['url', 'content'] },
    { id: 'content_quality_uniqueness', name: 'Content Uniqueness', icon: FileText, description: 'Detect duplicate content', color: 'bg-rose-500', category: 'keywords', endpoint: '/content_quality_uniqueness', inputs: ['url', 'content'] },
    { id: 'user_intent_alignment', name: 'Intent Alignment', icon: Search, description: 'Analyze user intent', color: 'bg-red-500', category: 'keywords', endpoint: '/user_intent_alignment', inputs: ['url', 'content'] },
    { id: 'content_readability', name: 'Readability Analysis', icon: FileText, description: 'Analyze readability scores', color: 'bg-orange-500', category: 'keywords', endpoint: '/content_readability_engagement', inputs: ['url', 'content'] },
    { id: 'content_freshness', name: 'Content Freshness', icon: FileText, description: 'Monitor content age', color: 'bg-amber-500', category: 'keywords', endpoint: '/content_freshness_monitor', inputs: ['last_updated_date'] },
    { id: 'content_depth_analysis', name: 'Depth Analysis', icon: FileText, description: 'Analyze content completeness', color: 'bg-yellow-500', category: 'keywords', endpoint: '/content_depth_analysis', inputs: ['url', 'content'] },
    { id: 'multimedia_usage', name: 'Multimedia Usage', icon: Image, description: 'Analyze multimedia presence', color: 'bg-lime-500', category: 'keywords', endpoint: '/multimedia_usage', inputs: ['url', 'content'] },
    { id: 'eeat_signals', name: 'E-E-A-T Signals', icon: Shield, description: 'Analyze expertise signals', color: 'bg-green-500', category: 'keywords', endpoint: '/eeat_signals', inputs: ['url', 'content'] },
    { id: 'readability_enhancement', name: 'Readability Enhance', icon: FileText, description: 'Improve readability', color: 'bg-emerald-500', category: 'keywords', endpoint: '/readability_enhancement', inputs: ['url', 'content'] },

    // META ELEMENTS (10 agents)
    { id: 'title_tag_optimizer', name: 'Title Optimizer', icon: FileText, description: 'Optimize title tags', color: 'bg-teal-500', category: 'meta', endpoint: '/title_tag_optimizer', inputs: ['url'] },
    { id: 'title_tag_creation', name: 'Title Creation', icon: FileText, description: 'Create optimized titles', color: 'bg-cyan-500', category: 'meta', endpoint: '/title_tag_creation', inputs: ['url', 'content'] },
    { id: 'title_tag_analysis', name: 'Title Analysis', icon: FileText, description: 'Analyze title tags', color: 'bg-sky-500', category: 'meta', endpoint: '/title_tag_analysis', inputs: ['url'] },
    { id: 'title_tag_update', name: 'Title Update', icon: FileText, description: 'Update based on performance', color: 'bg-blue-500', category: 'meta', endpoint: '/title_tag_update', inputs: ['url'] },
    { id: 'meta_description_generator', name: 'Meta Generator', icon: FileText, description: 'Generate meta descriptions', color: 'bg-indigo-500', category: 'meta', endpoint: '/meta_description_generator', inputs: ['url', 'content'] },
    { id: 'meta_description_writer', name: 'Meta Writer', icon: FileText, description: 'Write optimized descriptions', color: 'bg-violet-500', category: 'meta', endpoint: '/meta_description_writer', inputs: ['url', 'content'] },
    { id: 'meta_description_generation', name: 'Meta Generation', icon: FileText, description: 'Auto-generate descriptions', color: 'bg-purple-500', category: 'meta', endpoint: '/meta_description_generation', inputs: ['url', 'content'] },
    { id: 'meta_description_uniqueness', name: 'Meta Uniqueness', icon: FileText, description: 'Check uniqueness', color: 'bg-fuchsia-500', category: 'meta', endpoint: '/meta_description_uniqueness', inputs: [] },
    { id: 'meta_tags_consistency', name: 'Meta Consistency', icon: FileText, description: 'Check consistency', color: 'bg-pink-500', category: 'meta', endpoint: '/meta_tags_consistency', inputs: [] },
    { id: 'meta_tag_expiry', name: 'Meta Expiry Check', icon: AlertCircle, description: 'Check expired tags', color: 'bg-rose-500', category: 'meta', endpoint: '/meta_tag_expiry_checker', inputs: [] },

    // URL & CANONICAL (4 agents)
    { id: 'url_structure', name: 'URL Structure', icon: Link2, description: 'Optimize URL structure', color: 'bg-red-500', category: 'url', endpoint: '/url_structure_optimization', inputs: ['url'] },
    { id: 'canonical_management', name: 'Canonical Management', icon: Link2, description: 'Manage canonical tags', color: 'bg-orange-500', category: 'url', endpoint: '/canonical_tag_management', inputs: ['url'] },
    { id: 'canonical_assigning', name: 'Canonical Assign', icon: Link2, description: 'Assign canonical tags', color: 'bg-amber-500', category: 'url', endpoint: '/canonical_tag_assigning', inputs: [] },
    { id: 'canonical_enforcement', name: 'Canonical Enforce', icon: Shield, description: 'Enforce best practices', color: 'bg-yellow-500', category: 'url', endpoint: '/canonical_tag_enforcement', inputs: [] },

    // HEADERS & STRUCTURE (8 agents)
    { id: 'header_tag_manager', name: 'Header Manager', icon: Hash, description: 'Manage header structure', color: 'bg-lime-500', category: 'headers', endpoint: '/header_tag_manager', inputs: ['url', 'html_content'] },
    { id: 'header_architecture', name: 'Header Architecture', icon: Hash, description: 'Analyze header hierarchy', color: 'bg-green-500', category: 'headers', endpoint: '/header_tag_architecture', inputs: ['url', 'html_content'] },
    { id: 'header_structure_audit', name: 'Header Audit', icon: Hash, description: 'Audit header structure', color: 'bg-emerald-500', category: 'headers', endpoint: '/header_structure_audit', inputs: ['url', 'html_content'] },
    { id: 'header_rewrite', name: 'Header Rewrite', icon: Hash, description: 'Suggest header rewrites', color: 'bg-teal-500', category: 'headers', endpoint: '/header_rewrite', inputs: ['url', 'html_content'] },
    { id: 'header_optimization', name: 'Header Optimization', icon: Hash, description: 'Optimize with keywords', color: 'bg-cyan-500', category: 'headers', endpoint: '/header_tag_optimization', inputs: ['url', 'html_content'] },
    { id: 'content_outline_ux', name: 'Content Outline', icon: FileText, description: 'Analyze content flow', color: 'bg-sky-500', category: 'headers', endpoint: '/content_outline_ux', inputs: ['url', 'html_content'] },
    { id: 'page_layout_efficiency', name: 'Layout Efficiency', icon: Settings, description: 'Analyze layout & ads', color: 'bg-blue-500', category: 'headers', endpoint: '/page_layout_efficiency', inputs: ['url', 'html_content'] },

    // INTERNAL LINKING (7 agents)
    { id: 'internal_links_analysis', name: 'Internal Links', icon: Link2, description: 'Analyze internal links', color: 'bg-indigo-500', category: 'links', endpoint: '/internal_links_analysis', inputs: ['url'] },
    { id: 'internal_link_mapping', name: 'Link Mapping', icon: Link2, description: 'Map link equity', color: 'bg-violet-500', category: 'links', endpoint: '/internal_link_mapping', inputs: ['url'] },
    { id: 'internal_link_network', name: 'Link Network', icon: Link2, description: 'Build link network', color: 'bg-purple-500', category: 'links', endpoint: '/internal_link_network_builder', inputs: ['url'] },
    { id: 'anchor_text_optimization', name: 'Anchor Optimization', icon: Hash, description: 'Optimize anchor text', color: 'bg-fuchsia-500', category: 'links', endpoint: '/anchor_text_optimization', inputs: ['url'] },
    { id: 'anchor_text_diversity', name: 'Anchor Diversity', icon: Hash, description: 'Calculate diversity', color: 'bg-pink-500', category: 'links', endpoint: '/anchor_text_diversity', inputs: [] },
    { id: 'broken_link_repair', name: 'Broken Link Repair', icon: AlertCircle, description: 'Repair broken links', color: 'bg-rose-500', category: 'links', endpoint: '/broken_internal_link_repair', inputs: ['url'] },
    { id: 'broken_link_fixer', name: 'Link Fixer', icon: AlertCircle, description: 'Fix broken links', color: 'bg-red-500', category: 'links', endpoint: '/broken_internal_link_fixer', inputs: [] },

    // IMAGE & MULTIMEDIA (10 agents)
    { id: 'image_alt_text', name: 'Alt Text Analysis', icon: Image, description: 'Analyze alt text', color: 'bg-orange-500', category: 'images', endpoint: '/image_alt_text_analysis', inputs: ['url'] },
    { id: 'image_alt_creation', name: 'Alt Tag Creation', icon: Image, description: 'Create alt tags', color: 'bg-amber-500', category: 'images', endpoint: '/image_alt_tag_creation', inputs: [] },
    { id: 'image_alt_generator', name: 'Alt Generator', icon: Image, description: 'Generate alt text', color: 'bg-yellow-500', category: 'images', endpoint: '/image_alt_text_generator', inputs: [] },
    { id: 'image_optimization', name: 'Image Optimization', icon: Image, description: 'Optimize images', color: 'bg-lime-500', category: 'images', endpoint: '/image_optimization', inputs: ['url', 'html_content'] },
    { id: 'image_compression', name: 'Image Compression', icon: Image, description: 'Recommend compression', color: 'bg-green-500', category: 'images', endpoint: '/image_compression_format', inputs: [] },
    { id: 'image_filename', name: 'Filename Optimization', icon: Image, description: 'Optimize filenames', color: 'bg-emerald-500', category: 'images', endpoint: '/image_filename_optimization', inputs: [] },
    { id: 'lazy_loading_cdn', name: 'Lazy Loading CDN', icon: Zap, description: 'Implement lazy loading', color: 'bg-teal-500', category: 'images', endpoint: '/lazy_loading_cdn', inputs: ['url', 'html_content'] },
    { id: 'video_interactive', name: 'Video Content', icon: Image, description: 'Optimize video content', color: 'bg-cyan-500', category: 'images', endpoint: '/video_interactive_content', inputs: [] },
    { id: 'video_seo', name: 'Video SEO', icon: Image, description: 'Generate video schema', color: 'bg-sky-500', category: 'images', endpoint: '/video_seo', inputs: [] },
    { id: 'interactive_elements', name: 'Interactive Elements', icon: Settings, description: 'Optimize interactivity', color: 'bg-blue-500', category: 'images', endpoint: '/interactive_elements_optimization', inputs: [] },

    // SCHEMA & STRUCTURED DATA (4 agents)
    { id: 'schema_markup', name: 'Schema Generation', icon: Code, description: 'Generate schema markup', color: 'bg-indigo-500', category: 'schema', endpoint: '/schema_markup_generation', inputs: ['url', 'page_type'] },
    { id: 'schema_implementation', name: 'Schema Implementation', icon: Code, description: 'Implement schema', color: 'bg-violet-500', category: 'schema', endpoint: '/schema_markup_implementation', inputs: ['url', 'page_type'] },
    { id: 'schema_validation', name: 'Schema Validation', icon: Code, description: 'Validate schema', color: 'bg-purple-500', category: 'schema', endpoint: '/schema_validation', inputs: [] },
    { id: 'rich_snippets', name: 'Rich Snippets', icon: Code, description: 'Find snippet opportunities', color: 'bg-fuchsia-500', category: 'schema', endpoint: '/rich_snippet_opportunities', inputs: ['url'] },

    // UX & TECHNICAL (7 agents)
    { id: 'page_speed', name: 'Page Speed', icon: Zap, description: 'Analyze Core Web Vitals', color: 'bg-pink-500', category: 'technical', endpoint: '/page_speed_analysis', inputs: ['url'] },
    { id: 'core_web_vitals', name: 'Core Web Vitals', icon: Zap, description: 'Monitor vitals', color: 'bg-rose-500', category: 'technical', endpoint: '/core_web_vitals_monitor', inputs: ['url'] },
    { id: 'mobile_usability_check', name: 'Mobile Usability', icon: Globe, description: 'Check mobile usability', color: 'bg-red-500', category: 'technical', endpoint: '/mobile_usability_check', inputs: ['url', 'html_content'] },
    { id: 'mobile_usability_test', name: 'Mobile Test', icon: Globe, description: 'Test mobile friendly', color: 'bg-orange-500', category: 'technical', endpoint: '/mobile_usability_test', inputs: ['url'] },
    { id: 'accessibility_compliance', name: 'Accessibility', icon: Shield, description: 'Check accessibility', color: 'bg-amber-500', category: 'technical', endpoint: '/accessibility_compliance_check', inputs: ['url', 'html_content'] },
    { id: 'interstitial_ads', name: 'Interstitial Ads', icon: AlertCircle, description: 'Monitor intrusive ads', color: 'bg-yellow-500', category: 'technical', endpoint: '/interstitial_ad_monitoring', inputs: ['url', 'html_content'] },
    { id: 'user_engagement', name: 'User Engagement', icon: Settings, description: 'Analyze engagement', color: 'bg-lime-500', category: 'technical', endpoint: '/user_engagement_metrics', inputs: [] },

    // OUTBOUND LINKS (3 agents)
    { id: 'outbound_link_quality', name: 'Outbound Quality', icon: Link2, description: 'Analyze outbound links', color: 'bg-green-500', category: 'outbound', endpoint: '/outbound_link_quality', inputs: ['url', 'html_content'] },
    { id: 'outbound_link_integrator', name: 'Link Integrator', icon: Link2, description: 'Integrate external links', color: 'bg-emerald-500', category: 'outbound', endpoint: '/external_outbound_link_integrator', inputs: ['url', 'content'] },
    { id: 'outbound_link_monitoring', name: 'Link Monitoring', icon: Link2, description: 'Monitor outbound links', color: 'bg-teal-500', category: 'outbound', endpoint: '/outbound_link_monitoring', inputs: [] },

    // SOCIAL SEO (4 agents)
    { id: 'social_sharing', name: 'Social Sharing', icon: Share2, description: 'Optimize social tags', color: 'bg-cyan-500', category: 'social', endpoint: '/social_sharing_optimization', inputs: ['url', 'html_content'] },
    { id: 'social_buttons', name: 'Social Buttons', icon: Share2, description: 'Optimize share buttons', color: 'bg-sky-500', category: 'social', endpoint: '/social_sharing_button_optimizer', inputs: ['url', 'html_content'] },
    { id: 'social_engagement', name: 'Social Engagement', icon: Share2, description: 'Track engagement', color: 'bg-blue-500', category: 'social', endpoint: '/social_engagement_tracking', inputs: ['url'] },
    { id: 'engagement_signals', name: 'Engagement Signals', icon: Share2, description: 'Track signals', color: 'bg-indigo-500', category: 'social', endpoint: '/engagement_signal_tracker', inputs: [] },

    // ERROR HANDLING (6 agents)
    { id: 'error_404', name: '404 Management', icon: AlertCircle, description: 'Manage 404 errors', color: 'bg-violet-500', category: 'errors', endpoint: '/error_404_redirect_management', inputs: [] },
    { id: 'redirect_chains', name: 'Redirect Chains', icon: AlertCircle, description: 'Clean redirect chains', color: 'bg-purple-500', category: 'errors', endpoint: '/redirect_chain_loop_cleaner', inputs: [] },
    { id: 'duplicate_content', name: 'Duplicate Content', icon: AlertCircle, description: 'Detect duplicates', color: 'bg-fuchsia-500', category: 'errors', endpoint: '/duplicate_content_detection', inputs: [] },
    { id: 'thin_content', name: 'Thin Content', icon: AlertCircle, description: 'Detect thin content', color: 'bg-pink-500', category: 'errors', endpoint: '/thin_content_detector', inputs: [] },
    { id: 'seo_audit', name: 'SEO Audit', icon: Search, description: 'Comprehensive audit', color: 'bg-rose-500', category: 'errors', endpoint: '/seo_audit', inputs: [] },
    { id: 'robots_meta', name: 'Robots Meta', icon: Code, description: 'Manage robots tags', color: 'bg-red-500', category: 'errors', endpoint: '/robots_meta_tag_manager', inputs: ['url', 'html_content'] },

    // SECURITY & CRAWLABILITY (4 agents)
    { id: 'crawl_budget', name: 'Crawl Budget', icon: Shield, description: 'Optimize crawl budget', color: 'bg-orange-500', category: 'security', endpoint: '/page_crawl_budget_optimizer', inputs: [] },
    { id: 'https_mixed', name: 'HTTPS Mixed Content', icon: Shield, description: 'Check mixed content', color: 'bg-amber-500', category: 'security', endpoint: '/https_mixed_content_checker', inputs: ['url'] },
    { id: 'resource_blocking', name: 'Resource Blocking', icon: Shield, description: 'Audit blocked resources', color: 'bg-yellow-500', category: 'security', endpoint: '/resource_blocking_auditor', inputs: ['url', 'html_content'] },
    { id: 'security_headers', name: 'Security Headers', icon: Shield, description: 'Check security headers', color: 'bg-lime-500', category: 'security', endpoint: '/security_headers_checker', inputs: ['url'] }
  ];

  const categories = [
    { id: 'all', name: 'All Agents', count: onPageAgents.length },
    { id: 'keywords', name: 'Keywords & Content', count: onPageAgents.filter(a => a.category === 'keywords').length },
    { id: 'meta', name: 'Meta Elements', count: onPageAgents.filter(a => a.category === 'meta').length },
    { id: 'url', name: 'URL & Canonical', count: onPageAgents.filter(a => a.category === 'url').length },
    { id: 'headers', name: 'Headers', count: onPageAgents.filter(a => a.category === 'headers').length },
    { id: 'links', name: 'Internal Links', count: onPageAgents.filter(a => a.category === 'links').length },
    { id: 'images', name: 'Images & Media', count: onPageAgents.filter(a => a.category === 'images').length },
    { id: 'schema', name: 'Schema', count: onPageAgents.filter(a => a.category === 'schema').length },
    { id: 'technical', name: 'Technical', count: onPageAgents.filter(a => a.category === 'technical').length },
    { id: 'outbound', name: 'Outbound', count: onPageAgents.filter(a => a.category === 'outbound').length },
    { id: 'social', name: 'Social', count: onPageAgents.filter(a => a.category === 'social').length },
    { id: 'errors', name: 'Errors', count: onPageAgents.filter(a => a.category === 'errors').length },
    { id: 'security', name: 'Security', count: onPageAgents.filter(a => a.category === 'security').length }
  ];

  const filteredAgents = activeCategory === 'all' 
    ? onPageAgents 
    : onPageAgents.filter(a => a.category === activeCategory);

  const updateAgentInput = (agentId: string, field: string, value: string) => {
    if (!agentInputs[agentId]) {
      agentInputs[agentId] = {};
    }
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

  const executeAgent = async (agent: typeof onPageAgents[0]) => {
    setExecuting(true);
    setResult(null);

    try {
      let requestBody: any = {};
      const inputs = agentInputs[agent.id] || {};
      const targetUrl = currentUrl || inputs.url;

      if (targetUrl) {
        requestBody.url = targetUrl;
      }

      // Add agent-specific inputs
      if (inputs.content) requestBody.content = inputs.content;
      if (inputs.html_content) requestBody.html_content = inputs.html_content;
      if (inputs.competitor_url) requestBody.competitor_url = inputs.competitor_url;
      if (inputs.last_updated_date) requestBody.last_updated_date = inputs.last_updated_date;
      if (inputs.page_type) requestBody.page_type = inputs.page_type;

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
    const value = agentInputs[agentId]?.[field] || '';
    
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

  const renderAgentInputs = (agent: typeof onPageAgents[0]) => {
    const inputs = agentInputs[agent.id] || {};

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
          
          <div className="grid grid-cols-1 gap-3">
            {agent.inputs.includes('content') && renderInputField(agent.id, 'content', 'Content (Optional)', 'Enter content text...', 'textarea')}
            {agent.inputs.includes('html_content') && renderInputField(agent.id, 'html_content', 'HTML Content (Optional)', '<html>...</html>', 'textarea')}
            {agent.inputs.includes('competitor_url') && renderInputField(agent.id, 'competitor_url', 'Competitor URL (Optional)', 'https://competitor.com')}
            {agent.inputs.includes('last_updated_date') && renderInputField(agent.id, 'last_updated_date', 'Last Updated Date', '2024-01-01', 'date')}
            {agent.inputs.includes('page_type') && (
              <div>
                <label className="block text-sm text-slate-700 mb-1">Page Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={inputs.page_type || ''}
                  onChange={(e) => updateAgentInput(agent.id, 'page_type', e.target.value)}
                >
                  <option value="">Select type...</option>
                  <option value="Article">Article</option>
                  <option value="FAQ">FAQ</option>
                  <option value="Product">Product</option>
                  <option value="Review">Review</option>
                </select>
              </div>
            )}
          </div>
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
          <FileText className="size-6 text-blue-600" />
          <div>
            <h2 className="text-slate-900">On-Page SEO Agents</h2>
            <p className="text-sm text-slate-600">
              75+ agents for keywords, content, meta tags, headers, links, images, schema, and technical SEO
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;

          return (
            <div
              key={agent.id}
              className={`bg-white rounded-lg shadow-sm border transition-all ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-200 md:col-span-2 lg:col-span-4' 
                  : 'border-slate-200 hover:shadow-md cursor-pointer'
              }`}
            >
              <div 
                className="p-4"
                onClick={() => !isSelected && toggleAgent(agent.id)}
              >
                <div className="flex items-start gap-2">
                  <div className={`${agent.color} p-2 rounded-lg`}>
                    <Icon className="size-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm text-slate-900">{agent.name}</h3>
                      {isSelected ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAgent(agent.id);
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="size-4" />
                        </button>
                      ) : (
                        <ChevronDown className="size-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{agent.description}</p>
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
