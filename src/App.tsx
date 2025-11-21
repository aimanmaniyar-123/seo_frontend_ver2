import { useState } from 'react';
import { Header } from './components/Header';
import { SystemHealth } from './components/SystemHealth';
import { URLInput } from './components/URLInput';
import { AgentsList } from './components/AgentsList';
import { PhaseControl } from './components/PhaseControl';
import { ExecutionLogs } from './components/ExecutionLogs';
import { DependencyGraph } from './components/DependencyGraph';
import { OrchestrationPanel } from './components/OrchestrationPanel';
import { ApiStatusBanner } from './components/ApiStatusBanner';
import { LocalSEOPanel } from './components/LocalSEOPanel';
import { OffPageSEOPanel } from './components/OffPageSEOPanel';
import { OnPageSEOPanel } from './components/OnPageSEOPanel';
import { TechnicalSEOPanel } from './components/TechnicalSEOPanel';
import { LayoutDashboard, Bot, Layers, Activity, FileText, MapPin, Link, ScrollText, GitBranch, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'phases' | 'local-seo' | 'off-page-seo' | 'on-page-seo' | 'technical-seo' | 'logs' | 'dependencies'>('dashboard');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'phases', label: 'Phases', icon: Layers },
    { id: 'technical-seo', label: 'Technical SEO', icon: Activity },
    { id: 'on-page-seo', label: 'On-Page SEO', icon: FileText },
    { id: 'local-seo', label: 'Local SEO', icon: MapPin },
    { id: 'off-page-seo', label: 'Off-Page SEO', icon: Link },
    { id: 'logs', label: 'Logs', icon: ScrollText },
    { id: 'dependencies', label: 'Dependencies', icon: GitBranch },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-white border-r border-slate-200 overflow-hidden flex-shrink-0`}>
          <div className="p-4 h-full overflow-y-auto">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`size-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mb-4 p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            {/* API Status Banner */}
            <ApiStatusBanner />

            {/* System Health Banner */}
            <SystemHealth refreshTrigger={refreshTrigger} />

            {/* URL Input */}
            <URLInput currentUrl={currentUrl} onUrlChange={setCurrentUrl} />

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <OrchestrationPanel 
                currentUrl={currentUrl} 
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'agents' && (
              <AgentsList 
                currentUrl={currentUrl} 
                refreshTrigger={refreshTrigger}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'phases' && (
              <PhaseControl 
                currentUrl={currentUrl}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'technical-seo' && (
              <TechnicalSEOPanel 
                currentUrl={currentUrl}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'on-page-seo' && (
              <OnPageSEOPanel 
                currentUrl={currentUrl}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'local-seo' && (
              <LocalSEOPanel 
                currentUrl={currentUrl}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'off-page-seo' && (
              <OffPageSEOPanel 
                currentUrl={currentUrl}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'logs' && (
              <ExecutionLogs refreshTrigger={refreshTrigger} />
            )}

            {activeTab === 'dependencies' && (
              <DependencyGraph refreshTrigger={refreshTrigger} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}