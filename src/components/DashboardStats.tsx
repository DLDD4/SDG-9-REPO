import React from 'react';
import { ResearchPaper } from '../types/repository';
import { FileText, CheckCircle2, Award, Hash, TrendingUp, Globe2, FileSearch } from 'lucide-react';

interface DashboardStatsProps {
  papers: ResearchPaper[];
  onFilterPublishedOnly: () => void;
  onFilterUnderReview: () => void;
  onViewKeywords: () => void;
  onViewSdgs?: () => void;
  onViewReviewer?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  papers,
  onFilterPublishedOnly,
  onFilterUnderReview,
  onViewKeywords,
  onViewSdgs,
  onViewReviewer
}) => {
  const totalPapers = papers.length;
  const publishedCount = papers.filter(p => p.isPublished).length;
  const underReviewCount = papers.filter(p => !p.isPublished).length;
  const publishedPercentage = totalPapers > 0 ? Math.round((publishedCount / totalPapers) * 100) : 0;
  
  const indexedCount = papers.filter(p => 
    p.publicationDetails?.indexing && p.publicationDetails.indexing.length > 0
  ).length;

  const totalCitations = papers.reduce((acc, p) => acc + (p.citationsCount || 0), 0);
  
  const allKeywords = new Set(papers.flatMap(p => p.keywords));
  const uniqueKeywordsCount = allKeywords.size;

  const totalSdgsCovered = new Set(papers.flatMap(p => p.sdgs || [])).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 bg-white border border-slate-200 rounded-xl mb-6 shadow-xs">
      {/* 1. Total Papers */}
      <div className="flex flex-col justify-between p-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Total College Papers</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalPapers}
          </span>
          <span className="text-xs text-slate-500">archived</span>
        </div>
      </div>

      {/* 2. Journal Published */}
      <button 
        onClick={onFilterPublishedOnly}
        className="flex flex-col justify-between p-2 text-left hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="group-hover:text-blue-700">Journal Published</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {publishedCount}
          </span>
          <span className="text-xs text-emerald-600 font-semibold font-mono tabular-nums">
            {publishedPercentage}%
          </span>
        </div>
      </button>

      {/* 3. Under Review / Pre-print */}
      <button 
        onClick={onFilterUnderReview}
        className="flex flex-col justify-between p-2 text-left hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span className="group-hover:text-blue-700">Pre-prints & Theses</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {underReviewCount}
          </span>
          <span className="text-xs text-slate-500">proof verified</span>
        </div>
      </button>

      {/* 4. Scopus / WoS Indexed */}
      <div className="flex flex-col justify-between p-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>Indexed Publications</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {indexedCount}
          </span>
          <span className="text-xs text-slate-500">Scopus / WoS</span>
        </div>
      </div>

      {/* 5. Catalogued Keywords */}
      <button 
        onClick={onViewKeywords}
        className="flex flex-col justify-between p-2 text-left hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Hash className="w-3.5 h-3.5 text-blue-600" />
          <span className="group-hover:text-blue-700">Catalogued Keywords</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {uniqueKeywordsCount}
          </span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {totalCitations} cit.
          </span>
        </div>
      </button>

      {/* 6. UN SDG Goals Tracked */}
      <button 
        onClick={onViewSdgs}
        className="flex flex-col justify-between p-2 text-left hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="group-hover:text-emerald-700">UN SDG Catalog</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalSdgsCovered}
          </span>
          <span className="text-xs text-emerald-600 font-medium">
            of 17 Goals
          </span>
        </div>
      </button>
    </div>
  );
};
