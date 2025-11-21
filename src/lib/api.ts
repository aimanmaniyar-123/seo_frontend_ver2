// API Configuration and utilities
import { API_BASE_URL, USE_MOCK_DATA, getApiUrl } from '../utils/api';

// Mock data for development
const mockHealth = {
  health_status: 'EXCELLENT',
  total_agents: 5,
  successful_agents: 4,
  failed_agents: 0,
  success_percentage: 80,
  uptime: 'active',
  timestamp: new Date().toISOString()
};

const mockAgents = {
  agents: [
    {
      name: 'seo_orchestration_core',
      dependencies: [],
      status: 'success',
      last_run: new Date().toISOString()
    },
    {
      name: 'on_page_seo_agent',
      dependencies: [],
      status: 'success',
      last_run: new Date().toISOString()
    },
    {
      name: 'off_page_seo_agent',
      dependencies: ['on_page_seo_agent'],
      status: 'not_run',
      last_run: null
    },
    {
      name: 'technical_seo_agent',
      dependencies: [],
      status: 'success',
      last_run: new Date().toISOString()
    },
    {
      name: 'local_seo_agent',
      dependencies: ['technical_seo_agent'],
      status: 'not_run',
      last_run: null
    }
  ],
  total_agents: 5,
  execution_order: [
    'seo_orchestration_core',
    'on_page_seo_agent',
    'technical_seo_agent',
    'off_page_seo_agent',
    'local_seo_agent'
  ],
  agents_with_dependencies: 2
};

const mockDependencies = {
  dependency_graph: {
    'seo_orchestration_core': {
      dependencies: [],
      dependents: []
    },
    'on_page_seo_agent': {
      dependencies: [],
      dependents: ['off_page_seo_agent']
    },
    'off_page_seo_agent': {
      dependencies: ['on_page_seo_agent'],
      dependents: []
    },
    'technical_seo_agent': {
      dependencies: [],
      dependents: ['local_seo_agent']
    },
    'local_seo_agent': {
      dependencies: ['technical_seo_agent'],
      dependents: []
    }
  },
  total_agents: 5,
  agents_with_dependencies: 2,
  agents_with_dependents: 2,
  timestamp: new Date().toISOString()
};

const mockLogs = {
  total_entries: 10,
  returned: 10,
  offset: 0,
  limit: 50,
  logs: [
    {
      agent: 'seo_orchestration_core',
      success: true,
      message: 'Executed successfully',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      agent: 'on_page_seo_agent',
      success: true,
      message: 'Executed successfully',
      timestamp: new Date(Date.now() - 240000).toISOString()
    },
    {
      agent: 'technical_seo_agent',
      success: true,
      message: 'Executed successfully',
      timestamp: new Date(Date.now() - 180000).toISOString()
    },
    {
      agent: 'off_page_seo_agent',
      success: false,
      message: 'Dependency not met: on_page_seo_agent',
      timestamp: new Date(Date.now() - 120000).toISOString()
    }
  ],
  timestamp: new Date().toISOString()
};

// API fetch wrapper with mock data fallback
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // If using mock data, return immediately
  if (USE_MOCK_DATA) {
    return getMockData(endpoint) as T;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Check if response is HTML (common error page)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      console.warn(`Received HTML instead of JSON for ${endpoint}. Using mock data.`);
      return getMockData(endpoint) as T;
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}. Using mock data.`, error);
    return getMockData(endpoint) as T;
  }
}

// Get mock data based on endpoint
function getMockData(endpoint: string): any {
  // Remove query parameters for matching
  const baseEndpoint = endpoint.split('?')[0];

  if (baseEndpoint === '/health') {
    return mockHealth;
  }
  
  if (baseEndpoint === '/agents') {
    return mockAgents;
  }
  
  if (baseEndpoint === '/agent_dependencies') {
    return mockDependencies;
  }
  
  if (baseEndpoint === '/execution_log') {
    return mockLogs;
  }
  
  if (baseEndpoint.startsWith('/trigger_agent/')) {
    const agentName = baseEndpoint.split('/').pop();
    return {
      agent: agentName,
      success: true,
      result: {
        task: agentName,
        status: 'completed',
        actions: ['action_1', 'action_2']
      },
      timestamp: new Date().toISOString()
    };
  }
  
  if (baseEndpoint.startsWith('/trigger_phase/')) {
    const phaseName = baseEndpoint.split('/').pop();
    return {
      phase: phaseName,
      agents_executed: 3,
      results: [
        { agent: 'agent_1', success: true, result: {} },
        { agent: 'agent_2', success: true, result: {} },
        { agent: 'agent_3', success: true, result: {} }
      ],
      timestamp: new Date().toISOString()
    };
  }
  
  if (baseEndpoint === '/seo_orchestration_core') {
    return {
      status: 'SUCCESS',
      result: {
        source_url: 'https://example.com',
        source_domain: 'example.com',
        site_data: { domain: 'example.com', pages: {} },
        orchestration_plan: {
          phase_1_foundation: {
            agents: ['robots_txt_management', 'xml_sitemap_generator', 'canonical_tag_management'],
            estimated_duration: '30 minutes',
            dependencies: []
          },
          phase_2_onpage: {
            agents: ['title_tag_optimizer', 'meta_description_generator', 'header_tag_manager'],
            estimated_duration: '45 minutes',
            dependencies: ['phase_1_foundation']
          },
          phase_3_technical: {
            agents: ['page_speed_analyzer', 'mobile_usability_tester', 'schema_markup_validator'],
            estimated_duration: '60 minutes',
            dependencies: ['phase_1_foundation']
          },
          phase_4_content: {
            agents: ['content_quality_depth', 'keyword_mapping', 'internal_links_agent'],
            estimated_duration: '90 minutes',
            dependencies: ['phase_2_onpage']
          },
          phase_5_offpage: {
            agents: ['backlink_analyzer', 'social_signal_tracker', 'brand_mention_outreach'],
            estimated_duration: '120 minutes',
            dependencies: ['phase_4_content']
          }
        },
        priority_scores: {},
        resource_allocation: {
          total_agents_available: 5,
          active_agents: 4,
          failed_agents: 0
        },
        system_health: {
          overall_status: 'healthy',
          success_rate: 80
        },
        recommendations: [
          'Run foundation phase first',
          'Monitor technical SEO agents closely',
          'Schedule off-page activities for low-traffic hours'
        ]
      }
    };
  }
  
  if (baseEndpoint === '/trigger_all_agents') {
    return {
      message: 'All agents executed',
      results: [
        { agent: 'seo_orchestration_core', success: true, result: {} },
        { agent: 'on_page_seo_agent', success: true, result: {} },
        { agent: 'technical_seo_agent', success: true, result: {} },
        { agent: 'off_page_seo_agent', success: false, error: 'Dependency not met', retries: 3 },
        { agent: 'local_seo_agent', success: false, error: 'Dependency not met', retries: 3 }
      ],
      total_agents: 5,
      successful: 3,
      failed: 2,
      success_rate: 60,
      timestamp: new Date().toISOString()
    };
  }
  
  if (baseEndpoint === '/reset_agents') {
    return {
      message: 'All agent statuses and logs have been reset',
      previous_state: {
        total_agents: 5,
        successful_agents: 3,
        failed_agents: 2,
        log_entries_cleared: 10
      },
      timestamp: new Date().toISOString()
    };
  }

  // Local SEO Agents endpoints
  if (baseEndpoint === '/gmb_manager') {
    return {
      status: 'SUCCESS',
      result: {
        gmb_url: 'https://business.google.com/example',
        business_info: {
          name: 'Example Local Business',
          address: '123 Main St, New York, NY',
          phone: '(555) 123-4567',
          category: 'Restaurant'
        },
        management_actions: {
          business_info_updated: true,
          photos_uploaded: 3,
          posts_published: 2,
          reviews_responded: 1,
          q_and_a_updated: true,
          hours_verified: true
        },
        optimization_score: 85,
        recommendations: ['Add more photos', 'Post weekly updates']
      }
    };
  }

  if (baseEndpoint === '/business_profile_manager') {
    return {
      status: 'SUCCESS',
      result: {
        profile_updates: {
          listing_url: 'https://example-directory.com/business',
          attributes_updated: 5,
          verification_status: 'verified',
          completeness_score: 90
        },
        status: 'success',
        next_review_date: '2024-12-01'
      }
    };
  }

  if (baseEndpoint === '/citation_builder') {
    return {
      status: 'SUCCESS',
      result: {
        business_data: {
          name: 'Example Business',
          address: '123 Main St',
          phone: '555-1234'
        },
        citation_opportunities: [
          { directory: 'MapQuest', priority: 'high', estimated_da: 85, submission_cost: 'free' },
          { directory: 'Foursquare', priority: 'medium', estimated_da: 72, submission_cost: 'free' }
        ],
        existing_citations: [
          { directory: 'Google My Business', status: 'active', nap_consistent: true },
          { directory: 'Yelp', status: 'active', nap_consistent: false },
          { directory: 'Bing Places', status: 'active', nap_consistent: true }
        ],
        consistency_issues: 1,
        total_directories: 8,
        recommendations: 'Fix 1 consistency issue'
      }
    };
  }

  if (baseEndpoint === '/citation_creation_audit') {
    return {
      status: 'SUCCESS',
      result: {
        business_nap: ['Example Business', '123 Main St', '555-1234'],
        audit_results: [
          { directory: 'yellowpages.com', is_consistent: true, listing_exists: true, action_needed: 'none' },
          { directory: 'yelp.com', is_consistent: false, listing_exists: true, action_needed: 'update_info' },
          { directory: 'mapquest.com', is_consistent: true, listing_exists: false, action_needed: 'create_listing' }
        ],
        consistency_score: 66.7,
        directories_audited: 5,
        action_items: ['yelp.com', 'mapquest.com']
      }
    };
  }

  if (baseEndpoint === '/nap_consistency') {
    return {
      status: 'SUCCESS',
      result: {
        nap_variations: {
          names: ['Example Business', 'Example Business Inc'],
          addresses: ['123 Main St', '123 Main Street'],
          phones: ['555-1234', '(555) 123-4567']
        },
        consistency_check: {
          name_consistent: false,
          address_consistent: false,
          phone_consistent: false
        },
        overall_consistent: false,
        standardization_plan: {
          canonical_name: 'NEEDS_STANDARDIZATION',
          canonical_address: 'NEEDS_STANDARDIZATION',
          canonical_phone: 'NEEDS_STANDARDIZATION'
        },
        inconsistencies: [
          'Name variations: Example Business, Example Business Inc',
          'Address variations: 123 Main St, 123 Main Street'
        ],
        listings_analyzed: 2
      }
    };
  }

  if (baseEndpoint === '/review_management') {
    return {
      status: 'SUCCESS',
      result: {
        review_summary: {
          total_reviews: 15,
          average_rating: 4.3,
          response_rate_percent: 73.3,
          sentiment_breakdown: {
            positive: 10,
            neutral: 3,
            negative: 2
          }
        },
        sentiment_analysis: [
          { text: 'Great service!', rating: 5, sentiment: 'positive', platform: 'Google', responded: true },
          { text: 'Could be better', rating: 3, sentiment: 'neutral', platform: 'Yelp', responded: false }
        ],
        response_suggestions: [
          { review_index: 1, suggested_response: 'Thank you for taking the time to review us.' }
        ],
        acquisition_strategy: {
          current_review_rate: '2-3 per week',
          target_platforms: ['Google', 'Yelp', 'Facebook'],
          follow_up_needed: 2,
          positive_reviews_to_promote: 10
        },
        reputation_health: 'good'
      }
    };
  }

  if (baseEndpoint === '/local_keyword_research') {
    return {
      status: 'SUCCESS',
      result: {
        location: 'New York',
        business_type: 'restaurant',
        services: ['dining', 'takeout', 'catering'],
        local_keywords: [
          { keyword: 'restaurant in New York', search_volume: 1200, competition: 'high', commercial_intent: 'high', local_pack_difficulty: 8 },
          { keyword: 'best restaurant New York', search_volume: 890, competition: 'high', commercial_intent: 'high', local_pack_difficulty: 9 },
          { keyword: 'dining in New York', search_volume: 650, competition: 'medium', commercial_intent: 'high', local_pack_difficulty: 6 }
        ],
        keyword_categories: {
          high_intent: 12,
          brand_defense: 5,
          service_specific: 8,
          competitor_analysis: 2
        },
        total_keywords: 20,
        high_priority_count: 12
      }
    };
  }

  if (baseEndpoint === '/map_pack_rank_tracker') {
    return {
      status: 'SUCCESS',
      result: {
        tracking_summary: {
          keywords_tracked: 5,
          map_pack_appearances: 3,
          average_rank: 2.4,
          total_visibility_score: 382.5,
          location: 'New York, NY'
        },
        ranking_data: [
          { keyword: 'restaurant near me', business_rank: 2, in_map_pack: true, visibility_score: 85, search_volume: 2500 },
          { keyword: 'best pizza NYC', business_rank: 1, in_map_pack: true, visibility_score: 100, search_volume: 1800 },
          { keyword: 'italian restaurant NYC', business_rank: 4, in_map_pack: false, visibility_score: 55, search_volume: 1200 }
        ],
        competitive_analysis: {
          'Competitor A': { map_pack_appearances: 2, threat_level: 'medium' },
          'Competitor B': { map_pack_appearances: 4, threat_level: 'high' }
        },
        recommendations: ['Maintain current ranking', 'Focus on review quality']
      }
    };
  }

  if (baseEndpoint === '/local_competitor_benchmark') {
    return {
      status: 'SUCCESS',
      result: {
        business_data: { name: 'Your Business', reviews: 150, rating: 4.3 },
        competitive_comparison: {
          your_business: {
            name: 'Your Business',
            google_reviews_count: 150,
            average_rating: 4.3,
            gmb_completeness: 85,
            citation_count: 92,
            website_local_seo: 78,
            social_presence: 65
          },
          competitors: [
            { name: 'Competitor A', google_reviews_count: 200, average_rating: 4.1, gmb_completeness: 90 },
            { name: 'Competitor B', google_reviews_count: 89, average_rating: 4.6, gmb_completeness: 88 }
          ]
        },
        category_rankings: {
          google_reviews_count: { your_score: 150, your_rank: 2, improvement_needed: true },
          average_rating: { your_score: 4.3, your_rank: 2, improvement_needed: true }
        },
        improvement_opportunities: [
          { category: 'Google Reviews Count', current_rank: 2, gap_to_leader: 50, priority: 'medium' },
          { category: 'Average Rating', current_rank: 2, gap_to_leader: 0.3, priority: 'low' }
        ],
        competitive_analysis: {
          average_rank: 2.0,
          competitive_strength: 'competitive',
          categories_leading: 2,
          categories_need_improvement: 2
        }
      }
    };
  }

  // Off-Page SEO Agents endpoints - Backlink Management
  if (baseEndpoint === '/quality_backlink_sourcing') {
    return {
      status: 'SUCCESS',
      result: {
        backlink_sources: [
          { keyword: 'seo', potential_sites: ['seo-authority.com', 'best-seo.org'], domain_authority: 85, relevance: 'high' },
          { keyword: 'marketing', potential_sites: ['marketing-hub.com', 'marketing-news.net'], domain_authority: 78, relevance: 'high' }
        ],
        total_opportunities: 6
      }
    };
  }

  if (baseEndpoint === '/backlink_acquisition') {
    return {
      status: 'SUCCESS',
      result: {
        prospects: [
          { domain: 'authority-site.com', contact_email: 'editor@authority-site.com', content_type_preference: 'guest_post', estimated_da: 72, outreach_priority: 'high' },
          { domain: 'industry-blog.org', contact_email: 'editor@industry-blog.org', content_type_preference: 'resource', estimated_da: 65, outreach_priority: 'medium' }
        ],
        success_rate_estimate: 0.15
      }
    };
  }

  if (baseEndpoint === '/guest_posting') {
    return {
      status: 'SUCCESS',
      result: {
        guest_post_opportunities: [
          { site: 'digital marketing-blog.com', da: 68, guidelines: '1500+ words' },
          { site: 'marketing-insider.org', da: 75, guidelines: 'Original research required' },
          { site: 'top-seo.net', da: 58, guidelines: 'No self-promotional links' }
        ],
        average_da: 67,
        content_samples_needed: 3
      }
    };
  }

  if (baseEndpoint === '/outreach_guest_posting') {
    return {
      status: 'SUCCESS',
      result: {
        outreach_results: [
          { target_site: 'site1.com', contact_found: true, response_rate: 0.25, status: 'responded' },
          { target_site: 'site2.com', contact_found: true, response_rate: 0.18, status: 'contacted' },
          { target_site: 'site3.com', contact_found: false, response_rate: 0, status: 'rejected' }
        ],
        total_contacted: 3
      }
    };
  }

  if (baseEndpoint === '/outreach_execution') {
    return {
      status: 'SUCCESS',
      result: {
        execution_report: [
          { prospect: 'example.com', emails_sent: 2, opens: 1, replies: 1, conversion: true },
          { prospect: 'authority.com', emails_sent: 3, opens: 2, replies: 0, conversion: false }
        ],
        total_emails_sent: 5,
        reply_rate: 0.2
      }
    };
  }

  if (baseEndpoint === '/broken_link_building') {
    return {
      status: 'SUCCESS',
      result: {
        broken_link_opportunities: [
          { 
            website: 'industry-site.com', 
            broken_links: [
              { url: 'http://old-resource1.com', anchor_text: 'Resource 1' },
              { url: 'http://old-resource2.com', anchor_text: 'Resource 2' }
            ],
            replacement_opportunities: 2
          }
        ],
        total_opportunities: 2
      }
    };
  }

  if (baseEndpoint === '/skyscraper_content_outreach') {
    return {
      status: 'SUCCESS',
      result: {
        content_analysis: {
          topic: 'SEO Guide',
          competitor_analysis: {
            average_word_count: 2500,
            average_backlinks: 45,
            content_gaps_identified: ['mobile optimization', 'voice search', 'AI tools']
          },
          enhanced_content_plan: {
            word_count: 4000,
            unique_features: ['interactive tools', 'video tutorials', 'downloadable resources'],
            target_improvement: '40% more comprehensive'
          }
        },
        outreach_targets: [
          { site: 'authority-1.com', current_resource: 'old-seo-guide-1' },
          { site: 'authority-2.com', current_resource: 'old-seo-guide-2' }
        ]
      }
    };
  }

  if (baseEndpoint === '/lost_backlink_recovery') {
    return {
      status: 'SUCCESS',
      result: {
        recovery_attempts: [
          { lost_link: 'lost-link-1.com', recovery_email_sent: true, response_received: true, link_restored: true, alternative_offered: false },
          { lost_link: 'lost-link-2.org', recovery_email_sent: true, response_received: false, link_restored: false, alternative_offered: true }
        ],
        success_rate: 0.5,
        total_lost_links: 2
      }
    };
  }

  if (baseEndpoint === '/backlink_quality_evaluator') {
    return {
      status: 'SUCCESS',
      result: {
        backlink_evaluation: [
          { url: 'authority-site.com', domain_authority: 75, spam_score: 5, quality_rating: 'high', action: 'keep' },
          { url: 'low-quality.com', domain_authority: 20, spam_score: 85, quality_rating: 'low', action: 'disavow' },
          { url: 'medium-site.org', domain_authority: 45, spam_score: 30, quality_rating: 'medium', action: 'review' }
        ],
        average_quality: 46.7
      }
    };
  }

  if (baseEndpoint === '/anchor_text_diversity') {
    return {
      status: 'SUCCESS',
      result: {
        anchor_distribution: {
          exact_match: 15.0,
          partial_match: 25.0,
          branded: 40.0,
          generic: 20.0
        },
        recommendations: ['Maintain current distribution'],
        diversity_score: 100
      }
    };
  }

  if (baseEndpoint === '/toxic_link_detection') {
    return {
      status: 'SUCCESS',
      result: {
        toxic_links_found: 2,
        disavow_list: ['spam-site.com', 'bad-links.net'],
        disavow_file: '# Disavow file for example.com\ndomain:spam-site.com\ndomain:bad-links.net\n',
        clean_links: 8
      }
    };
  }

  if (baseEndpoint === '/backlink_profile_monitor') {
    return {
      status: 'SUCCESS',
      result: {
        monitoring_data: {
          domain: 'example.com',
          period: '30_days',
          new_backlinks: 18,
          lost_backlinks: 5,
          total_backlinks: 450,
          referring_domains: 125,
          link_velocity: 1.8,
          referral_traffic: 1250
        },
        net_growth: 13,
        growth_rate_percent: 2.89
      }
    };
  }

  // Brand Mention & Social Signals
  if (baseEndpoint === '/unlinked_brand_mention_finder') {
    return {
      status: 'SUCCESS',
      result: {
        unlinked_mentions: [
          { site: 'mention-site-1.com', mention_text: 'Great article about MyBrand', url: 'https://mention-site-1.com/article-1', domain_authority: 65, mention_type: 'positive' },
          { site: 'mention-site-2.org', mention_text: 'MyBrand offers excellent services', url: 'https://mention-site-2.org/review', domain_authority: 58, mention_type: 'positive' },
          { site: 'mention-site-3.net', mention_text: 'MyBrand could improve', url: 'https://mention-site-3.net/feedback', domain_authority: 42, mention_type: 'neutral' }
        ],
        total_mentions: 3,
        high_authority_mentions: 2
      }
    };
  }

  if (baseEndpoint === '/brand_mention_outreach') {
    return {
      status: 'SUCCESS',
      result: {
        outreach_results: [
          { site: 'example.com', outreach_sent: true, response_received: true, link_added: true, relationship_built: true },
          { site: 'blog-site.org', outreach_sent: true, response_received: false, link_added: false, relationship_built: false }
        ],
        conversion_rate: 0.5,
        total_outreach: 2
      }
    };
  }

  if (baseEndpoint === '/brand_mention_sentiment') {
    return {
      status: 'SUCCESS',
      result: {
        sentiment_analysis: [
          { text: 'Great product! Highly recommended...', source: 'review-site.com', sentiment: 'positive', score: 0.85 },
          { text: 'Could be better but okay...', source: 'feedback-blog.org', sentiment: 'neutral', score: 0.1 },
          { text: 'Disappointed with service...', source: 'complaint-forum.net', sentiment: 'negative', score: -0.65 }
        ],
        average_sentiment: 0.1,
        brand_health: 'neutral'
      }
    };
  }

  if (baseEndpoint === '/social_signal_collector') {
    return {
      status: 'SUCCESS',
      result: {
        url: 'https://example.com',
        social_signals: {
          facebook: { shares: 245, likes: 432, comments: 67, mentions: 23 },
          twitter: { shares: 189, likes: 567, comments: 45, mentions: 78 },
          linkedin: { shares: 134, likes: 289, comments: 34, mentions: 12 },
          instagram: { shares: 98, likes: 823, comments: 156, mentions: 45 }
        },
        total_engagement: 3187,
        top_platform: 'instagram'
      }
    };
  }

  // Forum & Community
  if (baseEndpoint === '/forum_participation') {
    return {
      status: 'SUCCESS',
      result: {
        participation_report: [
          { forum: 'reddit.com', posts_made: 8, responses_received: 42, upvotes_karma: 156, authority_level: 'contributor' },
          { forum: 'quora.com', posts_made: 5, responses_received: 28, upvotes_karma: 89, authority_level: 'beginner' },
          { forum: 'marketing-forum.com', posts_made: 6, responses_received: 35, upvotes_karma: 112, authority_level: 'expert' }
        ],
        total_posts: 19,
        total_engagement: 105
      }
    };
  }

  if (baseEndpoint === '/forum_engagement') {
    return {
      status: 'SUCCESS',
      result: {
        target_communities: [
          { name: 'SEO Reddit', members: '500k+', activity: 'high' },
          { name: 'SEO Stack Exchange', members: '100k+', activity: 'medium' },
          { name: 'SEO Discord', members: '50k+', activity: 'very_high' }
        ],
        engagement_strategy: {
          posting_frequency: 'daily',
          content_type: 'helpful_answers',
          link_inclusion: 'minimal'
        },
        metrics: {
          communities_active: 3,
          weekly_posts: 12,
          average_upvotes: 8,
          followers_gained: 45
        }
      }
    };
  }

  // Citations & Directories
  if (baseEndpoint === '/citation_directory_listing') {
    return {
      status: 'SUCCESS',
      result: {
        business_data: {
          name: 'Example Business',
          address: '123 Main St, City, State',
          phone: '555-123-4567'
        },
        listing_status: [
          { directory: 'Google My Business', status: 'listed', nap_consistent: true, last_updated: '2024-10-01' },
          { directory: 'Yelp', status: 'listed', nap_consistent: false, last_updated: '2024-09-15' },
          { directory: 'Yellow Pages', status: 'pending', nap_consistent: true, last_updated: '2024-10-05' }
        ],
        nap_consistency_score: 66.7
      }
    };
  }

  if (baseEndpoint === '/directory_submissions') {
    return {
      status: 'SUCCESS',
      result: {
        submission_plan: [
          { directory: 'Industry Directory 1', domain_authority: 65, submission_cost: 'free', priority: 'high', estimated_completion: '7 days' },
          { directory: 'Premium Business List', domain_authority: 80, submission_cost: '$50/year', priority: 'high', estimated_completion: '7 days' },
          { directory: 'Local Chamber Directory', domain_authority: 55, submission_cost: 'membership', priority: 'medium', estimated_completion: '7 days' }
        ],
        high_priority_directories: 2,
        estimated_cost: 'varies by directory'
      }
    };
  }

  // Monitoring & Reporting
  if (baseEndpoint === '/competitor_backlink_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        competitor_analysis: [
          {
            domain: 'competitor1.com',
            total_backlinks: 2340,
            referring_domains: 456,
            top_link_sources: [
              { site: 'authority-1.com', links: 25 },
              { site: 'authority-2.com', links: 18 }
            ],
            common_anchor_texts: ['brand name', 'homepage', 'learn more'],
            link_gap_opportunities: 45
          }
        ],
        total_opportunities_identified: 45
      }
    };
  }

  if (baseEndpoint === '/spam_defense') {
    return {
      status: 'SUCCESS',
      result: {
        domain: 'example.com',
        threat_analysis: {
          suspicious_backlinks: 3,
          negative_seo_attempts: 1,
          toxic_link_velocity: 0.8,
          spam_score_increase: 5.2
        },
        defense_actions: [],
        security_status: 'protected'
      }
    };
  }

  if (baseEndpoint === '/offpage_performance_report') {
    return {
      status: 'SUCCESS',
      result: {
        time_period: '30_days',
        metrics: {
          new_backlinks: 25,
          lost_backlinks: 8,
          referral_traffic: 1500,
          brand_mentions: 45,
          social_signals: 2300
        },
        insights: [
          'Positive link growth trend',
          'Strong referral traffic performance',
          'Good brand visibility online'
        ],
        performance_score: 52.8
      }
    };
  }

  if (baseEndpoint === '/reputation_monitoring') {
    return {
      status: 'SUCCESS',
      result: {
        brand_name: 'ExampleBrand',
        reputation_data: [
          { platform: 'Google Reviews', mentions_found: 45, average_rating: 4.5, sentiment_score: 0.75, trending: 'positive' },
          { platform: 'Yelp', mentions_found: 32, average_rating: 4.2, sentiment_score: 0.55, trending: 'positive' },
          { platform: 'Twitter', mentions_found: 78, average_rating: 4.0, sentiment_score: 0.4, trending: 'neutral' },
          { platform: 'Reddit', mentions_found: 23, average_rating: 3.8, sentiment_score: 0.2, trending: 'neutral' }
        ],
        overall_sentiment: 0.48,
        reputation_health: 'good',
        total_mentions: 178
      }
    };
  }

  // On-Page SEO Agents endpoints - Keywords & Content
  if (baseEndpoint === '/target_keyword_research') {
    return {
      status: 'SUCCESS',
      result: {
        keywords: [
          { keyword: 'seo optimization', score: 0.023 },
          { keyword: 'search engine ranking', score: 0.031 },
          { keyword: 'content marketing strategy', score: 0.019 },
          { keyword: 'digital marketing', score: 0.027 },
          { keyword: 'organic traffic', score: 0.022 }
        ]
      }
    };
  }

  if (baseEndpoint === '/content_gap_analyzer') {
    return {
      status: 'SUCCESS',
      result: {
        content_gaps: ['voice search optimization', 'mobile-first indexing', 'core web vitals', 'featured snippets']
      }
    };
  }

  if (baseEndpoint === '/content_readability_engagement') {
    return {
      status: 'SUCCESS',
      result: {
        flesch_score: 65.2,
        passive_voice_pct: 12,
        engagement_score: 78
      }
    };
  }

  // Meta Elements
  if (baseEndpoint === '/title_tag_optimizer') {
    return {
      status: 'SUCCESS',
      result: {
        optimized_titles: {
          'homepage': 'SEO Services | Expert Digital Marketing - SEO',
          'about': 'About Our SEO Agency - SEO',
          'services': 'Professional SEO Services - SEO'
        }
      }
    };
  }

  if (baseEndpoint === '/meta_description_generator') {
    return {
      status: 'SUCCESS',
      result: {
        meta_descriptions: {
          'page': 'Discover expert SEO strategies and digital marketing solutions. Our team helps businesses rank higher in search results... Learn more on our site!'
        }
      }
    };
  }

  // Headers
  if (baseEndpoint === '/header_tag_manager') {
    return {
      status: 'SUCCESS',
      result: {
        header_counts: { h1: 1, h2: 5, h3: 8, h4: 3, h5: 0, h6: 0 },
        is_hierarchical: true
      }
    };
  }

  // Internal Links
  if (baseEndpoint === '/internal_links_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        internal_link_map: {
          '/home': ['/about', '/services', '/contact'],
          '/about': ['/team', '/history'],
          '/services': ['/seo', '/content', '/analytics']
        },
        broken_links: [],
        redundant_links: {},
        missing_links_proposals: {}
      }
    };
  }

  // Images
  if (baseEndpoint === '/image_alt_text_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        alt_text_report: {
          'img1': { has_alt: true, alt_text: 'SEO dashboard showing analytics', recommendation: 'Alt text present' },
          'img2': { has_alt: false, alt_text: '', recommendation: 'Add descriptive alt text' },
          'img3': { has_alt: true, alt_text: 'Team meeting discussing strategy', recommendation: 'Alt text present' }
        }
      }
    };
  }

  if (baseEndpoint === '/image_optimization') {
    return {
      status: 'SUCCESS',
      result: {
        total_images: 12,
        issues: ['Image /assets/hero.jpg missing alt text', 'Image /assets/feature.png missing alt text']
      }
    };
  }

  // Schema
  if (baseEndpoint === '/schema_markup_generation') {
    return {
      status: 'SUCCESS',
      result: {
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': 'Complete SEO Guide for 2024',
          'author': { '@type': 'Person', 'name': 'John Doe' },
          'datePublished': '2024-01-15'
        }
      }
    };
  }

  // Technical
  if (baseEndpoint === '/page_speed_analysis' || baseEndpoint === '/core_web_vitals_monitor') {
    return {
      status: 'SUCCESS',
      result: {
        lcp_seconds: 2.1,
        fid_ms: 85,
        cls_score: 0.08,
        recommendations: ['Optimize images for faster loading', 'Reduce JavaScript execution time']
      }
    };
  }

  if (baseEndpoint === '/mobile_usability_check' || baseEndpoint === '/mobile_usability_test') {
    return {
      status: 'SUCCESS',
      result: {
        has_viewport_meta: true,
        is_responsive: true,
        mobile_friendly: true,
        issues: []
      }
    };
  }

  if (baseEndpoint === '/accessibility_compliance_check') {
    return {
      status: 'SUCCESS',
      result: {
        total_images: 15,
        images_missing_alt: 3,
        inputs_missing_labels: 1,
        compliance_score: 70
      }
    };
  }

  // Social
  if (baseEndpoint === '/social_sharing_optimization') {
    return {
      status: 'SUCCESS',
      result: {
        meta_tags: {
          'og:title': 'SEO Guide 2024',
          'og:type': 'article',
          'og:image': 'https://example.com/image.jpg',
          'og:url': 'https://example.com',
          'og:description': 'Complete guide to SEO',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'SEO Guide 2024',
          'twitter:description': 'Complete guide to SEO',
          'twitter:image': 'https://example.com/image.jpg'
        },
        missing_tags: []
      }
    };
  }

  // Errors
  if (baseEndpoint === '/duplicate_content_detection') {
    return {
      status: 'SUCCESS',
      result: {
        duplicate_pages: [
          ['/page1', '/page2'],
          ['/about', '/about-us']
        ]
      }
    };
  }

  if (baseEndpoint === '/thin_content_detector') {
    return {
      status: 'SUCCESS',
      result: {
        thin_content_pages: [
          { url: '/contact', word_count: 125 },
          { url: '/privacy', word_count: 250 }
        ]
      }
    };
  }

  // Security
  if (baseEndpoint === '/security_headers_checker') {
    return {
      status: 'SUCCESS',
      result: {
        security_headers: {
          'x-frame-options': true,
          'x-content-type-options': true,
          'strict-transport-security': false,
          'content-security-policy': false
        },
        missing_headers: ['strict-transport-security', 'content-security-policy'],
        security_score: 50
      }
    };
  }

  // Catch-all for other On-Page SEO endpoints
  if (baseEndpoint.includes('keyword') || baseEndpoint.includes('content') || 
      baseEndpoint.includes('title') || baseEndpoint.includes('meta') ||
      baseEndpoint.includes('header') || baseEndpoint.includes('link') ||
      baseEndpoint.includes('image') || baseEndpoint.includes('schema') ||
      baseEndpoint.includes('canonical') || baseEndpoint.includes('url_structure')) {
    return {
      status: 'SUCCESS',
      result: {
        message: `On-Page SEO analysis completed for ${baseEndpoint}`,
        analyzed: true,
        recommendations: ['Optimize for target keywords', 'Improve meta descriptions', 'Add structured data'],
        score: Math.floor(Math.random() * 40) + 60
      }
    };
  }

  // Technical SEO Agents endpoints - Crawling & Indexing
  if (baseEndpoint === '/robots_txt_audit') {
    return {
      status: 'SUCCESS',
      result: {
        audit_report: {
          robots_txt_exists: true,
          file_size_bytes: 1248,
          user_agent_count: 3,
          disallow_rules: 5,
          allow_rules: 2,
          sitemap_references: 1,
          syntax_errors: 0
        },
        issues: [],
        audit_score: 100
      }
    };
  }

  if (baseEndpoint === '/sitemap_xml_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        analysis: {
          sitemap_exists: true,
          url_count: 456,
          last_modified_tags: 456,
          priority_tags: 456,
          change_frequency: 456,
          submission_status: 'Submitted'
        },
        sitemap_health: 100
      }
    };
  }

  if (baseEndpoint === '/indexing_status') {
    return {
      status: 'SUCCESS',
      result: {
        indexing: {
          total_indexed: 1250,
          last_24h_indexed: 45,
          last_7d_indexed: 234,
          indexation_rate: 12.5,
          trend: 'Increasing'
        },
        indexation_rate: 12.5
      }
    };
  }

  if (baseEndpoint === '/crawl_budget_optimization') {
    return {
      status: 'SUCCESS',
      result: {
        optimization: {
          estimated_crawl_budget: 25000,
          current_crawl_usage: 18500,
          utilization_percent: 74.0,
          optimization_potential: 18.5,
          priority_optimization: 'Medium'
        },
        budget_score: 26.0
      }
    };
  }

  if (baseEndpoint === '/crawl_error_detection') {
    return {
      status: 'SUCCESS',
      result: {
        errors: {
          total_errors: 23,
          server_errors_5xx: 3,
          not_found_4xx: 15,
          timeout_errors: 2,
          redirect_errors: 3,
          critical_errors: 0
        },
        error_count: 23
      }
    };
  }

  if (baseEndpoint === '/js_rendering_audit') {
    return {
      status: 'SUCCESS',
      result: {
        audit: {
          javascript_heavy: true,
          spa_framework: 'React',
          server_side_rendering: true,
          rendering_issues: 3,
          crawlable_content: 92.5
        },
        indexability_score: 92.5
      }
    };
  }

  if (baseEndpoint === '/index_coverage_audit') {
    return {
      status: 'SUCCESS',
      result: {
        audit: {
          total_pages: 1500,
          pages_indexed: 1320,
          pages_noindexed: 45,
          pages_excluded: 135,
          coverage_percent: 88.0,
          issues_found: 12
        },
        coverage_percent: 88.0
      }
    };
  }

  if (baseEndpoint === '/noindex_audit') {
    return {
      status: 'SUCCESS',
      result: {
        audit: {
          pages_with_noindex: 45,
          pages_with_nofollow: 23,
          pages_with_noarchive: 8,
          accidental_noindex: 2,
          audit_issues: 5
        },
        issues: ['2 accidentally noindexed pages'],
        audit_score: 90
      }
    };
  }

  // Site Structure & URLs
  if (baseEndpoint === '/url_structure_optimization') {
    return {
      status: 'SUCCESS',
      result: {
        optimization: {
          url_length: 45,
          readable_keywords: true,
          hyphens_used: 3,
          special_chars: 0,
          optimization_score: 92.5
        },
        issues: [],
        score: 92.5
      }
    };
  }

  if (baseEndpoint === '/canonical_management') {
    return {
      status: 'SUCCESS',
      result: {
        management: {
          canonical_present: true,
          self_referential: true,
          canonical_valid: true
        },
        status: 'Valid'
      }
    };
  }

  if (baseEndpoint === '/redirect_management') {
    return {
      status: 'SUCCESS',
      result: {
        management: {
          total_redirects: 67,
          permanent_301: 58,
          temporary_302: 9,
          active_redirects: 67
        },
        redirect_count: 67
      }
    };
  }

  if (baseEndpoint === '/redirect_chain_cleaning') {
    return {
      status: 'SUCCESS',
      result: {
        cleanup: {
          chains_found: 5,
          loops_found: 1,
          redirects_cleaned: 6,
          cleanup_complete: true
        },
        complete: true
      }
    };
  }

  // Performance
  if (baseEndpoint === '/page_speed_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        analysis: {
          page_load_time_seconds: 2.3,
          fcp_seconds: 1.2,
          lcp_seconds: 2.1,
          cls_score: 0.08,
          speed_score: 85.5,
          mobile_speed_score: 78.2
        },
        speed_score: 85.5
      }
    };
  }

  if (baseEndpoint === '/core_web_vitals_monitoring') {
    return {
      status: 'SUCCESS',
      result: {
        monitoring: {
          lcp_status: 'Good',
          fid_status: 'Good',
          cls_status: 'Needs work',
          fix_priority: 'Medium'
        },
        priority: 'Medium'
      }
    };
  }

  if (baseEndpoint === '/critical_rendering_path_optimization') {
    return {
      status: 'SUCCESS',
      result: {
        optimization: {
          resources_analyzed: 25,
          critical_resources: 8,
          optimization_actions: 5,
          crp_time_reduction_percent: 18.5
        },
        reduction: 18.5
      }
    };
  }

  if (baseEndpoint === '/cdn_hosting_health_monitoring') {
    return {
      status: 'SUCCESS',
      result: {
        monitoring: {
          cdn_status: 'Online',
          hosting_uptime: 99.85,
          latency_ms: 45
        },
        status: 'Online'
      }
    };
  }

  // Mobile & Usability
  if (baseEndpoint === '/mobile_friendliness_check') {
    return {
      status: 'SUCCESS',
      result: {
        mobile_check: {
          has_viewport_meta: true,
          responsive_design: true,
          mobile_friendly_score: 92.5,
          font_size_readable: true,
          tap_targets_appropriate: true,
          no_interstitial_ads: true
        },
        issues: [],
        is_mobile_friendly: true
      }
    };
  }

  if (baseEndpoint === '/mobile_usability_testing') {
    return {
      status: 'SUCCESS',
      result: {
        usability_tests: {
          navigation_accessible: true,
          forms_usable: true,
          content_legible: true,
          horizontal_scroll_needed: false,
          buttons_tappable: true,
          images_responsive: true,
          ads_intrusive: false
        },
        issues: [],
        usability_score: 100
      }
    };
  }

  if (baseEndpoint === '/wcag_compliance_audit') {
    return {
      status: 'SUCCESS',
      result: {
        audit_result: {
          wcag_target_level: 'AA',
          total_passed: 52,
          total_failed: 3,
          compliance_percentage: 94.5,
          wcag_level_achieved: 'AA'
        },
        recommendation: 'Page meets WCAG AA compliance'
      }
    };
  }

  // Security
  if (baseEndpoint === '/ssl_https_check') {
    return {
      status: 'SUCCESS',
      result: {
        ssl_check: {
          https_enabled: true,
          ssl_certificate_valid: true,
          certificate_issuer: "Let's Encrypt",
          certificate_expiry: '2025-10-04',
          days_until_expiry: 348,
          protocol_version: 'TLS 1.3',
          cipher_strength: 'Strong'
        },
        issues: [],
        ssl_score: 100
      }
    };
  }

  if (baseEndpoint === '/security_headers_management') {
    return {
      status: 'SUCCESS',
      result: {
        security_headers: {
          content_security_policy: true,
          x_frame_options: true,
          x_content_type_options: true,
          strict_transport_security: true,
          referrer_policy: false,
          permissions_policy: false
        },
        missing_headers: ['referrer_policy', 'permissions_policy'],
        header_score: 66.7
      }
    };
  }

  if (baseEndpoint === '/malware_vulnerability_scanning') {
    return {
      status: 'SUCCESS',
      result: {
        scan_results: {
          malware_detected: false,
          vulnerabilities_found: 1,
          suspicious_files: 0,
          compromised_content: false
        },
        threat_level: 'LOW',
        action_required: false
      }
    };
  }

  if (baseEndpoint === '/gdpr_ccpa_compliance_check') {
    return {
      status: 'SUCCESS',
      result: {
        compliance_assessment: {
          gdpr_compliant: true,
          ccpa_compliant: true,
          consent_mechanism: 'banner',
          has_privacy_policy: true
        },
        compliance_gaps: [],
        overall_compliance_score: 100,
        risk_level: 'LOW'
      }
    };
  }

  // Schema & Structured Data
  if (baseEndpoint === '/structured_data_validation') {
    return {
      status: 'SUCCESS',
      result: {
        validation_report: {
          json_ld_blocks: 3,
          microdata_items: 0,
          rdfa_markup: 0,
          validation_status: 'VALID',
          schema_types_found: ['Article', 'Organization', 'BreadcrumbList']
        },
        issues: [],
        validation_score: 100
      }
    };
  }

  if (baseEndpoint === '/schema_coverage_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        coverage_analysis: {
          pages_with_schema: 320,
          pages_without_schema: 45,
          schema_coverage_percent: 87.7,
          schema_errors: 8,
          critical_errors: 1,
          warnings: 7
        },
        recommendations: ['Increase schema markup coverage to 90%+']
      }
    };
  }

  // Link & Resource Health
  if (baseEndpoint === '/broken_link_checking') {
    return {
      status: 'SUCCESS',
      result: {
        check_report: {
          total_links_checked: 1250,
          broken_links_found: 12,
          external_broken: 8,
          internal_broken: 4,
          redirect_chains: 3
        },
        link_health_score: 40
      }
    };
  }

  if (baseEndpoint === '/custom_404_error_handling') {
    return {
      status: 'SUCCESS',
      result: {
        handler_status: {
          has_custom_404: true,
          custom_404_quality: 'Good',
          soft_404_detected: false,
          error_page_redirects: 0,
          error_messages_helpful: true
        },
        recommendations: [],
        error_handling_score: 100
      }
    };
  }

  if (baseEndpoint === '/soft_404_monitoring') {
    return {
      status: 'SUCCESS',
      result: {
        soft_404_detection: {
          pages_analyzed: 450,
          soft_404_detected: 3,
          detection_methods: ['Empty content', 'Custom 404 pages returning 200'],
          severity: 'Low'
        },
        soft_404_score: 85
      }
    };
  }

  if (baseEndpoint === '/server_error_detection') {
    return {
      status: 'SUCCESS',
      result: {
        server_errors: {
          error_500_count: 2,
          error_502_count: 0,
          error_503_count: 1,
          error_504_count: 0
        },
        server_health_score: 85
      }
    };
  }

  // International SEO
  if (baseEndpoint === '/international_seo_hreflang_validation') {
    return {
      status: 'SUCCESS',
      result: {
        international_check: {
          hreflang_tags: 5,
          valid_hreflang: 5,
          language_versions: 5,
          alternate_tags_complete: true
        },
        hreflang_score: 100
      }
    };
  }

  if (baseEndpoint === '/hreflang_implementation_audit') {
    return {
      status: 'SUCCESS',
      result: {
        audit_report: {
          pages_with_hreflang: 234,
          total_pages: 450,
          language_versions: 5,
          hreflang_errors: 3,
          missing_self_referential_tags: 2
        },
        audit_score: 90
      }
    };
  }

  // Emerging Technology
  if (baseEndpoint === '/voice_search_readiness') {
    return {
      status: 'SUCCESS',
      result: {
        voice_readiness: {
          faq_schema_present: true,
          conversational_keywords: 15,
          question_format_content: true,
          schema_for_qa: true,
          natural_language_optimized: true
        },
        voice_gaps: [],
        voice_readiness_score: 100
      }
    };
  }

  if (baseEndpoint === '/infinite_scroll_lazy_indexability') {
    return {
      status: 'SUCCESS',
      result: {
        indexability_analysis: {
          has_infinite_scroll: true,
          lazy_loaded_content: 45,
          pagination_present: true,
          content_indexable: true,
          javascript_required: false
        },
        indexability_issues: [],
        indexability_score: 100
      }
    };
  }

  // Competitive Analysis
  if (baseEndpoint === '/competitive_technical_gap_analysis') {
    return {
      status: 'SUCCESS',
      result: {
        gap_analysis: {
          own_url: 'https://example.com',
          competitors_analyzed: 3,
          technical_gaps: 8,
          performance_gap: -5.2,
          schema_gap: 3,
          mobile_readiness_gap: 2.5
        },
        gaps_found: ['8 technical implementation gaps', '3 missing schema implementations'],
        competitive_position: 'Strong'
      }
    };
  }

  if (baseEndpoint === '/fringe_serp_feature_opportunities') {
    return {
      status: 'SUCCESS',
      result: {
        feature_opportunities: {
          available_features: 12,
          implemented_features: 7,
          opportunity_features: 5,
          feature_potential: 78.5
        },
        unexploited_features: [
          { feature_type: 'FAQ box', implementation_effort: 'Low', ctr_potential: 15.5 },
          { feature_type: 'How-to', implementation_effort: 'Medium', ctr_potential: 22.3 }
        ],
        opportunity_value: 78.5
      }
    };
  }

  // Orchestration & Monitoring
  if (baseEndpoint === '/technical_health_dashboard') {
    return {
      status: 'SUCCESS',
      result: {
        health_metrics: {
          overall_health_score: 87.5,
          crawlability_score: 92.0,
          indexability_score: 88.5,
          mobile_friendliness_score: 95.0,
          performance_score: 78.5,
          security_score: 90.0,
          seo_health_status: 'GOOD'
        },
        critical_issues: [],
        dashboard_status: 'Healthy'
      }
    };
  }

  if (baseEndpoint === '/content_volatility_tracking') {
    return {
      status: 'SUCCESS',
      result: {
        volatility_metrics: {
          changes_detected: 12,
          change_frequency: 'Low',
          major_content_shifts: 2,
          metadata_changes: 5,
          stability_score: 82.5
        },
        volatility_concerns: [],
        content_stability: 82.5
      }
    };
  }

  // Catch-all for Technical SEO endpoints
  if (baseEndpoint.includes('robots') || baseEndpoint.includes('sitemap') || 
      baseEndpoint.includes('crawl') || baseEndpoint.includes('index') ||
      baseEndpoint.includes('redirect') || baseEndpoint.includes('canonical') ||
      baseEndpoint.includes('speed') || baseEndpoint.includes('performance') ||
      baseEndpoint.includes('mobile') || baseEndpoint.includes('ssl') ||
      baseEndpoint.includes('security') || baseEndpoint.includes('structured') ||
      baseEndpoint.includes('schema') || baseEndpoint.includes('amp') ||
      baseEndpoint.includes('hreflang') || baseEndpoint.includes('bot')) {
    return {
      status: 'SUCCESS',
      result: {
        message: `Technical SEO analysis completed for ${baseEndpoint}`,
        analyzed: true,
        recommendations: ['Optimize crawl budget', 'Fix critical issues', 'Improve performance'],
        score: Math.floor(Math.random() * 30) + 70,
        health_status: 'Good'
      }
    };
  }

  // Default response
  return {
    message: 'Mock data not available for this endpoint',
    endpoint: baseEndpoint
  };
}

export { API_BASE_URL, USE_MOCK_DATA };