import React, { useState, useEffect } from 'react';
import { 
  ResearchPaper, 
  AcademicRole, 
  JournalIndexing, 
  OpenAccessType 
} from '../types/repository';
import { 
  KEYWORD_CATEGORIES, 
  COLLEGE_DEPARTMENTS, 
  ALL_CANONICAL_KEYWORDS 
} from '../data/keywordsTaxonomy';
import { UN_SDG_GOALS, SDG_MAP } from '../data/sdgTaxonomy';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';
import { 
  X, 
  Upload, 
  FileText, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  FileCheck2, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Globe2
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperUploaded: (paper: ResearchPaper, notificationsTriggeredCount: number) => void;
  initialDraft?: { title: string; abstract: string; department: string; keywords: string[] } | null;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPaperUploaded,
  initialDraft = null
}) => {
  if (!isOpen) return null;

  // Step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [abstract, setAbstract] = useState(initialDraft?.abstract || '');
  const [department, setDepartment] = useState<string>(initialDraft?.department || COLLEGE_DEPARTMENTS[0]);
  const [subjectCategory, setSubjectCategory] = useState<string>(KEYWORD_CATEGORIES[0].name);
  const [academicYear, setAcademicYear] = useState('2024-2025');

  // Authors
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRole, setLeadRole] = useState<AcademicRole>('PhD Scholar');
  const [leadOrcid, setLeadOrcid] = useState('');
  const [coAuthorsText, setCoAuthorsText] = useState('');

  // Keywords & SDGs
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialDraft?.keywords || []);
  const [customKeywordInput, setCustomKeywordInput] = useState('');
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([3, 9]);

  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.title) setTitle(initialDraft.title);
      if (initialDraft.abstract) setAbstract(initialDraft.abstract);
      if (initialDraft.department) setDepartment(initialDraft.department);
      if (initialDraft.keywords) setSelectedKeywords(initialDraft.keywords);
    }
  }, [initialDraft]);

  // Publication Status
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [journalName, setJournalName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [doi, setDoi] = useState('');
  const [issn, setIssn] = useState('');
  const [impactFactor, setImpactFactor] = useState('');
  const [selectedIndexing, setSelectedIndexing] = useState<JournalIndexing[]>(['Scopus']);
  const [openAccessType, setOpenAccessType] = useState<OpenAccessType>('Gold Open Access');

  // Proof Documents State
  const [paperFileName, setPaperFileName] = useState('Manuscript_Draft_v1.pdf');
  const [paperFileSize, setPaperFileSize] = useState('3.8 MB');

  // Proof 1: IRB
  const [irbFileName, setIrbFileName] = useState('Ethics_IRB_Clearance_2025.pdf');
  const [irbApprovalNo, setIrbApprovalNo] = useState('IRB-2025-APP-04');
  const [irbExempt, setIrbExempt] = useState(false);

  // Proof 2: Guide Endorsement
  const [guideFileName, setGuideFileName] = useState('Guide_Endorsement_Signoff.pdf');
  const [guideSignatoryName, setGuideSignatoryName] = useState('Prof. A. K. Sundaram');
  const [guideDesignation, setGuideDesignation] = useState('Head of Department / Research Advisory Chair');

  // Proof 3: Plagiarism Report
  const [plagiarismFileName, setPlagiarismFileName] = useState('Turnitin_Similarity_Report.pdf');
  const [similarityPercentage, setSimilarityPercentage] = useState<number>(6);
  const [plagiarismSoftware, setPlagiarismSoftware] = useState<'Turnitin' | 'Urkund / Ouriginal' | 'iThenticate' | 'DrillBit'>('Turnitin');

  // Proof 4: Journal Proof (if published)
  const [journalProofFileName, setJournalProofFileName] = useState('Camera_Ready_Journal_Reprint_Proof.pdf');
  const [journalProofType, setJournalProofType] = useState<'Published Final Reprint (Camera-Ready)' | 'Editorial Acceptance Letter' | 'DOI CrossRef Verification' | 'Copyright Agreement'>('Published Final Reprint (Camera-Ready)');

  // Submission error / alert
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keyword helper functions
  const handleToggleKeyword = (kw: string) => {
    if (selectedKeywords.includes(kw)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
    } else {
      setSelectedKeywords([...selectedKeywords, kw]);
    }
  };

  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customKeywordInput.trim();
    if (!trimmed) return;
    if (!selectedKeywords.includes(trimmed)) {
      setSelectedKeywords([...selectedKeywords, trimmed]);
    }
    setCustomKeywordInput('');
  };

  const handleToggleSdg = (sdgId: number) => {
    if (selectedSdgs.includes(sdgId)) {
      setSelectedSdgs(selectedSdgs.filter(id => id !== sdgId));
    } else {
      setSelectedSdgs([...selectedSdgs, sdgId]);
    }
  };

  const handleToggleIndexing = (idx: JournalIndexing) => {
    if (selectedIndexing.includes(idx)) {
      setSelectedIndexing(selectedIndexing.filter(i => i !== idx));
    } else {
      setSelectedIndexing([...selectedIndexing, idx]);
    }
  };

  // Step Validation
  const validateStep1 = () => {
    if (!title.trim()) {
      setErrorMessage('Please provide the research paper title.');
      return false;
    }
    if (!abstract.trim() || abstract.length < 30) {
      setErrorMessage('Please provide a substantive abstract (at least 30 characters).');
      return false;
    }
    if (!leadName.trim()) {
      setErrorMessage('Please provide the lead/corresponding author name.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    if (selectedKeywords.length < 1) {
      setErrorMessage('Please select or add at least 1 keyword for cataloguing.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep3 = () => {
    if (isPublished) {
      if (!journalName.trim()) {
        setErrorMessage('Please specify the scientific journal name.');
        return false;
      }
      if (!doi.trim()) {
        setErrorMessage('Please provide the Digital Object Identifier (DOI) or publication identifier.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmitPaper = () => {
    setIsSubmitting(true);

    // Prepare co-authors list
    const coAuthors = coAuthorsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(name => ({
        name,
        role: 'PhD Scholar' as AcademicRole,
        department,
        email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@college.edu`
      }));

    const allAuthors = [
      {
        name: leadName,
        role: leadRole,
        department,
        email: leadEmail || `${leadName.toLowerCase().replace(/[^a-z]/g, '.')}@college.edu`,
        isCorresponding: true,
        orcid: leadOrcid || undefined
      },
      ...coAuthors
    ];

    const newPaperId = `CRP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newPaper: ResearchPaper = {
      id: newPaperId,
      title,
      abstract,
      department,
      subjectCategory,
      academicYear,
      submissionDate: new Date().toISOString().split('T')[0],
      authors: allAuthors,
      keywords: selectedKeywords,
      sdgs: selectedSdgs,
      isPublished,
      publicationDetails: isPublished ? {
        journalName,
        publisher: publisher || 'Peer-Reviewed Academic Press',
        volume: volume || '1',
        issue: issue || '1',
        pages: pages || '1-12',
        publishedDate: publishedDate || new Date().toISOString().split('T')[0],
        doi: doi.startsWith('10.') ? doi : `10.1000/${doi}`,
        issn: issn || undefined,
        indexing: selectedIndexing.length > 0 ? selectedIndexing : ['Scopus'],
        impactFactor: impactFactor ? parseFloat(impactFactor) : undefined,
        openAccessType
      } : undefined,
      proofDocuments: {
        irbClearance: {
          uploaded: true,
          fileName: irbFileName,
          fileSize: '480 KB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'irb_clearance',
          title: 'Institutional Ethics Clearance Document',
          approvalNumber: irbExempt ? 'EXEMPT-DECLARED' : irbApprovalNo,
          verificationStatus: irbExempt ? 'Exempt' : 'Verified'
        },
        guideEndorsement: {
          uploaded: true,
          fileName: guideFileName,
          fileSize: '320 KB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'guide_endorsement',
          title: 'Department Faculty Supervisor Endorsement Sign-off',
          signatoryName: guideSignatoryName,
          signatoryDesignation: guideDesignation,
          verificationStatus: 'Verified'
        },
        plagiarismReport: {
          uploaded: true,
          fileName: plagiarismFileName,
          fileSize: '1.2 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'plagiarism_report',
          title: 'Authenticity & Similarity Verification Report',
          similarityPercentage: Number(similarityPercentage),
          softwareUsed: plagiarismSoftware,
          verificationStatus: Number(similarityPercentage) <= 10 ? 'Compliant (<10%)' : 'Acceptable (10-15%)'
        },
        journalProof: isPublished ? {
          uploaded: true,
          fileName: journalProofFileName,
          fileSize: '2.5 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'journal_proof',
          title: 'Official Journal Publication Proof',
          proofType: journalProofType,
          acceptanceDate: publishedDate || new Date().toISOString().split('T')[0],
          verificationStatus: 'Verified'
        } : undefined
      },
      paperFileName,
      paperFileSize,
      pagesCount: Math.floor(8 + Math.random() * 12),
      reviewStatus: 'Verified',
      reviewedBy: 'College Research Cell Board',
      citationsCount: 0,
      viewsCount: 1,
      downloadsCount: 0
    };

    // 1. Save to localStorage
    storageService.savePaper(newPaper);

    // 2. Run automated notification engine
    const triggeredNotifications = notificationService.evaluatePaper(newPaper);

    setIsSubmitting(false);
    onPaperUploaded(newPaper, triggeredNotifications.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Upload Research Paper to College Repository
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit manuscript, catalog keywords, verify journal publication, and attach required proof documents.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close upload modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 1 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              1
            </span>
            <span className={currentStep === 1 ? 'text-blue-900 font-semibold' : 'text-slate-500'}>
              Manuscript & Authors
            </span>
          </div>
          <span className="text-slate-300">→</span>

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 2 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              2
            </span>
            <span className={currentStep === 2 ? 'text-blue-900 font-semibold' : 'text-slate-500'}>
              Keywords Cataloguing
            </span>
          </div>
          <span className="text-slate-300">→</span>

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 3 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              3
            </span>
            <span className={currentStep === 3 ? 'text-blue-900 font-semibold' : 'text-slate-500'}>
              Journal & Proof Documents
            </span>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Manuscript & Authors */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Research Paper Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Self-Supervised Neural Radiance Fields for Endoscopic Vision"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Abstract & Executive Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Provide an overview of the research problem, methodology, key findings, and empirical results..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600 bg-white"
                  >
                    {COLLEGE_DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600 bg-white font-mono"
                  >
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                  </select>
                </div>
              </div>

              {/* Lead Author */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lead / Corresponding Author Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Dr. Maya Krishnan"
                      className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Institutional Email
                    </label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="m.krishnan@college.edu"
                      className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Academic Role
                    </label>
                    <select
                      value={leadRole}
                      onChange={(e) => setLeadRole(e.target.value as AcademicRole)}
                      className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                    >
                      <option value="Faculty">Faculty</option>
                      <option value="PhD Scholar">PhD Scholar</option>
                      <option value="Master Student">Master Student</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    ORCID iD (Optional)
                  </label>
                  <input
                    type="text"
                    value={leadOrcid}
                    onChange={(e) => setLeadOrcid(e.target.value)}
                    placeholder="0000-0002-1845-9321"
                    className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Co-Authors */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Co-Authors (One name per line, optional)
                </label>
                <textarea
                  rows={2}
                  value={coAuthorsText}
                  onChange={(e) => setCoAuthorsText(e.target.value)}
                  placeholder="Prof. Marcus Chen&#10;Arjun Venkatesh"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              {/* Manuscript File Upload Mock */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Manuscript PDF File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <div className="text-xs font-semibold text-slate-800">
                    {paperFileName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ready for repository indexing ({paperFileSize})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Keywords Cataloguing */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-900 mb-1">
                  Keyword-Based Cataloguing System
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Keywords power the repository search engine and the automated subscriber notification engine. Papers are automatically pushed to scholars tracking matching keywords.
                </p>
              </div>

              {/* Selected Keywords list */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs font-medium text-slate-700 mb-2 flex items-center justify-between">
                  <span>Selected Keywords ({selectedKeywords.length})</span>
                  {selectedKeywords.length > 0 && (
                    <button
                      onClick={() => setSelectedKeywords([])}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {selectedKeywords.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">
                    No keywords selected yet. Click from the taxonomy below or add custom terms.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 text-xs bg-blue-700 text-white px-2.5 py-1 rounded-md"
                      >
                        #{kw}
                        <button
                          type="button"
                          onClick={() => handleToggleKeyword(kw)}
                          className="hover:text-red-200 cursor-pointer ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Keyword */}
              <form onSubmit={handleAddCustomKeyword} className="flex gap-2">
                <input
                  type="text"
                  value={customKeywordInput}
                  onChange={(e) => setCustomKeywordInput(e.target.value)}
                  placeholder="Add custom keyword (e.g. Neuromorphic Computing)"
                  className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-blue-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Add Keyword
                </button>
              </form>

              {/* Predefined Categories Taxonomy */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select from College Research Taxonomy
                </div>

                {KEYWORD_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-1">
                      {cat.name}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {cat.keywords.map((kw) => {
                        const isSelected = selectedKeywords.includes(kw);
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => handleToggleKeyword(kw)}
                            className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-700 text-white font-medium shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {kw}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* UN Sustainable Development Goals (SDGs) Cataloguing Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>UN Sustainable Development Goals (SDGs) Alignment</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedSdgs.length} selected
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Tag the UN goals advanced by your research (e.g. Health, Clean Energy, Climate, Innovation).
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {UN_SDG_GOALS.map((goal) => {
                    const isSdgSelected = selectedSdgs.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => handleToggleSdg(goal.id)}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSdgSelected
                            ? 'border-slate-800 bg-slate-50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0"
                          style={{ backgroundColor: goal.color }}
                        >
                          {goal.id}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-slate-900 block truncate">
                            {goal.code}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {goal.shortTitle}
                          </span>
                        </div>
                        {isSdgSelected && (
                          <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Journal Publication & Proof Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Publication Status Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Scientific Journal Publication Status
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Has this paper been published in a peer-reviewed scientific journal?
                    </p>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center gap-2 bg-white p-1 border border-slate-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setIsPublished(false)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                        !isPublished ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      No (Pre-print / Thesis)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublished(true)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                        isPublished ? 'bg-blue-700 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Yes (Published Journal)
                    </button>
                  </div>
                </div>

                {/* If Published: Fill Journal Details */}
                {isPublished && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Journal Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={journalName}
                          onChange={(e) => setJournalName(e.target.value)}
                          placeholder="e.g. IEEE Transactions on Medical Imaging"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Publisher Name
                        </label>
                        <input
                          type="text"
                          value={publisher}
                          onChange={(e) => setPublisher(e.target.value)}
                          placeholder="e.g. IEEE, Elsevier, Springer Nature"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Volume
                        </label>
                        <input
                          type="text"
                          value={volume}
                          onChange={(e) => setVolume(e.target.value)}
                          placeholder="44"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Issue
                        </label>
                        <input
                          type="text"
                          value={issue}
                          onChange={(e) => setIssue(e.target.value)}
                          placeholder="3"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Pages
                        </label>
                        <input
                          type="text"
                          value={pages}
                          onChange={(e) => setPages(e.target.value)}
                          placeholder="812-824"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Impact Factor
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={impactFactor}
                          onChange={(e) => setImpactFactor(e.target.value)}
                          placeholder="10.6"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Digital Object Identifier (DOI) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={doi}
                          onChange={(e) => setDoi(e.target.value)}
                          placeholder="10.1109/TMI.2025.3412901"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Publication Date
                        </label>
                        <input
                          type="date"
                          value={publishedDate}
                          onChange={(e) => setPublishedDate(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Indexing Checkboxes */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                        Journal Indexing
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['Scopus', 'Web of Science (SCI/SCIE)', 'IEEE Xplore', 'PubMed', 'UGC-CARE'] as JournalIndexing[]).map(idx => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleIndexing(idx)}
                            className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                              selectedIndexing.includes(idx)
                                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                                : 'border-slate-300 text-slate-600 hover:border-slate-400'
                            }`}
                          >
                            {selectedIndexing.includes(idx) ? '✓ ' : ''}{idx}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* REQUIRED DOCUMENTS OF PROOF SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mandatory Documents of Proof
                  </h3>
                  <span className="text-xs text-slate-500">
                    Institutional verification requirements
                  </span>
                </div>

                {/* Proof 1: Institutional Ethics / IRB */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">
                        1. Institutional Ethics / IRB Clearance Document
                      </span>
                    </div>
                    <label className="text-xs flex items-center gap-1.5 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={irbExempt}
                        onChange={(e) => setIrbExempt(e.target.checked)}
                        className="rounded"
                      />
                      <span>Exempt (e.g. theoretical/computational)</span>
                    </label>
                  </div>

                  {!irbExempt && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Approval Number</label>
                        <input
                          type="text"
                          value={irbApprovalNo}
                          onChange={(e) => setIrbApprovalNo(e.target.value)}
                          placeholder="IRB-BME-2025-014"
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Attached PDF File</label>
                        <input
                          type="text"
                          value={irbFileName}
                          onChange={(e) => setIrbFileName(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 font-mono bg-slate-50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Proof 2: Guide / HOD Endorsement */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">
                      2. Faculty Supervisor & Department Head Endorsement Letter
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Supervisor Signatory</label>
                      <input
                        type="text"
                        value={guideSignatoryName}
                        onChange={(e) => setGuideSignatoryName(e.target.value)}
                        placeholder="Prof. A. K. Sundaram"
                        className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Designation</label>
                      <input
                        type="text"
                        value={guideDesignation}
                        onChange={(e) => setGuideDesignation(e.target.value)}
                        placeholder="Head of Department"
                        className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Endorsement File</label>
                      <input
                        type="text"
                        value={guideFileName}
                        onChange={(e) => setGuideFileName(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 font-mono bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Proof 3: Plagiarism / Originality Report */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">
                      3. Plagiarism & Originality Verification Report
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Software Used</label>
                      <select
                        value={plagiarismSoftware}
                        onChange={(e) => setPlagiarismSoftware(e.target.value as any)}
                        className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                      >
                        <option value="Turnitin">Turnitin</option>
                        <option value="iThenticate">iThenticate</option>
                        <option value="Urkund / Ouriginal">Urkund / Ouriginal</option>
                        <option value="DrillBit">DrillBit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Similarity Score % (College limit &le; 10%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={similarityPercentage}
                        onChange={(e) => setSimilarityPercentage(Number(e.target.value))}
                        className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Certificate File</label>
                      <input
                        type="text"
                        value={plagiarismFileName}
                        onChange={(e) => setPlagiarismFileName(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 font-mono bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Proof 4: Journal Publication Proof (if isPublished) */}
                {isPublished && (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">
                        4. Journal Reprint / Editorial Acceptance Proof Document
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Proof Type</label>
                        <select
                          value={journalProofType}
                          onChange={(e) => setJournalProofType(e.target.value as any)}
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                        >
                          <option value="Published Final Reprint (Camera-Ready)">Published Final Reprint (Camera-Ready)</option>
                          <option value="Editorial Acceptance Letter">Editorial Acceptance Letter</option>
                          <option value="DOI CrossRef Verification">DOI CrossRef Verification</option>
                          <option value="Copyright Agreement">Copyright Agreement</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Attached Proof Document</label>
                        <input
                          type="text"
                          value={journalProofFileName}
                          onChange={(e) => setJournalProofFileName(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 font-mono bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep(currentStep - 1);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg cursor-pointer"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && validateStep1()) {
                    setCurrentStep(2);
                  } else if (currentStep === 2 && validateStep2()) {
                    setCurrentStep(3);
                  }
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer shadow-xs"
              >
                Continue to {currentStep === 1 ? 'Keywords' : 'Journal & Proofs'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) {
                    handleSubmitPaper();
                  }
                }}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? 'Submitting & Indexing...' : 'Publish to Repository'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
