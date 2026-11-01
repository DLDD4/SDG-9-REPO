import React, { useState } from 'react';
import { ResearchPaper } from '../types/repository';
import { KEYWORD_CATEGORIES, ALL_CANONICAL_KEYWORDS } from '../data/keywordsTaxonomy';
import { storageService } from '../services/storageService';
import { Search, Hash, Bell, BookOpen, Layers, Check, ArrowRight } from 'lucide-react';

interface KeywordCatalogViewProps {
  papers: ResearchPaper[];
  onSelectKeyword: (keyword: string) => void;
  onRefreshAlerts: () => void;
  onOpenNotifications: () => void;
}

export const KeywordCatalogView: React.FC<KeywordCatalogViewProps> = ({
  papers,
  onSelectKeyword,
  onRefreshAlerts,
  onOpenNotifications
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trackedKeywordMessage, setTrackedKeywordMessage] = useState<string | null>(null);

  // Compute paper counts for each keyword
  const keywordCounts: Record<string, number> = {};
  for (const paper of papers) {
    for (const kw of paper.keywords) {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
    }
  }

  // Handle quick subscription creation for a keyword
  const handleQuickTrackKeyword = (keyword: string) => {
    const sub = {
      id: `sub-quick-${Date.now()}`,
      name: `Keyword Alert: #${keyword}`,
      keywords: [keyword],
      departments: [],
      onlyPublishedJournals: false,
      createdDate: new Date().toISOString().split('T')[0],
      active: true
    };
    storageService.saveSubscription(sub);
    onRefreshAlerts();
    setTrackedKeywordMessage(`Subscribed to automated alerts for "${keyword}"!`);
    setTimeout(() => setTrackedKeywordMessage(null), 3000);
  };

  const filteredCategories = KEYWORD_CATEGORIES.map(category => {
    const matchingKeywords = category.keywords.filter(kw => 
      kw.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...category,
      keywords: matchingKeywords
    };
  }).filter(c => c.keywords.length > 0);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Institutional Taxonomy & Ontology</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Keyword-Based Cataloguing System
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Explore the college repository by domain ontologies. Click any keyword to filter associated research papers, or enable automated alert tracking for new uploads matching the keyword.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search catalogued terms..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:bg-white focus:outline-blue-600"
          />
        </div>
      </div>

      {/* Subscription Toast Feedback */}
      {trackedKeywordMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{trackedKeywordMessage}</span>
          </div>
          <button
            onClick={onOpenNotifications}
            className="text-xs font-bold underline hover:text-emerald-900 cursor-pointer"
          >
            View Alert Subscriptions →
          </button>
        </div>
      )}

      {/* Category Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((category) => (
          <div 
            key={category.id} 
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {category.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {category.keywords.length} terms
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {category.description}
              </p>

              {/* Keywords List with paper count and quick alert button */}
              <div className="space-y-2">
                {category.keywords.map((kw) => {
                  const paperCount = keywordCounts[kw] || 0;
                  return (
                    <div 
                      key={kw}
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between group transition-colors"
                    >
                      <button
                        onClick={() => onSelectKeyword(kw)}
                        className="text-left text-xs font-semibold text-slate-800 group-hover:text-blue-700 flex items-center gap-1.5 cursor-pointer flex-1 mr-2"
                      >
                        <Hash className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                        <span>{kw}</span>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono tabular-nums text-slate-500">
                          {paperCount} {paperCount === 1 ? 'paper' : 'papers'}
                        </span>

                        <button
                          onClick={() => handleQuickTrackKeyword(kw)}
                          title={`Create automated alert for new papers with #${kw}`}
                          className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                          aria-label={`Subscribe to alert for ${kw}`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectKeyword(kw)}
                          className="p-1 text-slate-400 group-hover:text-blue-700 cursor-pointer"
                          title="View papers"
                          aria-label={`Filter papers by ${kw}`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
