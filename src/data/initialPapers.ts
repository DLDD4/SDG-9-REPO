import { ResearchPaper } from '../types/repository';

export const INITIAL_RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'CRP-2025-001',
    title: 'Self-Supervised Neural Radiance Fields for Minimally Invasive Endoscopic Depth Estimation',
    abstract: 'Depth estimation in endoscopic surgery remains challenged by specular reflections, non-Lambertian tissue deformations, and smoke artifacts. We propose a self-supervised Neural Radiance Field (NeRF) formulation tailored for dynamic laparo-endoscopic procedures. By integrating optical flow priors with reflectance-aware loss, our model achieves sub-millimeter reconstruction fidelity on benchmark tissue phantoms without requiring external structured light depth sensors.',
    department: 'Biomedical Engineering',
    subjectCategory: 'Biomedical & Healthcare Engineering',
    academicYear: '2024-2025',
    submissionDate: '2025-02-14',
    authors: [
      {
        name: 'Dr. Elena Rostova',
        role: 'Faculty',
        department: 'Biomedical Engineering',
        email: 'e.rostova@college.edu',
        isCorresponding: true,
        orcid: '0000-0002-1845-9321'
      },
      {
        name: 'Arjun Venkatesh',
        role: 'PhD Scholar',
        department: 'Computer Science & Engineering',
        email: 'a.venkatesh@college.edu'
      },
      {
        name: 'Prof. Marcus Chen',
        role: 'Faculty',
        department: 'Biomedical Engineering',
        email: 'm.chen@college.edu'
      }
    ],
    keywords: ['Neural Radiance Fields', 'Endoscopic Vision', 'Computer Vision', 'Deep Learning', 'Surgical Robotics'],
    sdgs: [3, 9],
    isPublished: true,
    publicationDetails: {
      journalName: 'IEEE Transactions on Medical Imaging',
      publisher: 'IEEE',
      volume: '44',
      issue: '3',
      pages: '812-824',
      publishedDate: '2025-03-10',
      doi: '10.1109/TMI.2025.3412901',
      issn: '0278-0062',
      indexing: ['Scopus', 'Web of Science (SCI/SCIE)', 'IEEE Xplore', 'PubMed'],
      impactFactor: 10.6,
      openAccessType: 'Gold Open Access'
    },
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'IRB_Approval_Letter_2024_089B.pdf',
        fileSize: '420 KB',
        uploadDate: '2025-01-10',
        documentType: 'irb_clearance',
        title: 'Institutional Ethics Board Clearance - Tissue Phantom Protocol',
        approvalNumber: 'IRB-BME-2024-089-A',
        verificationStatus: 'Verified'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Guide_Endorsement_Dr_Rostova.pdf',
        fileSize: '310 KB',
        uploadDate: '2025-01-12',
        documentType: 'guide_endorsement',
        title: 'Department Head & Faculty Supervisor Endorsement Sign-off',
        signatoryName: 'Prof. Marcus Chen, Head of Department',
        signatoryDesignation: 'Chair, Biomedical Engineering Research Council',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'Turnitin_Similarity_Report_NeRF_Endo.pdf',
        fileSize: '1.2 MB',
        uploadDate: '2025-01-15',
        documentType: 'plagiarism_report',
        title: 'Turnitin Authenticity & Originality Verification Report',
        similarityPercentage: 6,
        softwareUsed: 'Turnitin',
        verificationStatus: 'Compliant (<10%)'
      },
      journalProof: {
        uploaded: true,
        fileName: 'IEEE_TMI_CameraReady_Reprint_Proof.pdf',
        fileSize: '2.8 MB',
        uploadDate: '2025-03-11',
        documentType: 'journal_proof',
        title: 'Published Final Reprint & Camera-Ready Editorial Proof',
        proofType: 'Published Final Reprint (Camera-Ready)',
        acceptanceDate: '2025-01-28',
        verificationStatus: 'Verified'
      },
      datasetRelease: {
        uploaded: true,
        fileName: 'Phantom_Dataset_Zenodo_Release.pdf',
        fileSize: '180 KB',
        uploadDate: '2025-02-01',
        documentType: 'dataset_release',
        title: 'Zenodo Open Data Repository Accession Agreement',
        verificationStatus: 'Verified'
      }
    },
    paperFileName: 'NeRF_Endoscopic_Depth_Estimation_CollegeRepo.pdf',
    paperFileSize: '4.6 MB',
    pagesCount: 13,
    reviewStatus: 'Verified',
    reviewedBy: 'College Research Cell Board (Dr. K. Patel)',
    citationsCount: 19,
    viewsCount: 1420,
    downloadsCount: 580
  },
  {
    id: 'CRP-2025-002',
    title: 'Defect Passivation via 2D MXene Heterostructures in Formamidinium Perovskite Solar Cells',
    abstract: 'Formamidinium lead iodide (FAPbI3) perovskite solar cells suffer from interfacial recombination and deep trap states at the electron transport layer interface. Here, we demonstrate in-situ synthesized Ti3C2Tx MXene nanosheets functionalized with fluorinated silane molecules as an ultrathin interfacial buffer layer. The device exhibits power conversion efficiency of 24.8% alongside 1200 hours of continuous operational stability under AM1.5G 1-sun illumination.',
    department: 'Materials Science & Nanotechnology',
    subjectCategory: 'Materials Science & Renewable Energy',
    academicYear: '2024-2025',
    submissionDate: '2025-01-20',
    authors: [
      {
        name: 'Dr. Siddharth Nair',
        role: 'Faculty',
        department: 'Materials Science & Nanotechnology',
        email: 's.nair@college.edu',
        isCorresponding: true,
        orcid: '0000-0001-9234-8840'
      },
      {
        name: 'Li Wei',
        role: 'Postdoctoral Researcher',
        department: 'Materials Science & Nanotechnology',
        email: 'w.li@college.edu'
      },
      {
        name: 'Pooja Sundaram',
        role: 'Master Student',
        department: 'Materials Science & Nanotechnology',
        email: 'p.sundaram@college.edu'
      }
    ],
    keywords: ['Perovskite Solar Cells', '2D MXenes', 'Photocatalysis', 'Carbon Nanotubes', 'Green Hydrogen'],
    sdgs: [7, 9, 13],
    isPublished: true,
    publicationDetails: {
      journalName: 'ACS Applied Materials & Interfaces',
      publisher: 'ACS Publications',
      volume: '17',
      issue: '8',
      pages: '10412-10425',
      publishedDate: '2025-02-18',
      doi: '10.1021/acsami.4c21980',
      issn: '1944-8244',
      indexing: ['Scopus', 'Web of Science (SCI/SCIE)'],
      impactFactor: 9.5,
      openAccessType: 'Gold Open Access'
    },
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Lab_Chemical_Safety_Compliance_Certificate.pdf',
        fileSize: '350 KB',
        uploadDate: '2024-12-10',
        documentType: 'irb_clearance',
        title: 'Institutional Chemical Safety and Nanomaterials Handling Clearance',
        approvalNumber: 'EHS-MAT-2024-114',
        verificationStatus: 'Exempt'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Endorsement_Dean_Engineering_Nair.pdf',
        fileSize: '290 KB',
        uploadDate: '2025-01-08',
        documentType: 'guide_endorsement',
        title: 'Faculty Supervisor & Dean of Engineering Endorsement',
        signatoryName: 'Prof. David Vance, Dean of Engineering',
        signatoryDesignation: 'Dean, College Faculty of Advanced Engineering',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'iThenticate_Perovskite_MXene_Report.pdf',
        fileSize: '980 KB',
        uploadDate: '2025-01-14',
        documentType: 'plagiarism_report',
        title: 'iThenticate Originality Verification Certificate',
        similarityPercentage: 4,
        softwareUsed: 'iThenticate',
        verificationStatus: 'Compliant (<10%)'
      },
      journalProof: {
        uploaded: true,
        fileName: 'ACS_Acceptance_Letter_and_DOI_Receipt.pdf',
        fileSize: '1.4 MB',
        uploadDate: '2025-02-19',
        documentType: 'journal_proof',
        title: 'Official ACS Editorial Board Acceptance Letter & DOI Receipt',
        proofType: 'Editorial Acceptance Letter',
        acceptanceDate: '2025-02-05',
        verificationStatus: 'Verified'
      }
    },
    paperFileName: 'MXene_Perovskite_Defect_Passivation.pdf',
    paperFileSize: '5.2 MB',
    pagesCount: 14,
    reviewStatus: 'Verified',
    reviewedBy: 'College Research Cell Board (Prof. R. Banerjee)',
    citationsCount: 34,
    viewsCount: 2100,
    downloadsCount: 890
  },
  {
    id: 'CRP-2025-003',
    title: 'Differential-Privacy Preserving Graph Neural Networks for Cross-Silo Electronic Health Records',
    abstract: 'Training machine learning models on multi-hospital clinical graphs without exposing sensitive patient phenotypic links requires strong algorithmic privacy guarantees. We present PrivHealth-GNN, an end-to-end framework enforcing (ε, δ)-differential privacy during message passing. Through randomized edge perturbations and gradient perturbation clipped per hospital silo, we achieve AUROC of 0.89 on early sepsis onset prediction while maintaining ε ≤ 1.5.',
    department: 'Computer Science & Engineering',
    subjectCategory: 'Artificial Intelligence & Machine Learning',
    academicYear: '2024-2025',
    submissionDate: '2025-03-01',
    authors: [
      {
        name: 'Kavya Ramanathan',
        role: 'PhD Scholar',
        department: 'Computer Science & Engineering',
        email: 'k.ramanathan@college.edu',
        isCorresponding: true
      },
      {
        name: 'Dr. Tariq Al-Mansoor',
        role: 'Faculty',
        department: 'Computer Science & Engineering',
        email: 't.mansoor@college.edu'
      }
    ],
    keywords: ['Graph Neural Networks', 'Federated Learning', 'Deep Learning', 'Explainable AI', 'Medical Image Segmentation'],
    sdgs: [3, 9, 16],
    isPublished: false,
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Ethics_Clinical_Data_DeIdentification_IRB.pdf',
        fileSize: '510 KB',
        uploadDate: '2025-02-10',
        documentType: 'irb_clearance',
        title: 'Institutional Review Board Clearance for Synthetic & De-Identified MIMIC Data',
        approvalNumber: 'IRB-CS-2025-012',
        verificationStatus: 'Verified'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Guide_Endorsement_Dr_Mansoor.pdf',
        fileSize: '280 KB',
        uploadDate: '2025-02-28',
        documentType: 'guide_endorsement',
        title: 'Doctoral Advisory Committee Sign-off',
        signatoryName: 'Dr. Tariq Al-Mansoor, Associate Professor',
        signatoryDesignation: 'Chair, AI Systems Research Group',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'Turnitin_PrivHealth_GNN_Report.pdf',
        fileSize: '840 KB',
        uploadDate: '2025-02-27',
        documentType: 'plagiarism_report',
        title: 'Turnitin Originality Report',
        similarityPercentage: 8,
        softwareUsed: 'Turnitin',
        verificationStatus: 'Compliant (<10%)'
      }
    },
    paperFileName: 'PrivHealth_GNN_CrossSilo_CollegeRepo.pdf',
    paperFileSize: '3.1 MB',
    pagesCount: 11,
    reviewStatus: 'Pending Review',
    citationsCount: 0,
    viewsCount: 420,
    downloadsCount: 115
  },
  {
    id: 'CRP-2025-004',
    title: 'Centrifugal Microfluidic Disc with Integrated Graphene Biosensors for Rapid Dengue Serotyping',
    abstract: 'Point-of-care discrimination of Dengue virus serotypes (DENV 1-4) is vital for early triage of severe hemorrhagic fever. We engineered a centrifugal microfluidic "lab-on-a-disc" cartridge comprising four electrochemically distinct graphene oxide functionalized micro-electrodes. The complete assay operates in 22 minutes from 50 µL of fingerstick whole blood with a limit of detection below 10 pM NS1 antigen.',
    department: 'Biomedical Engineering',
    subjectCategory: 'Biomedical & Healthcare Engineering',
    academicYear: '2024-2025',
    submissionDate: '2025-02-04',
    authors: [
      {
        name: 'Prof. Ananya Sen',
        role: 'Faculty',
        department: 'Biomedical Engineering',
        email: 'a.sen@college.edu',
        isCorresponding: true,
        orcid: '0000-0003-4412-1092'
      },
      {
        name: 'Gareth Evans',
        role: 'PhD Scholar',
        department: 'Biomedical Engineering',
        email: 'g.evans@college.edu'
      },
      {
        name: 'Maya Krishnan',
        role: 'Undergraduate',
        department: 'Electrical & Computer Engineering',
        email: 'm.krishnan@college.edu'
      }
    ],
    keywords: ['Microfluidics', 'Biosensors', 'Point-of-Care Diagnostics', '2D MXenes', 'CRISPR-Cas9'],
    sdgs: [3, 9, 10],
    isPublished: true,
    publicationDetails: {
      journalName: 'Biosensors and Bioelectronics',
      publisher: 'Elsevier',
      volume: '248',
      issue: '1',
      pages: '116032',
      publishedDate: '2025-03-01',
      doi: '10.1016/j.bios.2025.116032',
      issn: '0956-5663',
      indexing: ['Scopus', 'Web of Science (SCI/SCIE)', 'PubMed'],
      impactFactor: 12.6,
      openAccessType: 'Gold Open Access'
    },
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Clinical_Serum_Ethics_Clearance_2024.pdf',
        fileSize: '490 KB',
        uploadDate: '2024-11-20',
        documentType: 'irb_clearance',
        title: 'Institutional Biosafety and Clinical Serum Ethics Clearance',
        approvalNumber: 'IBC-CLIN-2024-055',
        verificationStatus: 'Verified'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Dean_Endorsement_Sen_Lab.pdf',
        fileSize: '320 KB',
        uploadDate: '2025-01-18',
        documentType: 'guide_endorsement',
        title: 'Biomedical Engineering Lab Review Sign-off',
        signatoryName: 'Prof. Ananya Sen, Principal Investigator',
        signatoryDesignation: 'Director, Bio-MEMS Instrumentation Facility',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'Turnitin_Dengue_Biosensors.pdf',
        fileSize: '1.1 MB',
        uploadDate: '2025-01-20',
        documentType: 'plagiarism_report',
        title: 'Turnitin Originality Report',
        similarityPercentage: 5,
        softwareUsed: 'Turnitin',
        verificationStatus: 'Compliant (<10%)'
      },
      journalProof: {
        uploaded: true,
        fileName: 'Elsevier_Biosensors_Published_Reprint.pdf',
        fileSize: '3.4 MB',
        uploadDate: '2025-03-02',
        documentType: 'journal_proof',
        title: 'Elsevier Final Publication Reprint & Author Rights Confirmation',
        proofType: 'Published Final Reprint (Camera-Ready)',
        acceptanceDate: '2025-01-15',
        verificationStatus: 'Verified'
      }
    },
    paperFileName: 'Centrifugal_Microfluidic_Dengue_Biosensors.pdf',
    paperFileSize: '6.4 MB',
    pagesCount: 15,
    reviewStatus: 'Verified',
    reviewedBy: 'College Research Cell Board (Dr. K. Patel)',
    citationsCount: 27,
    viewsCount: 1840,
    downloadsCount: 710
  },
  {
    id: 'CRP-2025-005',
    title: 'Distributed Cooperative SLAM for Swarm Micro-Aerial Vehicles in GPS-Denied Confined Environments',
    abstract: 'Exploration of collapsed sub-surface structures requires heterogeneous aerial swarms to map 3D subterranean geometry without drift. We introduce a distributed keyframe-based pose graph optimization protocol over ad-hoc peer-to-peer radio meshes. An adaptive loop closure consensus algorithm rejects inconsistent visual loops during subterranean smoke occlusions.',
    department: 'Mechanical & Aerospace Engineering',
    subjectCategory: 'Robotics, IoT & Embedded Systems',
    academicYear: '2024-2025',
    submissionDate: '2025-02-22',
    authors: [
      {
        name: 'Dr. Hiroshi Tanaka',
        role: 'Faculty',
        department: 'Mechanical & Aerospace Engineering',
        email: 'h.tanaka@college.edu',
        isCorresponding: true
      },
      {
        name: 'Zachary Cole',
        role: 'Master Student',
        department: 'Mechanical & Aerospace Engineering',
        email: 'z.cole@college.edu'
      },
      {
        name: 'Aisha Nur',
        role: 'PhD Scholar',
        department: 'Electrical & Computer Engineering',
        email: 'a.nur@college.edu'
      }
    ],
    keywords: ['Swarm Robotics', 'SLAM Algorithms', 'Autonomous Mobile Robots', 'Sensor Fusion', 'Edge Computing'],
    sdgs: [9, 11],
    isPublished: true,
    publicationDetails: {
      journalName: 'IEEE Transactions on Robotics',
      publisher: 'IEEE',
      volume: '41',
      issue: '2',
      pages: '450-466',
      publishedDate: '2025-03-25',
      doi: '10.1109/TRO.2025.3421109',
      issn: '1552-3098',
      indexing: ['Scopus', 'Web of Science (SCI/SCIE)', 'IEEE Xplore'],
      impactFactor: 7.8,
      openAccessType: 'Green Open Access'
    },
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Drone_Outdoor_Flight_Safety_Permit.pdf',
        fileSize: '390 KB',
        uploadDate: '2024-10-15',
        documentType: 'irb_clearance',
        title: 'Institutional Aviation & Drone Safety Board Permission',
        approvalNumber: 'AV-AERO-2024-041',
        verificationStatus: 'Verified'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'MAE_Department_Chair_Signoff.pdf',
        fileSize: '240 KB',
        uploadDate: '2025-02-15',
        documentType: 'guide_endorsement',
        title: 'Mechanical & Aerospace Dept Head Endorsement',
        signatoryName: 'Prof. Arthur Pendelton',
        signatoryDesignation: 'Chair, Robotics & Autonomous Systems Lab',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'Turnitin_Swarm_SLAM.pdf',
        fileSize: '1.4 MB',
        uploadDate: '2025-02-18',
        documentType: 'plagiarism_report',
        title: 'Turnitin Originality Report',
        similarityPercentage: 7,
        softwareUsed: 'Turnitin',
        verificationStatus: 'Compliant (<10%)'
      },
      journalProof: {
        uploaded: true,
        fileName: 'IEEE_TRO_Acceptance_DOI.pdf',
        fileSize: '1.9 MB',
        uploadDate: '2025-03-26',
        documentType: 'journal_proof',
        title: 'IEEE TRO Editor-in-Chief Formal Acceptance & Proof Certificate',
        proofType: 'Editorial Acceptance Letter',
        acceptanceDate: '2025-02-20',
        verificationStatus: 'Verified'
      }
    },
    paperFileName: 'Cooperative_SLAM_Swarm_MAVs_CollegeRepo.pdf',
    paperFileSize: '7.8 MB',
    pagesCount: 17,
    reviewStatus: 'Verified',
    reviewedBy: 'College Research Cell Board (Dr. S. Nair)',
    citationsCount: 14,
    viewsCount: 1650,
    downloadsCount: 620
  },
  {
    id: 'CRP-2025-006',
    title: 'Catalytic Degradation of Microplastics in Brackish Effluents via Solar-Driven Fenton-like Bioreactors',
    abstract: 'Accumulation of secondary microplastics (< 100 µm) in coastal estuaries threatens benthic ecosystems. This work synthesizes magnetic Fe3O4-biochar composites derived from agricultural wheat straw residues to catalyze persulfate activation under natural solar radiation. At pH 6.8, our continuous fluidized bed photoreactor achieved 94.2% mass reduction of polyethylene and polystyrene microbeads within 4 hours retention.',
    department: 'Environmental & Chemical Engineering',
    subjectCategory: 'Environmental Engineering & Sustainability',
    academicYear: '2024-2025',
    submissionDate: '2025-01-29',
    authors: [
      {
        name: 'Dr. Frank O\'Connor',
        role: 'Faculty',
        department: 'Environmental & Chemical Engineering',
        email: 'f.oconnor@college.edu',
        isCorresponding: true
      },
      {
        name: 'Priyanka Das',
        role: 'PhD Scholar',
        department: 'Environmental & Chemical Engineering',
        email: 'p.das@college.edu'
      }
    ],
    keywords: ['Microplastic Degradation', 'Photocatalysis', 'Biochar Soil Remediation', 'Wastewater Treatment', 'Lifecycle Assessment'],
    sdgs: [6, 12, 14, 15],
    isPublished: true,
    publicationDetails: {
      journalName: 'Water Research',
      publisher: 'Elsevier',
      volume: '269',
      issue: '1',
      pages: '122780',
      publishedDate: '2025-02-15',
      doi: '10.1016/j.watres.2025.122780',
      issn: '0043-1354',
      indexing: ['Scopus', 'Web of Science (SCI/SCIE)'],
      impactFactor: 11.4,
      openAccessType: 'Gold Open Access'
    },
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Env_Safety_Clearance_Water_Lab.pdf',
        fileSize: '320 KB',
        uploadDate: '2024-11-05',
        documentType: 'irb_clearance',
        title: 'Environmental Effluent Sampling and Discharge Authorization',
        approvalNumber: 'ENV-WATER-2024-078',
        verificationStatus: 'Verified'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Supervisor_Endorsement_OConnor.pdf',
        fileSize: '260 KB',
        uploadDate: '2025-01-25',
        documentType: 'guide_endorsement',
        title: 'Environmental Engineering Faculty Endorsement',
        signatoryName: 'Dr. Frank O\'Connor, Associate Professor',
        signatoryDesignation: 'Head, Eco-Remediation Research Group',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'Turnitin_Microplastics_WaterRes.pdf',
        fileSize: '1.3 MB',
        uploadDate: '2025-01-26',
        documentType: 'plagiarism_report',
        title: 'Turnitin Originality Report',
        similarityPercentage: 9,
        softwareUsed: 'Turnitin',
        verificationStatus: 'Compliant (<10%)'
      },
      journalProof: {
        uploaded: true,
        fileName: 'Water_Research_Reprint_DOI.pdf',
        fileSize: '2.4 MB',
        uploadDate: '2025-02-16',
        documentType: 'journal_proof',
        title: 'Elsevier Water Research Final Author Proof & DOI Certificate',
        proofType: 'Published Final Reprint (Camera-Ready)',
        acceptanceDate: '2025-01-18',
        verificationStatus: 'Verified'
      }
    },
    paperFileName: 'Solar_Fenton_Microplastic_Degradation_CollegeRepo.pdf',
    paperFileSize: '4.8 MB',
    pagesCount: 12,
    reviewStatus: 'Verified',
    reviewedBy: 'College Research Cell Board (Dr. K. Patel)',
    citationsCount: 22,
    viewsCount: 1390,
    downloadsCount: 510
  },
  {
    id: 'CRP-2025-007',
    title: 'Fault-Tolerant Surface Code Decoding with Neural Quantum Error Mitigation on Superconducting Qubit Processors',
    abstract: 'Scalable quantum computation hinges on real-time error syndrome extraction below the fault-tolerance threshold. We construct a transformer-based spatial syndrome decoder that maps syndrome bitstrings directly to minimum-weight recovery Pauli operators in less than 280 nanoseconds on field-programmable gate arrays (FPGAs). Experimental tests on a 17-qubit superconducting testbed confirm a 31% logical error suppression rate.',
    department: 'Physics & Applied Quantum Sciences',
    subjectCategory: 'Quantum Computing & Photonics',
    academicYear: '2024-2025',
    submissionDate: '2025-02-28',
    authors: [
      {
        name: 'Dr. Alexander Vance',
        role: 'Faculty',
        department: 'Physics & Applied Quantum Sciences',
        email: 'a.vance@college.edu',
        isCorresponding: true
      },
      {
        name: 'Nadia Soltani',
        role: 'PhD Scholar',
        department: 'Physics & Applied Quantum Sciences',
        email: 'n.soltani@college.edu'
      },
      {
        name: 'Suresh Pillai',
        role: 'Master Student',
        department: 'Electrical & Computer Engineering',
        email: 's.pillai@college.edu'
      }
    ],
    keywords: ['Superconducting Qubits', 'Quantum Error Correction', 'Transformer Architecture', 'Deep Learning', 'Quantum Algorithms'],
    sdgs: [9],
    isPublished: true,
    publicationDetails: {
      journalName: 'Physical Review Letters',
      publisher: 'American Physical Society (APS)',
      volume: '134',
      issue: '10',
      pages: '100601',
      publishedDate: '2025-03-08',
      doi: '10.1103/PhysRevLett.134.100601',
      issn: '0031-9007',
      indexing: ['Scopus', 'Web of Science (SCI/SCIE)'],
      impactFactor: 8.8,
      openAccessType: 'Gold Open Access'
    },
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Quantum_Cryo_Lab_Safety_Protocol.pdf',
        fileSize: '290 KB',
        uploadDate: '2024-09-12',
        documentType: 'irb_clearance',
        title: 'Cryogenic Dilution Refrigerator Operation Clearance',
        approvalNumber: 'CRYO-PHYS-2024-019',
        verificationStatus: 'Exempt'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Dean_Physics_Endorsement_Letter.pdf',
        fileSize: '310 KB',
        uploadDate: '2025-02-20',
        documentType: 'guide_endorsement',
        title: 'Department Chair & Lab Director Endorsement',
        signatoryName: 'Prof. Alexander Vance',
        signatoryDesignation: 'Chair, Quantum Information Technologies Group',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'iThenticate_Quantum_Decoding_Report.pdf',
        fileSize: '950 KB',
        uploadDate: '2025-02-22',
        documentType: 'plagiarism_report',
        title: 'iThenticate Originality Check',
        similarityPercentage: 4,
        softwareUsed: 'iThenticate',
        verificationStatus: 'Compliant (<10%)'
      },
      journalProof: {
        uploaded: true,
        fileName: 'APS_PRL_Published_Proof_Reprint.pdf',
        fileSize: '2.1 MB',
        uploadDate: '2025-03-09',
        documentType: 'journal_proof',
        title: 'American Physical Society Camera-Ready Final Proof',
        proofType: 'Published Final Reprint (Camera-Ready)',
        acceptanceDate: '2025-02-14',
        verificationStatus: 'Verified'
      }
    },
    paperFileName: 'Surface_Code_Decoding_Superconducting_Qubits.pdf',
    paperFileSize: '5.1 MB',
    pagesCount: 10,
    reviewStatus: 'Verified',
    reviewedBy: 'College Research Cell Board (Prof. R. Banerjee)',
    citationsCount: 41,
    viewsCount: 2890,
    downloadsCount: 1120
  },
  {
    id: 'CRP-2025-008',
    title: 'Solid-State Sodium-Ion Electrolytes Based on Succinonitrile-Plasticized Composite Membranes',
    abstract: 'Resource abundance makes ambient-temperature sodium-ion chemistry an attractive grid storage alternative to lithium. We synthesize a solid polymer-ceramic composite electrolyte consisting of poly(ethylene oxide), succinonitrile plasticizer, and Na3Zr2Si2PO12 (NZSP) nanoparticles. The optimized membrane yields an ionic conductivity of 1.2 × 10^-3 S/cm at 25 °C with an electrochemical stability window spanning up to 4.8 V vs. Na/Na+.',
    department: 'Materials Science & Nanotechnology',
    subjectCategory: 'Materials Science & Renewable Energy',
    academicYear: '2024-2025',
    submissionDate: '2025-03-12',
    authors: [
      {
        name: 'Harini Balakrishnan',
        role: 'PhD Scholar',
        department: 'Materials Science & Nanotechnology',
        email: 'h.bala@college.edu',
        isCorresponding: true
      },
      {
        name: 'Dr. Siddharth Nair',
        role: 'Faculty',
        department: 'Materials Science & Nanotechnology',
        email: 's.nair@college.edu'
      }
    ],
    keywords: ['Solid-State Electrolytes', 'Lithium-Sulfur Batteries', 'Supercapacitors', 'Polymer Nanocomposites'],
    sdgs: [7, 12, 13],
    isPublished: false,
    proofDocuments: {
      irbClearance: {
        uploaded: true,
        fileName: 'Battery_Lab_HighVoltage_Safety_Protocol.pdf',
        fileSize: '340 KB',
        uploadDate: '2025-01-10',
        documentType: 'irb_clearance',
        title: 'Institutional Battery & High-Voltage Testing Safety Protocol',
        approvalNumber: 'EHS-BATT-2025-004',
        verificationStatus: 'Verified'
      },
      guideEndorsement: {
        uploaded: true,
        fileName: 'Guide_Endorsement_Dr_Nair_Bala.pdf',
        fileSize: '290 KB',
        uploadDate: '2025-03-10',
        documentType: 'guide_endorsement',
        title: 'Supervisory Advisory Sign-off',
        signatoryName: 'Dr. Siddharth Nair, Associate Professor',
        signatoryDesignation: 'Faculty Lead, Energy Storage & Nanomaterials Lab',
        verificationStatus: 'Verified'
      },
      plagiarismReport: {
        uploaded: true,
        fileName: 'Turnitin_Sodium_Electrolyte_Report.pdf',
        fileSize: '890 KB',
        uploadDate: '2025-03-11',
        documentType: 'plagiarism_report',
        title: 'Turnitin Originality Report',
        similarityPercentage: 7,
        softwareUsed: 'Turnitin',
        verificationStatus: 'Compliant (<10%)'
      }
    },
    paperFileName: 'Solid_State_Sodium_Electrolytes_WorkingPaper.pdf',
    paperFileSize: '3.9 MB',
    pagesCount: 14,
    reviewStatus: 'Pending Review',
    citationsCount: 0,
    viewsCount: 380,
    downloadsCount: 92
  }
];
