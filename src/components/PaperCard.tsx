import { ResearchPaper } from '../types/repository';
import { UN_SDG_GOALS, SDG_MAP } from '../data/sdgTaxonomy';
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle, 
  Download, 
  FileCheck2,
  AlertCircle,
  Globe2
} from 'lucide-react';

interface PaperCardProps {
  paper: ResearchPaper;
  onSelectPaper: (paper: ResearchPaper) => void;
  onKeywordClick: (keyword: string) => void;
  onSdgClick?: (sdgId: number) => void;
  selectedKeywords?: string[];
  selectedSdg?: number | null;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  onSelectPaper,
  onKeywordClick,
  onSdgClick,
  selectedKeywords = [],
  selectedSdg = null
}) => {
  const leadAuthor = paper.authors[0];
  const otherAuthorsCount = paper.authors.length - 1;
  const isJournalPublished = paper.isPublished && paper.publicationDetails;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top Kicker: Department & Publication Status as unboxed clean text */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900">{paper.department}</span>
            <span aria-hidden="true">·</span>
            <span>{paper.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{paper.id}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            {isJournalPublished ? (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Journal Published</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Institutional Pre-print</span>
              </span>
            )}
          </div>
        </div>

        {/* Paper Title (Clickable) */}
        <h3 
          onClick={() => onSelectPaper(paper)}
          className="text-base font-semibold text-slate-900 hover:text-blue-700 cursor-pointer leading-snug mb-2 transition-colors"
        >
          {paper.title}
        </h3>

        {/* Authors */}
        <div className="text-xs text-slate-600 mb-3 flex items-center flex-wrap gap-1">
          <span className="font-medium text-slate-900">{leadAuthor.name}</span>
          <span className="text-slate-400">({leadAuthor.role})</span>
          {otherAuthorsCount > 0 && (
            <>
              <span className="text-slate-400">and</span>
              <span className="text-slate-700">
                {paper.authors.slice(1).map(a => a.name).join(', ')}
              </span>
            </>
          )}
        </div>

        {/* Abstract Snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {paper.abstract}
        </p>

        {/* Journal citation if published */}
        {isJournalPublished && paper.publicationDetails && (
          <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-slate-900 truncate">
                {paper.publicationDetails.journalName}
              </span>
              {paper.publicationDetails.impactFactor && (
                <span className="text-slate-500 shrink-0 font-mono tabular-nums text-[11px]">
                  IF {paper.publicationDetails.impactFactor.toFixed(1)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{paper.publicationDetails.publisher}</span>
              <span aria-hidden="true">·</span>
              <span>{paper.publicationDetails.publishedDate}</span>
              {paper.publicationDetails.doi && (
                <>
                  <span aria-hidden="true">·</span>
                  <a 
                    href={`https://doi.org/${paper.publicationDetails.doi}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-blue-700 hover:underline inline-flex items-center gap-0.5 font-mono"
                    onClick={(e) => e.stopPropagation()}
                  >
                    doi:{paper.publicationDetails.doi}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </>
              )}
            </div>
          </div>
        )}

        {/* Proof Documents Status Summary Bar */}
        <div className="mb-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Proof Documents
          </span>
          <div className="flex items-center gap-3">
            {/* IRB / Ethics */}
            <span 
              className={`inline-flex items-center gap-1 ${
                paper.proofDocuments.irbClearance.uploaded ? 'text-emerald-700' : 'text-slate-400'
              }`}
              title={`IRB Clearance: ${paper.proofDocuments.irbClearance.verificationStatus}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px]">IRB</span>
            </span>

            {/* Guide Endorsement */}
            <span 
              className={`inline-flex items-center gap-1 ${
                paper.proofDocuments.guideEndorsement.uploaded ? 'text-emerald-700' : 'text-slate-400'
              }`}
              title={`Guide Endorsement: ${paper.proofDocuments.guideEndorsement.signatoryName}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="text-[11px]">Guide</span>
            </span>

            {/* Plagiarism Report */}
            <span 
              className="inline-flex items-center gap-1 text-slate-700"
              title={`${paper.proofDocuments.plagiarismReport.softwareUsed} Similarity: ${paper.proofDocuments.plagiarismReport.similarityPercentage}%`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-mono tabular-nums">
                {paper.proofDocuments.plagiarismReport.similarityPercentage}% Sim
              </span>
            </span>

            {/* Journal Proof if published */}
            {isJournalPublished && (
              <span 
                className="inline-flex items-center gap-1 text-emerald-700"
                title="Journal Acceptance / Camera-ready Proof Uploaded"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[11px]">Proof</span>
              </span>
            )}
          </div>
        </div>

        {/* SDG Sustainability Alignment & Keywords */}
        <div className="space-y-2 mb-4">
          {paper.sdgs && paper.sdgs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                SDG Goals:
              </span>
              {paper.sdgs.map(sdgId => {
                const goal = SDG_MAP.get(sdgId);
                if (!goal) return null;
                const isSdgSelected = selectedSdg === sdgId;
                return (
                  <button
                    key={sdgId}
                    onClick={() => onSdgClick && onSdgClick(sdgId)}
                    title={`${goal.code}: ${goal.name}`}
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                      isSdgSelected 
                        ? 'ring-2 ring-slate-900 text-white' 
                        : 'text-white hover:opacity-90'
                    }`}
                    style={{ backgroundColor: goal.color }}
                  >
                    <span>{goal.code}</span>
                    <span className="font-normal opacity-90">{goal.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Keywords catalog tags (interactive buttons with clean styling) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {paper.keywords.map((kw) => {
              const isSelected = selectedKeywords.includes(kw);
              return (
                <button
                  key={kw}
                  onClick={() => onKeywordClick(kw)}
                  className={`text-[11px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white font-medium'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  #{kw}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata & Inspect Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums">{paper.citationsCount} citations</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{paper.downloadsCount} downloads</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectPaper(paper)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-blue-50"
          >
            Inspect Dossier & Proofs
          </button>
        </div>
      </div>
    </div>
  );
};
