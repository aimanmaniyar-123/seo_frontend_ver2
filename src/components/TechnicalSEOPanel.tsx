import { useState } from 'react';
import { Activity, Globe, Zap, Smartphone, Shield, Code, Link2, Bot, Map, AlertTriangle, Sparkles, TrendingUp, Target, BarChart, Loader2, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiFetch } from '../lib/api';

interface TechnicalSEOPanelProps {
  currentUrl?: string;
  onRefresh?: () => void;
}

export function TechnicalSEOPanel({ currentUrl, onRefresh }: TechnicalSEOPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [agentInputs, setAgentInputs] = useState<Record<string, any>>({});

  const TECH_PREFIX = "/technical_seo";

const technicalAgents = [
  // ============ CRAWLING & INDEXING (33) ============
  { id: 'robots_txt_audit_versioning', name: 'Robots.txt Audit & Versioning', icon: Activity, description: 'Audit robots.txt with version control', color: 'bg-blue-500', category: 'crawling', endpoint: `${TECH_PREFIX}/robots_txt_audit`, inputs: ['url'] },
  { id: 'robots_txt_basic', name: 'Robots.txt Basic Analysis', icon: Activity, description: 'Basic robots.txt analysis', color: 'bg-indigo-500', category: 'crawling', endpoint: `${TECH_PREFIX}/robots_txt_analysis`, inputs: ['url'] },
  { id: 'robots_txt_strategy', name: 'Robots.txt Strategy', icon: Activity, description: 'Strategic robots.txt versioning', color: 'bg-violet-500', category: 'crawling', endpoint: `${TECH_PREFIX}/robots_txt_strategy`, inputs: [] },
  { id: 'robots_txt_management', name: 'Robots.txt Management', icon: Activity, description: 'Rule management micro-agent', color: 'bg-purple-500', category: 'crawling', endpoint: `${TECH_PREFIX}/robots_txt_management`, inputs: [] },
  { id: 'robots_txt_optimizer', name: 'Robots.txt Optimizer', icon: Activity, description: 'Optimize robots.txt efficiency', color: 'bg-fuchsia-500', category: 'crawling', endpoint: `${TECH_PREFIX}/robots_txt_optimizer`, inputs: ['url'] },
  { id: 'sitemap_xml', name: 'XML Sitemap Analysis', icon: Activity, description: 'Analyze XML sitemap', color: 'bg-pink-500', category: 'crawling', endpoint: `${TECH_PREFIX}/sitemap_xml_analysis`, inputs: ['url'] },
  { id: 'xml_sitemap_master', name: 'XML Sitemap Master', icon: Activity, description: 'Master sitemap generator', color: 'bg-rose-500', category: 'crawling', endpoint: `${TECH_PREFIX}/xml_sitemap_master`, inputs: [] },
  { id: 'xml_sitemap_generator', name: 'XML Sitemap Generator', icon: Activity, description: 'Generate and validate sitemaps', color: 'bg-red-500', category: 'crawling', endpoint: `${TECH_PREFIX}/xml_sitemap_generator`, inputs: [] },
  { id: 'sitemap_generation', name: 'Sitemap Auto-Generation', icon: Activity, description: 'Automatic sitemap generation', color: 'bg-orange-500', category: 'crawling', endpoint: `${TECH_PREFIX}/sitemap_generation`, inputs: ['url'] },
  { id: 'sitemap_notifier', name: 'Sitemap Change Notifier', icon: Activity, description: 'Notify sitemap changes', color: 'bg-amber-500', category: 'crawling', endpoint: `${TECH_PREFIX}/sitemap_notifier`, inputs: ['url'] },
  { id: 'sitemap_feed_push', name: 'Sitemap Feed Push', icon: Activity, description: 'Push sitemap to search engines', color: 'bg-yellow-500', category: 'crawling', endpoint: `${TECH_PREFIX}/sitemap_feed_push`, inputs: ['url'] },
  { id: 'dynamic_js_rendering', name: 'Dynamic JS Rendering Audit', icon: Code, description: 'Audit JavaScript rendering', color: 'bg-lime-500', category: 'crawling', endpoint: `${TECH_PREFIX}/js_rendering_audit`, inputs: ['url'] },
  { id: 'dynamic_content_indexability', name: 'Dynamic Content Indexability', icon: Code, description: 'Check dynamic content indexing', color: 'bg-green-500', category: 'crawling', endpoint: `${TECH_PREFIX}/dynamic_content_indexability`, inputs: ['url'] },
  { id: 'js_framework_seo', name: 'JS Framework SEO', icon: Code, description: 'SEO for JS frameworks', color: 'bg-emerald-500', category: 'crawling', endpoint: `${TECH_PREFIX}/js_framework_seo`, inputs: [] },
  { id: 'spa_routing', name: 'SPA Routing Indexation', icon: Code, description: 'SPA routing for search engines', color: 'bg-teal-500', category: 'crawling', endpoint: `${TECH_PREFIX}/spa_routing_indexation`, inputs: ['url'] },
  { id: 'crawl_budget_optimizer', name: 'Crawl Budget Optimizer', icon: Activity, description: 'Optimize crawl budget', color: 'bg-cyan-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_budget_optimization`, inputs: ['url'] },
  { id: 'crawl_budget_micro', name: 'Crawl Budget Micro', icon: Activity, description: 'Page-level budget optimization', color: 'bg-sky-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_budget_micro`, inputs: [] },
  { id: 'crawl_budget_health', name: 'Crawl Budget Health', icon: Activity, description: 'Monitor crawl budget health', color: 'bg-blue-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_budget_health`, inputs: ['url'] },
  { id: 'crawl_error_detector', name: 'Crawl Error Detector', icon: AlertTriangle, description: 'Detect crawl errors', color: 'bg-indigo-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_error_detection`, inputs: ['url'] },
  { id: 'crawl_error_monitor', name: 'Crawl Error Monitor', icon: AlertTriangle, description: 'Continuous error monitoring', color: 'bg-violet-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_error_monitor`, inputs: ['url'] },
  { id: 'crawl_error_detection_micro', name: 'Crawl Error Detection Micro', icon: AlertTriangle, description: 'Detailed error detection', color: 'bg-purple-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_error_detection_micro`, inputs: [] },
  { id: 'crawl_health_monitor', name: 'Crawl Health Monitor', icon: Activity, description: 'Overall crawl health', color: 'bg-fuchsia-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawl_health_monitor`, inputs: ['url'] },
  { id: 'log_file_analyzer', name: 'Log File Analyzer', icon: Activity, description: 'Analyze server logs for SEO', color: 'bg-pink-500', category: 'crawling', endpoint: `${TECH_PREFIX}/log_file_analyzer`, inputs: [] },
  { id: 'log_file_analysis', name: 'Log File Analysis', icon: Activity, description: 'Detailed log file analysis', color: 'bg-rose-500', category: 'crawling', endpoint: `${TECH_PREFIX}/log_file_analysis`, inputs: [] },
  { id: 'log_file_analyzer_micro', name: 'Log File Analyzer Micro', icon: Activity, description: 'Individual log entry analysis', color: 'bg-red-500', category: 'crawling', endpoint: `${TECH_PREFIX}/log_file_analyzer_micro`, inputs: [] },
  { id: 'indexing_status', name: 'Indexing Status', icon: Activity, description: 'Track indexing status', color: 'bg-orange-500', category: 'crawling', endpoint: `${TECH_PREFIX}/indexing_status`, inputs: ['url'] },
  { id: 'index_status_monitoring', name: 'Index Status Monitoring', icon: Activity, description: 'Monitor specific URL indexing', color: 'bg-amber-500', category: 'crawling', endpoint: `${TECH_PREFIX}/index_status_monitoring`, inputs: [] },
  { id: 'index_coverage_audit', name: 'Index Coverage Audit', icon: Activity, description: 'Audit index coverage', color: 'bg-yellow-500', category: 'crawling', endpoint: `${TECH_PREFIX}/index_coverage_audit`, inputs: ['url'] },
  { id: 'index_coverage_reporter', name: 'Index Coverage Reporter', icon: Activity, description: 'Report on index coverage', color: 'bg-lime-500', category: 'crawling', endpoint: `${TECH_PREFIX}/index_coverage_reporter`, inputs: [] },
  { id: 'indexation_control', name: 'Indexation Control', icon: Activity, description: 'Control page indexation', color: 'bg-green-500', category: 'crawling', endpoint: `${TECH_PREFIX}/indexation_control`, inputs: [] },
  { id: 'historical_indexation', name: 'Historical Indexation Tracking', icon: Activity, description: 'Track indexation trends', color: 'bg-emerald-500', category: 'crawling', endpoint: `${TECH_PREFIX}/historical_indexation`, inputs: ['url'] },
  { id: 'index_drop_alert', name: 'Index Drop Alert', icon: AlertTriangle, description: 'Alert on index drops', color: 'bg-teal-500', category: 'crawling', endpoint: `${TECH_PREFIX}/index_drop_alert`, inputs: ['url'] },
  { id: 'noindex_audit', name: 'Noindex/Nofollow Audit', icon: Activity, description: 'Audit noindex tags', color: 'bg-cyan-500', category: 'crawling', endpoint: `${TECH_PREFIX}/noindex_audit`, inputs: ['url'] },
  { id: 'crawler_emulation', name: 'Universal Crawler Emulation', icon: Bot, description: 'Emulate search engine crawlers', color: 'bg-sky-500', category: 'crawling', endpoint: `${TECH_PREFIX}/crawler_emulation`, inputs: ['url'] },

  // ============ SITE STRUCTURE (23) ============
  { id: 'url_structure_optimizer', name: 'URL Structure Optimizer', icon: Globe, description: 'Optimize URL structure', color: 'bg-blue-500', category: 'structure', endpoint: `${TECH_PREFIX}/url_structure_optimization`, inputs: ['url'] },
  { id: 'url_structure_enforcement', name: 'URL Structure Enforcement', icon: Globe, description: 'Enforce URL standards', color: 'bg-indigo-500', category: 'structure', endpoint: `${TECH_PREFIX}/url_structure_enforcement`, inputs: [] },
  { id: 'url_standardizer', name: 'URL Standardizer', icon: Globe, description: 'Standardize URL structure', color: 'bg-violet-500', category: 'structure', endpoint: `${TECH_PREFIX}/url_standardizer`, inputs: [] },
  { id: 'canonical_manager', name: 'Canonical Tag Manager', icon: Globe, description: 'Manage canonical tags', color: 'bg-purple-500', category: 'structure', endpoint: `${TECH_PREFIX}/canonical_management`, inputs: ['url'] },
  { id: 'canonical_validator', name: 'Canonical Tag Validator', icon: Globe, description: 'Validate canonical tags', color: 'bg-fuchsia-500', category: 'structure', endpoint: `${TECH_PREFIX}/canonical_validator`, inputs: [] },
  { id: 'canonical_compliance', name: 'Canonical Compliance', icon: Globe, description: 'Ensure canonical compliance', color: 'bg-pink-500', category: 'structure', endpoint: `${TECH_PREFIX}/canonical_compliance`, inputs: ['url'] },
  { id: 'redirect_manager', name: 'Redirect Manager', icon: Globe, description: 'Manage redirects', color: 'bg-rose-500', category: 'structure', endpoint: `${TECH_PREFIX}/redirect_management`, inputs: [] },
  { id: 'redirect_manager_micro', name: 'Redirect Manager Micro', icon: Globe, description: 'Individual redirect management', color: 'bg-red-500', category: 'structure', endpoint: `${TECH_PREFIX}/redirect_manager_micro`, inputs: [] },
  { id: 'redirect_chain_detector', name: 'Redirect Chain Detector', icon: AlertTriangle, description: 'Detect redirect chains', color: 'bg-orange-500', category: 'structure', endpoint: `${TECH_PREFIX}/redirect_chain_detector`, inputs: ['url'] },
  { id: 'redirect_chain_cleaner', name: 'Redirect Chain Cleaner', icon: AlertTriangle, description: 'Clean redirect chains', color: 'bg-amber-500', category: 'structure', endpoint: `${TECH_PREFIX}/redirect_chain_cleaning`, inputs: [] },
  { id: 'redirect_chain_cleaner_micro', name: 'Redirect Chain Cleaner Micro', icon: AlertTriangle, description: 'Clean specific chains', color: 'bg-yellow-500', category: 'structure', endpoint: `${TECH_PREFIX}/redirect_chain_cleaner_micro`, inputs: [] },
  { id: 'redirect_map_maintenance', name: 'Redirect Map Maintenance', icon: Globe, description: 'Maintain redirect maps', color: 'bg-lime-500', category: 'structure', endpoint: `${TECH_PREFIX}/redirect_map_maintenance`, inputs: ['url'] },
  { id: 'pagination_faceted_nav', name: 'Pagination & Faceted Nav', icon: Globe, description: 'Manage pagination', color: 'bg-green-500', category: 'structure', endpoint: `${TECH_PREFIX}/pagination_control`, inputs: ['url'] },
  { id: 'pagination_crawl_control', name: 'Pagination Crawl Control', icon: Globe, description: 'Control pagination crawling', color: 'bg-emerald-500', category: 'structure', endpoint: `${TECH_PREFIX}/pagination_crawl_control`, inputs: [] },
  { id: 'pagination_canonical', name: 'Pagination Canonical', icon: Globe, description: 'Handle pagination canonicals', color: 'bg-teal-500', category: 'structure', endpoint: `${TECH_PREFIX}/pagination_canonical`, inputs: [] },
  { id: 'faceted_nav_controller', name: 'Faceted Nav Controller', icon: Globe, description: 'Control faceted navigation', color: 'bg-cyan-500', category: 'structure', endpoint: `${TECH_PREFIX}/faceted_nav_controller`, inputs: ['url'] },
  { id: 'faceted_nav_indexability', name: 'Faceted Nav Indexability', icon: Globe, description: 'Control faceted nav indexing', color: 'bg-sky-500', category: 'structure', endpoint: `${TECH_PREFIX}/faceted_nav_indexability`, inputs: [] },
  { id: 'internal_linking_auditor', name: 'Internal Linking Auditor', icon: Link2, description: 'Audit internal links', color: 'bg-blue-500', category: 'structure', endpoint: `${TECH_PREFIX}/internal_linking_audit`, inputs: ['url'] },
  { id: 'breadcrumb_schema', name: 'Breadcrumb Schema Manager', icon: Globe, description: 'Manage breadcrumb schema', color: 'bg-indigo-500', category: 'structure', endpoint: `${TECH_PREFIX}/breadcrumb_schema`, inputs: ['url'] },
  { id: 'breadcrumb_enhancer', name: 'Breadcrumb Enhancer', icon: Globe, description: 'Enhance breadcrumb navigation', color: 'bg-violet-500', category: 'structure', endpoint: `${TECH_PREFIX}/breadcrumb_enhancer`, inputs: [] },
  { id: 'logical_structure_nav', name: 'Logical Structure Nav', icon: Globe, description: 'Optimize logical navigation', color: 'bg-purple-500', category: 'structure', endpoint: `${TECH_PREFIX}/logical_structure_nav`, inputs: ['url'] },
  { id: 'duplicate_content_scanner', name: 'Duplicate Content Scanner', icon: AlertTriangle, description: 'Scan for duplicates', color: 'bg-fuchsia-500', category: 'structure', endpoint: `${TECH_PREFIX}/duplicate_scanning`, inputs: [] },
  { id: 'duplicate_thin_detection', name: 'Duplicate & Thin Detection', icon: AlertTriangle, description: 'Detect duplicate/thin content', color: 'bg-pink-500', category: 'structure', endpoint: `${TECH_PREFIX}/duplicate_thin_detection`, inputs: ['url'] },

  // ============ SPEED & PERFORMANCE (21) ============
  { id: 'page_speed', name: 'Page Speed Analyzer', icon: Zap, description: 'Analyze page speed', color: 'bg-rose-500', category: 'performance', endpoint: `${TECH_PREFIX}/page_speed_analysis`, inputs: ['url'] },
  { id: 'page_speed_micro', name: 'Page Speed Micro', icon: Zap, description: 'Detailed speed analysis', color: 'bg-red-500', category: 'performance', endpoint: `${TECH_PREFIX}/page_speed_detailed_analysis`, inputs: ['url'] },
  { id: 'page_speed_analytics', name: 'Page Speed Analytics', icon: Zap, description: 'Speed analytics', color: 'bg-orange-500', category: 'performance', endpoint: `${TECH_PREFIX}/page_speed_analytics`, inputs: [] },
  { id: 'page_speed_tester', name: 'Page Speed Tester', icon: Zap, description: 'Test page speed', color: 'bg-amber-500', category: 'performance', endpoint: `${TECH_PREFIX}/page_speed_testing`, inputs: ['url'] },
  { id: 'core_web_vitals', name: 'Core Web Vitals Monitor', icon: Zap, description: 'Monitor Core Web Vitals', color: 'bg-yellow-500', category: 'performance', endpoint: `${TECH_PREFIX}/core_web_vitals_monitoring`, inputs: ['url'] },
  { id: 'speed_optimization', name: 'Speed Optimization', icon: Zap, description: 'Optimize speed', color: 'bg-lime-500', category: 'performance', endpoint: `${TECH_PREFIX}/speed_optimization`, inputs: ['url'] },
  { id: 'performance_optimization', name: 'Performance Optimization', icon: Zap, description: 'Overall performance', color: 'bg-green-500', category: 'performance', endpoint: `${TECH_PREFIX}/performance_optimization`, inputs: ['url'] },
  { id: 'crp_optimizer_micro', name: 'CRP Optimizer Micro', icon: Zap, description: 'Optimize critical rendering', color: 'bg-emerald-500', category: 'performance', endpoint: `${TECH_PREFIX}/critical_rendering_path_optimization`, inputs: [] },
  { id: 'crp_optimizer', name: 'CRP Optimizer', icon: Zap, description: 'Site-wide CRP optimization', color: 'bg-teal-500', category: 'performance', endpoint: `${TECH_PREFIX}/critical_rendering_path_site_optimization`, inputs: ['url'] },
  { id: 'crp_analyzer', name: 'CRP Analyzer', icon: Zap, description: 'Analyze critical rendering path', color: 'bg-cyan-500', category: 'performance', endpoint: `${TECH_PREFIX}/critical_rendering_path_analysis`, inputs: ['url'] },
  { id: 'resource_loading_optimizer', name: 'Resource Loading Optimizer', icon: Zap, description: 'Optimize resource loading', color: 'bg-sky-500', category: 'performance', endpoint: `${TECH_PREFIX}/resource_loading_optimization`, inputs: [] },
  { id: 'resource_load_micro', name: 'Resource Load Micro', icon: Zap, description: 'Individual resource optimization', color: 'bg-blue-500', category: 'performance', endpoint: `${TECH_PREFIX}/resource_load_optimization_micro`, inputs: [] },
  { id: 'resource_efficiency', name: 'Resource Efficiency', icon: Zap, description: 'Analyze resource efficiency', color: 'bg-indigo-500', category: 'performance', endpoint: `${TECH_PREFIX}/resource_efficiency_analysis`, inputs: ['url'] },
  { id: 'image_media_opt', name: 'Image/Media Optimizer', icon: Zap, description: 'Optimize images and media', color: 'bg-violet-500', category: 'performance', endpoint: `${TECH_PREFIX}/image_media_optimization`, inputs: ['url'] },
  { id: 'third_party_scripts', name: 'Third-Party Script Audit', icon: Zap, description: 'Audit 3rd party scripts', color: 'bg-purple-500', category: 'performance', endpoint: `${TECH_PREFIX}/third_party_script_audit`, inputs: ['url'] },
  { id: 'lazy_loading', name: 'Lazy Load & Preloading', icon: Zap, description: 'Manage lazy loading', color: 'bg-fuchsia-500', category: 'performance', endpoint: `${TECH_PREFIX}/lazy_load_preloading_management`, inputs: [] },
  { id: 'cdn_health', name: 'CDN Health Monitor', icon: Zap, description: 'Monitor CDN health', color: 'bg-pink-500', category: 'performance', endpoint: `${TECH_PREFIX}/cdn_hosting_health_monitoring`, inputs: ['url'] },
  { id: 'cdn_edge_cache', name: 'CDN Edge Cache Monitor', icon: Zap, description: 'Monitor edge cache', color: 'bg-rose-500', category: 'performance', endpoint: `${TECH_PREFIX}/cdn_edge_cache_monitoring`, inputs: ['url'] },
  { id: 'cdn_failover', name: 'CDN Failover Manager', icon: Zap, description: 'Manage CDN failover', color: 'bg-red-500', category: 'performance', endpoint: `${TECH_PREFIX}/cdn_failover_management`, inputs: [] },
  { id: 'server_uptime_watchdog', name: 'Server Uptime Watchdog', icon: Zap, description: 'Watch server uptime', color: 'bg-orange-500', category: 'performance', endpoint: `${TECH_PREFIX}/server_uptime_watchdog`, inputs: ['url'] },
  { id: 'server_uptime_latency', name: 'Server Uptime & Latency', icon: Zap, description: 'Monitor uptime and latency', color: 'bg-amber-500', category: 'performance', endpoint: `${TECH_PREFIX}/server_uptime_latency_monitoring`, inputs: ['url'] },

  { id: 'mobile_friendly', name: 'Mobile Friendliness', icon: Smartphone, description: 'Check mobile friendliness', color: 'bg-yellow-500', category: 'mobile', endpoint: `${TECH_PREFIX}/mobile_friendliness_check`, inputs: ['url'] },
  { id: 'mobile_validator', name: 'Mobile Friendliness Validator', icon: Smartphone, description: 'Validate mobile elements', color: 'bg-lime-500', category: 'mobile', endpoint: `${TECH_PREFIX}/mobile_friendliness_validation`, inputs: [] },
  { id: 'mobile_usability', name: 'Mobile Usability Tester', icon: Smartphone, description: 'Test mobile usability', color: 'bg-green-500', category: 'mobile', endpoint: `${TECH_PREFIX}/mobile_usability_testing`, inputs: ['url'] },
  { id: 'responsive_layout', name: 'Responsive Layout Auditor', icon: Smartphone, description: 'Audit responsive design', color: 'bg-emerald-500', category: 'mobile', endpoint: `${TECH_PREFIX}/responsive_layout_audit`, inputs: [] },
  { id: 'mobile_first_consistency', name: 'Mobile-First Consistency', icon: Smartphone, description: 'Check mobile-desktop parity', color: 'bg-teal-500', category: 'mobile', endpoint: `${TECH_PREFIX}/mobile_first_consistency_check`, inputs: [] },
  { id: 'responsive_design', name: 'Responsive Design Auditor', icon: Smartphone, description: 'Audit responsive design', color: 'bg-cyan-500', category: 'mobile', endpoint: `${TECH_PREFIX}/responsive_design_audit`, inputs: ['url'] },
  { id: 'responsive_ui', name: 'Responsive UI Tester', icon: Smartphone, description: 'Test UI across viewports', color: 'bg-sky-500', category: 'mobile', endpoint: `${TECH_PREFIX}/responsive_ui_testing`, inputs: ['url'] },
  { id: 'mobile_speed_tap', name: 'Mobile Speed & Tap Targets', icon: Smartphone, description: 'Audit mobile speed/taps', color: 'bg-blue-500', category: 'mobile', endpoint: `${TECH_PREFIX}/mobile_speed_tap_target_audit`, inputs: ['url'] },
  { id: 'accessibility_micro', name: 'Accessibility Compliance', icon: Smartphone, description: 'Check WCAG compliance', color: 'bg-indigo-500', category: 'mobile', endpoint: `${TECH_PREFIX}/accessibility_compliance_check`, inputs: [] },
  { id: 'wcag_audit', name: 'WCAG Compliance Auditor', icon: Smartphone, description: 'Comprehensive WCAG audit', color: 'bg-violet-500', category: 'mobile', endpoint: `${TECH_PREFIX}/wcag_compliance_audit`, inputs: ['url'] },
  { id: 'interstitial_detector', name: 'Interstitial Ad Detector', icon: AlertTriangle, description: 'Detect intrusive ads', color: 'bg-purple-500', category: 'mobile', endpoint: `${TECH_PREFIX}/interstitial_ad_intrusion_detection`, inputs: [] },
  { id: 'ssl_https', name: 'SSL/HTTPS Checker', icon: Shield, description: 'Check SSL certificate', color: 'bg-fuchsia-500', category: 'security', endpoint: `${TECH_PREFIX}/ssl_https_check`, inputs: ['url','domain'] },
{ id: 'ssl_tls_health', name: 'SSL/TLS Health Checker', icon: Shield, description: 'Validate SSL/TLS config', color: 'bg-pink-500', category: 'security', endpoint: `${TECH_PREFIX}/ssl_tls_health_check`, inputs: ['url','domain'] },
{ id: 'https_implementation', name: 'HTTPS Implementation', icon: Shield, description: 'Monitor HTTPS setup', color: 'bg-rose-500', category: 'security', endpoint: `${TECH_PREFIX}/https_implementation_monitoring`, inputs: ['url'] },
{ id: 'https_ssl_monitor', name: 'HTTPS/SSL Health Monitor', icon: Shield, description: 'Continuous SSL monitoring', color: 'bg-red-500', category: 'security', endpoint: `${TECH_PREFIX}/https_ssl_health_monitoring`, inputs: ['url','domain'] },
{ id: 'https_ssl_validator', name: 'HTTPS/SSL Validator', icon: Shield, description: 'Validate HTTPS/SSL', color: 'bg-orange-500', category: 'security', endpoint: `${TECH_PREFIX}/https_ssl_validation`, inputs: ['url'] },
{ id: 'security_headers', name: 'Security Headers Manager', icon: Shield, description: 'Manage security headers', color: 'bg-amber-500', category: 'security', endpoint: `${TECH_PREFIX}/security_headers_management`, inputs: ['url'] },
{ id: 'security_headers_enforcer', name: 'Security Headers Enforcer', icon: Shield, description: 'Enforce security headers', color: 'bg-yellow-500', category: 'security', endpoint: `${TECH_PREFIX}/security_headers_enforcement`, inputs: ['url','domain'] },
{ id: 'security_headers_enforcer_agent', name: 'Security Headers Enforcer Agent', icon: Shield, description: 'Custom header enforcement', color: 'bg-lime-500', category: 'security', endpoint: `${TECH_PREFIX}/security_headers_enforcer_agent`, inputs: ['url'] },
{ id: 'malware_scanner', name: 'Malware & Vulnerability Scanner', icon: Shield, description: 'Scan for malware', color: 'bg-green-500', category: 'security', endpoint: `${TECH_PREFIX}/malware_vulnerability_scanning`, inputs: ['url'] },
{ id: 'malware_detection', name: 'Malware Detection Agent', icon: Shield, description: 'Continuous malware monitoring', color: 'bg-emerald-500', category: 'security', endpoint: `${TECH_PREFIX}/malware_vulnerability_detection`, inputs: [] },
{ id: 'malware_spam', name: 'Malware & Spam Scanner', icon: Shield, description: 'Scan for malware patterns', color: 'bg-teal-500', category: 'security', endpoint: `${TECH_PREFIX}/malware_spam_scanning`, inputs: [] },
{ id: 'privacy_audit', name: 'Privacy & Consent Auditor', icon: Shield, description: 'Audit privacy compliance', color: 'bg-cyan-500', category: 'security', endpoint: `${TECH_PREFIX}/privacy_consent_audit`, inputs: [] },
{ id: 'gdpr_compliance', name: 'GDPR/CCPA Compliance', icon: Shield, description: 'Check GDPR/CCPA compliance', color: 'bg-sky-500', category: 'security', endpoint: `${TECH_PREFIX}/gdpr_ccpa_compliance_check`, inputs: ['url'] },
{ id: 'structured_data_validator', name: 'Structured Data Validator', icon: Code, description: 'Validate structured data', color: 'bg-blue-500', category: 'schema', endpoint: `${TECH_PREFIX}/structured_data_validation`, inputs: ['url'] },
{ id: 'structured_data_micro', name: 'Structured Data Micro', icon: Code, description: 'Validate JSON-LD/Microdata', color: 'bg-indigo-500', category: 'schema', endpoint: `${TECH_PREFIX}/structured_data_format_validation`, inputs: [] },
{ id: 'schema_generator', name: 'Schema Markup Generator', icon: Code, description: 'Generate schema markup', color: 'bg-violet-500', category: 'schema', endpoint: `${TECH_PREFIX}/schema_markup_generation`, inputs: ['page_type'] },
{ id: 'schema_generator_validator', name: 'Schema Generator & Validator', icon: Code, description: 'Generate and validate', color: 'bg-purple-500', category: 'schema', endpoint: `${TECH_PREFIX}/schema_markup_generation_validation`, inputs: ['page_type'] },
{ id: 'schema_validation_micro', name: 'Schema Validation Micro', icon: Code, description: 'In-depth schema validation', color: 'bg-fuchsia-500', category: 'schema', endpoint: `${TECH_PREFIX}/schema_validation_micro`, inputs: [] },
{ id: 'schema_coverage', name: 'Schema Coverage Analyzer', icon: Code, description: 'Analyze schema coverage', color: 'bg-pink-500', category: 'schema', endpoint: `${TECH_PREFIX}/schema_coverage_analysis`, inputs: ['url'] },
{ id: 'rich_snippet_trigger', name: 'Rich Snippet Trigger', icon: Code, description: 'Identify rich snippet triggers', color: 'bg-rose-500', category: 'schema', endpoint: `${TECH_PREFIX}/rich_snippet_trigger_detection`, inputs: [] },
{ id: 'rich_results_opportunity', name: 'Rich Results Opportunity', icon: Code, description: 'Detect rich result opportunities', color: 'bg-red-500', category: 'schema', endpoint: `${TECH_PREFIX}/rich_results_opportunity_detection`, inputs: ['url'] },
{ id: 'serp_feature_trigger', name: 'SERP Feature Trigger', icon: Code, description: 'Identify SERP features', color: 'bg-orange-500', category: 'schema', endpoint: `${TECH_PREFIX}/serp_feature_trigger_detection`, inputs: [] },
{ id: 'amp_optimization', name: 'AMP Optimization', icon: Code, description: 'Optimize for AMP', color: 'bg-amber-500', category: 'schema', endpoint: `${TECH_PREFIX}/web_stories_amp_optimization`, inputs: [] },
{ id: 'amp_compliance', name: 'AMP Compliance', icon: Code, description: 'Check AMP compliance', color: 'bg-yellow-500', category: 'schema', endpoint: `${TECH_PREFIX}/web_stories_amp_compliance`, inputs: ['url'] },
{ id: 'amp_validation', name: 'AMP Validator', icon: Code, description: 'Validate AMP pages', color: 'bg-lime-500', category: 'schema', endpoint: `${TECH_PREFIX}/web_stories_amp_validation`, inputs: [] },
{ id: 'amp_manager', name: 'AMP Page Manager', icon: Code, description: 'Manage AMP pages', color: 'bg-green-500', category: 'schema', endpoint: `${TECH_PREFIX}/amp_page_management`, inputs: ['url'] },
{ id: 'broken_link_checker', name: 'Broken Link Checker', icon: Link2, description: 'Check for broken links', color: 'bg-emerald-500', category: 'links', endpoint: `${TECH_PREFIX}/broken_link_checking`, inputs: ['url'] },
{ id: 'broken_link_detector', name: 'Broken Link Detector', icon: Link2, description: 'Detect broken links in HTML', color: 'bg-teal-500', category: 'links', endpoint: `${TECH_PREFIX}/broken_link_detection`, inputs: [] },
{ id: 'broken_external_monitor', name: 'Broken External Link Monitor', icon: Link2, description: 'Monitor external links', color: 'bg-cyan-500', category: 'links', endpoint: `${TECH_PREFIX}/broken_external_link_monitoring`, inputs: [] },
{ id: 'outbound_internal_scanner', name: 'Outbound/Internal Scanner', icon: Link2, description: 'Scan all link types', color: 'bg-sky-500', category: 'links', endpoint: `${TECH_PREFIX}/outbound_internal_broken_scanning`, inputs: ['url'] },
{ id: 'custom_404', name: 'Custom 404 Handler', icon: AlertTriangle, description: 'Manage 404 errors', color: 'bg-blue-500', category: 'links', endpoint: `${TECH_PREFIX}/custom_404_error_handling`, inputs: ['url'] },
{ id: 'soft_404', name: 'Soft 404 Monitor', icon: AlertTriangle, description: 'Monitor soft 404s', color: 'bg-indigo-500', category: 'links', endpoint: `${TECH_PREFIX}/soft_404_monitoring`, inputs: ['url'] },
{ id: 'server_errors', name: 'Server Error Detector', icon: AlertTriangle, description: 'Detect 5xx errors', color: 'bg-violet-500', category: 'links', endpoint: `${TECH_PREFIX}/server_error_detection`, inputs: ['url'] },
{ id: 'resource_blocking_micro', name: 'Resource Blocking Auditor Micro', icon: AlertTriangle, description: 'Audit blocked resources', color: 'bg-purple-500', category: 'links', endpoint: `${TECH_PREFIX}/resource_blocking_audit`, inputs: [] },
{ id: 'resource_blocking_agent', name: 'Resource Blocking Auditor', icon: AlertTriangle, description: 'Comprehensive resource audit', color: 'bg-fuchsia-500', category: 'links', endpoint: `${TECH_PREFIX}/resource_blocking_comprehensive_audit`, inputs: ['url'] },
{ id: 'bot_access', name: 'Bot Access Control', icon: Bot, description: 'Control bot access', color: 'bg-pink-500', category: 'bots', endpoint: `${TECH_PREFIX}/bot_access_control`, inputs: [] },
{ id: 'bot_fraud', name: 'Bot Fraud Detection', icon: Bot, description: 'Detect bot fraud', color: 'bg-rose-500', category: 'bots', endpoint: `${TECH_PREFIX}/bot_fraud_detection`, inputs: [] },
{ id: 'hreflang_validation', name: 'Hreflang Validation', icon: Map, description: 'Validate hreflang tags', color: 'bg-red-500', category: 'international', endpoint: `${TECH_PREFIX}/international_seo_hreflang_validation`, inputs: ['url'] },
{ id: 'hreflang_audit', name: 'Hreflang Implementation Audit', icon: Map, description: 'Audit hreflang setup', color: 'bg-orange-500', category: 'international', endpoint: `${TECH_PREFIX}/hreflang_implementation_audit`, inputs: ['url'] },
{ id: 'hreflang_targeting', name: 'Hreflang International Targeting', icon: Map, description: 'Manage international targeting', color: 'bg-amber-500', category: 'international', endpoint: `${TECH_PREFIX}/hreflang_international_targeting`, inputs: [] },
{ id: 'geo_targeting', name: 'Geo-Targeted Content', icon: Map, description: 'Personalize by location', color: 'bg-yellow-500', category: 'international', endpoint: `${TECH_PREFIX}/geo_targeted_content_personalization`, inputs: ['url'] },
{ id: 'geo_ip', name: 'Geo-IP Personalization', icon: Map, description: 'Geo-IP content personalization', color: 'bg-lime-500', category: 'international', endpoint: `${TECH_PREFIX}/geo_ip_personalization`, inputs: [] },
{ id: 'cache_busting', name: 'Automated Cache Buster', icon: AlertTriangle, description: 'Automated cache clearing', color: 'bg-green-500', category: 'errors', endpoint: `${TECH_PREFIX}/automated_cache_busting`, inputs: [] },
{ id: 'disaster_recovery', name: 'Disaster Recovery Agent', icon: Shield, description: 'Automated recovery', color: 'bg-emerald-500', category: 'errors', endpoint: `${TECH_PREFIX}/automated_disaster_recovery`, inputs: [] },
{ id: 'testing_rollback', name: 'Testing & Rollback Agent', icon: AlertTriangle, description: 'Automated testing/rollback', color: 'bg-teal-500', category: 'errors', endpoint: `${TECH_PREFIX}/automated_testing_rollback`, inputs: [] },
{ id: 'infinite_scroll', name: 'Infinite Scroll Indexability', icon: Sparkles, description: 'Check scroll indexability', color: 'bg-cyan-500', category: 'emerging', endpoint: `${TECH_PREFIX}/infinite_scroll_lazy_indexability`, inputs: ['url'] },
{ id: 'infinite_scroll_a11y', name: 'Infinite Scroll Accessibility', icon: Sparkles, description: 'Check scroll accessibility', color: 'bg-sky-500', category: 'emerging', endpoint: `${TECH_PREFIX}/infinite_scroll_accessibility`, inputs: [] },
{ id: 'voice_search', name: 'Voice Search Readiness', icon: Sparkles, description: 'Voice search optimization', color: 'bg-blue-500', category: 'emerging', endpoint: `${TECH_PREFIX}/voice_search_readiness`, inputs: ['url'] },
{ id: 'conversational', name: 'Conversational Search', icon: Sparkles, description: 'Conversational readiness', color: 'bg-indigo-500', category: 'emerging', endpoint: `${TECH_PREFIX}/conversational_search_readiness`, inputs: [] },
{ id: 'jamstack_seo', name: 'Jamstack SEO', icon: Sparkles, description: 'Optimize Jamstack/headless CMS', color: 'bg-violet-500', category: 'emerging', endpoint: `${TECH_PREFIX}/headless_cms_jamstack_seo`, inputs: [] },
{ id: 'favicon_manifest', name: 'Favicon & Manifest', icon: Sparkles, description: 'Optimize favicon/manifest', color: 'bg-purple-500', category: 'emerging', endpoint: `${TECH_PREFIX}/favicon_manifest_optimization`, inputs: ['url'] },
{ id: 'alt_search_engines', name: 'Alternative Search Engines', icon: Sparkles, description: 'Optimize for non-Google', color: 'bg-fuchsia-500', category: 'emerging', endpoint: `${TECH_PREFIX}/non_standard_search_engines`, inputs: ['url'] },
{ id: 'webmention', name: 'Webmention & Pingback', icon: Sparkles, description: 'Repair webmention functionality', color: 'bg-pink-500', category: 'emerging', endpoint: `${TECH_PREFIX}/webmention_pingback_repair`, inputs: ['url'] },
{ id: 'content_volatility', name: 'Content Volatility Tracker', icon: TrendingUp, description: 'Track content changes', color: 'bg-rose-500', category: 'monitoring', endpoint: `${TECH_PREFIX}/content_volatility_tracking`, inputs: ['url'] },
{ id: 'technical_gap', name: 'Technical Gap Analyzer', icon: Target, description: 'Analyze technical gaps', color: 'bg-red-500', category: 'competitive', endpoint: `${TECH_PREFIX}/competitive_technical_gap_analysis`, inputs: ['url', 'competitor_urls'] },
{ id: 'loophole_hunter', name: 'Competitor Loophole Hunter', icon: Target, description: 'Find competitor loopholes', color: 'bg-orange-500', category: 'competitive', endpoint: `${TECH_PREFIX}/competitor_loophole_hunting`, inputs: [] },
{ id: 'emerging_trends', name: 'Emerging Trend Integration', icon: TrendingUp, description: 'Integrate new trends', color: 'bg-amber-500', category: 'competitive', endpoint: `${TECH_PREFIX}/emerging_trend_integration`, inputs: [] },
{ id: 'serp_features', name: 'SERP Feature Opportunities', icon: Target, description: 'Find SERP opportunities', color: 'bg-yellow-500', category: 'competitive', endpoint: `${TECH_PREFIX}/fringe_serp_feature_opportunities`, inputs: ['url'] },
{ id: 'micro_loopholes', name: 'Micro Loophole Detector', icon: Target, description: 'Detect micro advantages', color: 'bg-lime-500', category: 'competitive', endpoint: `${TECH_PREFIX}/micro_loophole_detection`, inputs: ['url', 'competitor_url'] },
{ id: 'task_prioritization', name: 'Task Prioritization', icon: BarChart, description: 'Prioritize tasks', color: 'bg-green-500', category: 'orchestration', endpoint: `${TECH_PREFIX}/task_prioritization_conflict_resolution`, inputs: [] },
{ id: 'workflow_sequencing', name: 'Workflow Sequencing', icon: BarChart, description: 'Sequence workflows', color: 'bg-emerald-500', category: 'orchestration', endpoint: `${TECH_PREFIX}/workflow_sequencing`, inputs: [] },
{ id: 'tech_health_dashboard', name: 'Technical Health Dashboard', icon: BarChart, description: 'Real-time health metrics', color: 'bg-teal-500', category: 'orchestration', endpoint: `${TECH_PREFIX}/technical_health_dashboard`, inputs: ['url'] },
{ id: 'reporting_dashboard', name: 'Comprehensive Reporting', icon: BarChart, description: 'Full SEO reporting', color: 'bg-cyan-500', category: 'orchestration', endpoint: `${TECH_PREFIX}/comprehensive_reporting_dashboard`, inputs: [] },
{ id: 'alerting_suite', name: 'Dashboard Alerting Suite', icon: AlertTriangle, description: 'Configure alerts', color: 'bg-sky-500', category: 'orchestration', endpoint: `${TECH_PREFIX}/dashboard_alerting_suite`, inputs: [] },
{ id: 'anomaly_detection', name: 'Anomaly Pattern Detector', icon: TrendingUp, description: 'Detect patterns/anomalies', color: 'bg-blue-500', category: 'orchestration', endpoint: `${TECH_PREFIX}/anomaly_pattern_detection`, inputs: [] },
];


  const categories = [
    { id: 'all', name: 'All Agents', count: technicalAgents.length },
    { id: 'crawling', name: 'Crawling & Indexing', count: technicalAgents.filter(a => a.category === 'crawling').length },
    { id: 'structure', name: 'Site Structure', count: technicalAgents.filter(a => a.category === 'structure').length },
    { id: 'performance', name: 'Performance', count: technicalAgents.filter(a => a.category === 'performance').length },
    { id: 'mobile', name: 'Mobile', count: technicalAgents.filter(a => a.category === 'mobile').length },
    { id: 'security', name: 'Security', count: technicalAgents.filter(a => a.category === 'security').length },
    { id: 'schema', name: 'Schema', count: technicalAgents.filter(a => a.category === 'schema').length },
    { id: 'links', name: 'Link Health', count: technicalAgents.filter(a => a.category === 'links').length },
    { id: 'bots', name: 'Bots', count: technicalAgents.filter(a => a.category === 'bots').length },
    { id: 'international', name: 'International', count: technicalAgents.filter(a => a.category === 'international').length },
    { id: 'errors', name: 'Error Handling', count: technicalAgents.filter(a => a.category === 'errors').length },
    { id: 'emerging', name: 'Emerging Tech', count: technicalAgents.filter(a => a.category === 'emerging').length },
    { id: 'monitoring', name: 'Monitoring', count: technicalAgents.filter(a => a.category === 'monitoring').length },
    { id: 'competitive', name: 'Competitive', count: technicalAgents.filter(a => a.category === 'competitive').length },
    { id: 'orchestration', name: 'Orchestration', count: technicalAgents.filter(a => a.category === 'orchestration').length }
  ];

  const filteredAgents = activeCategory === 'all' 
    ? technicalAgents 
    : technicalAgents.filter(a => a.category === activeCategory);

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

  const executeAgent = async (agent: typeof technicalAgents[0]) => {
    setExecuting(true);
    setResult(null);

    try {
      let requestBody: any = {};
      const inputs = agentInputs[agent.id] || {};
      const targetUrl = currentUrl || inputs.url;

      if (targetUrl) {
        requestBody.url = targetUrl;
      }

      // Add common inputs
      if (inputs.domain) requestBody.domain = inputs.domain;
      if (inputs.site_url) requestBody.site_url = inputs.site_url;
      if (inputs.html_content) requestBody.html_content = inputs.html_content;
      if (inputs.page_type) requestBody.page_type = inputs.page_type;
      if (inputs.competitor_urls) requestBody.competitor_urls = inputs.competitor_urls.split(',').map((u: string) => u.trim());
      if (inputs.competitor_url) requestBody.competitor_url = inputs.competitor_url;

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

  const renderAgentInputs = (agent: typeof technicalAgents[0]) => {
    const inputs = agentInputs[agent.id] || {};

    return (
      <div className="space-y-4 mt-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-slate-900">Input Options</h4>
          <span className="text-xs text-slate-500">Provide URL or specific data</span>
        </div>

        {!currentUrl && agent.inputs.includes('url') && (
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
            {agent.inputs.includes('domain') && renderInputField(agent.id, 'domain', 'Domain (Optional)', 'example.com')}
            {agent.inputs.includes('site_url') && renderInputField(agent.id, 'site_url', 'Site URL (Optional)', 'https://example.com')}
            {agent.inputs.includes('html_content') && renderInputField(agent.id, 'html_content', 'HTML Content (Optional)', '<html>...</html>', 'textarea')}
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
                  <option value="Product">Product</option>
                  <option value="Organization">Organization</option>
                  <option value="LocalBusiness">Local Business</option>
                  <option value="FAQPage">FAQ Page</option>
                </select>
              </div>
            )}
            {agent.inputs.includes('competitor_urls') && renderInputField(agent.id, 'competitor_urls', 'Competitor URLs (comma-separated)', 'https://comp1.com, https://comp2.com')}
            {agent.inputs.includes('competitor_url') && renderInputField(agent.id, 'competitor_url', 'Competitor URL', 'https://competitor.com')}
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
          <Activity className="size-6 text-blue-600" />
          <div>
            <h2 className="text-slate-900">Technical SEO Agents</h2>
            <p className="text-sm text-slate-600">
              153 specialized agents for crawling, indexing, performance, mobile, security, schema, and more
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

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-900">
              <strong>Complete Technical SEO Arsenal:</strong> All 153 agents are now available for comprehensive site analysis
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl text-blue-700">153</div>
            <div className="text-xs text-blue-600">Total Agents</div>
          </div>
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
