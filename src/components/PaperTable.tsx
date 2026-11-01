import React, { useState } from 'react';
import { ResearchPaper } from '../types/repository';
import { SDG_MAP } from '../data/sdgTaxonomy';
import { 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Eye 
} from 'lucide-react';

interface PaperTableProps {
  papers: ResearchPaper[];
  onSelectPaper: (paper: ResearchPaper) => void;
  onKeywordClick: (keyword: string) => void;
  onSdgClick?: (sdgId: number) => void;
}

type SortField = 'title' | 'department' | 'academicYear' | 'citationsCount' | 'plagiarism';

export const PaperTable: React.FC<PaperTableProps> = ({
  papers,
  onSelectPaper,
  onKeywordClick,
  onSdgClick
}) => {
  const [sortField, setSortField] = useState<SortField>('citationsCount');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedPapers = [...papers].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'department') {
      comparison = a.department.localeCompare(b.department);
    } else if (sortField === 'academicYear') {
      comparison = a.academicYear.localeCompare(b.academicYear);
    } else if (sortField === 'citationsCount') {
      comparison = a.citationsCount - b.citationsCount;
    } else if (sortField === 'plagiarism') {
      comparison = 
        a.proofDocuments.plagiarismReport.similarityPercentage - 
        b.proofDocuments.plagiarismReport.similarityPercentage;
    }
    return sortAsc ? comparison : -comparison;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th scope="col" className="py-3 px-4">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  Paper Title & Authors
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  Department
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                Status & Journal
              </th>
              <th scope="col" className="py-3 px-3">
                Proofs
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  onClick={() => handleSort('plagiarism')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer font-mono"
                >
                  Similarity
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3 text-right">
                <button
                  onClick={() => handleSort('citationsCount')}
                  className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer font-mono ml-auto"
                >
                  Citations
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedPapers.map((paper) => {
              const leadAuthor = paper.authors[0];
              const isJournalPublished = paper.isPublished && paper.publicationDetails;

              return (
                <tr 
                  key={paper.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => onSelectPaper(paper)}
                >
                  {/* Title & Author */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {paper.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>{leadAuthor.name}</span>
                      <span className="text-slate-400 font-mono">[{paper.id}]</span>
                    </div>
                    {/* First 2 keywords & SDGs */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {paper.sdgs && paper.sdgs.map(sdgId => {
                        const g = SDG_MAP.get(sdgId);
                        if (!g) return null;
                        return (
                          <span
                            key={sdgId}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSdgClick && onSdgClick(sdgId);
                            }}
                            style={{ backgroundColor: g.color }}
                            className="text-[9px] text-white px-1.5 py-0.2 rounded font-semibold cursor-pointer hover:opacity-90"
                            title={`${g.code}: ${g.name}`}
                          >
                            {g.code}
                          </span>
                        );
                      })}
                      {paper.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          onClick={(e) => {
                            e.stopPropagation();
                            onKeywordClick(kw);
                          }}
                          className="text-[10px] text-slate-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                    {paper.department}
                  </td>

                  {/* Status & Journal */}
                  <td className="py-3.5 px-3">
                    {isJournalPublished ? (
                      <div>
                        <div className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle className="w-3 h-3 shrink-0" />
                          <span>Published</span>
                        </div>
                        <div className="text-[11px] text-slate-600 truncate max-w-[160px] font-medium" title={paper.publicationDetails?.journalName}>
                          {paper.publicationDetails?.journalName}
                        </div>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Pre-print / Thesis</span>
                      </div>
                    )}
                  </td>

                  {/* Proofs status */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                      <span title="IRB Clearance status" className="text-emerald-700 font-medium">IRB✓</span>
                      <span className="text-slate-300">·</span>
                      <span title="Guide Endorsement status" className="text-emerald-700 font-medium">Guide✓</span>
                      {isJournalPublished && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span title="Journal Editorial Proof" className="text-blue-700 font-medium">Journal✓</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Similarity % */}
                  <td className="py-3.5 px-3 font-mono tabular-nums text-slate-800">
                    <span className={
                      paper.proofDocuments.plagiarismReport.similarityPercentage < 10
                        ? 'text-emerald-700 font-medium'
                        : 'text-amber-700 font-medium'
                    }>
                      {paper.proofDocuments.plagiarismReport.similarityPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {paper.proofDocuments.plagiarismReport.softwareUsed}
                    </span>
                  </td>

                  {/* Citations */}
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-800 font-medium">
                    {paper.citationsCount}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPaper(paper);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
