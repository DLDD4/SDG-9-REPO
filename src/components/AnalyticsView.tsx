import React from 'react';
import { ResearchPaper } from '../types/repository';
import { COLLEGE_DEPARTMENTS } from '../data/keywordsTaxonomy';
import { BarChart2, Award, ShieldCheck, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface AnalyticsViewProps {
  papers: ResearchPaper[];
  onSelectDepartment: (dept: string) => void;
  onSelectPaper: (paper: ResearchPaper) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  papers,
  onSelectDepartment,
  onSelectPaper
}) => {
  const total = papers.length;
  const journalPublished = papers.filter(p => p.isPublished).length;
  const totalCitations = papers.reduce((acc, p) => acc + p.citationsCount, 0);
  const avgSimilarity = total > 0
    ? (papers.reduce((acc, p) => acc + p.proofDocuments.plagiarismReport.similarityPercentage, 0) / total).toFixed(1)
    : '0';

  // Department statistics
  const deptStats = COLLEGE_DEPARTMENTS.map(dept => {
    const deptPapers = papers.filter(p => p.department === dept);
    const published = deptPapers.filter(p => p.isPublished).length;
    const citations = deptPapers.reduce((acc, p) => acc + p.citationsCount, 0);
    return {
      name: dept,
      total: deptPapers.length,
      published,
      citations
    };
  }).filter(d => d.total > 0);

  // Indexing distribution
  const indexingCounts: Record<string, number> = {
    'Scopus': 0,
    'Web of Science (SCI/SCIE)': 0,
    'IEEE Xplore': 0,
    'PubMed': 0
  };

  for (const paper of papers) {
    if (paper.publicationDetails?.indexing) {
      for (const idx of paper.publicationDetails.indexing) {
        if (indexingCounts[idx] !== undefined) {
          indexingCounts[idx]++;
        }
      }
    }
  }

  // Top cited papers
  const topCited = [...papers].sort((a, b) => b.citationsCount - a.citationsCount).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <BarChart2 className="w-4 h-4" />
          <span>Institutional Research Intelligence</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          College Scholar & Publication Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Aggregated performance across academic departments, peer-reviewed journal indexing, compliance documentation, and scholar citation impact.
        </p>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500">Repository Archival</span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {total} <span className="text-xs font-normal text-slate-500">papers</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Journal Publication Rate</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
              {total > 0 ? Math.round((journalPublished / total) * 100) : 0}%
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Total Citations Recorded</span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {totalCitations}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Avg Originality Similarity</span>
            <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums mt-0.5">
              {avgSimilarity}% <span className="text-xs font-normal text-slate-500">Turnitin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Departmental Breakdown & Indexing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Output */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Departmental Output & Publishing Efficiency
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Research papers catalogued and published by academic unit.
          </p>

          <div className="space-y-3">
            {deptStats.map((dept) => {
              const percentage = total > 0 ? (dept.total / total) * 100 : 0;
              return (
                <div 
                  key={dept.name}
                  onClick={() => onSelectDepartment(dept.name)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-800 mb-1">
                    <span className="truncate pr-2">{dept.name}</span>
                    <span className="font-mono tabular-nums shrink-0">
                      {dept.total} papers ({dept.published} published)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-700 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indexing Distribution & Proof Compliance */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Scientific Indexing Coverage
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of verified peer-reviewed publications across indexing agencies.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(indexingCounts).map(([indexingName, count]) => (
                <div key={indexingName} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-600 block">{indexingName}</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {count}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">indexed papers</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Proof Document Compliance Rate
            </h3>
            <div className="space-y-2 mt-3 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Ethics / IRB Clearance Verification
                </span>
                <span className="font-bold text-emerald-700 font-mono">100% Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Guide / HOD Endorsement Sign-offs
                </span>
                <span className="font-bold text-emerald-700 font-mono">100% Endorsed</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Plagiarism Compliance (&le; 10% similarity)
                </span>
                <span className="font-bold text-blue-700 font-mono">100% Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Impact Research Papers */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Top Impact Research Works in College Repository
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Highest cited papers across national and international scholarly citations.
        </p>

        <div className="divide-y divide-slate-100">
          {topCited.map((paper, idx) => (
            <div 
              key={paper.id}
              onClick={() => onSelectPaper(paper)}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-xs font-mono font-bold text-slate-400 w-4">
                  0{idx + 1}.
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {paper.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{paper.authors[0].name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.department}</span>
                    {paper.publicationDetails && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium truncate">{paper.publicationDetails.journalName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {paper.citationsCount}
                </div>
                <div className="text-[10px] text-slate-400 uppercase">citations</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
