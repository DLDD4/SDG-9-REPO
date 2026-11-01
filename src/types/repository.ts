export type AcademicRole = 'Faculty' | 'PhD Scholar' | 'Master Student' | 'Undergraduate' | 'Postdoctoral Researcher';

export interface Author {
  name: string;
  role: AcademicRole;
  department: string;
  email: string;
  isCorresponding?: boolean;
  orcid?: string;
}

export type JournalIndexing = 'Scopus' | 'Web of Science (SCI/SCIE)' | 'IEEE Xplore' | 'PubMed' | 'ACM Digital Library' | 'UGC-CARE';

export type OpenAccessType = 'Gold Open Access' | 'Green Open Access' | 'Hybrid' | 'Subscription / Closed';

export interface PublicationDetails {
  journalName: string;
  publisher: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publishedDate: string;
  doi: string;
  issn?: string;
  indexing: JournalIndexing[];
  impactFactor?: number;
  openAccessType: OpenAccessType;
}

export interface ProofDocument {
  uploaded: boolean;
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
  documentType: 'irb_clearance' | 'guide_endorsement' | 'plagiarism_report' | 'journal_proof' | 'dataset_release';
  title: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Exempt';
  notes?: string;
}

export interface PlagiarismReportProof extends Omit<ProofDocument, 'verificationStatus'> {
  verificationStatus: 'Compliant (<10%)' | 'Acceptable (10-15%)' | 'Requires Review (>15%)' | 'Verified' | 'Pending Verification';
  similarityPercentage: number;
  softwareUsed: 'Turnitin' | 'Urkund / Ouriginal' | 'iThenticate' | 'DrillBit';
}

export interface IrbProof extends ProofDocument {
  approvalNumber?: string;
  committeeName?: string;
}

export interface GuideEndorsementProof extends ProofDocument {
  signatoryName: string;
  signatoryDesignation: string;
}

export interface JournalProof extends ProofDocument {
  proofType: 'Published Final Reprint (Camera-Ready)' | 'Editorial Acceptance Letter' | 'DOI CrossRef Verification' | 'Copyright Agreement';
  acceptanceDate?: string;
}

export interface ProofDocumentsCollection {
  irbClearance: IrbProof;
  guideEndorsement: GuideEndorsementProof;
  plagiarismReport: PlagiarismReportProof;
  journalProof?: JournalProof;
  datasetRelease?: ProofDocument;
}

export type RepositoryReviewStatus = 'Verified' | 'Pending Review' | 'Revision Requested';

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  department: string;
  subjectCategory: string;
  academicYear: string;
  submissionDate: string;
  authors: Author[];
  keywords: string[];
  sdgs?: number[]; // UN Sustainable Development Goals IDs (1-17)
  isPublished: boolean;
  publicationDetails?: PublicationDetails;
  proofDocuments: ProofDocumentsCollection;
  paperFileName: string;
  paperFileSize: string;
  pagesCount: number;
  reviewStatus: RepositoryReviewStatus;
  reviewedBy?: string;
  citationsCount: number;
  viewsCount: number;
  downloadsCount: number;
}

export interface MatchedPaperPriorArt {
  paperId: string;
  paperTitle: string;
  similarityScore: number;
  leadAuthor: string;
  department: string;
  journalName?: string;
  matchedKeywords: string[];
  matchedPhrases: string[];
  suggestedCitation: string;
}

export interface SimilarityReviewResult {
  reviewId: string;
  inputTitle: string;
  inputAbstract: string;
  inputDepartment: string;
  analyzedDate: string;
  overallSimilarityScore: number;
  verdict: 'Original (<10%)' | 'Acceptable (10-18%)' | 'Moderate Overlap (18-28%)' | 'High Prior Art Overlap (>28%)';
  topMatches: MatchedPaperPriorArt[];
  novelConceptsIdentified: string[];
  overlappingConceptsIdentified: string[];
  citationGuidance: string[];
  wordCount: number;
}

export type ViewMode = 'grid' | 'table' | 'keywords' | 'sdg' | 'reviewer' | 'analytics' | 'assistant';

export type AssistantPersonaId = 'archie' | 'beaker' | 'reviewer2' | 'zen';

export interface AssistantCitation {
  paperId: string;
  title: string;
  department: string;
  relevance: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: AssistantPersonaId;
  citations?: AssistantCitation[];
  suggestedPrompts?: string[];
  isStreaming?: boolean;
}

export interface NotificationSubscription {
  id: string;
  name: string;
  keywords: string[];
  departments: string[];
  onlyPublishedJournals: boolean;
  createdDate: string;
  active: boolean;
}

export interface AutomatedNotification {
  id: string;
  title: string;
  message: string;
  paperId: string;
  paperTitle: string;
  matchedKeywords: string[];
  department: string;
  timestamp: string;
  read: boolean;
  isJournalPublished: boolean;
  journalName?: string;
}
