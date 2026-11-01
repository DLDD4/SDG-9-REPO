import React, { useState } from 'react';
import { ResearchPaper, RepositoryReviewStatus } from '../types/repository';
import { SDG_MAP } from '../data/sdgTaxonomy';
import { 
  X, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  FileCheck2, 
  BookOpen, 
  Award, 
  FileText, 
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Globe2
} from 'lucide-react';

interface PaperDetailModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
  onKeywordClick: (keyword: string) => void;
  onSdgClick?: (sdgId: number) => void;
  onUpdateReviewStatus: (paperId: string, newStatus: RepositoryReviewStatus) => void;
}

export const PaperDetailModal: React.FC<PaperDetailModalProps> = ({
  paper,
  onClose,
  onKeywordClick,
  onSdgClick,
  onUpdateReviewStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'proofs' | 'citations'>('overview');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!paper) return null;

  const leadAuthor = paper.authors[0];
  const isJournal = paper.isPublished && paper.publicationDetails;

  // Citation generator formats
  const generateAPA = () => {
    const authorsText = paper.authors.map(a => a.name).join(', ');
    const year = paper.academicYear.split('-')[0] || '2025';
    if (isJournal && paper.publicationDetails) {
      return `${authorsText} (${year}). ${paper.title}. ${paper.publicationDetails.journalName}, ${paper.publicationDetails.volume || '1'}(${paper.publicationDetails.issue || '1'}), ${paper.publicationDetails.pages || '1-10'}. https://doi.org/${paper.publicationDetails.doi}`;
    }
    return `${authorsText} (${year}). ${paper.title} [Institutional Pre-print]. ${paper.department}, College Research Repository.`;
  };

  const generateIEEE = () => {
    const authorsInitials = paper.authors.map(a => `${a.name.split(' ').map(n => n[0]).join('. ')} ${a.name.split(' ').slice(-1)}`).join(', ');
    const year = paper.academicYear.split('-')[0] || '2025';
    if (isJournal && paper.publicationDetails) {
      return `${authorsInitials}, "${paper.title}," ${paper.publicationDetails.journalName}, vol. ${paper.publicationDetails.volume || '1'}, no. ${paper.publicationDetails.issue || '1'}, pp. ${paper.publicationDetails.pages || '1-10'}, ${year}, doi: ${paper.publicationDetails.doi}.`;
    }
    return `${authorsInitials}, "${paper.title}," College Institutional Repository, ${year}.`;
  };

  const generateBibTeX = () => {
    const key = `${leadAuthor.name.split(' ').slice(-1)[0]?.toLowerCase() || 'author'}${paper.academicYear.split('-')[0] || '2025'}${paper.id.replace(/[^a-zA-Z0-9]/g, '')}`;
    const authorsStr = paper.authors.map(a => a.name).join(' and ');
    if (isJournal && paper.publicationDetails) {
      return `@article{${key},
  author    = {${authorsStr}},
  title     = {${paper.title}},
  journal   = {${paper.publicationDetails.journalName}},
  publisher = {${paper.publicationDetails.publisher}},
  volume    = {${paper.publicationDetails.volume || ''}},
  number    = {${paper.publicationDetails.issue || ''}},
  pages     = {${paper.publicationDetails.pages || ''}},
  year      = {${paper.academicYear.split('-')[0] || '2025'}},
  doi       = {${paper.publicationDetails.doi}}
}`;
    }
    return `@techreport{${key},
  author      = {${authorsStr}},
  title       = {${paper.title}},
  institution = {College Research Repository},
  department  = {${paper.department}},
  year        = {${paper.academicYear.split('-')[0] || '2025'}},
  note        = {Institutional Working Paper ID: ${paper.id}}
}`;
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownloadSimulation = () => {
    setDownloadSuccess(true);
    // Create simulated academic download
    const element = document.createElement("a");
    const file = new Blob([
      `================================================================================
COLLEGE INSTITUTIONAL RESEARCH REPOSITORY - AUTHORIZED MANUSCRIPT
================================================================================
Paper Identifier: ${paper.id}
Title: ${paper.title}
Department: ${paper.department}
Academic Year: ${paper.academicYear}
Submission Date: ${paper.submissionDate}

AUTHORS:
${paper.authors.map(a => `- ${a.name} (${a.role}) - ${a.email} [${a.department}]`).join('\n')}

PUBLICATION STATUS:
${isJournal && paper.publicationDetails ? `Journal: ${paper.publicationDetails.journalName}
Publisher: ${paper.publicationDetails.publisher}
DOI: https://doi.org/${paper.publicationDetails.doi}
ISSN: ${paper.publicationDetails.issn || 'N/A'}
Impact Factor: ${paper.publicationDetails.impactFactor || 'N/A'}` : 'Institutional Pre-print / Research Working Paper'}

VERIFIED PROOF COMPLIANCE:
- IRB / Ethics Clearance: ${paper.proofDocuments.irbClearance.approvalNumber || 'Approved'} (${paper.proofDocuments.irbClearance.title})
- Guide Endorsement: Signed by ${paper.proofDocuments.guideEndorsement.signatoryName}
- Plagiarism Similarity: ${paper.proofDocuments.plagiarismReport.similarityPercentage}% via ${paper.proofDocuments.plagiarismReport.softwareUsed} (${paper.proofDocuments.plagiarismReport.verificationStatus})
${paper.proofDocuments.journalProof ? `- Journal Reprint Proof: ${paper.proofDocuments.journalProof.proofType}` : ''}

KEYWORDS:
${paper.keywords.join(', ')}

ABSTRACT:
${paper.abstract}

================================================================================
This verified manuscript is archived under the College Open Repository Governance policy.
================================================================================`
    ], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = `${paper.id}_${paper.title.slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_')}_Official_Dossier.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-semibold text-blue-900">{paper.department}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{paper.id}</span>
              <span aria-hidden="true">·</span>
              <span>{paper.academicYear}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${
                paper.reviewStatus === 'Verified' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {paper.reviewStatus === 'Verified' ? 'Cell Verified' : paper.reviewStatus}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {paper.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Authors
          </button>
          <button
            onClick={() => setActiveTab('proofs')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proofs'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Proof Documents & Verification
            <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.2 rounded">
              {Object.keys(paper.proofDocuments).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'citations'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Cite & Export
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <>
              {/* Journal Publication Banner (if published) */}
              {isJournal && paper.publicationDetails ? (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Peer-Reviewed Journal Publication</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {paper.publicationDetails.journalName}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Publisher: {paper.publicationDetails.publisher}</span>
                        <span aria-hidden="true">·</span>
                        {paper.publicationDetails.volume && (
                          <>
                            <span>Vol. {paper.publicationDetails.volume}, Iss. {paper.publicationDetails.issue || '1'}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>Published: {paper.publicationDetails.publishedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{paper.publicationDetails.openAccessType}</span>
                      </div>

                      {/* Indexing Badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-medium">Indexed in:</span>
                        {paper.publicationDetails.indexing.map(idx => (
                          <span key={idx} className="text-xs text-slate-700 font-mono">
                            {idx}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {paper.publicationDetails.impactFactor && (
                        <div className="text-xs text-slate-500">
                          Impact Factor: <span className="font-bold text-slate-900 font-mono tabular-nums">{paper.publicationDetails.impactFactor}</span>
                        </div>
                      )}
                      <a
                        href={`https://doi.org/${paper.publicationDetails.doi}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-700 hover:underline font-mono"
                      >
                        doi:{paper.publicationDetails.doi}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Institutional Pre-Print / Thesis Manuscript</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Archived in college digital repository. Not yet formally released in an external scientific journal. All institutional proof documents verified.
                    </p>
                  </div>
                </div>
              )}

              {/* Abstract */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Abstract & Synopsis
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  {paper.abstract}
                </p>
              </div>

              {/* UN Sustainable Development Goals (SDGs) Alignment */}
              {paper.sdgs && paper.sdgs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>UN Sustainable Development Goals (SDGs)</span>
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {paper.sdgs.map(sdgId => {
                      const goal = SDG_MAP.get(sdgId);
                      if (!goal) return null;
                      return (
                        <button
                          key={sdgId}
                          onClick={() => {
                            if (onSdgClick) onSdgClick(sdgId);
                            onClose();
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: goal.color }}
                          title={`${goal.code}: ${goal.description}`}
                        >
                          <span className="font-bold">{goal.code}</span>
                          <span className="font-normal opacity-90">{goal.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Keywords Cataloguing */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Catalogued Keywords & Subject Categories
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {paper.keywords.map(kw => (
                    <button
                      key={kw}
                      onClick={() => {
                        onKeywordClick(kw);
                        onClose();
                      }}
                      className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      #{kw}
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">
                    Subject: <strong className="text-slate-700 font-normal">{paper.subjectCategory}</strong>
                  </span>
                </div>
              </div>

              {/* Authors Roster */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Author Roster & Institutional Affiliation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paper.authors.map((author, index) => (
                    <div key={index} className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-semibold text-slate-900">{author.name}</span>
                        <span className="text-xs text-slate-500">{author.role}</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{author.department}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1 flex items-center justify-between">
                        <span>{author.email}</span>
                        {author.orcid && (
                          <span className="text-emerald-700 text-[11px]">ORCID: {author.orcid}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repository Metrics & Cell Review Controls */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Citations Recorded</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">{paper.citationsCount}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400 block text-[11px]">Repository Views</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">{paper.viewsCount}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400 block text-[11px]">Downloads</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">{paper.downloadsCount}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400 block text-[11px]">File Size & Pages</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">{paper.paperFileSize} · {paper.pagesCount} pp</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Research Cell Review:</span>
                  <select
                    value={paper.reviewStatus}
                    onChange={(e) => onUpdateReviewStatus(paper.id, e.target.value as RepositoryReviewStatus)}
                    aria-label="Update Research Cell review status"
                    className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium cursor-pointer focus:outline-blue-600"
                  >
                    <option value="Verified">Verified by Cell</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Revision Requested">Revision Requested</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'proofs' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                The college repository mandates verified evidence of ethical compliance, faculty supervisor sign-off, originality/anti-plagiarism screening, and peer-reviewed journal proof.
              </div>

              {/* 1. IRB / Ethical Clearance */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        1. Institutional Ethics & IRB Clearance Document
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {paper.proofDocuments.irbClearance.title}
                      </p>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                        <span>Approval No: <strong className="font-mono text-slate-800">{paper.proofDocuments.irbClearance.approvalNumber || 'IRB-EXEMPT-01'}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>File: <strong className="font-mono text-slate-800">{paper.proofDocuments.irbClearance.fileName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Size: {paper.proofDocuments.irbClearance.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    {paper.proofDocuments.irbClearance.verificationStatus}
                  </span>
                </div>
              </div>

              {/* 2. Department Guide Endorsement */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0 mt-0.5">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        2. Faculty Guide & Department Head Endorsement Sign-off
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {paper.proofDocuments.guideEndorsement.title}
                      </p>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                        <span>Signatory: <strong className="text-slate-800">{paper.proofDocuments.guideEndorsement.signatoryName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Designation: {paper.proofDocuments.guideEndorsement.signatoryDesignation}</span>
                        <span aria-hidden="true">·</span>
                        <span>File: <strong className="font-mono text-slate-800">{paper.proofDocuments.guideEndorsement.fileName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    Endorsed
                  </span>
                </div>
              </div>

              {/* 3. Originality & Plagiarism Report */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        3. Plagiarism & Originality Verification Report
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {paper.proofDocuments.plagiarismReport.title}
                      </p>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                        <span>Software: <strong className="text-slate-800">{paper.proofDocuments.plagiarismReport.softwareUsed}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Similarity Score: <strong className="font-mono text-slate-900 text-sm">{paper.proofDocuments.plagiarismReport.similarityPercentage}%</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>File: <strong className="font-mono text-slate-800">{paper.proofDocuments.plagiarismReport.fileName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    paper.proofDocuments.plagiarismReport.similarityPercentage < 10
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-amber-700 bg-amber-50'
                  }`}>
                    {paper.proofDocuments.plagiarismReport.verificationStatus}
                  </span>
                </div>
              </div>

              {/* 4. Journal Proof (if published) */}
              {isJournal && paper.proofDocuments.journalProof ? (
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          4. Scientific Journal Publication Proof
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {paper.proofDocuments.journalProof.title}
                        </p>
                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                          <span>Proof Category: <strong className="text-slate-800">{paper.proofDocuments.journalProof.proofType}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Accepted Date: {paper.proofDocuments.journalProof.acceptanceDate || 'Verified'}</span>
                          <span aria-hidden="true">·</span>
                          <span>File: <strong className="font-mono text-slate-800">{paper.proofDocuments.journalProof.fileName}</strong></span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      Verified Match
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <div className="font-semibold text-slate-800 mb-1">4. Journal Proof: Not Applicable</div>
                  This document is registered as an Institutional Pre-Print / Thesis. Upon formal journal acceptance, the author can upload the camera-ready reprint and editorial acceptance proof.
                </div>
              )}
            </div>
          )}

          {activeTab === 'citations' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Export bibliographic citation formats for reference managers (Zotero, Mendeley, EndNote) or LaTeX bibliographies.
              </div>

              {/* APA 7th */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    APA (7th Edition)
                  </span>
                  <button
                    onClick={() => copyToClipboard(generateAPA(), 'apa')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    {copiedFormat === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedFormat === 'apa' ? 'Copied!' : 'Copy APA'}
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-800 select-all leading-relaxed">
                  {generateAPA()}
                </div>
              </div>

              {/* IEEE */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    IEEE Style
                  </span>
                  <button
                    onClick={() => copyToClipboard(generateIEEE(), 'ieee')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    {copiedFormat === 'ieee' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedFormat === 'ieee' ? 'Copied!' : 'Copy IEEE'}
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-800 select-all leading-relaxed">
                  {generateIEEE()}
                </div>
              </div>

              {/* BibTeX */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    BibTeX
                  </span>
                  <button
                    onClick={() => copyToClipboard(generateBibTeX(), 'bibtex')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    {copiedFormat === 'bibtex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedFormat === 'bibtex' ? 'Copied!' : 'Copy BibTeX'}
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-800 select-all whitespace-pre-wrap leading-relaxed">
                  {generateBibTeX()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Primary File: <strong className="font-mono text-slate-800">{paper.paperFileName}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{paper.paperFileSize}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSimulation}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              {downloadSuccess ? 'Downloaded!' : 'Download Paper & Proof Dossier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
