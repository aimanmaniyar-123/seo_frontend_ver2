# SEO Micro-Agents Orchestration System - UI

A modern, comprehensive dashboard for managing and monitoring SEO micro-agents with real-time execution tracking and dependency management.

## 🚀 Features

- **Real-time System Health Monitoring** - Track agent performance and success rates
- **Agent Management** - View, execute, and monitor individual agents
- **Phase-based Execution** - Run coordinated SEO phases (Foundation, On-Page, Technical, Content, Off-Page)
- **On-Page SEO Agents** - 75+ agents for keywords, content, meta, headers, links, images, schema
- **Local SEO Agents** - 9 specialized agents for local search optimization (GMB, Citations, Reviews, Keywords)
- **Off-Page SEO Agents** - 24+ agents for backlinks, brand mentions, social signals, and reputation
- **Execution Logs** - Detailed history with pagination
- **Dependency Graph** - Visualize agent relationships and dependencies
- **URL-based Operations** - Target specific URLs for SEO analysis
- **Mock Data Mode** - Test the UI without a backend

## 📋 Prerequisites

- Node.js 16+ (for running the UI)
- Your FastAPI backend (optional - mock data available)

## 🛠️ Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Configure API Connection

Edit `.env`:

**For Demo Mode (Mock Data):**
```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=
```

**For Real Backend:**
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run the Application

The UI will automatically start in your browser.

## 🔌 Backend Integration

This UI connects to the FastAPI backend you provided. Ensure your backend is running with these endpoints:

- `GET /health` - System health status
- `GET /agents` - List all registered agents
- `POST /seo_orchestration_core` - Run SEO orchestration
- `POST /trigger_all_agents` - Execute all agents
- `POST /trigger_agent/{agent_name}` - Execute specific agent
- `POST /trigger_phase/{phase_name}` - Execute specific phase
- `GET /execution_log` - Get execution logs
- `GET /agent_dependencies` - Get dependency graph
- `POST /reset_agents` - Reset all agents

## 📱 Usage

### Dashboard Tab
- Run complete SEO orchestration
- Trigger all agents at once
- Reset agent statuses
- View orchestration plans and results

### Agents Tab
- View all registered agents
- See agent status and dependencies
- Execute individual agents
- Track last run timestamps

### Phases Tab
- Execute coordinated SEO phases:
  - Phase 1: Foundation (Robots.txt, Sitemap, Canonical Tags)
  - Phase 2: On-Page (Title Tags, Meta Descriptions, Headers)
  - Phase 3: Technical (Speed, Mobile, Schema)
  - Phase 4: Content (Quality, Keywords, Links)
  - Phase 5: Off-Page (Backlinks, Social Signals)

### On-Page SEO Tab
**75+ agents organized into 12 categories:**

**Keywords & Content (14 agents):**
- Keyword Research, Discovery, Mapping
- LSI & Semantic Keywords
- Content Gap Analysis
- Content Quality & Depth
- Uniqueness & Duplication Detection
- User Intent Alignment
- Readability & Engagement
- Freshness Monitoring
- E-E-A-T Signals
- Multimedia Usage

**Meta Elements (10 agents):**
- Title Tag Optimizer, Creator, Analyzer
- Meta Description Generator, Writer
- Uniqueness & Consistency Checks
- Tag Expiry Monitoring

**URL & Canonical (4 agents):**
- URL Structure Optimization
- Canonical Tag Management & Assignment
- Best Practice Enforcement

**Headers & Structure (7 agents):**
- Header Tag Manager
- Architecture & Hierarchy Analysis
- Structure Auditing
- Header Rewrite Suggestions
- Keyword Optimization
- Content Outline & UX Flow
- Page Layout Efficiency

**Internal Links (7 agents):**
- Link Analysis & Mapping
- Network Building
- Anchor Text Optimization & Diversity
- Broken Link Detection & Repair

**Images & Multimedia (10 agents):**
- Alt Text Analysis, Creation, Generation
- Image Optimization & Compression
- Filename Optimization
- Lazy Loading & CDN
- Video SEO & Interactive Elements

**Schema & Structured Data (4 agents):**
- Schema Markup Generation & Implementation
- Schema Validation
- Rich Snippet Opportunity Finder

**Technical & UX (7 agents):**
- Page Speed & Core Web Vitals
- Mobile Usability Testing
- Accessibility Compliance
- Interstitial Ad Monitoring
- User Engagement Metrics

**Outbound Links (3 agents):**
- Link Quality Analysis
- External Link Integration
- Link Monitoring

**Social SEO (4 agents):**
- Social Sharing Optimization
- Share Button Optimization
- Engagement Tracking
- Signal Tracking

**Error Handling (6 agents):**
- 404 Error Management
- Redirect Chain Cleaning
- Duplicate Content Detection
- Thin Content Detection
- SEO Audit
- Robots Meta Tag Management

**Security & Crawlability (4 agents):**
- Crawl Budget Optimization
- HTTPS Mixed Content Checker
- Resource Blocking Auditor
- Security Headers Checker

### Local SEO Tab
- **GMB Manager** - Manage Google Business Profile optimization
- **Profile Manager** - Update business attributes across platforms
- **Citation Builder** - Build citations across local directories
- **Citation Audit** - Audit citation consistency and NAP data
- **NAP Consistency** - Check Name, Address, Phone consistency
- **Review Management** - Analyze sentiment and respond to reviews
- **Keyword Research** - Discover local search keywords
- **Map Pack Tracker** - Monitor Google Map Pack rankings
- **Competitor Benchmark** - Compare against local competitors

### Off-Page SEO Tab
**24+ agents organized by category:**

**Backlink Management (12 agents):**
- Quality Backlink Sourcing - Identify authoritative link sources
- Backlink Acquisition - Source high-authority prospects
- Guest Posting - Research guest blog opportunities
- Guest Post Outreach - Automate outreach campaigns
- Outreach Execution - Manage personalized emails
- Broken Link Building - Find and replace broken links
- Skyscraper Content - Create enhanced linkable content
- Lost Link Recovery - Recover lost backlinks
- Quality Evaluator - Assess backlink quality
- Anchor Text Diversity - Optimize anchor distribution
- Toxic Link Detection - Identify and disavow spam
- Profile Monitor - Track backlink changes

**Brand & Social (4 agents):**
- Brand Mention Finder - Find unlinked mentions
- Mention Outreach - Convert mentions to links
- Sentiment Analysis - Analyze brand perception
- Social Signals - Track social engagement

**Community (2 agents):**
- Forum Participation - Engage in niche forums
- Community Engagement - Build authority online

**Citations (2 agents):**
- Directory Listings - Manage business directories
- Directory Submissions - Automate submissions

**Monitoring (4 agents):**
- Competitor Analysis - Analyze competitor links
- Spam Defense - Protect against negative SEO
- Performance Report - Generate insights
- Reputation Monitor - Track brand reputation

### Logs Tab
- View execution history
- Filter by success/failure
- Paginated results

### Dependencies Tab
- Visualize agent relationships
- See which agents depend on others
- Identify dependency chains

## 🎯 URL-Based Operations

Enter a target URL in the input field to:
- Run SEO analysis on specific websites
- Track domain-specific operations
- Generate targeted reports

## 🧪 Mock Data Mode

The UI includes comprehensive mock data for testing without a backend:
- 5 sample agents with different statuses
- Execution logs with timestamps
- Dependency relationships
- Orchestration plans
- Phase execution results

This allows you to explore the full UI functionality before connecting your backend.

## 🔧 Switching Between Mock and Real Data

1. **Start with Mock Data** (default):
   - UI works immediately
   - Explore all features
   - No backend required

2. **Connect to Real Backend**:
   - Update `.env`: `VITE_USE_MOCK_DATA=false`
   - Set `VITE_API_BASE_URL` to your backend URL
   - Restart the application

## 🎨 UI Components

- **SystemHealth** - Real-time health metrics with color-coded status
- **AgentsList** - Interactive agent management with execution controls
- **PhaseControl** - Color-coded phases with one-click execution
- **ExecutionLogs** - Detailed log viewer with pagination
- **DependencyGraph** - Visual representation of agent relationships
- **OrchestrationPanel** - Central control for all operations

## 📊 Status Indicators

- 🟢 **Green** - Success/Healthy
- 🔴 **Red** - Failed/Critical
- 🟡 **Yellow** - Warning/Fair
- 🔵 **Blue** - Good/Active
- ⚪ **Gray** - Not Run/Inactive

## 🚀 Next Steps

1. Run the UI in demo mode to explore features
2. Set up your FastAPI backend
3. Configure the API connection
4. Start managing your SEO micro-agents!

## 📝 Notes

- The UI automatically falls back to mock data if the backend is unavailable
- All agent operations support URL-based targeting
- Toast notifications provide real-time feedback
- The system auto-refreshes data after operations