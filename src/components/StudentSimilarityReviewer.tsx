import React, { useState } from 'react';
import { ResearchPaper, SimilarityReviewResult } from '../types/repository';
import { similarityService } from '../services/similarityService';
import { COLLEGE_DEPARTMENTS, ALL_CANONICAL_KEYWORDS } from '../data/keywordsTaxonomy';
import { 
  FileSearch, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  RotateCcw,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

interface StudentSimilarityReviewerProps {
  papers: ResearchPaper[];
  onInspectExistingPaper: (paperId: string) => void;
  onProceedToUpload?: (draft: { title: string; abstract: string; department: string; keywords: string[] }) => void;
}

export const StudentSimilarityReviewer: React.FC<StudentSimilarityReviewerProps> = ({
  papers,
  onInspectExistingPaper,
  onProceedToUpload
}) => {
  // Input State
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [department, setDepartment] = useState<string>(COLLEGE_DEPARTMENTS[0]);
  const [keywords, setKeywords] = useState<string[]>(['Deep Learning', 'Computer Vision']);
  const [customKeyword, setCustomKeyword] = useState('');

  // Execution & Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<SimilarityReviewResult | null>(null);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [certificateDownloaded, setCertificateDownloaded] = useState(false);

  // Sample drafts loader
  const samples = similarityService.getSampleDrafts();

  const handleLoadSample = (sample: typeof samples[0]) => {
    setTitle(sample.title);
    setAbstract(sample.abstract);
    setDepartment(sample.department);
    setKeywords(sample.keywords);
    setReviewResult(null);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customKeyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setCustomKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleRunAnalysis = () => {
    if (!title.trim() || !abstract.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = similarityService.analyzeDraft(
        title,
        abstract,
        department,
        keywords,
        papers
      );
      setReviewResult(result);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleClear = () => {
    setTitle('');
    setAbstract('');
    setKeywords([]);
    setReviewResult(null);
  };

  const copyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitationId(id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  const downloadOriginalityCertificate = () => {
    if (!reviewResult) return;
    setCertificateDownloaded(true);

    const content = `================================================================================
COLLEGE RESEARCH REPOSITORY - STUDENT PRE-SUBMISSION ORIGINALITY REVIEW
================================================================================
Report Identifier: ${reviewResult.reviewId}
Date of Analysis: ${reviewResult.analyzedDate}
Student Draft Title: ${reviewResult.inputTitle}
Target Department: ${reviewResult.inputDepartment}
Word Count Analyzed: ${reviewResult.wordCount} words
Comparison Corpus: ${papers.length} Institutional College Research Papers

================================================================================
ORIGINALITY & SIMILARITY METRICS
================================================================================
Overall Similarity Index: ${reviewResult.overallSimilarityScore}%
Institutional Safety Verdict: ${reviewResult.verdict}

CRITERIA BENCHMARKS:
- Less than 10%: Highly Original (Eligible for immediate institutional review)
- 10% to 18%: Acceptable Overlap (Standard domain terminology and methodology citations)
- 18% to 28%: Moderate Overlap (Requires explicit prior art citation in Section 2)
- Greater than 28%: High Risk (Significant conceptual or phrase overlap; revision mandatory)

================================================================================
TOP MATCHING COLLEGE PRIOR ART PAPERS
================================================================================
${reviewResult.topMatches.length === 0 ? 'No significant college prior-art collisions detected.' : reviewResult.topMatches.map((m, idx) => `
0${idx + 1}. [Score: ${m.similarityScore}%] ${m.paperTitle}
    Author: ${m.leadAuthor} | Department: ${m.department} | ID: ${m.paperId}
    Matched Keywords: ${m.matchedKeywords.join(', ') || 'N/A'}
    Overlapping N-Gram Phrases: ${m.matchedPhrases.length > 0 ? m.matchedPhrases.map(p => `"${p}"`).join(', ') : 'None verbatim'}
    Mandatory Suggested Citation:
    ${m.suggestedCitation}
`).join('\n')}

================================================================================
NOVELTY EVALUATION
================================================================================
Novel Concepts Introduced:
${reviewResult.novelConceptsIdentified.length > 0 ? reviewResult.novelConceptsIdentified.map(c => `- ${c}`).join('\n') : '- None distinctly unique from college taxonomy'}

Pre-existing College Concepts Overlapping:
${reviewResult.overlappingConceptsIdentified.length > 0 ? reviewResult.overlappingConceptsIdentified.map(c => `- ${c}`).join('\n') : '- Minimal prior footprint in college'}

================================================================================
CITATION & INTEGRITY GUIDANCE FOR STUDENT
================================================================================
${reviewResult.citationGuidance.map((g, i) => `${i + 1}. ${g}`).join('\n')}

================================================================================
Verification Seal: College Research Cell Academic Integrity Office
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `${reviewResult.reviewId}_Originality_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setCertificateDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <FileSearch className="w-4 h-4" />
            <span>Academic Integrity & Prior Art Reviewer</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Student Pre-Submission Similarity Review System
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Test your research draft against all previously archived papers in the college repository before final submission. Detect conceptual collisions, discover prior college work you must cite, and verify originality.
          </p>
        </div>

        {/* Load Test Samples */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="text-xs text-slate-400 font-medium">Load sample:</span>
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadSample(s)}
              className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Sample {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Results Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INPUT DRAFT FORM */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Submit Draft for Similarity Check
            </h3>
            {(title || abstract) && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Draft Paper Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Neural Radiance Fields for Minimally Invasive Surgery"
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Draft Abstract or Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Paste your draft abstract, methodology description, or key findings here..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600 leading-relaxed"
            />
            <div className="text-[11px] text-slate-400 text-right mt-1 font-mono">
              {abstract.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Your Academic Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2 text-slate-900 bg-white"
            >
              {COLLEGE_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Keywords Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Research Keywords ({keywords.length})
            </label>
            <div className="flex flex-wrap gap-1 mb-2 min-h-6">
              {keywords.map(kw => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium"
                >
                  #{kw}
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-red-600 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                placeholder="Add keyword (e.g. Biosensors)"
                className="flex-1 text-xs border border-slate-300 rounded p-1.5 text-slate-900"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700 cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={!title.trim() || !abstract.trim() || isAnalyzing}
            className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Comparing Against {papers.length} College Papers...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Originality & Similarity Check</span>
              </>
            )}
          </button>
        </div>

        {/* RESULTS INSPECTOR */}
        <div className="lg:col-span-7 space-y-4">
          {!reviewResult ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
              <FileSearch className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Awaiting Student Paper Submission
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Enter your draft title and abstract on the left, or click one of the pre-loaded sample drafts above to run an instant similarity check against the college repository.
              </p>
              <div className="text-xs text-slate-400">
                Institutional corpus contains <strong className="text-slate-700 font-mono">{papers.length}</strong> verified college papers.
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              {/* Score Card Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span>Report: <strong className="font-mono text-slate-800">{reviewResult.reviewId}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Compared against <strong className="font-mono text-slate-800">{papers.length}</strong> college papers</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Originality Assessment: {reviewResult.verdict}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {reviewResult.overallSimilarityScore < 10
                        ? 'Safe for submission. Minimal overlap detected with previous college works.'
                        : reviewResult.overallSimilarityScore < 20
                        ? 'Acceptable overlap. Ensure all shared domain concepts are properly cited.'
                        : 'Moderate to high overlap. Prior-art citation and conceptual differentiation required before formal upload.'}
                    </p>
                  </div>

                  {/* Big tabular percentage display */}
                  <div className="text-right shrink-0">
                    <div className={`text-4xl font-extrabold font-mono tabular-nums ${
                      reviewResult.overallSimilarityScore < 10
                        ? 'text-emerald-700'
                        : reviewResult.overallSimilarityScore < 20
                        ? 'text-blue-700'
                        : reviewResult.overallSimilarityScore < 30
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}>
                      {reviewResult.overallSimilarityScore}%
                    </div>
                    <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                      Similarity Index
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      reviewResult.overallSimilarityScore < 10
                        ? 'bg-emerald-600'
                        : reviewResult.overallSimilarityScore < 20
                        ? 'bg-blue-600'
                        : reviewResult.overallSimilarityScore < 30
                        ? 'bg-amber-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${reviewResult.overallSimilarityScore}%` }}
                  />
                </div>
              </div>

              {/* Top Matching Prior Art Papers */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Matching College Prior Art ({reviewResult.topMatches.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Ranked by similarity
                  </span>
                </div>

                {reviewResult.topMatches.length === 0 ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No conflicting prior art found in the college repository for this draft!</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviewResult.topMatches.map((match, idx) => (
                      <div 
                        key={match.paperId}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900 leading-snug block">
                              {match.paperTitle}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>Lead: <strong>{match.leadAuthor}</strong></span>
                              <span aria-hidden="true">·</span>
                              <span>{match.department}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-slate-600">[{match.paperId}]</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold font-mono tabular-nums text-slate-800">
                              {match.similarityScore}%
                            </span>
                            <span className="text-[10px] text-slate-400 block uppercase">overlap</span>
                          </div>
                        </div>

                        {/* Overlapping Phrases or Keywords */}
                        {match.matchedPhrases.length > 0 && (
                          <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/80">
                            <span className="font-semibold text-slate-700">Matching Phrasing: </span>
                            {match.matchedPhrases.map((phrase, pIdx) => (
                              <span key={pIdx} className="bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-mono mr-1">
                                "{phrase}"
                              </span>
                            ))}
                          </div>
                        )}

                        {match.matchedKeywords.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap text-[11px]">
                            <span className="text-slate-400 font-medium">Shared keywords:</span>
                            {match.matchedKeywords.map(kw => (
                              <span key={kw} className="text-blue-800 font-medium">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Citation Copy Box */}
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                          <button
                            onClick={() => onInspectExistingPaper(match.paperId)}
                            className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            Inspect Paper Dossier
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => copyCitation(match.suggestedCitation, match.paperId)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
                          >
                            {copiedCitationId === match.paperId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedCitationId === match.paperId ? 'Citation Copied!' : 'Copy Citation for Paper'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Novelty vs Overlap Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Novel Concepts Identified</span>
                  </div>
                  {reviewResult.novelConceptsIdentified.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">
                      All submitted keywords match existing college repository topics.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {reviewResult.novelConceptsIdentified.map(c => (
                        <span key={c} className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                          ✓ #{c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Overlapping Domain Footprint</span>
                  </div>
                  {reviewResult.overlappingConceptsIdentified.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">
                      Zero conceptual overlap in indexed keywords.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {reviewResult.overlappingConceptsIdentified.map(c => (
                        <span key={c} className="text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-medium">
                          #{c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Guidance & Export Action */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Ready to attach proof to your formal manuscript?
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadOriginalityCertificate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {certificateDownloaded ? 'Certificate Downloaded!' : 'Export Originality Report'}
                  </button>

                  {onProceedToUpload && (
                    <button
                      onClick={() => onProceedToUpload({
                        title: reviewResult.inputTitle,
                        abstract: reviewResult.inputAbstract,
                        department: reviewResult.inputDepartment,
                        keywords
                      })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Proceed to Final Upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
