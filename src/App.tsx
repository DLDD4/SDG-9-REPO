import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResearchPaper, 
  ViewMode, 
  AutomatedNotification, 
  NotificationSubscription,
  RepositoryReviewStatus 
} from './types/repository';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { COLLEGE_DEPARTMENTS, ALL_CANONICAL_KEYWORDS } from './data/keywordsTaxonomy';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { PaperCard } from './components/PaperCard';
import { PaperTable } from './components/PaperTable';
import { PaperDetailModal } from './components/PaperDetailModal';
import { UploadModal } from './components/UploadModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { KeywordCatalogView } from './components/KeywordCatalogView';
import { SdgCatalogView } from './components/SdgCatalogView';
import { StudentSimilarityReviewer } from './components/StudentSimilarityReviewer';
import { AnalyticsView } from './components/AnalyticsView';
import { ScholarBotAssistant } from './components/ScholarBotAssistant';
import { SDG_MAP } from './data/sdgTaxonomy';
import { 
  Search, 
  Filter, 
  Grid, 
  Table as TableIcon, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Send, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Globe2,
  FileSearch,
  Bot
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [notifications, setNotifications] = useState<AutomatedNotification[]>([]);
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([]);

  // Navigation & View
  const [currentView, setCurrentView] = useState<ViewMode>('grid');

  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [initialDraftForUpload, setInitialDraftForUpload] = useState<{ title: string; abstract: string; department: string; keywords: string[] } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [publicationFilter, setPublicationFilter] = useState<'all' | 'published' | 'review'>('all');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedSdg, setSelectedSdg] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'citations' | 'downloads' | 'title'>('recent');

  // Real-time Notification Toast
  const [activeToast, setActiveToast] = useState<{ message: string; paperId?: string } | null>(null);

  // Initial Data Load
  useEffect(() => {
    loadRepositoryData();

    // Listen for custom notification events
    const handleNotificationCreated = (e: any) => {
      loadRepositoryData();
      const count = e.detail?.count || 1;
      const firstNotif = e.detail?.notifications?.[0];
      setActiveToast({
        message: `${count} automated researcher alert${count > 1 ? 's' : ''} triggered for matching subscribers!`,
        paperId: firstNotif?.paperId
      });
      setTimeout(() => setActiveToast(null), 6000);
    };

    window.addEventListener('college-repo-notification-created', handleNotificationCreated);
    return () => {
      window.removeEventListener('college-repo-notification-created', handleNotificationCreated);
    };
  }, []);

  const loadRepositoryData = () => {
    setPapers(storageService.getPapers());
    setNotifications(storageService.getNotifications());
    setSubscriptions(storageService.getSubscriptions());
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Filter & Search Logic
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      // 1. Text Search across Title, Abstract, Authors, Keywords, DOI, Journal Name
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = paper.title.toLowerCase().includes(query);
        const abstractMatch = paper.abstract.toLowerCase().includes(query);
        const authorMatch = paper.authors.some(a => a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query));
        const keywordMatch = paper.keywords.some(k => k.toLowerCase().includes(query));
        const doiMatch = paper.publicationDetails?.doi?.toLowerCase().includes(query);
        const journalMatch = paper.publicationDetails?.journalName?.toLowerCase().includes(query);
        const deptMatch = paper.department.toLowerCase().includes(query);

        if (!titleMatch && !abstractMatch && !authorMatch && !keywordMatch && !doiMatch && !journalMatch && !deptMatch) {
          return false;
        }
      }

      // 2. Department filter
      if (selectedDepartment !== 'All' && paper.department !== selectedDepartment) {
        return false;
      }

      // 3. Publication status filter
      if (publicationFilter === 'published' && !paper.isPublished) {
        return false;
      }
      if (publicationFilter === 'review' && paper.isPublished) {
        return false;
      }

      // 4. Keywords filter (AND matching: paper must include all active selected keywords)
      if (selectedKeywords.length > 0) {
        const hasAllKeywords = selectedKeywords.every(sk => 
          paper.keywords.some(pk => pk.toLowerCase() === sk.toLowerCase())
        );
        if (!hasAllKeywords) {
          return false;
        }
      }

      // 5. SDG filter
      if (selectedSdg !== null) {
        if (!paper.sdgs || !paper.sdgs.includes(selectedSdg)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'citations') {
        return b.citationsCount - a.citationsCount;
      }
      if (sortBy === 'downloads') {
        return b.downloadsCount - a.downloadsCount;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: recent by submissionDate
      return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
    });
  }, [papers, searchQuery, selectedDepartment, publicationFilter, selectedKeywords, selectedSdg, sortBy]);

  // Handlers
  const handleKeywordToggle = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
      // Switch back to grid or table to show results
      if (currentView !== 'grid' && currentView !== 'table') {
        setCurrentView('grid');
      }
    }
  };

  const handleSdgSelect = (sdgId: number) => {
    if (selectedSdg === sdgId) {
      setSelectedSdg(null);
    } else {
      setSelectedSdg(sdgId);
      setCurrentView('grid');
    }
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setPublicationFilter('all');
    setSelectedKeywords([]);
    setSelectedSdg(null);
    setSortBy('recent');
  };

  const handlePaperUploaded = (newPaper: ResearchPaper, notificationsTriggeredCount: number) => {
    loadRepositoryData();
    setIsUploadOpen(false);
    setSelectedPaper(newPaper);
    setActiveToast({
      message: `Paper "${newPaper.title.slice(0, 36)}..." indexed! ${notificationsTriggeredCount} automated subscriber notifications sent.`,
      paperId: newPaper.id
    });
    setTimeout(() => setActiveToast(null), 6000);
  };

  const handleSimulatePeerUpload = () => {
    const result = notificationService.simulatePeerUpload();
    loadRepositoryData();
    setActiveToast({
      message: `Simulated Peer Upload: "${result.paper.title.slice(0, 32)}..." uploaded! ${result.notifications.length} subscriber alerts triggered.`,
      paperId: result.paper.id
    });
    setTimeout(() => setActiveToast(null), 6000);
  };

  const handleSelectPaperById = (paperId: string) => {
    const found = papers.find(p => p.id === paperId);
    if (found) {
      setSelectedPaper(found);
    }
  };

  const handleUpdateReviewStatus = (paperId: string, newStatus: RepositoryReviewStatus) => {
    const found = papers.find(p => p.id === paperId);
    if (found) {
      const updated = {
        ...found,
        reviewStatus: newStatus,
        reviewedBy: 'College Research Cell Board'
      };
      storageService.updatePaper(updated);
      loadRepositoryData();
      if (selectedPaper && selectedPaper.id === paperId) {
        setSelectedPaper(updated);
      }
    }
  };

  const handleResetData = () => {
    if (confirm('Reset repository papers and subscriptions to clean default catalog?')) {
      storageService.resetToDefault();
      loadRepositoryData();
    }
  };

  const activeFiltersCount = 
    (selectedDepartment !== 'All' ? 1 : 0) + 
    (publicationFilter !== 'all' ? 1 : 0) + 
    selectedKeywords.length + 
    (selectedSdg !== null ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Real-time Notification Banner Toast */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 max-w-md animate-in slide-in-from-bottom duration-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-blue-600 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Research Alert
              </div>
              <div className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {activeToast.message}
              </div>
              {activeToast.paperId && (
                <button
                  onClick={() => {
                    handleSelectPaperById(activeToast.paperId!);
                    setActiveToast(null);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline mt-1.5 inline-block cursor-pointer"
                >
                  Inspect Uploaded Paper Dossier →
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenUploadModal={() => {
          setInitialDraftForUpload(null);
          setIsUploadOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* KPI Strip */}
        <DashboardStats
          papers={papers}
          onFilterPublishedOnly={() => {
            setPublicationFilter('published');
            setCurrentView('grid');
          }}
          onFilterUnderReview={() => {
            setPublicationFilter('review');
            setCurrentView('grid');
          }}
          onViewKeywords={() => setCurrentView('keywords')}
          onViewSdgs={() => setCurrentView('sdg')}
          onViewReviewer={() => setCurrentView('reviewer')}
        />

        {/* View Switching router */}
        {currentView === 'sdg' ? (
          <SdgCatalogView
            papers={papers}
            onSelectSdg={handleSdgSelect}
            onRefreshAlerts={loadRepositoryData}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        ) : currentView === 'reviewer' ? (
          <StudentSimilarityReviewer
            papers={papers}
            onInspectExistingPaper={handleSelectPaperById}
            onProceedToUpload={(draft) => {
              setInitialDraftForUpload(draft);
              setIsUploadOpen(true);
            }}
          />
        ) : currentView === 'keywords' ? (
          <KeywordCatalogView
            papers={papers}
            onSelectKeyword={(kw) => {
              setSelectedKeywords([kw]);
              setCurrentView('grid');
            }}
            onRefreshAlerts={loadRepositoryData}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        ) : currentView === 'analytics' ? (
          <AnalyticsView
            papers={papers}
            onSelectDepartment={(dept) => {
              setSelectedDepartment(dept);
              setCurrentView('grid');
            }}
            onSelectPaper={setSelectedPaper}
          />
        ) : currentView === 'assistant' ? (
          <ScholarBotAssistant
            papers={papers}
            onInspectPaper={handleSelectPaperById}
            onNavigateToView={setCurrentView}
          />
        ) : (
          /* Main Repository Browser (Grid or Table) */
          <div className="space-y-4">
            {/* Search, Filter Toolbar & Simulation Action */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Global Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, keywords, authors, DOI, abstract, journal name..."
                    className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:bg-white focus:outline-blue-600 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Toggles & Simulation Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Simulate Peer Upload Action */}
                  <button
                    onClick={handleSimulatePeerUpload}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Simulate a college peer uploading research to trigger automated subscriber notifications"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Simulate Peer Upload</span>
                  </button>

                  {/* Grid / Table segmented switch */}
                  <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setCurrentView('grid')}
                      className={`p-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        currentView === 'grid'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Cards View"
                      aria-label="Cards View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentView('table')}
                      className={`p-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        currentView === 'table'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="High-Density Table View"
                      aria-label="Table View"
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Filter Row: Department, Publication Status, Sorting */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Department Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Department:</span>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium focus:outline-blue-600 cursor-pointer"
                    >
                      <option value="All">All Departments</option>
                      {COLLEGE_DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Publication Segmented Control (Functional buttons with click handlers) */}
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setPublicationFilter('all')}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                        publicationFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPublicationFilter('published')}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                        publicationFilter === 'published'
                          ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Peer-Reviewed Journals
                    </button>
                    <button
                      onClick={() => setPublicationFilter('review')}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                        publicationFilter === 'review'
                          ? 'bg-white text-amber-800 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pre-prints / Theses
                    </button>
                  </div>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-blue-600 cursor-pointer"
                  >
                    <option value="recent">Most Recent Submission</option>
                    <option value="citations">Highest Citations</option>
                    <option value="downloads">Most Downloaded</option>
                    <option value="title">Paper Title (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Active Filters & Keywords Chips Row */}
              {(selectedKeywords.length > 0 || activeFiltersCount > 0) && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-slate-400 font-medium">Active filters:</span>
                    
                    {selectedDepartment !== 'All' && (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        Dept: {selectedDepartment}
                        <button 
                          onClick={() => setSelectedDepartment('All')} 
                          className="hover:text-red-600 cursor-pointer ml-1"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {publicationFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        Status: {publicationFilter === 'published' ? 'Journals Only' : 'Pre-prints Only'}
                        <button 
                          onClick={() => setPublicationFilter('all')} 
                          className="hover:text-red-600 cursor-pointer ml-1"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {selectedSdg !== null && (
                      <span 
                        className="inline-flex items-center gap-1 text-white px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ backgroundColor: SDG_MAP.get(selectedSdg)?.color || '#059669' }}
                      >
                        {SDG_MAP.get(selectedSdg)?.code}: {SDG_MAP.get(selectedSdg)?.shortTitle}
                        <button 
                          onClick={() => setSelectedSdg(null)} 
                          className="hover:opacity-75 cursor-pointer ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {selectedKeywords.map(kw => (
                      <span 
                        key={kw}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px] font-semibold"
                      >
                        #{kw}
                        <button 
                          onClick={() => handleKeywordToggle(kw)} 
                          className="hover:text-red-600 cursor-pointer ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleClearAllFilters}
                    className="text-[11px] text-red-600 hover:underline cursor-pointer ml-auto"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Papers Results Count */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong className="text-slate-900 font-mono tabular-nums">{filteredPapers.length}</strong> of{' '}
                <strong className="text-slate-900 font-mono tabular-nums">{papers.length}</strong> college research papers
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetData}
                  className="text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Reset initial dataset"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Catalog
                </button>
              </div>
            </div>

            {/* Primary View Display */}
            {filteredPapers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  No research papers match your current filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try clearing some keyword filters, switching departments, or resetting your search query.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => {
                      setInitialDraftForUpload(null);
                      setIsUploadOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                  >
                    Upload Paper Now
                  </button>
                </div>
              </div>
            ) : currentView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPapers.map(paper => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    onSelectPaper={setSelectedPaper}
                    onKeywordClick={handleKeywordToggle}
                    onSdgClick={handleSdgSelect}
                    selectedKeywords={selectedKeywords}
                    selectedSdg={selectedSdg}
                  />
                ))}
              </div>
            ) : (
              <PaperTable
                papers={filteredPapers}
                onSelectPaper={setSelectedPaper}
                onKeywordClick={handleKeywordToggle}
                onSdgClick={handleSdgSelect}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            College Institutional Research Repository · Research Cell & Ethical Governance Board
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('sdg')}
              className="hover:text-slate-900 cursor-pointer text-emerald-700 font-medium"
            >
              SDG Catalog
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView('reviewer')}
              className="hover:text-slate-900 cursor-pointer text-blue-700 font-medium"
            >
              Student Reviewer
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView('keywords')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Keyword Taxonomy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Alert Subscriptions
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView('analytics')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Scholar Analytics
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView('assistant')}
              className="hover:text-indigo-900 text-indigo-700 font-bold cursor-pointer flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              ScholarBot AI Lab
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Quick Launcher for ScholarBot AI Assistant */}
      {currentView !== 'assistant' && (
        <button
          onClick={() => setCurrentView('assistant')}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-xl border border-indigo-500/40 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer group"
          title="Open ScholarBot Quirky Research Lab AI"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🦉</span>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Ask ScholarBot AI</span>
              <span className="text-[9px] bg-amber-400 text-amber-950 px-1 rounded-sm uppercase tracking-wider font-extrabold">SLM</span>
            </div>
            <div className="text-[10px] text-indigo-200">Campus Research Assistant</div>
          </div>
        </button>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setInitialDraftForUpload(null);
        }}
        onPaperUploaded={handlePaperUploaded}
        initialDraft={initialDraftForUpload}
      />

      {/* Paper Detail Inspector Modal */}
      <PaperDetailModal
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
        onKeywordClick={handleKeywordToggle}
        onSdgClick={handleSdgSelect}
        onUpdateReviewStatus={handleUpdateReviewStatus}
      />

      {/* Automated Notifications & Alert Subscriptions Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        subscriptions={subscriptions}
        onSelectPaperById={handleSelectPaperById}
        onRefreshNotifications={loadRepositoryData}
        onSimulatePeerUpload={handleSimulatePeerUpload}
      />
    </div>
  );
}
