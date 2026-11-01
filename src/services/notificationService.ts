import { ResearchPaper, NotificationSubscription, AutomatedNotification } from '../types/repository';
import { storageService } from './storageService';

export const notificationService = {
  /**
   * Evaluates a newly uploaded research paper against all active subscriptions
   * Returns newly generated notification items
   */
  evaluatePaper(paper: ResearchPaper): AutomatedNotification[] {
    const subscriptions = storageService.getSubscriptions().filter(s => s.active);
    const newNotifications: AutomatedNotification[] = [];

    const paperKeywordsLower = paper.keywords.map(k => k.toLowerCase().trim());
    const paperTitleLower = paper.title.toLowerCase();
    const paperAbstractLower = paper.abstract.toLowerCase();

    for (const sub of subscriptions) {
      let isMatch = false;
      const matchedKeywords: string[] = [];

      // 1. Check keyword match
      if (sub.keywords && sub.keywords.length > 0) {
        for (const kw of sub.keywords) {
          const kwLower = kw.toLowerCase().trim();
          const keywordMatched =
            paperKeywordsLower.some(pk => pk.includes(kwLower) || kwLower.includes(pk)) ||
            paperTitleLower.includes(kwLower) ||
            paperAbstractLower.includes(kwLower);

          if (keywordMatched) {
            isMatch = true;
            matchedKeywords.push(kw);
          }
        }
      }

      // 2. Check department match
      let departmentMatched = false;
      if (sub.departments && sub.departments.length > 0) {
        if (sub.departments.includes(paper.department)) {
          departmentMatched = true;
          if (sub.keywords.length === 0) {
            isMatch = true;
          }
        } else if (sub.keywords.length > 0) {
          // If department specified and paper doesn't match department, disqualify
          isMatch = false;
        }
      }

      // 3. Check published journal requirement
      if (sub.onlyPublishedJournals && !paper.isPublished) {
        isMatch = false;
      } else if (sub.onlyPublishedJournals && paper.isPublished && sub.keywords.length === 0 && sub.departments.length === 0) {
        isMatch = true;
      }

      if (isMatch) {
        const leadAuthor = paper.authors[0]?.name || 'A college researcher';
        let matchReason = '';
        if (matchedKeywords.length > 0) {
          matchReason = `Matched keyword${matchedKeywords.length > 1 ? 's' : ''}: ${matchedKeywords.join(', ')}`;
        } else if (departmentMatched) {
          matchReason = `From tracked department: ${paper.department}`;
        } else if (sub.onlyPublishedJournals) {
          matchReason = `Peer-reviewed publication in ${paper.publicationDetails?.journalName || 'journal'}`;
        }

        const notif: AutomatedNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: `New Research: "${paper.title.slice(0, 52)}..."`,
          message: `${leadAuthor} (${paper.department}) uploaded a new paper. ${matchReason}.`,
          paperId: paper.id,
          paperTitle: paper.title,
          matchedKeywords,
          department: paper.department,
          timestamp: new Date().toISOString(),
          read: false,
          isJournalPublished: paper.isPublished,
          journalName: paper.publicationDetails?.journalName
        };

        newNotifications.push(notif);
        storageService.addNotification(notif);
      }
    }

    if (newNotifications.length > 0) {
      window.dispatchEvent(new CustomEvent('college-repo-notification-created', {
        detail: { count: newNotifications.length, notifications: newNotifications }
      }));
    }

    return newNotifications;
  },

  /**
   * Simulates a peer research upload to demonstrate automated alert triggers
   */
  simulatePeerUpload(): { paper: ResearchPaper; notifications: AutomatedNotification[] } {
    const peerTopics = [
      {
        title: 'Reinforcement Learning from Physical Feedback for Dexterous Soft Robotic Grippers',
        abstract: 'Soft robotic manipulators struggle with dynamic payload grasping under uncertainty. We propose an end-to-end actor-critic reinforcement learning pipeline with sensor fusion from embedded dielectric elastomer arrays. Benchmarks show 96.4% success on fragile biological specimens.',
        department: 'Mechanical & Aerospace Engineering',
        category: 'Robotics, IoT & Embedded Systems',
        keywords: ['Reinforcement Learning', 'Surgical Robotics', 'Sensor Fusion', 'Autonomous Mobile Robots'],
        isPublished: true,
        journalName: 'Soft Robotics (Mary Ann Liebert)',
        doi: '10.1089/soro.2025.0089',
        leadAuthor: 'Dr. Arthur Pendelton'
      },
      {
        title: 'Zero-Shot Medical Image Segmentation via Multimodal Large Language Models',
        abstract: 'Medical image segmentation typically requires extensive expert pixel-level annotations. We introduce MedPrompt-Seg, a multimodal foundational architecture combining vision transformers with clinical text embeddings to segment unseen pathologies on MRI and CT scans without fine-tuning.',
        department: 'Computer Science & Engineering',
        category: 'Artificial Intelligence & Machine Learning',
        keywords: ['Deep Learning', 'Medical Image Segmentation', 'Large Language Models', 'Computer Vision'],
        isPublished: true,
        journalName: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
        doi: '10.1109/TPAMI.2025.3529910',
        leadAuthor: 'Prof. Li Wei'
      },
      {
        title: 'Scalable Synthesis of 2D MXene Membranes for High-Flux Brackish Water Desalination',
        abstract: 'Two-dimensional transition metal carbides (MXenes) offer unique sub-nanometer laminar channels for ultrafast water permeation. Here we report a vacuum-assisted assembly technique yielding uniform Ti3C2Tx membranes with 99.1% monovalent ion rejection under 5 bar pressure.',
        department: 'Materials Science & Nanotechnology',
        category: 'Materials Science & Renewable Energy',
        keywords: ['2D MXenes', 'Membrane Desalination', 'Wastewater Treatment', 'Perovskite Solar Cells'],
        isPublished: false,
        leadAuthor: 'Kiran Mazumdar'
      }
    ];

    const pick = peerTopics[Math.floor(Math.random() * peerTopics.length)];
    const randomId = `CRP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newPaper: ResearchPaper = {
      id: randomId,
      title: pick.title,
      abstract: pick.abstract,
      department: pick.department,
      subjectCategory: pick.category,
      academicYear: '2024-2025',
      submissionDate: new Date().toISOString().split('T')[0],
      authors: [
        {
          name: pick.leadAuthor,
          role: 'Faculty',
          department: pick.department,
          email: `${pick.leadAuthor.toLowerCase().replace(/[^a-z]/g, '.')}@college.edu`,
          isCorresponding: true
        },
        {
          name: 'Research Collaborators Group',
          role: 'PhD Scholar',
          department: pick.department,
          email: 'collab@college.edu'
        }
      ],
      keywords: pick.keywords,
      isPublished: pick.isPublished,
      publicationDetails: pick.isPublished ? {
        journalName: pick.journalName || 'Nature Communications',
        publisher: 'Springer Nature',
        volume: '16',
        issue: '1',
        pages: '142-156',
        publishedDate: new Date().toISOString().split('T')[0],
        doi: pick.doi || `10.1038/s41467-025-${Math.floor(10000 + Math.random() * 90000)}`,
        issn: '2041-1723',
        indexing: ['Scopus', 'Web of Science (SCI/SCIE)'],
        impactFactor: 16.6,
        openAccessType: 'Gold Open Access'
      } : undefined,
      proofDocuments: {
        irbClearance: {
          uploaded: true,
          fileName: `IRB_Approval_${randomId}.pdf`,
          fileSize: '380 KB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'irb_clearance',
          title: 'Institutional Ethics Clearance Certificate',
          approvalNumber: `IRB-${randomId}`,
          verificationStatus: 'Verified'
        },
        guideEndorsement: {
          uploaded: true,
          fileName: `Dean_Signoff_${randomId}.pdf`,
          fileSize: '290 KB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'guide_endorsement',
          title: 'Faculty Supervisor & Academic Dean Endorsement',
          signatoryName: `${pick.leadAuthor}, Lead Investigator`,
          signatoryDesignation: 'Senior Faculty Member',
          verificationStatus: 'Verified'
        },
        plagiarismReport: {
          uploaded: true,
          fileName: `Turnitin_Similarity_${randomId}.pdf`,
          fileSize: '1.1 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'plagiarism_report',
          title: 'Turnitin Originality Report',
          similarityPercentage: Math.floor(4 + Math.random() * 6),
          softwareUsed: 'Turnitin',
          verificationStatus: 'Compliant (<10%)'
        },
        journalProof: pick.isPublished ? {
          uploaded: true,
          fileName: `Journal_Acceptance_Proof_${randomId}.pdf`,
          fileSize: '2.2 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: 'journal_proof',
          title: 'Official Journal Editorial Acceptance Proof',
          proofType: 'Editorial Acceptance Letter',
          acceptanceDate: new Date().toISOString().split('T')[0],
          verificationStatus: 'Verified'
        } : undefined
      },
      paperFileName: `${pick.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Final.pdf`,
      paperFileSize: '4.2 MB',
      pagesCount: 12,
      reviewStatus: 'Verified',
      reviewedBy: 'College Research Cell Board',
      citationsCount: 0,
      viewsCount: 1,
      downloadsCount: 0
    };

    // Save paper
    storageService.savePaper(newPaper);

    // Evaluate notifications
    const notifications = this.evaluatePaper(newPaper);

    return { paper: newPaper, notifications };
  }
};
