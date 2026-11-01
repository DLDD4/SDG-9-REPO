export interface KeywordCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export const KEYWORD_CATEGORIES: KeywordCategory[] = [
  {
    id: 'ai_ml',
    name: 'Artificial Intelligence & Machine Learning',
    description: 'Neural networks, computer vision, natural language processing, and automated reasoning',
    keywords: [
      'Deep Learning',
      'Neural Radiance Fields',
      'Large Language Models',
      'Computer Vision',
      'Reinforcement Learning',
      'Transformer Architecture',
      'Medical Image Segmentation',
      'Graph Neural Networks',
      'Federated Learning',
      'Explainable AI',
      'Multimodal Embeddings'
    ]
  },
  {
    id: 'biomed_health',
    name: 'Biomedical & Healthcare Engineering',
    description: 'Bioinformatics, biomedical instrumentation, drug delivery, and genomic analysis',
    keywords: [
      'Microfluidics',
      'Biosensors',
      'Targeted Drug Delivery',
      'Genomic Sequencing',
      'CRISPR-Cas9',
      'Cardiovascular Biomechanics',
      'Endoscopic Vision',
      'Neural Prosthetics',
      'Point-of-Care Diagnostics',
      'Tissue Engineering'
    ]
  },
  {
    id: 'energy_materials',
    name: 'Materials Science & Renewable Energy',
    description: 'Nanomaterials, photovoltaic cells, solid-state batteries, and polymer chemistry',
    keywords: [
      'Perovskite Solar Cells',
      'Lithium-Sulfur Batteries',
      'Carbon Nanotubes',
      'Solid-State Electrolytes',
      'Green Hydrogen',
      'Photocatalysis',
      'Supercapacitors',
      '2D MXenes',
      'Thermoelectric Generators',
      'Polymer Nanocomposites'
    ]
  },
  {
    id: 'systems_robotics',
    name: 'Robotics, IoT & Embedded Systems',
    description: 'Autonomous systems, cyber-physical architectures, and sensor networks',
    keywords: [
      'Autonomous Mobile Robots',
      'Surgical Robotics',
      'Edge Computing',
      'Low-Power IoT',
      'Swarm Robotics',
      'Sensor Fusion',
      'SLAM Algorithms',
      'Cyber-Physical Systems',
      'Embedded Real-Time OS',
      'Haptic Interfaces'
    ]
  },
  {
    id: 'environment_climate',
    name: 'Environmental Engineering & Sustainability',
    description: 'Carbon sequestration, water purification, remote sensing, and ecological modeling',
    keywords: [
      'Carbon Capture & Storage',
      'Membrane Desalination',
      'Atmospheric Aerosols',
      'Microplastic Degradation',
      'Satellite Remote Sensing',
      'Urban Heat Islands',
      'Biochar Soil Remediation',
      'Wastewater Treatment',
      'Lifecycle Assessment'
    ]
  },
  {
    id: 'quantum_photonics',
    name: 'Quantum Computing & Photonics',
    description: 'Superconducting qubits, integrated photonics, and quantum cryptography',
    keywords: [
      'Superconducting Qubits',
      'Quantum Error Correction',
      'Silicon Photonics',
      'Quantum Key Distribution',
      'Optical Resonators',
      'Topological Insulators',
      'Quantum Algorithms'
    ]
  }
];

export const ALL_CANONICAL_KEYWORDS = Array.from(
  new Set(KEYWORD_CATEGORIES.flatMap(category => category.keywords))
).sort();

export const COLLEGE_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Biomedical Engineering',
  'Materials Science & Nanotechnology',
  'Electrical & Computer Engineering',
  'Mechanical & Aerospace Engineering',
  'Environmental & Chemical Engineering',
  'Physics & Applied Quantum Sciences'
] as const;
